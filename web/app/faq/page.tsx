// /app/faq/page.tsx

import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";
import FAQClient from "../contact/FAQClient";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { Metadata } from "next";

import HeroController from "@/components/HeroController";
import { groq } from "next-sanity";
import type { FAQCategory, FAQItem } from "../../types/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { HeroData } from "@/components/HeroController";
import Link from "next/link";
// Batch 17: "Popular questions" links to the Safari Questions pages
import {
  QUESTIONS_PATH,
  popularSafariQuestionsQuery,
  type SafariQuestionLink,
} from "@/lib/safariQuestions";

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

// JSON for a <script> tag: escape "<" so text like "</script>" in an answer
// can't end the tag early.
function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// -----------------------------
// PAGE
// -----------------------------
export default async function FAQPage() {
  const [heroData, categories, popularRaw]: [
    HeroData | null,
    FAQCategory[],
    SafariQuestionLink[] | null,
  ] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(faqCategoriesQuery),
    client.fetch(popularSafariQuestionsQuery),
  ]);
  const popular = (popularRaw || []).filter((q) => q?.slug && q?.question);

  const questions: FAQItem[] = categories
    .flatMap((cat) => cat.items ?? [])
    // Google needs both a question and an answer for each FAQ entry
    .filter((q) => Boolean(q?.question) && portableTextToPlainText(q.answer) !== "");

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
        item: "https://www.fairtradesafaris.com/faq/",
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
        headlineAs="p"
      />

      <main className="min-h-screen px-4 py-5 bg-[#f9f6f2]">
        {/* Structured Data (batch 16: plain <script> tags so the JSON-LD is
            in the HTML itself; next/script only added it after JS ran) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(faqJsonLd),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(breadcrumbJsonLd),
          }}
        />

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
            Your Safari Questions, Answered
          </h1>

          {/* Batch 17: only when Safari Questions exist */}
          {popular.length > 0 && (
            <nav
              aria-labelledby="popular-questions"
              className="mx-auto mb-2 max-w-4xl px-4 text-center"
            >
              <h2
                id="popular-questions"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a0703f]"
              >
                Popular questions
              </h2>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {popular.map((q) => (
                  <li key={q._id}>
                    <Link
                      href={`${QUESTIONS_PATH}/${q.slug}/`}
                      className="inline-block rounded-full bg-white px-4 py-2 text-sm text-[#4a3527] ring-1 ring-[#e6d8c8] transition hover:bg-[#fbf6ef] hover:text-[#24170f] hover:ring-[#c9a57f]"
                    >
                      {q.question}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`${QUESTIONS_PATH}/`}
                className="mt-4 inline-block text-sm font-semibold text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-[6px] hover:text-[#24170f]"
              >
                See all safari questions
              </Link>
            </nav>
          )}

          <FAQClient categories={categories} />
        </div>
      </main>
    </>
  );
}
