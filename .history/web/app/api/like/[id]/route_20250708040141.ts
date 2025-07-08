// app/api/like/[id]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { serverClient } from "@/lib/sanity.server";

// ✅ This interface is key to fix the build error
interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  const id = context.params.id;

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
