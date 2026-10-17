// app/api/zoho-remove-file/route.ts
// Zoho CRM -> website: take files off a client's portal.
//
// Called by the "Sync Portal" button on a Zoho Deal. Protected by the
// REQUIRED shared secret (header "x-zoho-secret"); refuses if the
// ZOHO_WEBHOOK_SECRET env var is missing or wrong.
//
// SAFETY RULES (batch 11b, after a sync removed files that were still in Zoho):
//  - Only trips linked to the clicked deal are touched: the trip's zohoDealId
//    equals dealId, or (trips without a zohoDealId) the trip title equals the
//    deal name. Other trips of the same email are NEVER touched.
//  - Sync mode refuses an empty or missing keep list.
//  - Sync mode refuses (removes nothing) if it would remove more than
//    MAX_REMOVE files in total, or more than half of any trip's files:
//    { error: "too_many", wouldRemove: [...] }.
//  - Removing only unsets the item from the trip. The Sanity asset and the
//    Vercel Blob are KEPT, so a mistake can be undone by re-adding the item.
//
// Two modes (JSON body):
//  1. Sync (used by the button):
//     { dealId, dealName, email, keepAttachmentIds: [...], keepFileNames: [...], dryRun? }
//     Removes items no longer in Zoho:
//       - documents (files Zoho sent): removed when their zohoAttachmentId is
//         not in keepAttachmentIds; older items without an id are compared by
//         normalised file name. Items with neither are never touched.
//       - passport / flight uploads (client uploads): ONLY those with a
//         zohoAttachmentId, removed when that id is not in keepAttachmentIds.
//  2. Single file:
//     { dealId, dealName, email, zohoAttachmentId?, fileName?, dryRun? }
//
// Response: { removed: n, files: [names], dryRun? }
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { zohoSecretRequired } from "@/lib/server/zohoWebhook";

const sanityClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const FIELDS = ["documents", "passportUploads", "flightTicketUploads"] as const;
type Field = (typeof FIELDS)[number];

/** A sync may remove at most this many files in one click. */
const MAX_REMOVE = 2;
/** ...and never more than this share of one trip's files. */
const MAX_SHARE = 0.5;

type Item = {
  _key: string;
  name?: string | null;
  zohoAttachmentId?: string | null;
  ofn?: string | null; // originalFilename as stored by the Zoho webhook
};

type Trip = {
  _id: string;
  title?: string | null;
  zohoDealId?: string | null;
  documents?: Item[] | null;
  passportUploads?: Item[] | null;
  flightTicketUploads?: Item[] | null;
};

const PORTAL_PREFIX =
  /^\s*(passport|flight ticket)\s*-\s*from client portal\s*-\s*/i;

/** Display name without the "Passport - from client portal - " prefix. */
function cleanName(v: unknown): string {
  return typeof v === "string" ? v.replace(PORTAL_PREFIX, "").trim() : "";
}

/** Comparison key for a file name: prefix stripped, trimmed, lowercase, single spaces. */
function normName(v: unknown): string {
  return cleanName(v).replace(/\s+/g, " ").toLowerCase();
}

/** Comparison key for a trip title / deal name. */
function normTitle(v: unknown): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().toLowerCase() : "";
}

/**
 * A list from the Zoho payload. Accepts a JSON array, or a string holding a
 * JSON array (in case Deluge serialised the List as text). Anything else: null.
 */
function strList(v: unknown, max = 2000): string[] | null {
  let arr: unknown = v;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s.startsWith("[")) return null;
    try {
      arr = JSON.parse(s);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(arr)) return null;
  return arr
    .slice(0, max)
    .map((x) => (x == null ? "" : String(x).trim()))
    .filter(Boolean);
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request): Promise<Response> {
  // 🔐 REQUIRED secret
  if (!zohoSecretRequired(req, "zoho-remove-file")) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const dealId = body.dealId == null ? "" : String(body.dealId).trim();
  const dealName = normTitle(body.dealName);
  const dryRun = body.dryRun === true || body.dryRun === "true";

  if (!email || !email.includes("@")) {
    return json({ error: "Missing email" }, 400);
  }
  if (!dealId || !/^\d+$/.test(dealId)) {
    return json({ error: "Missing or invalid dealId" }, 400);
  }

  const hasKeepIds = body.keepAttachmentIds !== undefined;
  const hasKeepNames = body.keepFileNames !== undefined;
  const syncMode = hasKeepIds || hasKeepNames;

  const singleId =
    body.zohoAttachmentId == null ? "" : String(body.zohoAttachmentId).trim();
  const singleName = normName(body.fileName);

  if (!syncMode && !singleId && !singleName) {
    return json(
      { error: "Send keepAttachmentIds/keepFileNames (sync) or zohoAttachmentId/fileName" },
      400,
    );
  }

  let keepIds = new Set<string>();
  let keepNames = new Set<string>();
  if (syncMode) {
    const ids = strList(body.keepAttachmentIds);
    const names = strList(body.keepFileNames);
    // An empty or unreadable keep list would mean "remove everything": refuse.
    if (!ids || !names || ids.length === 0 || names.length === 0) {
      return json(
        {
          error: "empty_keep_list",
          detail:
            "keepAttachmentIds and keepFileNames must both be non-empty lists. Nothing was removed.",
          received: { keepAttachmentIds: ids?.length ?? null, keepFileNames: names?.length ?? null },
        },
        400,
      );
    }
    keepIds = new Set(ids);
    keepNames = new Set(names.map(normName).filter(Boolean));
  }

  try {
    const itemProj = `{
      _key,
      zohoAttachmentId,
      "ofn": originalFilename,
      "name": coalesce(originalFilename, file.asset->originalFilename, asset->originalFilename)
    }`;
    const allTrips: Trip[] = await sanityClient.fetch(
      `*[_type == "trip" && !(_id in path("drafts.**")) && lower(clientEmail) == $email]{
        _id,
        title,
        zohoDealId,
        documents[]${itemProj},
        passportUploads[]${itemProj},
        flightTicketUploads[]${itemProj}
      }`,
      { email },
    );

    // Only trips linked to THIS deal.
    const trips = (allTrips ?? []).filter((t) => {
      const tripDeal = t.zohoDealId == null ? "" : String(t.zohoDealId).trim();
      if (tripDeal) return tripDeal === dealId;
      return Boolean(dealName) && normTitle(t.title) === dealName;
    });

    if (trips.length === 0) {
      return json({
        removed: 0,
        files: [],
        note: dealName
          ? "No portal trip for this client is linked to this deal"
          : "No portal trip linked to this deal (dealName missing)",
      });
    }

    // Decide what to remove
    const toRemove: { tripId: string; field: Field; item: Item }[] = [];
    const tripSize = new Map<string, number>();
    for (const trip of trips) {
      let size = 0;
      for (const field of FIELDS) {
        const items = Array.isArray(trip[field]) ? (trip[field] as Item[]) : [];
        size += items.filter((i) => i?._key).length;
        const isZohoDoc = field === "documents";

        if (syncMode) {
          for (const item of items) {
            if (!item?._key) continue;
            const id = item.zohoAttachmentId ? String(item.zohoAttachmentId).trim() : "";
            if (id) {
              // Also keep it if the same file name is still in Zoho (the
              // attachment may have been re-uploaded with a new id).
              const n = normName(item.ofn ?? item.name);
              if (!keepIds.has(id) && !(n && keepNames.has(n))) {
                toRemove.push({ tripId: trip._id, field, item });
              }
            } else if (isZohoDoc) {
              // Older Zoho files (no id stored): compare by normalised name.
              // Files added by hand in Sanity Studio have no stored name and
              // are never touched.
              const n = normName(item.ofn);
              if (n && !keepNames.has(n)) {
                toRemove.push({ tripId: trip._id, field, item });
              }
            }
            // Client uploads without a Zoho id: never removed.
          }
        } else {
          let matches = singleId
            ? items.filter((i) => i?._key && String(i.zohoAttachmentId ?? "") === singleId)
            : [];
          if (matches.length === 0 && singleName) {
            matches = items.filter(
              (i) =>
                i?._key &&
                normName(i.ofn ?? i.name) === singleName &&
                (isZohoDoc || Boolean(i.zohoAttachmentId)),
            );
          }
          for (const item of matches) toRemove.push({ tripId: trip._id, field, item });
        }
      }
      tripSize.set(trip._id, size);
    }

    const files = toRemove.map((r) => cleanName(r.item.name) || "(unnamed file)");

    // 🛑 Safety cap: refuse big removals outright.
    const perTrip = new Map<string, number>();
    for (const r of toRemove) perTrip.set(r.tripId, (perTrip.get(r.tripId) ?? 0) + 1);
    const tooShare = Array.from(perTrip).some(
      ([tripId, n]) => n > MAX_SHARE * (tripSize.get(tripId) ?? 0),
    );
    if (toRemove.length > MAX_REMOVE || tooShare) {
      console.warn(
        `[zoho-remove-file] safety stop for deal ${dealId}: would remove ${toRemove.length} item(s)`,
      );
      return json(
        { error: "too_many", count: toRemove.length, wouldRemove: files },
        409,
      );
    }

    if (dryRun || toRemove.length === 0) {
      return json({ removed: 0, wouldRemove: toRemove.length, files, dryRun });
    }

    // Unset from the trip docs only. Assets and Blobs are kept, so an item
    // can be put back. Field names are allow-listed; keys come from the database.
    const tx = sanityClient.transaction();
    const byTrip = new Map<string, string[]>();
    for (const r of toRemove) {
      const paths = byTrip.get(r.tripId) ?? [];
      paths.push(`${r.field}[_key == ${JSON.stringify(r.item._key)}]`);
      byTrip.set(r.tripId, paths);
    }
    for (const [tripId, paths] of byTrip) {
      tx.patch(tripId, (p) => p.unset(paths));
    }
    await tx.commit();

    console.log(
      `[zoho-remove-file] unset ${toRemove.length} item(s) for deal ${dealId} (${syncMode ? "sync" : "single"}); assets kept`,
    );
    return json({ removed: toRemove.length, files });
  } catch (err) {
    console.error(
      "[zoho-remove-file] failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return json({ error: "Remove failed" }, 500);
  }
}
