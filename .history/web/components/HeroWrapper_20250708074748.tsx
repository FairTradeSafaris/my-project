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

  return <HeroWithSearch data={data} />;
}
