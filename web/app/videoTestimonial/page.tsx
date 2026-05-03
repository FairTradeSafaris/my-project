import { groq } from "next-sanity";
import { freshClient as client } from "@/lib/sanityFresh";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import VideoTestimonials from "./VideoTestimonials";

import HeroController from "@/components/HeroController";
import Script from "next/script";

export const revalidate = 60;

/* ===========================
   QUERY
=========================== */
const TESTIMONIALS_QUERY = groq`
  *[_type == "videoTestimonial"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    location,
    videoUrl,
    quote,
    "thumbnailUrl": thumbnail.asset->url,
    uploadDate,
    videoDuration
  }
`;

/* ===========================
   TYPES
=========================== */
type Testimonial = {
  _id: string;
  name: string;
  location: string;
  videoUrl: string;
  quote: string;
  thumbnailUrl: string;
  uploadDate: string;
  videoDuration: string;
  slug: string;
};

/* ===========================
   METADATA
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("videoTestimonial");

  return {
    ...metadata,
    title: metadata?.title || "Video Testimonials | Fair Trade Safaris",
    description:
      metadata?.description ||
      "Hear directly from travelers who experienced ethical, luxury safari adventures with us.",
    alternates: {
      canonical: "https://www.fairtradesafaris.com/video-testimonials/",
    },
  };
}

/* ===========================
   HERO QUERY
=========================== */
const heroQuery = `
  *[_type == "hero" && customScope == "videoTestimonial"][0]{
    headline,
    subheadline,
    action,
    backgroundImages[]{
      alt,
      desktopImage { asset-> },
      mobileImage { asset-> }
    }
  }
`;

/* ===========================
   PAGE
=========================== */
export default async function Page() {
  const [heroData, testimonials] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch<Testimonial[]>(TESTIMONIALS_QUERY),
  ]);

  /* ===========================
     BREADCRUMB SCHEMA
  =========================== */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Video Testimonials",
        item: "https://www.fairtradesafaris.com/video-testimonials/",
      },
    ],
  };

  return (
    <>
      {/* STRUCTURED DATA */}
      <Script
        id="video-testimonials-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* HERO */}
      <HeroController
        heroData={heroData ?? undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Video Testimonials", href: "/video-testimonials" },
        ]}
      />

      {/* CONTENT */}
      <main className="px-6 py-16 max-w-6xl mx-auto">
        <VideoTestimonials testimonials={testimonials} />
      </main>
    </>
  );
}
