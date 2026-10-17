import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";

export const dynamic = "force-dynamic";

// The user is always the logged-in Clerk user; any ?userId= is ignored.
export async function GET(req: NextRequest) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  try {
    const claims = await client.fetch(
      `*[_type == "leadMagnetClaim" && clerkUserId == $userId]{
        bookTitle,
        bookUrl
      }`,
      { userId: me.userId }
    );

    const headers = { "Cache-Control": "private, no-store" };
    if (claims.length > 0) {
      return NextResponse.json({ claim: claims[0] }, { headers }); // only allow 1 claim
    } else {
      return NextResponse.json({ claim: null }, { headers });
    }
  } catch (error) {
    console.error(
      "Claim Status API Error:",
      error instanceof Error ? error.message : "unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}
