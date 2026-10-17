import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/client";
import {
  getPortalUser,
  getVerifiedEmails,
  unauthorized,
} from "@/lib/server/portalAuth";

export const dynamic = "force-dynamic";

// Returns ONLY the logged-in user's trips. Any ?email= in the URL is ignored;
// the email comes from the Clerk session (verified addresses only).
export async function GET(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  try {
    const emails = await getVerifiedEmails(me.userId);
    if (emails.length === 0) {
      return NextResponse.json(
        { trips: [] },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    const trips = await sanityClient.fetch(
      `*[_type == "trip" && lower(clientEmail) in $emails]{
        ...,
        destination->{
          name,
          slug
        },
        documents[] {
          _key,
          label,
          zohoAttachmentId,
          "name": coalesce(originalFilename, file.asset->originalFilename, label),
          "mimeType": file.asset->mimeType,
          "size": file.asset->size,
          "assetId": file.asset._ref
        },
        passportUploads[] {
          _key,
          "isPrivate": defined(blobPath),
          "name": coalesce(originalFilename, asset->originalFilename),
          "mimeType": coalesce(mimeType, asset->mimeType),
          "size": coalesce(size, asset->size),
          "assetId": asset._ref
        },
        flightTicketUploads[] {
          _key,
          "isPrivate": defined(blobPath),
          "name": coalesce(originalFilename, asset->originalFilename),
          "mimeType": coalesce(mimeType, asset->mimeType),
          "size": coalesce(size, asset->size),
          "assetId": asset._ref
        }
      }`,
      { emails },
    );

    return NextResponse.json(
      { trips },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error(
      "[trips] fetch failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 },
    );
  }
}
