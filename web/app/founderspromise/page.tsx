import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import OurPromisePage from "./ClientPage";
import HeroController from "@/components/HeroController";
import { client as sanity } from "@/lib/sanity";

/* ===========================
   ✅ Metadata
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("founderspromise");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

/* ===========================
   ✅ Hero Query
=========================== */
const heroQuery = `
  *[_type == "hero" && customScope == "founderspromise"][0]{
    headline,
    subheadline,
    action,
    primaryCTA,
    secondaryCTA,
    primaryLink { href, label },
    backgroundImages[]{
      alt,
      desktopImage { asset-> },
      mobileImage { asset-> }
    }
  }
`;

/* ===========================
   ✅ PAGE
=========================== */
export default async function Page() {
  const heroData = await sanity.fetch(heroQuery);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Our Promise", href: "/founderspromise" },
  ];

  return (
    <>
      <HeroController
        heroData={heroData ?? undefined}
        breadcrumbs={breadcrumbs}
      />
      <OurPromisePage />
    </>
  );
}
