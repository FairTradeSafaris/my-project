import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/client";

export async function GET() {
  try {
    const books = await sanityClient.fetch(
      `*[_type == "book"] | order(order asc) {
        _id,
        title,
        previewUrl,
        description
      }`
    );

    return NextResponse.json({ books });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
