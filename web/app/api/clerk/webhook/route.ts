import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";
import { createZohoLead } from "@/lib/zoho/createLead";

// Minimal shapes for Clerk data
type ClerkEmail = { email_address?: string };
type ClerkEventData = {
  email_addresses?: ClerkEmail[];
  first_name?: string | null;
  last_name?: string | null;
};
type ClerkEvent = { type: string; data?: ClerkEventData };

export async function POST(req: Request) {
  console.log("✅ Webhook reached — parsing event");

  const payload = await req.text();

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("❌ Missing Svix headers");
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
    const evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;

    console.log("📩 Event received:", evt);

    const email = evt.data?.email_addresses?.[0]?.email_address ?? "no-email";
    const firstName = evt.data?.first_name ?? "New";
    const lastName = evt.data?.last_name ?? "Web User";

    if (evt.type === "user.created") {
      console.log("🚀 Creating Zoho lead with:", {
        firstName,
        lastName,
        email,
      });

      const zohoResult = await createZohoLead({
        firstName,
        lastName,
        email,
        phone: "",
        appointment: false,
        marketingConsent: false,
        sourceChannel: "WebClient",
      });

      console.log("✅ Zoho lead created successfully:", zohoResult);

      // ✅ Send email via Resend (clean HTML, no try/catch)
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.NOTIFY_EMAIL_FROM || "info@fairtradesafaris.com",
        to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
        subject: `📥 New Clerk User: ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #2e7d32;">🧾 New User Registration (via Clerk)</h2>
            <p style="font-size: 16px;">A new user just registered via Clerk and has been added to Zoho CRM.</p>

            <table style="width: 100%; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0;"><strong>First Name:</strong></td>
                <td>${firstName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Last Name:</strong></td>
                <td>${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Source:</strong></td>
                <td>WebClient (via Clerk Webhook)</td>
              </tr>
            </table>

            <p style="font-size: 14px; margin-top: 30px; color: #777;">
              This message was generated automatically by your Clerk → Zoho integration.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        message: "Zoho lead created and email sent",
        type: evt.type,
        email,
        firstName,
        lastName,
        zoho: zohoResult,
      });
    }

    return NextResponse.json({
      message: "Event received but not processed",
      type: evt.type,
    });
  } catch (err) {
    console.error("❌ Invalid signature or failure:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }
}
