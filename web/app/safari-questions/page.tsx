// app/safari-questions/page.tsx (batch 17)
// Index of all Safari Questions, grouped by destination ("Planning your
// safari" for questions without one). With no questions published yet it is
// a 404 and stays out of the sitemap, so there is never an empty page.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import JsonLd from "@/components/JsonLd";
import LineArt from "@/components/LineArt";
import { DEFAULT_OG_IMAGE } from "@/lib/seoDefaults";
import { QuestionLinkList, StillHaveAQuestion } from "@/components/safari-questions/QuestionParts";
import {
  QUESTIONS_PATH,
  SITE_URL,
  questionUrl,
  safariQuestionListQuery,
  type SafariQuestionLink,
} from "@/lib/safariQuestions";

export const revalidate = 300;

const INDEX_URL = `${SITE_URL}${QUESTIONS_PATH}/`;
const TITLE = "Safari Questions, Answered | Fair Trade Safaris";
const DESCRIPTION =
  "Straight answers to the questions travellers ask most before an African safari: when to go, what it costs, where to see wildlife and how to plan it.";

async function getQuestions(): Promise<SafariQuestionLink[]> {
  const list = await client.fetch<SafariQuestionLink[]>(safariQuestionListQuery);
  return (list || []).filter((q) => q?.slug && q?.question);
}

export async function generateMetadata(): Promise<Metadata> {
  if ((await getQuestions()).length === 0) notFound();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: INDEX_URL },
    openGraph: { title: TITLE, description: DESCRIPTION, url: INDEX_URL, images: [{ url: DEFAULT_OG_IMAGE }] },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function SafariQuestionsIndex() {
  const questions = await getQuestions();
  if (questions.length === 0) notFound();

  // group: general questions first, then destinations A-Z
  const groups = new Map<string, { title: string; slug?: string; items: SafariQuestionLink[] }>();
  for (const q of questions) {
    const key = q.destination?.slug && q.destination?.title ? q.destination.slug : "_general";
    if (!groups.has(key)) {
      groups.set(key, {
        title: key === "_general" ? "Planning your safari" : `${q.destination!.title}`,
        slug: key === "_general" ? undefined : key,
        items: [],
      });
    }
    groups.get(key)!.items.push(q);
  }
  const ordered = [
    ...(groups.has("_general") ? [groups.get("_general")!] : []),
    ...[...groups.entries()]
      .filter(([k]) => k !== "_general")
      .map(([, g]) => g)
      .sort((a, b) => a.title.localeCompare(b.title)),
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Safari Questions", item: INDEX_URL },
    ],
  };
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: questions.map((q, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: q.question,
      url: questionUrl(q.slug),
    })),
  };

  return (
    <main className="bg-[#fbf6ef] text-[#24170f]">
      <JsonLd id="questions-breadcrumbs" data={breadcrumbLd} />
      <JsonLd id="questions-list" data={listLd} />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-end gap-10 px-6 pb-12 pt-28 sm:pt-36 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#8a6a52]">
              <Link href="/" className="hover:text-[#24170f]">Home</Link>
              <span aria-hidden="true">›</span>
              <span className="text-[#24170f]">Safari Questions</span>
            </nav>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Safari questions, answered
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4a3527]">
              Straight answers from our safari specialists to the questions travellers ask us most. Looking for something
              else? Browse the full <Link href="/faq/" className="font-medium text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-4 hover:text-[#24170f]">FAQ</Link>.
            </p>
          </div>
          <LineArt name="giraffes" className="hidden w-full max-w-[420px] text-[#c9a57f]/70 lg:col-span-5 lg:ml-auto lg:block" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-14 lg:col-span-7">
            {ordered.map((g) => (
              <div key={g.slug || "general"}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-bold leading-tight">{g.title}</h2>
                  {g.slug && (
                    <Link
                      href={`/destination/${g.slug}/`}
                      className="shrink-0 text-sm font-semibold text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-[6px] hover:text-[#24170f]"
                    >
                      {g.title} guide
                    </Link>
                  )}
                </div>
                <div className="mt-5">
                  <QuestionLinkList items={g.items} />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <StillHaveAQuestion />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
