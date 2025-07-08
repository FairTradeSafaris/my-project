export const runtime = "nodejs"; // 👈 Add this line

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("✅ Step 2: Route hit");

  try {
    const body = await req.json();
    console.log("🧾 Request body:", body);

    const { name, email, comment, postId } = body;

    if (!name || !email || !comment || !postId) {
      console.warn("⚠️ Missing fields:", { name, email, comment, postId });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Step 2 passed: Fields received!" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    console.error("❌ Error parsing body:", message);

    return NextResponse.json(
      { message: "Invalid request format" },
      { status: 400 }
    );
  }
}
