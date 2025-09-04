// app/api/clerk/webhook/route.ts
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { createZohoLead } from "@/lib/zoho/createLead";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ correct Clerk import for backend

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string; // Clerk user ID
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
    try {
      const user = await clerkClient.users.getUser(data.id);

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const email = user.emailAddresses?.[0]?.emailAddress ?? "";

      console.log("📬 Clerk signup received:", { firstName, lastName, email });

      const result = await createZohoLead({
        firstName,
        lastName,
        email,
        phone: "",
        appointment: false,
        marketingConsent: false,
      });

      console.log("✅ Zoho Lead created:", result);
    } catch (err) {
      console.error("❌ Failed to fetch user or create Zoho lead:", err);
    }
  } else {
    console.log("ℹ️ Ignored event type:", type);
  }

  return new NextResponse("OK", { status: 200 });
}
