// /app/faq/page.tsx

import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";
import FAQClient from "../contact/FAQClient";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import Script from "next/script";

import HeroController from "@/components/HeroController";
import { groq } from "next-sanity";
import type { FAQCategory, FAQItem } from "../../types/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { HeroData } from "@/components/HeroController";

export const revalidate = 60;

// -----------------------------
// SEO METADATA
// -----------------------------
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("faq");

  return {
    ...metadata,
    title: metadata?.title || "FAQ | Fair Trade Safaris",
    description:
      metadata?.description ||
      "Answers to common safari questions: travel safety, packing tips, ethics, and more from Fair Trade Safaris.",
  };
}

/* ✅ ADD HERO QUERY */
const heroQuery = groq`
*[_type == "hero" && customScope == "faq"][0]{
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
`;

// -----------------------------
// Helper: Convert Portable Text to Plain Text
// -----------------------------
function portableTextToPlainText(
  blocks: PortableTextBlock[] | undefined,
): string {
  if (!blocks) return "";

  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return "";

      return block.children
        .map((child) =>
          "text" in child && typeof child.text === "string" ? child.text : "",
        )
        .join("");
    })
    .join("\n")
    .trim();
}

// -----------------------------
// PAGE
// -----------------------------
export default async function FAQPage() {
  const [heroData, categories]: [HeroData | null, FAQCategory[]] =
    await Promise.all([
      client.fetch(heroQuery),
      client.fetch(faqCategoriesQuery),
    ]);

  const questions: FAQItem[] = categories
    .flatMap((cat) => cat.items ?? [])
    .filter(Boolean);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: portableTextToPlainText(q.answer),
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: "https://www.fairtradesafaris.com/faq",
      },
    ],
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <>
      {/* ✅ HERO */}
      <HeroController
        heroData={heroData ?? undefined}
        breadcrumbs={breadcrumbs}
      />

      <main className="min-h-screen px-4 py-5 bg-[#f9f6f2]">
        {/* Structured Data */}
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />

        <Script
          id="faq-breadcrumbs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
            Your Safari Questions, Answered
          </h1>

          <FAQClient categories={categories} />
        </div>
      </main>
    </>
  );
}
