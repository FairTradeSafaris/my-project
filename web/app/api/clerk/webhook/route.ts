// app/api/clerk/webhook/route.ts
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { createZohoLead } from "@/lib/zoho/createLead";

// ✅ Explicit type instead of `any`
type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    first_name?: string;
    last_name?: string;
    email_addresses?: { email_address: string }[];
  };
};

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: ClerkUserCreatedEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": headersList.get("svix-id")!,
      "svix-timestamp": headersList.get("svix-timestamp")!,
      "svix-signature": headersList.get("svix-signature")!,
    }) as ClerkUserCreatedEvent;
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const user = data;

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const email = user.email_addresses?.[0]?.email_address || "";

    console.log("📬 New user.created webhook received:", {
      firstName,
      lastName,
      email,
    });

    try {
      const result = await createZohoLead({
        firstName,
        lastName,
        email,
        phone: "", // Optional — Clerk doesn't include this by default
        appointment: false,
        marketingConsent: false,
      });

      console.log("✅ Zoho Lead created:", result);
    } catch (err) {
      console.error("❌ Failed to create Zoho Lead:", err);
    }
  } else {
    console.log("ℹ️ Ignored event type:", type);
  }

  return new NextResponse("OK", { status: 200 });
}
