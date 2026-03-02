// /app/destination/page.tsx
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import DestinationClient from "@/app/destination/DestinationClient";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";

export const revalidate = 60;

// --- SEO METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("destination");

  return {
    ...metadata,
    title:
      metadata?.title ||
      "Destinations | Fair Trade Safaris — Explore Africa’s Most Iconic Regions",
    description:
      metadata?.description ||
      "Discover breathtaking safari destinations across East & Southern Africa. Wildlife, culture, landscapes, and responsible travel experiences curated for mindful explorers.",
  };
}

const listQuery = groq`
  *[_type == "destination" && defined(slug.current)]
  | order(ranking asc, title asc){
    title,
    "slug": slug,

    // Proper hero image resolution
"image": coalesce(
  heroImage.asset->url,
  heroImage.galleryImage->image.asset->url,
  gallery[0]->image.asset->url
),
    "flagImage": flagImage.asset->url,
    region,
    ranking,
    featured,
    mapLocation,
    tags,
    travelInfo,
    highlights,
    practicalStuff,

    "didYouKnowImage": coalesce(
      didYouKnowImage.image.asset->url,
      didYouKnowImage.galleryImage->image.asset->url
    ),

    didYouKnowText,
    "gallery": gallery[]->image.asset->url
  }
`;

export default async function DestinationsPage() {
  const data = await client.fetch(listQuery);
  return (
    <DestinationClient initialDestinations={Array.isArray(data) ? data : []} />
  );
}
