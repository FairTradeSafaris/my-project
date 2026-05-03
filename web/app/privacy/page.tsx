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
        heroData={heroData ?? undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy" },
        ]}
      />

      {/* ===========================
          CONTENT
      =========================== */}
      <main className="min-h-screen text-black bg-[#fdf8f3]">
        <section className="max-w-3xl mx-auto px-6 py-12">
          {/* ❌ REMOVED H1 (hero owns it) */}

          <div className="prose prose-lg text-gray-700">
            <PortableText
              value={data.content}
              components={portableTextComponents}
            />
          </div>
        </section>
      </main>
    </>
  );
}
