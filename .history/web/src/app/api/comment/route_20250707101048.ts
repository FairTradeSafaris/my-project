import { NextResponse } from "next/server";
import { serverClient } from "@/../lib/sanity.server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, comment, postId } = body;

    if (!name || !email || !comment || !postId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedComment = comment.trim();

    // ✅ Save comment to Sanity (unapproved by default)
    const sanityResponse = await serverClient.create({
      _type: "comment",
      name: trimmedName,
      email: trimmedEmail,
      comment: trimmedComment,
      approved: false,
      post: {
        _type: "reference",
        _ref: postId,
      },
    });

    console.log("✅ Comment saved to Sanity:", sanityResponse);

    // ✅ Send email notification via Resend
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

    return NextResponse.json(
      { message: "Comment submitted successfully!" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("❌ Sanity comment submission failed:", message);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
