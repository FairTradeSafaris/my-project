export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server"; // ← client with token!

export async function POST(req: Request) {
  console.log("✅ API /api/comment hit");

  try {
    const body = await req.json();
    const { name, email, comment, postId } = body;

    if (!name || !email || !comment || !postId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📝 Saving to Sanity...");
    const result = await serverClient.create({
      _type: "comment",
      name,
      email,
      comment,
      post: {
        _type: "reference",
        _ref: postId,
      },
      approved: false,
    });

    console.log("✅ Saved:", result._id);
    return NextResponse.json({ message: "Saved to Sanity" }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to save comment:", err);
    return NextResponse.json(
      { message: "Internal error", error: `${err}` },
      { status: 500 }
    );
  }
}
