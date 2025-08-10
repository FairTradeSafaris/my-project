// app/destinations/page.tsx
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import DestinationClient from "@/app/destination/DestinationClient"; // adjust path if needed

export const revalidate = 60;

const listQuery = groq`
  *[_type == "destination" && defined(slug.current)]
  | order(ranking asc, title asc){
    title,
    "slug": slug,                      // { current }
    "image": heroImage.asset->url,     // background/hero for list view
    "flagImage": flagImage.asset->url,
    region,
    ranking,
    featured,
    mapLocation,
    tags,
    // Panel content (Portable Text arrays etc.)
    travelInfo,
    highlights,
    practicalStuff,                    // [{title, content}]
    "didYouKnowImage": didYouKnowImage.asset->url,
    didYouKnowText,
    "gallery": gallery[].asset->url
  }
`;

export default async function DestinationsPage() {
  const data = await client.fetch(listQuery);
  return (
    <DestinationClient initialDestinations={Array.isArray(data) ? data : []} />
  );
}
