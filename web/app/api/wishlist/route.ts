export const runtime = "nodejs"; // ✅ Important line

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

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

  console.log("🔁 Updating wishlist for user:", userId, "→", wishlist);

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { wishlist },
    });

    const updatedUser = await clerkClient.users.getUser(userId);

    return NextResponse.json({
      success: true,
      wishlist: updatedUser.publicMetadata?.wishlist || [],
    });
  } catch (err) {
    console.error("❌ Error updating wishlist:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
