// /app/faq/page.tsx

import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";
import FAQClient from "../contact/FAQClient";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import type { FAQCategory, FAQItem } from "../../types/types";
import type { PortableTextBlock } from "@portabletext/types";

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
  const categories: FAQCategory[] = await client.fetch(faqCategoriesQuery);

  const questions: FAQItem[] = categories
    .flatMap((cat) => cat.items ?? [])
    .filter(Boolean);

  // JSON-LD structured data
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

  // Breadcrumb structured data
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

  return (
    <main className="min-h-screen px-4 py-5 bg-[#f9f6f2]">
      {/* FAQ Structured Data */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      {/* Breadcrumb Structured Data */}
      <Script
        id="faq-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Visible Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-1">›</span>
          <span className="text-gray-800 font-medium">FAQ</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          Your Safari Questions, Answered
        </h1>

        <FAQClient categories={categories} />
      </div>
    </main>
  );
}
