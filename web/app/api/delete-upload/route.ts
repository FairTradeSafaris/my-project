import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import {
  getPortalUser,
  getVerifiedEmails,
  isClientUploadField,
  unauthorized,
} from "@/lib/server/portalAuth";

const sanityClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

type FileItem = {
  _key: string;
  originalFilename?: string;
  assetRef?: string;
  assetFilename?: string;
};

export async function POST(req: Request): Promise<Response> {
  // 🔐 Must be logged in
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  try {
    const { tripId, field, originalFilename } = await req.json();

    if (!tripId || !field || !originalFilename) {
      return NextResponse.json(
        { error: "Missing tripId, field, or originalFilename" },
        { status: 400 }
      );
    }

    // 🔐 Only the passport / flight ticket upload fields
    if (!isClientUploadField(field) || typeof tripId !== "string") {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    const emails = await getVerifiedEmails(me.userId);
    if (emails.length === 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // 1️⃣ Get the trip doc — only if it belongs to the logged-in user.
    // The field is chosen with a parameter (no string-built GROQ).
    const trip: { _id: string; items: FileItem[] | null } | null =
      await sanityClient.fetch(
        `*[_type == "trip" && _id == $tripId && lower(clientEmail) in $emails][0]{
          _id,
          "items": select(
            $field == "passportUploads" => passportUploads,
            $field == "flightTicketUploads" => flightTicketUploads
          )[]{
            _key,
            originalFilename,
            "assetRef": coalesce(asset._ref, file.asset._ref),
            "assetFilename": coalesce(asset->originalFilename, file.asset->originalFilename)
          }
        }`,
        { tripId, emails, field }
      );

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const items: FileItem[] = trip.items || [];

    // 2️⃣ Find item by filename
    const match = items.find(
      (item) =>
        item.originalFilename === originalFilename ||
        item.assetFilename === originalFilename
    );

    if (!match) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const finalKey = match._key;
    const finalAssetId = match.assetRef;

    // 3️⃣ Remove from doc (key comes from the database, field is allow-listed)
    const patch = sanityClient
      .patch(trip._id)
      .unset([`${field}[_key == ${JSON.stringify(finalKey)}]`]);

    // 4️⃣ Check if asset is used elsewhere
    let stillUsed = false;
    if (finalAssetId) {
      stillUsed = Boolean(
        await sanityClient.fetch(
          `*[_type != "sanity.fileAsset" && references($assetId)][0]._id`,
          { assetId: finalAssetId }
        )
      );
    }

    // 5️⃣ Commit transaction
    const tx = sanityClient.transaction().patch(patch);
    if (finalAssetId && !stillUsed) {
      tx.delete(finalAssetId);
    }

    await tx.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "[delete-upload] failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
