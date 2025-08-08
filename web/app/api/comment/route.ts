export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity.server";
import { Resend } from "resend";

export async function POST(req: Request) {
  console.log("✅ API /api/comment hit");

  const body = await req.json();
  const { name, email, comment, postId } = body;

  if (!name || !email || !comment || !postId) {
    console.warn("⚠️ Missing fields:", { name, email, comment, postId });
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
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
    console.log("✅ Saved to Sanity:", result._id);

    console.log("📧 Sending email via Resend...");
    const resend = new Resend(process.env.RESEND_API_KEY); // ✅ moved inside POST
    const emailRes = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
      subject: "📝 New Comment Submitted",
      html: `
        <h3>New Comment on Blog Post</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Comment:</strong> ${comment}</p>
      `,
    });

    console.log("✅ Email sent:", emailRes);

    return NextResponse.json({ message: "Comment saved and email sent!" });
  } catch (err) {
    console.error("❌ Failed to handle comment:", err);
    return NextResponse.json(
      { message: "Internal error", error: `${err}` },
      { status: 500 }
    );
  }
}
