// app/safari-questions/[slug]/page.tsx (batch 17)
// One page per safari question (Sanity type "safariQuestion"): the question
// as the H1, the short answer as the very first paragraph, then the full
// answer, related itineraries, a link back to the destination and a
// "Still have a question?" box. FAQPage (single question) + BreadcrumbList
// JSON-LD, canonical and Open Graph.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { client } from "@/lib/sanity";
import Image from "@/components/SanityImage";
import JsonLd from "@/components/JsonLd";
import JourneyCard from "@/components/JourneyCard";
import LineArt from "@/components/LineArt";
import { DEFAULT_OG_IMAGE, ogImageUrl } from "@/lib/seoDefaults";
import {
  QuestionLinkList,
  StillHaveAQuestion,
  questionBodyComponents,
} from "@/components/safari-questions/QuestionParts";
import {
  QUESTIONS_PATH,
  SITE_URL,
  formatReviewed,
  portableToPlain,
  questionDescription,
  questionTitle,
  questionUrl,
  safariQuestionBySlugQuery,
  safariQuestionSlugsQuery,
  shortAnswerOf,
  type SafariQuestion,
} from "@/lib/safariQuestions";

// Same as app/destination/[slug]: render as static HTML (ISR) so questions
// published after a deploy also work on first visit.
export const dynamic = "force-static";
export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

async function getQuestion(slug: string): Promise<SafariQuestion | null> {
  return client.fetch<SafariQuestion | null>(safariQuestionBySlugQuery, { slug });
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(safariQuestionSlugsQuery);
  return (slugs || []).filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const q = await getQuestion(slug);
  if (!q) notFound();
  const title = questionTitle(q);
  const description = questionDescription(q);
  const url = questionUrl(q.slug);
  const img = q.heroImage?.url || q.destination?.heroUrl;
  const image = img ? ogImageUrl(img) : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SafariQuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const q = await getQuestion(slug);
  if (!q) notFound();

  const short = shortAnswerOf(q);
  const hasBody = Array.isArray(q.body) && q.body.length > 0;
  const reviewed = formatReviewed(q.lastReviewed);
  const dest = q.destination?.slug && q.destination?.title ? q.destination : null;
  const journeys = (q.relatedJourneys || []).filter((j) => j?.slug && j?.title);

  // "More questions": same destination first, then the rest (max 4)
  const related = (q.related || []).filter((r) => r.slug && r.question);
  const more = [
    ...related.filter((r) => dest && r.destination?.slug === dest.slug),
    ...related.filter((r) => !(dest && r.destination?.slug === dest.slug)),
  ].slice(0, 4);

  const url = questionUrl(q.slug);
  const answerText = [short, portableToPlain(q.body)].filter(Boolean).join("\n\n");
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    ...(q.lastReviewed ? { dateModified: q.lastReviewed } : {}),
    mainEntity: [
      {
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: answerText || q.question, url },
      },
    ],
  };
  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Safari Questions", item: `${SITE_URL}${QUESTIONS_PATH}/` },
    { name: q.question, item: url },
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
  };

  return (
    <main className="bg-[#fbf6ef] text-[#24170f]">
      <JsonLd id="question-faq" data={faqLd} />
      <JsonLd id="question-breadcrumbs" data={breadcrumbLd} />

      {/* QUESTION + SHORT ANSWER */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-14 pt-28 sm:pt-36 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pb-20">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#8a6a52]">
              <Link href="/" className="hover:text-[#24170f]">Home</Link>
              <span aria-hidden="true">›</span>
              <Link href={`${QUESTIONS_PATH}/`} className="hover:text-[#24170f]">Safari Questions</Link>
              {dest && (
                <>
                  <span aria-hidden="true">›</span>
                  <Link href={`/destination/${dest.slug}/`} className="hover:text-[#24170f]">{dest.title}</Link>
                </>
              )}
            </nav>

            <h1 className="mt-6 text-[32px] font-bold leading-[1.15] tracking-tight text-[#24170f] sm:text-5xl sm:leading-[1.1]">
              {q.question}
            </h1>

            {short && (
              <p className="mt-6 border-l-2 border-[#c9a57f] pl-5 text-lg leading-relaxed text-[#4a3527] sm:text-xl sm:leading-relaxed">
                {short}
              </p>
            )}

            <p className="mt-6 text-sm text-[#8a6a52]">
              Answered by the Fair Trade Safaris team
              {reviewed && (
                <>
                  {" · "}Last reviewed <time dateTime={q.lastReviewed}>{reviewed}</time>
                </>
              )}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-16">
            {q.heroImage?.url ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#f3e9dd] shadow-[0_30px_60px_-34px_rgba(60,42,30,0.55)]">
                <Image
                  src={q.heroImage.url}
                  alt={q.heroImage.alt || q.question}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <LineArt name="elephant-acacia" className="mx-auto hidden w-full max-w-[380px] text-[#c9a57f]/70 lg:block" />
            )}
          </div>
        </div>
      </section>

      {/* FULL ANSWER */}
      {hasBody && (
        <section className="bg-white">
          <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
            <PortableText value={q.body!} components={questionBodyComponents} />
          </div>
        </section>
      )}

      {/* RELATED ITINERARIES (batch 14 card) */}
      {journeys.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a0703f]">Itineraries</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">Safaris that fit this answer</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j) => (
              <JourneyCard
                key={j._id}
                journeyId={j._id}
                slug={j.slug || ""}
                title={j.title || ""}
                summary={j.summary}
                imageUrl={j.imageUrl}
                alt={j.alt || j.title}
                price={j.price}
                duration={j.duration}
                region={j.region?.title}
                star={j.star ? parseInt(j.star, 10) || 0 : 0}
                starIcon={j.starIcon}
              />
            ))}
          </div>
        </section>
      )}

      {/* DESTINATION + MORE QUESTIONS + CONTACT */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {dest && (
              <Link
                href={`/destination/${dest.slug}/`}
                className="group mb-12 flex items-center justify-between gap-6 rounded-[24px] bg-[#f3e9dd] px-7 py-6 ring-1 ring-[#e6d8c8] transition hover:bg-[#efe2d2]"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#a0703f]">Destination guide</span>
                  <span className="mt-1 block text-xl font-semibold text-[#24170f]">Explore {dest.title} safaris</span>
                </span>
                <span aria-hidden="true" className="text-2xl text-[#5d4037] transition group-hover:translate-x-1">→</span>
              </Link>
            )}

            {more.length > 0 && (
              <>
                <h2 className="text-2xl font-bold leading-tight">More safari questions</h2>
                <div className="mt-6">
                  <QuestionLinkList items={more} />
                </div>
                <Link
                  href={`${QUESTIONS_PATH}/`}
                  className="mt-6 inline-block text-sm font-semibold text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-[6px] hover:text-[#24170f]"
                >
                  See all safari questions
                </Link>
              </>
            )}
          </div>
          <div className="lg:col-span-5">
            <StillHaveAQuestion destinationTitle={dest?.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
