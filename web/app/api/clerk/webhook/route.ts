// app/api/clerk/webhook/route.ts

import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { createZohoLead } from "@/lib/zoho/createLead";
import { clerkClient } from "@clerk/clerk-sdk-node";

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
  };
};

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: ClerkUserCreatedEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": headers.get("svix-id")!,
      "svix-timestamp": headers.get("svix-timestamp")!,
      "svix-signature": headers.get("svix-signature")!,
    }) as ClerkUserCreatedEvent;
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    try {
      console.log("📩 Clerk user.created event received");

      const clerkUser = await clerkClient.users.getUser(data.id);
      console.log("🔎 Clerk user fetched:", clerkUser);

      const firstName = clerkUser.firstName || "New";
      const lastName = clerkUser.lastName || "Web User";
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";

      console.log("📦 Lead data prepared:", {
        firstName,
        lastName,
        email,
      });

      const result = await createZohoLead({
        firstName,
        lastName,
        email,
        phone: "", // Optional
        appointment: false,
        marketingConsent: false,
        sourceChannel: "WebClient",
      });

      console.log("✅ Zoho lead created:", result);
    } catch (error: any) {
      console.error("❌ Failed to handle Clerk user.created:");
      console.error("Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse("OK", { status: 200 });
}
