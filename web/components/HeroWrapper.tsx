// components/HeroWrapper.tsx
import HeroController, { type HeroData } from "@/components/HeroController";
import { client } from "@/lib/sanity";

export default async function HeroWrapper() {
  const data = await client.fetch(`
    *[_type == "hero"][0]{
      headline,
      subheadline,
      primaryCTA,
      secondaryCTA,
      backgroundImages[]{ alt, asset->{ _ref, _type, url } }
    }
  `);

  const images = Array.isArray(data?.backgroundImages)
    ? data.backgroundImages.filter(Boolean)
    : [];

  const chosen =
    images.length > 0
      ? images[Math.floor(Math.random() * images.length)]
      : null;

  const heroData: HeroData = {
    headline: data?.headline ?? undefined,
    subheadline: data?.subheadline ?? undefined,
    primaryCTA: data?.primaryCTA ?? undefined,
    secondaryCTA: data?.secondaryCTA ?? undefined,
    backgroundImages: chosen ? [chosen] : [],
  };

  return <HeroController heroData={heroData} />;
}
