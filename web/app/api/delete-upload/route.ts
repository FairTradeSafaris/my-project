import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

// TEMP TEST: log sanity token to verify it's being picked up

const serverClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type DeletePayload = {
  tripId: string;
  field: "passportUploads" | "flightTicketUploads";
  assetRef: string;
};

export async function POST(req: Request) {
  try {
    const body: DeletePayload = await req.json();
    const { tripId, field, assetRef } = body;

    if (!tripId || !field || !assetRef) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await serverClient
      .patch(tripId)
      .unset([`${field}[asset._ref == "${assetRef}"]`])
      .commit();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
