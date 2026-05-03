import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import ClientHomeWrapper from "./ClientHomeWrapper";
import HeroController from "@/components/HeroController";
import { client as sanity } from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("client-home");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

export default async function ClientHomePage() {
  const heroData = await sanity.fetch(`
    *[_type == "hero" && customScope == "client-home"][0]{
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
  `);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Safari Hub", href: "/client-home" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />
      <ClientHomeWrapper />
    </>
  );
}
