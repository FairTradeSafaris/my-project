import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { serverClient } from "@/lib/sanity.server";

// ✅ You no longer need a special RouteContext interface

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Await this!

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const result = await serverClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();

    return NextResponse.json({ likes: result.likes });
  } catch (error) {
    console.error("❌ Failed to update likes:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
