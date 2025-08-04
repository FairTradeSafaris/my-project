import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const claims = await client.fetch(
      `*[_type == "leadMagnetClaim" && clerkUserId == $userId]{
        bookTitle,
        bookUrl
      }`,
      { userId }
    );

    if (claims.length > 0) {
      return NextResponse.json({ claim: claims[0] }); // only allow 1 claim
    } else {
      return NextResponse.json({ claim: null });
    }
  } catch (error) {
    console.error("Claim Status API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}
