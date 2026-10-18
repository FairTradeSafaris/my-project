import { getSanityMetadata } from "@/lib/getSanityMetadata";
import { client } from "@/lib/sanity";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import HeroController from "@/components/HeroController";
import Script from "next/script";

/* ===========================
   ✅ Metadata
=========================== */
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("privacy");

  if (metadata?.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return {
    ...metadata,
    title: metadata?.title || "Privacy Policy | Fair Trade Safaris",
    description:
      metadata?.description ||
      "Learn how Fair Trade Safaris protects your data, privacy, and personal information when planning your safari experience.",
  };
}

/* ===========================
   ✅ Hero Query
=========================== */
const heroQuery = `
  *[_type == "hero" && customScope == "privacy"][0]{
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
   ✅ Page
=========================== */
export default async function PrivacyPolicyPage() {
  const [heroData, data] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(`*[_type == "privacyPolicy"][0]{
      pageHeading,
      content
    }`),
  ]);

  if (!data) {
    return <div className="p-8 text-red-500">Privacy policy not found.</div>;
  }

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
        name: "Privacy Policy",
        item: "https://www.fairtradesafaris.com/privacy/",
      },
    ],
  };

  return (
    <>
      {/* ===========================
          STRUCTURED DATA
      =========================== */}
      <Script
        id="privacy-breadcrumbs"
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
          { label: "Privacy Policy", href: "/privacy" },
        ]}
      />

      {/* ===========================
          CONTENT
      =========================== */}
      {/* Batch 23: policy text in a white card on cream (display only) */}
      <main className="min-h-screen text-[#24170f] bg-[#f7f3ec]">
        <section className="mx-auto max-w-[960px] px-6 py-10 md:py-14">
          {/* ❌ REMOVED H1 (hero owns it) */}

          <div className="rounded-2xl border border-[#ebe1d3] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)] md:px-12 md:py-12">
          <div className="prose max-w-none text-[16px] leading-7 text-[#5c4a3d] md:text-[17px] md:leading-8 prose-headings:font-semibold prose-headings:text-[#24170f] prose-h2:text-[26px] prose-h3:text-[20px] prose-strong:text-[#24170f] prose-a:text-[#9a4f22] prose-li:marker:text-[#c9974f]">
            <PortableText
              value={data.content}
              components={portableTextComponents}
            />
          </div>
          </div>
        </section>
      </main>
    </>
  );
}
