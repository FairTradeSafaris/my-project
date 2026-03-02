export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import AmbassadorCard from "@/components/AmbassadorCard";
import type { Ambassador } from "@/types/ambassador";

// -----------------------------------------
// Metadata from CMS (SEO)
// -----------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("ambassadors");

  return {
    ...metadata,
    title:
      metadata?.title ||
      "Safari Ambassadors | Fair Trade Safaris — Voices of Impact",
    description:
      metadata?.description ||
      "Meet the voices behind Fair Trade Safaris. Our ambassadors are storytellers, guides, and changemakers creating impact through travel.",
    // ✅ Add this line
    alternates: metadata?.alternates,
  };
}

// -----------------------------------------
// Portable Text to Plain String
// -----------------------------------------
type TextSpan = { _type: "span"; text: string };
type Block = { _type: "block"; children: TextSpan[] };

function extractPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  const block = blocks.find(
    (b): b is Block =>
      typeof b === "object" &&
      b !== null &&
      (b as Block)._type === "block" &&
      Array.isArray((b as Block).children),
  );

  return (
    block?.children
      .map((child) => child.text)
      .join(" ")
      .trim()
      .slice(0, 300) || ""
  );
}

// -----------------------------------------
// Page Component
// -----------------------------------------
export default async function AmbassadorsPage() {
  const [structuredData, ambassadors] = await Promise.all([
    client.fetch(
      `*[_type == "sitePages" && slug.current == "ambassadors"][0].structuredData`,
    ),
    client.fetch<Ambassador[]>(
      `*[_type == "ambassador"] | order(_createdAt desc){
        _id,
        name,
        role,
        slug, // ✅ Required for linking to profile pages
        description,
        ctaLabel,
        ctaLink,
        "image": image.asset->url,
        socials[] { platform, url, icon }
      }`,
    ),
  ]);

  const personSchema = ambassadors.map((amb) => ({
    "@type": "Person",
    name: amb.name,
    jobTitle: amb.role,
    image: amb.image,
    description: extractPlainText(amb.description),
    sameAs: amb.socials?.map((s) => s.url).filter(Boolean),
  }));

  return (
    <main className="bg-[#fdf8f3] text-black min-h-screen">
      {/* Structured Data */}
      {structuredData && (
        <Script
          id="jsonld-ambassadors"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: "Ambassadors",
                item: "https://www.fairtradesafaris.com/ambassadors",
              },
            ],
          }),
        }}
      />

      {/* Person JSON-LD */}
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      {/* Breadcrumb UI */}
      <nav
        className="max-w-7xl mx-auto px-6 pt-8 text-sm text-gray-600"
        aria-label="Breadcrumb"
      >
        <ol className="flex">
          <li>
            <Link href="/" className="hover:underline text-[#5a3e2b]">
              Home
            </Link>
          </li>
          <li className="mx-2 text-gray-400">/</li>
          <li className="text-gray-500">Ambassadors</li>
        </ol>
      </nav>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#3c2a1e] mb-4">
          The Faces Behind the Mission
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Our ambassadors are more than just names — they’re changemakers,
          cultural connectors, storytellers, and sustainability champions.
        </p>
      </section>

      {/* Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {ambassadors.map((amb) => (
            <AmbassadorCard key={amb._id} amb={amb} />
          ))}
        </div>
      </section>
    </main>
  );
}
