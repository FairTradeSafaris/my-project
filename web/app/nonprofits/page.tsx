import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import NonProfitCard from "@/components/NonProfitCard";
import type { NonProfit } from "@/types/nonProfit";
import Link from "next/link";
import HeroController from "@/components/HeroController";
import Script from "next/script";

export const revalidate = 60;

/* ===========================
   ✅ Metadata
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("nonprofits");

  return {
    ...metadata,
    title:
      metadata?.title || "Our Impact Partners | Ethical Safari Non-Profits",
    description:
      metadata?.description ||
      "Discover the non-profit partners working with Fair Trade Safaris to protect wildlife, empower communities, and promote ethical travel across Africa.",
  };
}

/* ===========================
   ✅ Hero Query (Sanity)
=========================== */
const heroQuery = `
  *[_type == "hero" && customScope == "nonprofits"][0]{
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
   ✅ Page
=========================== */
export default async function NonProfitsPage() {
  const [heroData, nonprofits] = await Promise.all([
    sanity.fetch(heroQuery),
    sanity.fetch<NonProfit[]>(`
      *[_type == "nonProfit"] | order(_createdAt desc){
        _id,
        name,
        mission,
        description,
        ctaLabel,
        ctaLink,
        website,
        "logo": logo.asset->url,
        socials[] { platform, url, icon }
      }
    `),
  ]);

  /* ===========================
     ✅ Breadcrumb JSON-LD
  =========================== */
  const breadcrumbJsonLd = {
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
        name: "Impact Partners",
        item: "https://www.fairtradesafaris.com/nonprofits/",
      },
    ],
  };

  return (
    <>
      {/* ===========================
          STRUCTURED DATA
      =========================== */}
      <Script
        id="nonprofits-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* ===========================
          HERO
      =========================== */}
      <HeroController
        heroData={heroData ?? undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Impact Partners", href: "/nonprofits" },
        ]}
      />

      {/* ===========================
          MAIN CONTENT
      =========================== */}
      <main className="bg-white text-[#2c1b13] min-h-screen">
        {/* GRID */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {nonprofits.map((org) => (
            <NonProfitCard key={org._id} org={org} />
          ))}
        </section>

        {/* QUOTE */}
        <section className="bg-[#f7f3ee] py-10">
          <div className="max-w-4xl mx-auto px-6 text-center italic text-[#3c2a1e] text-lg">
            “When we travel consciously, we don’t just visit — we contribute.”
            <br />
            <span className="not-italic text-sm text-gray-600">
              – FTS Non-Profit Partner
            </span>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#fdf4ea] py-14">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-semibold text-[#3c2a1e] mb-4">
              Want to Partner With Us?
            </h2>

            <p className="text-gray-700 mb-6">
              We&apos;re always open to teaming up with mission-aligned
              organizations. If your non-profit supports ethical travel,
              conservation, or community development — let’s talk.
            </p>

            <Link
              href="/contact/"
              className="inline-block px-6 py-3 bg-[#5a3e2b] text-white rounded-full hover:bg-[#3a291e] transition font-medium"
            >
              Become a Partner
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
