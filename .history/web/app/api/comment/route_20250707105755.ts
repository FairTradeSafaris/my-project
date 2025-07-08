export const runtime = "nodejs"; // Enables logging in dev

import { NextResponse } from "next/server";
import { Resend } from "resend";

// Log right away to verify .env loading
console.log("🟡 ENV Vars:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM: process.env.NOTIFY_EMAIL_FROM,
  TO: process.env.NOTIFY_EMAIL_TO,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("✅ Step 1: Route hit");

  try {
    const body = await req.json();
    const { name, email, comment, postId } = body;

    console.log("✅ Step 2: Body parsed", body);

    if (!name || !email || !comment || !postId) {
      console.warn("⚠️ Missing fields", { name, email, comment, postId });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedComment = comment.trim();

    const from = process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev";
    const to = process.env.NOTIFY_EMAIL_TO || "admin@example.com";

    console.log("📨 Sending email to:", to);

    const result = await resend.emails.send({
      from,
      to,
      subject: "📝 New Comment Submitted",
      html: `
        <h3>New Comment on Blog Post</h3>
        <p><strong>Name:</strong> ${trimmedName}</p>
        <p><strong>Email:</strong> ${trimmedEmail}</p>
        <p><strong>Comment:</strong> ${trimmedComment}</p>
      `,
    });

    console.log("✅ Email sent", result);

    return NextResponse.json(
      { message: "Comment submitted and email sent!" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Fatal error:", message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
