export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateWishlist } from "@/lib/server/wishlist";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  let { wishlist } = body;
  if (!Array.isArray(wishlist)) wishlist = [];

  wishlist = wishlist.filter(
    (item: unknown): item is string => typeof item === "string"
  );

  try {
    const updatedWishlist = await updateWishlist(userId, wishlist);

    return NextResponse.json({
      success: true,
      wishlist: updatedWishlist,
    });
  } catch (err) {
    console.error("❌ Error updating wishlist:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
