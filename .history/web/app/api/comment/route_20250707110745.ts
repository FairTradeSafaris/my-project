export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { client } from "@/lib/sanity"; // make sure this points to your configured sanity client

export async function POST(req: Request) {
  console.log("✅ API /api/comment hit");

  try {
    const body = await req.json();
    const { name, email, comment, postId } = body;

    if (!name || !email || !comment || !postId) {
      console.warn("⚠️ Missing fields:", { name, email, comment, postId });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📝 Creating comment in Sanity...");

    const result = await client.create({
      _type: "comment",
      name,
      email,
      comment,
      post: {
        _type: "reference",
        _ref: postId,
      },
      approved: false, // default to unapproved
    });

    console.log("✅ Comment saved:", result);

    return NextResponse.json(
      { message: "Comment saved to Sanity" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: `${err}` },
      { status: 500 }
    );
  }
}
