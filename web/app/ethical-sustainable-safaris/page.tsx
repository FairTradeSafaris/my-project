import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import EthicalSustainableSafarisPage from "./ClientPage";
import HeroController from "@/components/HeroController";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

export async function generateMetadata(): Promise<Metadata> {
  // Sanity doc slug is "ethicalsustainablesafaris" but the route is
  // /ethical-sustainable-safaris/ — canonical must point at the real route
  // (/ethicalsustainablesafaris/ rendered a soft 404; it now 301s here).
  const { metadata } = await getSanityMetadata(
    "ethicalsustainablesafaris",
    "/ethical-sustainable-safaris/",
  );

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  const canonical = "https://www.fairtradesafaris.com/ethical-sustainable-safaris/";
  return {
    ...metadata,
    alternates: { canonical },
    openGraph: { ...metadata.openGraph, url: canonical },
  };
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
    { label: "Ethical Safaris", href: "/ethical-sustainable-safaris/" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />
      <EthicalSustainableSafarisPage />
    </>
  );
}
