// components/HeroWrapper.tsx
import { client } from "@/lib/sanity";
import HeroWithSearch from "./HeroWithSearch";

export default async function HeroWrapper() {
  const data = await client.fetch(`
    *[_type == "hero"][0]{
      headline,
      subheadline,
      backgroundImages[]{asset->{url}}
    }
  `);

  const randomImage =
    data?.backgroundImages?.[
      Math.floor(Math.random() * data.backgroundImages.length)
    ]?.asset?.url;

  return (
    <HeroWithSearch
      data={{
        headline: data.headline,
        subheadline: data.subheadline,
        imageUrl: randomImage,
      }}
    />
  );
}
