import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const sanityClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const { tripId, field, originalFilename } = await req.json();

    if (!tripId || !field || !originalFilename) {
      return NextResponse.json(
        { error: "Missing tripId, field, or originalFilename" },
        { status: 400 }
      );
    }

    // 1️⃣ Get the trip doc
    const trip = await sanityClient.fetch(
      `*[_type == "trip" && _id == $tripId][0]{ ${field} }`,
      { tripId }
    );

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    type FileItem =
      | { _key: string; originalFilename?: string }
      | { _key: string; asset?: { originalFilename?: string; _ref?: string } }
      | {
          _key: string;
          file?: { asset?: { originalFilename?: string; _ref?: string } };
        };

    const items: FileItem[] = (trip?.[field] as FileItem[]) || [];

    // 2️⃣ Find item by filename
    const match = items.find((item) => {
      if (
        "originalFilename" in item &&
        item.originalFilename === originalFilename
      )
        return true;
      if ("asset" in item && item.asset?.originalFilename === originalFilename)
        return true;
      if (
        "file" in item &&
        item.file?.asset?.originalFilename === originalFilename
      )
        return true;
      return false;
    });

    if (!match) {
      return NextResponse.json(
        { error: `File with name "${originalFilename}" not found` },
        { status: 404 }
      );
    }

    const finalKey = match._key;
    let finalAssetId: string | undefined;

    if ("asset" in match && match.asset?._ref) {
      finalAssetId = match.asset._ref;
    } else if ("file" in match && match.file?.asset?._ref) {
      finalAssetId = match.file.asset._ref;
    }

    // 3️⃣ Remove from doc
    const patch = sanityClient
      .patch(tripId)
      .unset([`${field}[_key == "${finalKey}"]`]);

    // 4️⃣ Check if asset is used elsewhere
    let stillUsed = false;
    if (finalAssetId) {
      stillUsed = await sanityClient.fetch(
        `*[_type != "sanity.fileAsset" && references($assetId)][0]._id`,
        { assetId: finalAssetId }
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
    console.error("Delete failed:", err);
    return NextResponse.json(
      { error: "Delete failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}
