// GET /api/portal-file?trip=<tripId>&field=<field>&key=<_key>
// Streams one portal file to the logged-in owner of the trip.
// Works for Sanity-hosted files (old + CRM docs) and private Vercel Blob uploads.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "next-sanity";
import { get } from "@vercel/blob";
import {
  getPortalUser,
  getVerifiedEmails,
  unauthorized,
} from "@/lib/server/portalAuth";

const sanityClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const FIELDS = ["documents", "passportUploads", "flightTicketUploads"] as const;

type Item = {
  name?: string | null;
  url?: string | null;
  mimeType?: string | null;
  blobPath?: string | null;
};

function safeName(n: string) {
  return n.replace(/[^\w.\- ()]+/g, "_").slice(0, 150) || "file";
}

export async function GET(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  const sp = new URL(req.url).searchParams;
  const tripId = sp.get("trip");
  const field = sp.get("field");
  const key = sp.get("key");
  if (!tripId || !key || !field || !(FIELDS as readonly string[]).includes(field)) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const emails = await getVerifiedEmails(me.userId);
    if (!emails.length) return Response.json({ error: "Not found" }, { status: 404 });

    const item: Item | null = await sanityClient.fetch(
      `*[_type == "trip" && _id == $tripId && lower(clientEmail) in $emails][0]{
        "items": select(
          $field == "documents" => documents,
          $field == "passportUploads" => passportUploads,
          $field == "flightTicketUploads" => flightTicketUploads
        )
      }.items[_key == $key][0]{
        "name": coalesce(originalFilename, asset->originalFilename, file.asset->originalFilename, label),
        "url": coalesce(asset->url, file.asset->url),
        "mimeType": coalesce(mimeType, asset->mimeType, file.asset->mimeType),
        blobPath
      }`,
      { tripId, emails, field, key },
    );
    if (!item) return Response.json({ error: "Not found" }, { status: 404 });

    const name = safeName(item.name || "file");
    const download = sp.get("download") === "1";
    const headers: Record<string, string> = {
      "Content-Type": item.mimeType || "application/octet-stream",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    };

    if (item.blobPath) {
      const result = await get(item.blobPath, { access: "private" });
      if (!result || result.statusCode !== 200 || !result.stream) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      headers["Content-Type"] = item.mimeType || result.blob.contentType || headers["Content-Type"];
      return new Response(result.stream, { headers });
    }

    if (item.url && item.url.startsWith("https://cdn.sanity.io/")) {
      const upstream = await fetch(item.url);
      if (!upstream.ok || !upstream.body) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return new Response(upstream.body, { headers });
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("[portal-file] failed:", err instanceof Error ? err.message : "unknown error");
    return Response.json({ error: "Download failed" }, { status: 500 });
  }
}
