// app/video-testimonials/page.tsx

import { groq } from "next-sanity";
import { freshClient as client } from "@/lib/sanityFresh";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import VideoTestimonials from "./VideoTestimonials";
import Link from "next/link";
export const revalidate = 60;

// ---------- GROQ QUERY ----------
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

// ---------- Types ----------
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

// ---------- SEO METADATA ----------
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("videoTestimonial");

  return {
    ...metadata,
    title: metadata?.title || "Video Testimonials | Fair Trade Safaris",
    description:
      metadata?.description ||
      "Hear directly from travelers who experienced ethical, luxury safari adventures with us.",
    alternates: {
      canonical: "https://www.fairtradesafaris.com/videoTestimonial/",
    },
  };
}

// ---------- Page Component ----------
export default async function Page() {
  const testimonials = await client.fetch<Testimonial[]>(TESTIMONIALS_QUERY);

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
        item: "https://www.fairtradesafaris.com/videoTestimonial/",
      },
    ],
  };

  return (
    <main className="px-6 py-16 max-w-6xl mx-auto">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Visual Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">Video Testimonials</li>
        </ol>
      </nav>

      <VideoTestimonials testimonials={testimonials} />
    </main>
  );
}
