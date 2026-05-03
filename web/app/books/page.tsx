import BookPageWrapper from "./BookPageWrapper";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import HeroController from "@/components/HeroController";
import { client as sanity } from "@/lib/sanity";

/* ===========================
   ✅ Metadata from Sanity
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("client-home");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

/* ===========================
   ✅ Hero Data (FROM SANITY)
=========================== */
export default async function BooksPage() {
  const heroData = await sanity.fetch(`
    *[_type == "hero" && scope == "books"][0]{
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
    { label: "Guides", href: "/books" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />
      <BookPageWrapper />
    </>
  );
}
