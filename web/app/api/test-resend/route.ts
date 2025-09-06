import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const emailRes = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.NOTIFY_EMAIL_TO || "you@yourdomain.com", // ✅ Replace for testing
      subject: "🚀 Test Email from Resend API",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email sent via Resend from your Next.js API route.</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("✅ Resend email sent:", emailRes);
    return NextResponse.json({ success: true, emailRes });
  } catch (error) {
    console.error("❌ Resend email failed:", error);
    return NextResponse.json({ success: false, error });
  }
}
