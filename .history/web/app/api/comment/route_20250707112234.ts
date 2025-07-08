export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { client as sanityClient } from "@/lib/sanity"; // points to the Sanity client
import { serverClient } from "@/lib/sanity.server"; // your configured client with token

export async function POST(req: Request) {
  console.log("✅ API /api/comment hit");

  // 🔍 TEMP: Test if the SANITY_API_TOKEN has access
  try {
    const projectId = serverClient.config().projectId;
    const dataset = serverClient.config().dataset;
    const sanityApiUrl = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=*[_type=="comment"][0..1]`;

    const testResponse = await fetch(sanityApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
    });

    const testResult = await testResponse.json();
    console.log("🔍 Token test response:", JSON.stringify(testResult, null, 2));
  } catch (testErr) {
    console.error("❌ Token test failed:", testErr);
  }

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

    const result = await sanityClient.create({
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
