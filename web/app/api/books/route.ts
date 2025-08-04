import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  try {
    const books = await client.fetch(`
      *[_type == "book"] | order(order asc) {
        _id,
        title,
        previewUrl,
        description,
        buyLink,
        previewImage {
          asset->{
            url
          }
        }
      }
    `);

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
