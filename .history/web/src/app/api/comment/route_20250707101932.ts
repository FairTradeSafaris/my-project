export const runtime = "nodejs"; // ensure logs work in dev

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("✅ Step 3: Route hit");

  try {
    const body = await req.json();
    const { name, email, comment, postId } = body;

    if (!name || !email || !comment || !postId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: Trim and sanitize inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedComment = comment.trim();

    // 🟨 We’ll skip saving to Sanity for now — just test email
    console.log("📨 Sending email via Resend...");

    await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
      subject: "📝 New Comment Submitted",
      html: `
        <h3>New Comment on Blog Post</h3>
        <p><strong>Name:</strong> ${trimmedName}</p>
        <p><strong>Email:</strong> ${trimmedEmail}</p>
        <p><strong>Comment:</strong> ${trimmedComment}</p>
      `,
    });

    console.log("✅ Resend email sent.");

    return NextResponse.json(
      { message: "Comment submitted and email sent!" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("❌ Error in comment route:", message);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
