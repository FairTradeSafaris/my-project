import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/client";

// Define minimal type for debugging (only what's being logged)
type TripForDebug = {
  title?: string;
  documents?: {
    _key: string;
    label: string;
    originalFilename?: string; // ✅ Your schema-level field
    file: {
      asset: {
        url: string;
        mimeType: string;
      };
    };
  }[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  console.log("API /api/trips called with email:", email);

  if (!email) {
    console.log("No email param provided!");
    return NextResponse.json(
      { error: "Missing email parameter" },
      { status: 400 }
    );
  }

  try {
    const trips = await sanityClient.fetch(
      `*[_type == "trip" && clientEmail == $email]{
        ...,
        destination->{
          name,
          slug
        },
        documents[] {
          _key,
          label,
          originalFilename, // ✅ Schema-level field (NOT asset field)
          file {
            asset->{
              url,
              mimeType
            }
          }
        },
        passportUploads[] {
          asset->{
            url,
            originalFilename,
            mimeType
          }
        },
        flightTicketUploads[] {
          asset->{
            url,
            originalFilename,
            mimeType
          }
        }
      }`,
      { email }
    );

    console.log(`Fetched ${trips.length} trips for ${email}`);

    // 🔍 Debug log with explicit type — no 'any'
    (trips as TripForDebug[]).forEach((trip, index) => {
      console.log(`🧳 Trip #${index + 1}: ${trip.title}`);
      console.log("📁 CRM Documents:", trip.documents);
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips", details: error },
      { status: 500 }
    );
  }
}
