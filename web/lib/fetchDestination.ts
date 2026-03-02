// lib/fetchDestination.ts
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";

export const fetchDestinationWithJourneys = async (slug: string) => {
  const destinationQuery = groq`
    *[_type == "destination" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      travelInfo,
      didYouKnowText,
      highlights,
      practicalStuff,
      ctaLink,
      region,
      ranking,
      featured,
      mapLocation,
      tags,
      heroImage{image{asset->{url}, alt}, galleryImage->{image{asset->{url}}, alt}},
      didYouKnowImage{image{asset->{url}, alt}, galleryImage->{image{asset->{url}}, alt, caption, credit}},
      flagImage{image{asset->{url}, alt}, galleryImage->{image{asset->{url}}, alt}},
      gallery[]->{image{asset->{url}}, alt, caption, credit, license, sourceUrl},
      metaTitle,
      metaDescription,
      aiSummary,
      canonicalUrl
    }
  `;

  const journeyQuery = groq`
    *[_type == "journey" && references(*[_type == "destination" && slug.current == $slug]._id)]{
      _id,
      title,
      slug,
      price,
      "heroImage": {
        "url": heroImage.asset->url,
        "alt": alt
      }
    }
  `;

  const [destination, journeys] = await Promise.all([
    client.fetch(destinationQuery, { slug }),
    client.fetch(journeyQuery, { slug }),
  ]);

  return { destination, journeys };
};
