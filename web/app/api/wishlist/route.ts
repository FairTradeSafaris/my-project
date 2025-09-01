// app/api/wishlist/route.ts
import { serverClient } from "@/lib/sanity.server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const wishlist = await serverClient.fetch(
      `*[_type == "wishlist" && clerkUserId == $userId][0]`,
      { userId }
    );

    return NextResponse.json({
      journeys: wishlist?.journeys ?? [],
    });
  } catch (err) {
    console.error("❌ Failed to fetch wishlist:", err);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming Wishlist Request");

    const { userId, journeyId, action } = await req.json();

    console.log("📦 Payload Received:", { userId, journeyId, action });

    if (!userId || !journeyId || !["add", "remove"].includes(action)) {
      console.warn("⚠️ Invalid request payload");
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const journeyRef = {
      _type: "reference",
      _ref: journeyId,
      _key: uuidv4(),
    };

    const existing = await serverClient.fetch(
      `*[_type == "wishlist" && clerkUserId == $userId][0]`,
      { userId }
    );

    if (existing) {
      const hasIt =
        existing.journeys?.some(
          (j: { _ref: string }) => j._ref === journeyId
        ) || false;

      if (action === "add" && !hasIt) {
        await serverClient
          .patch(existing._id)
          .append("journeys", [journeyRef])
          .set({ updatedAt: new Date().toISOString() })
          .commit();
      }

      if (action === "remove" && hasIt) {
        await serverClient
          .patch(existing._id)
          .unset([`journeys[_ref=="${journeyId}"]`])
          .set({ updatedAt: new Date().toISOString() })
          .commit();
      }
    } else {
      if (action === "add") {
        await serverClient.create({
          _type: "wishlist",
          _id: `wishlist-${uuidv4()}`,
          clerkUserId: userId,
          journeys: [journeyRef],
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Wishlist POST failed:", err);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
