import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import EthicalSustainableSafarisPage from "./ClientPage";
import HeroController from "@/components/HeroController";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("ethicalsustainablesafaris");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

/* ✅ ADD HERO QUERY */
const heroQuery = groq`
*[_type == "hero" && customScope == "ethical-sustainable-safaris"][0]{
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

export default async function Page() {
  const heroData = await client.fetch(heroQuery);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ethical Safaris", href: "/ethicalsustainablesafaris" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />
      <EthicalSustainableSafarisPage />
    </>
  );
}
