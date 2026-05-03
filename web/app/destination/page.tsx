// /app/destination/page.tsx

import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import DestinationClient from "@/app/destination/DestinationClient";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import HeroController from "@/components/HeroController";

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
      "Discover breathtaking safari destinations across East & Southern Africa...",
  };
}

/* ✅ ADD THIS */
const heroQuery = groq`
*[_type == "hero" && customScope == "destination"][0]{
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  action,
  primaryLink { href, label },
  backgroundImages[]{
    alt,
    desktopImage { asset-> },
    mobileImage { asset-> }
  }
}
`;

const listQuery = groq`
  *[_type == "destination" && defined(slug.current)]
  | order(ranking asc, title asc){
    title,
    "slug": slug,
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
  const [heroData, data] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(listQuery),
  ]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destination" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />
      <DestinationClient
        initialDestinations={Array.isArray(data) ? data : []}
      />
    </>
  );
}
