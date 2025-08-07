import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/client";

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
    documents[]{
      _key,
      label,
      file{
        asset->{
          url,
          originalFilename,
          mimeType
        }
      }
    },
    passportUploads[]{
      asset->{
        url,
        originalFilename,
        mimeType
      }
    },
    flightTicketUploads[]{
      asset->{
        url,
        originalFilename,
        mimeType
      }
    }
  }`,
      { email }
    );

    console.log(`Fetched ${trips.length} trips for`, email);

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips", details: error },
      { status: 500 }
    );
  }
}
