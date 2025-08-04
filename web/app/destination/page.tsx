import { serverClient } from "@/lib/sanity.server";
import DestinationClient from "./DestinationClient";

export default async function DestinationPage() {
  const data = await serverClient.fetch(`
    *[_type == "destination"]{
      _id,
      slug,
      title,
      "image": heroImage.asset->url,
      subtitle,
      description,
      price,
      bestTime,
      highSeason,
      rating,
      reviews,
      "flagImage": flagImage.asset->url,
      region,
      tags,
      ranking,
      featured,
      mapLocation,
      "gallery": gallery[].asset->url
    }
  `);

  return <DestinationClient initialDestinations={data} />;
}
