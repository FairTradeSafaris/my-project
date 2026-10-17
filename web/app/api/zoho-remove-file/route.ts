// app/api/zoho-remove-file/route.ts
// Zoho CRM -> website: remove files from a client's portal.
//
// Called by the "Sync Portal" button on a Zoho Deal. Protected by the
// REQUIRED shared secret (header "x-zoho-secret"); refuses if the
// ZOHO_WEBHOOK_SECRET env var is missing or wrong, because it deletes things.
//
// Two modes (JSON body):
//  1. Sync (used by the button):
//     { dealId, email, keepAttachmentIds: [...], keepFileNames: [...], dryRun? }
//     Removes portal items that are no longer in Zoho:
//       - documents (files Zoho sent): removed when their zohoAttachmentId is
//         not in keepAttachmentIds; older items without an id are compared by
//         file name instead. Items with neither an id nor a name are never touched.
//       - passport / flight uploads (client uploads): ONLY those that have a
//         zohoAttachmentId stored, removed when that id is not in
//         keepAttachmentIds. Uploads without an id are never touched.
//  2. Single file:
//     { dealId, email, zohoAttachmentId?, fileName?, dryRun? }
//     Removes items with that Zoho attachment id, or (if none match by id)
//     with that exact file name.
//
// Response: { removed: n, files: [names], dryRun? }
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
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

type Item = {
  _key: string;
  name?: string | null;
  zohoAttachmentId?: string | null;
  ofn?: string | null; // originalFilename as stored by the Zoho webhook
  blobPath?: string | null;
  assetRef?: string | null;
};

type Trip = {
  _id: string;
  documents?: Item[] | null;
  passportUploads?: Item[] | null;
  flightTicketUploads?: Item[] | null;
};

const PORTAL_PREFIX =
  /^\s*(passport|flight ticket)\s*-\s*from client portal\s*-\s*/i;

/** File name without the "Passport - from client portal - " style prefix. */
function cleanName(v: unknown): string {
  return typeof v === "string" ? v.replace(PORTAL_PREFIX, "").trim() : "";
}

function strList(v: unknown, max = 1000): string[] | null {
  if (!Array.isArray(v)) return null;
  return v
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
  const dryRun = body.dryRun === true || body.dryRun === "true";

  if (!email || !email.includes("@")) {
    return json({ error: "Missing email" }, 400);
  }
  if (dealId && !/^\d+$/.test(dealId)) {
    return json({ error: "Invalid dealId" }, 400);
  }

  const keepIdsRaw = strList(body.keepAttachmentIds);
  const keepNamesRaw = strList(body.keepFileNames);
  const syncMode = keepIdsRaw !== null || keepNamesRaw !== null;

  const singleId =
    body.zohoAttachmentId == null ? "" : String(body.zohoAttachmentId).trim();
  const singleName = cleanName(body.fileName);

  if (!syncMode && !singleId && !singleName) {
    return json(
      { error: "Send keepAttachmentIds/keepFileNames (sync) or zohoAttachmentId/fileName" },
      400,
    );
  }

  const keepIds = new Set(keepIdsRaw ?? []);
  const keepNames = new Set((keepNamesRaw ?? []).map(cleanName).filter(Boolean));

  try {
    const itemProj = `{
      _key,
      zohoAttachmentId,
      blobPath,
      "ofn": originalFilename,
      "name": coalesce(originalFilename, file.asset->originalFilename, asset->originalFilename),
      "assetRef": coalesce(file.asset._ref, asset._ref)
    }`;
    const trips: Trip[] = await sanityClient.fetch(
      `*[_type == "trip" && !(_id in path("drafts.**")) && lower(clientEmail) == $email]{
        _id,
        documents[]${itemProj},
        passportUploads[]${itemProj},
        flightTicketUploads[]${itemProj}
      }`,
      { email },
    );

    if (!trips || trips.length === 0) {
      return json({ removed: 0, files: [], note: "No portal trip for this client" });
    }

    // Decide what to remove
    const toRemove: { tripId: string; field: Field; item: Item }[] = [];
    for (const trip of trips) {
      for (const field of FIELDS) {
        const items = Array.isArray(trip[field]) ? (trip[field] as Item[]) : [];
        const isZohoDoc = field === "documents";

        if (syncMode) {
          for (const item of items) {
            if (!item?._key) continue;
            const id = item.zohoAttachmentId ? String(item.zohoAttachmentId) : "";
            if (id) {
              if (!keepIds.has(id)) toRemove.push({ tripId: trip._id, field, item });
            } else if (isZohoDoc) {
              // Older Zoho files (before ids were stored): compare by the
              // name the webhook saved. Files added by hand in Sanity Studio
              // have no such name and are never touched.
              const n = cleanName(item.ofn);
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
                cleanName(i.ofn ?? i.name) === singleName &&
                // a client upload must be linked to Zoho to be removed from Zoho
                (isZohoDoc || Boolean(i.zohoAttachmentId)),
            );
          }
          for (const item of matches) toRemove.push({ tripId: trip._id, field, item });
        }
      }
    }

    const files = toRemove.map((r) => cleanName(r.item.name) || "(unnamed file)");

    if (dryRun || toRemove.length === 0) {
      return json({ removed: 0, wouldRemove: toRemove.length, files, dryRun });
    }

    // Remove from the trip docs (same unset approach as delete-upload).
    // Field names are allow-listed; keys come from the database.
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

    // Clean up the stored files. Sanity refuses to delete an asset that is
    // still referenced elsewhere, so a failure here just means "still in use".
    const assetIds = Array.from(
      new Set(toRemove.map((r) => r.item.assetRef).filter((v): v is string => Boolean(v))),
    );
    for (const assetId of assetIds) {
      try {
        await sanityClient.delete(assetId);
      } catch {
        // still referenced, or already gone: leave it
      }
    }
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      for (const r of toRemove) {
        if (!r.item.blobPath) continue;
        try {
          await del(r.item.blobPath);
        } catch (e) {
          console.error(
            "[zoho-remove-file] blob delete failed:",
            e instanceof Error ? e.message : "unknown error",
          );
        }
      }
    }

    console.log(
      `[zoho-remove-file] removed ${toRemove.length} item(s)${dealId ? ` for deal ${dealId}` : ""} (${syncMode ? "sync" : "single"})`,
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
