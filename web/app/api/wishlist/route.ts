// app/api/wishlist/route.ts
import { serverClient } from "@/lib/sanity.server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";

// Sanity document ids: letters, digits, dot, dash, underscore.
const SAFE_ID = /^[A-Za-z0-9._-]{1,128}$/;

// The user is always the logged-in Clerk user; any userId sent by the
// browser is ignored.
export async function GET(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();
  const userId = me.userId;

  try {
    const wishlist = await serverClient.fetch(
      `*[_type == "wishlist" && clerkUserId == $userId][0]`,
      { userId }
    );

    return NextResponse.json(
      { journeys: wishlist?.journeys ?? [] },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (err) {
    console.error(
      "[wishlist] fetch failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();
  const userId = me.userId;

  try {
    const { journeyId, action } = await req.json();

    if (
      typeof journeyId !== "string" ||
      !SAFE_ID.test(journeyId) ||
      !["add", "remove"].includes(action)
    ) {
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
          .unset([`journeys[_ref==${JSON.stringify(journeyId)}]`])
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
    console.error(
      "[wishlist] update failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
