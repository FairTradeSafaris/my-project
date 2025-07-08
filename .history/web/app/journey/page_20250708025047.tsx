import { Suspense } from "react";
import JourneyFinderClient from "../../components/JourneyFinderClient";
import { client as sanity } from "@/lib/sanity";

// Dynamically fetch metadata from Sanity
export async function generateMetadata() {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == "journey"][0]{
      metaTitle,
      metaDescription
    }`
  );

  return {
    title: data?.metaTitle || "Explore Journeys | Fair Trade Safaris",
    description:
      data?.metaDescription ||
      "Discover our collection of curated safari journeys across Africa.",
  };
}

export default function JourneyPage() {
  return (
    <Suspense fallback={<div>Loading journeys...</div>}>
      <JourneyFinderClient />
    </Suspense>
  );
}
