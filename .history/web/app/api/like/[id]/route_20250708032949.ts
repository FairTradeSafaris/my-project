import { NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const id = context.params?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  console.log("🔁 Liking post ID:", id);

  try {
    const result = await serverClient
      .patch(id)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();

    console.log("✅ Updated likes:", result.likes);

    return NextResponse.json({ likes: result.likes });
  } catch (error) {
    console.error("❌ Failed to update likes:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
