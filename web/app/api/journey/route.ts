import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(req: NextRequest) {
  const destinationId = req.nextUrl.searchParams.get("destinationId");

  if (!destinationId) {
    return NextResponse.json([], { status: 400 });
  }

  const query = `
    *[_type == "journey" && references($destinationId)]{
      title,
      slug,
      price,
      "heroImage": {
        "asset": heroImage.asset->{
          url
        }
      },
      alt
    }
  `;

  try {
    const journeys = await client.fetch(query, { destinationId });
    return NextResponse.json(journeys);
  } catch (err) {
    console.error("Error loading journeys", err);
    return NextResponse.json([], { status: 500 });
  }
}
