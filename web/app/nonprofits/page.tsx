import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import NonProfitCard from "@/components/NonProfitCard";
import type { NonProfit } from "@/types/nonProfit";
import Link from "next/link";
import HeroController from "@/components/HeroController";
import Script from "next/script";
import LineArt from "@/components/LineArt";
import { coreBody, coreButton, coreCard, coreContainer, coreH2 } from "@/components/core/coreStyles";

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
        look="calm"
        heroData={heroData ?? undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Impact Partners", href: "/nonprofits" },
        ]}
      />

      {/* ===========================
          MAIN CONTENT
      =========================== */}
      {/* Batch 23: homepage-style cards and sections (display only) */}
      <main className="bg-white text-[#24170f] min-h-screen">
        {/* GRID */}
        <section className="bg-[#f7f3ec] py-10 md:py-14">
          <div className={`${coreContainer} grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
          {nonprofits.map((org) => (
            <NonProfitCard key={org._id} org={org} />
          ))}
          </div>
        </section>

        {/* QUOTE */}
        <section className="bg-white py-10 md:py-14">
          <LineArt name="giraffes" className="mx-auto mb-5 w-36 text-[#c9974f]/70" />
          <div className="max-w-3xl mx-auto px-6 text-center italic text-[#24170f] text-[21px] leading-relaxed md:text-[24px]">
            “When we travel consciously, we don’t just visit — we contribute.”
            <br />
            <span className="not-italic text-[15px] text-[#5c4a3d]">
              – FTS Non-Profit Partner
            </span>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f7f3ec] py-10 md:py-14">
          <div className={coreContainer}>
          <div className={`${coreCard} mx-auto max-w-4xl px-6 py-8 text-center md:px-10 md:py-10`}>
            <h2 className={`${coreH2} mb-4`}>
              Want to Partner With Us?
            </h2>

            <p className={`${coreBody} mx-auto mb-6 max-w-2xl md:text-[17px] md:leading-8`}>
              We&apos;re always open to teaming up with mission-aligned
              organizations. If your non-profit supports ethical travel,
              conservation, or community development — let’s talk.
            </p>

            <Link
              href="/contact/"
              className={coreButton}
            >
              Become a Partner
            </Link>
          </div>
          </div>
        </section>
      </main>
    </>
  );
}
