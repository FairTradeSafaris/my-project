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
  let payload: string;
  let evt: ClerkUserCreatedEvent;

  try {
    payload = await req.text();
    const headers = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
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
      console.log("📩 Clerk user.created event received:", data);

      const clerkUser = await clerkClient.users.getUser(data.id);
      console.log("🔎 Clerk user fetched:", clerkUser);

      const firstName = clerkUser.firstName || "New";
      const lastName = clerkUser.lastName || "Web User";
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";

      const leadPayload = {
        firstName,
        lastName,
        email,
        phone: "",
        appointment: false,
        marketingConsent: false,
        sourceChannel: "WebClient",
      };

      console.log("📦 Lead data prepared:", leadPayload);

      const result = await createZohoLead(leadPayload);

      console.log("✅ Zoho lead created:", result);
    } catch (error: unknown) {
      console.error("❌ Failed to handle Clerk user.created webhook");

      if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Stack Trace:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }

      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  return new NextResponse("OK", { status: 200 });
}
