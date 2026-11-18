// lib/safariQuestions.ts (batch 17, internal links batch 34)
// Queries, types and fallbacks for the "Safari Questions" pages
// (/safari-questions/ and /safari-questions/<slug>/). The Sanity type is the
// new "safariQuestion" (studio/schemas/safariQuestion.ts). Every optional
// field has a fallback here, so a half-filled question never shows "null".
import type { PortableTextBlock } from "@portabletext/types";

export const SITE_URL = "https://www.fairtradesafaris.com";
export const QUESTIONS_PATH = "/safari-questions";
export const BOOK_CALL_URL = "https://zfrmz.com/XunmYZIZrWBuv495QyoV";
const BRAND = " | Fair Trade Safaris";

// Only complete, published questions (drafts never reach the public API,
// the path() check is a belt-and-braces guard for token clients).
const VALID = `_type == "safariQuestion" && defined(slug.current) && defined(question) && !(_id in path("drafts.**"))`;
const ORDER = `order(coalesce(sortOrder, 100) asc, question asc)`;

export type SafariQuestionLink = {
  _id: string;
  question: string;
  slug: string;
  shortAnswer?: string;
  destination?: { title?: string; slug?: string } | null;
};

export type SafariQuestionJourney = {
  _id: string;
  title?: string;
  slug?: string;
  summary?: string;
  duration?: string;
  price?: number | string;
  star?: string;
  starIcon?: string;
  imageUrl?: string;
  alt?: string;
  region?: { title?: string } | null;
};

export type SafariQuestion = SafariQuestionLink & {
  body?: PortableTextBlock[];
  heroImage?: { url?: string; alt?: string; width?: number; height?: number } | null;
  destination?: {
    _id?: string;
    title?: string;
    slug?: string;
    heroUrl?: string;
  } | null;
  relatedJourneys?: SafariQuestionJourney[];
  lastReviewed?: string;
  seoTitle?: string;
  seoDescription?: string;
  _updatedAt?: string;
  related?: SafariQuestionLink[];
};

const LINK_FIELDS = `
  _id,
  question,
  "slug": slug.current,
  shortAnswer,
  "destination": destination->{ title, "slug": slug.current }
`;

export const safariQuestionSlugsQuery = `*[${VALID}].slug.current`;

export const safariQuestionListQuery = `*[${VALID}] | ${ORDER}{${LINK_FIELDS}}`;

export const popularSafariQuestionsQuery = `*[${VALID}] | ${ORDER}[0...6]{${LINK_FIELDS}}`;

// For the "Common questions" section on a destination page: questions that
// point at this destination in Studio, plus the ones listed for it in
// DESTINATION_QUESTION_SLUGS below (batch 34). Needs the $questionSlugs param;
// sort and cap with orderDestinationQuestions().
export const destinationQuestionsProjection = `*[${VALID} && (references(^._id) || slug.current in $questionSlugs)] | ${ORDER}{${LINK_FIELDS}}`;

// Same list as a stand-alone query (for /destination/<slug>/safaris/).
export const destinationQuestionsQuery = `*[${VALID} && (destination->slug.current == $slug || slug.current in $questionSlugs)] | ${ORDER}{${LINK_FIELDS}}`;

// Batch 34 (internal linking): answer pages that are relevant to a destination
// but are not tied to it in Studio. Keyed by destination slug, most relevant
// first. A slug that does not exist (or is unpublished) is simply skipped.
export const DESTINATION_QUESTION_SLUGS: Record<string, string[]> = {
  tanzania: [
    "when-do-the-great-migration-river-crossings-happen",
    "is-tanzania-or-kenya-better-for-a-first-safari",
    "where-is-the-best-place-to-see-the-big-five",
    "what-are-the-best-safari-and-beach-combinations",
    "how-many-days-do-you-need-for-a-safari",
  ],
  kenya: [
    "is-tanzania-or-kenya-better-for-a-first-safari",
    "when-do-the-great-migration-river-crossings-happen",
    "where-is-the-best-place-to-see-the-big-five",
    "what-are-the-best-safari-and-beach-combinations",
    "is-it-safe-to-go-on-an-african-safari",
    "what-does-a-typical-day-on-safari-look-like",
    "how-much-does-a-luxury-african-safari-cost",
  ],
  rwanda: [
    "when-is-the-best-time-for-gorilla-trekking-in-rwanda",
    "rwanda-gorilla-permit",
    "is-uganda-or-rwanda-better-for-gorilla-trekking",
    "what-should-i-pack-for-a-safari",
    "how-much-does-a-luxury-african-safari-cost",
    "how-do-i-choose-a-safari-operator",
  ],
  uganda: [
    "is-uganda-or-rwanda-better-for-gorilla-trekking",
    "when-is-the-best-time-for-gorilla-trekking-in-rwanda",
    "rwanda-gorilla-permit",
    "what-should-i-pack-for-a-safari",
    "is-it-safe-to-go-on-an-african-safari",
  ],
  "south-africa": [
    "is-a-private-reserve-or-kruger-national-park-better-for-safari",
    "is-botswana-or-south-africa-better-for-a-safari",
    "where-can-i-go-on-a-malaria-free-safari",
    "where-is-the-best-place-to-see-the-big-five",
    "what-is-the-best-age-to-take-children-on-safari",
    "what-are-the-best-safari-and-beach-combinations",
    "how-much-should-i-tip-on-safari",
  ],
  botswana: [
    "when-is-the-best-time-to-visit-the-okavango-delta",
    "is-botswana-or-south-africa-better-for-a-safari",
    "when-is-the-best-time-to-visit-victoria-falls",
    "are-walking-safaris-safe",
    "what-does-a-typical-day-on-safari-look-like",
    "how-much-does-a-luxury-african-safari-cost",
  ],
  zambia: [
    "when-is-the-best-time-to-visit-victoria-falls",
    "are-walking-safaris-safe",
    "what-does-a-typical-day-on-safari-look-like",
    "how-do-i-choose-a-safari-operator",
    "what-is-an-ethical-safari",
  ],
  zimbabwe: [
    "when-is-the-best-time-to-visit-victoria-falls",
    "when-is-the-best-time-to-visit-the-okavango-delta",
    "are-walking-safaris-safe",
    "how-many-days-do-you-need-for-a-safari",
    "how-much-should-i-tip-on-safari",
    "what-is-an-ethical-safari",
  ],
  namibia: [
    "how-many-days-do-you-need-for-a-safari",
    "what-is-the-best-age-to-take-children-on-safari",
    "is-it-safe-to-go-on-an-african-safari",
    "what-should-i-pack-for-a-safari",
    "how-much-does-a-luxury-african-safari-cost",
  ],
  mozambique: [
    "what-are-the-best-safari-and-beach-combinations",
    "how-many-days-do-you-need-for-a-safari",
    "what-is-the-best-age-to-take-children-on-safari",
    "what-is-an-ethical-safari",
  ],
  seychelles: [
    "what-are-the-best-safari-and-beach-combinations",
    "how-many-days-do-you-need-for-a-safari",
    "how-much-does-a-luxury-african-safari-cost",
  ],
  madagascar: [
    "what-is-an-ethical-safari",
    "how-do-i-choose-a-safari-operator",
    "what-should-i-pack-for-a-safari",
  ],
  "mount-kilimanjaro": [
    "when-is-the-best-time-to-go-on-a-tanzania-safari",
    "do-i-need-a-visa-for-tanzania",
    "what-vaccinations-do-i-need-for-a-tanzania-safari",
    "what-should-i-pack-for-a-safari",
  ],
};

export function destinationQuestionSlugs(destinationSlug: string): string[] {
  return DESTINATION_QUESTION_SLUGS[destinationSlug] || [];
}

// Questions tied to the destination in Studio first (in their usual order),
// then the listed ones in list order; no duplicates, at most `max`.
export function orderDestinationQuestions(
  items: SafariQuestionLink[] | null | undefined,
  destinationSlug: string,
  max = 8,
): SafariQuestionLink[] {
  const valid = (items || []).filter((q) => q?.slug && q?.question);
  const own = valid.filter((q) => q.destination?.slug === destinationSlug);
  const listed = destinationQuestionSlugs(destinationSlug)
    .map((s) => valid.find((q) => q.slug === s))
    .filter((q): q is SafariQuestionLink => Boolean(q));
  const seen = new Set<string>();
  return [...own, ...listed]
    .filter((q) => (seen.has(q.slug) ? false : (seen.add(q.slug), true)))
    .slice(0, max);
}

// "More safari questions" on an answer page (batch 34): same destination
// first, then the questions that come after this one in the list, wrapping
// round. Every answer page is then linked from the pages just before it,
// instead of every page linking to the same first four.
export function moreQuestionsFor(
  current: { slug: string; destination?: { slug?: string } | null },
  all: SafariQuestionLink[] | null | undefined,
  max = 4,
): SafariQuestionLink[] {
  const list = (all || []).filter((r) => r?.slug && r?.question);
  const i = list.findIndex((r) => r.slug === current.slug);
  const rotated =
    i >= 0 ? [...list.slice(i + 1), ...list.slice(0, i)] : list.filter((r) => r.slug !== current.slug);
  const destSlug = current.destination?.slug;
  return [
    ...rotated.filter((r) => destSlug && r.destination?.slug === destSlug),
    ...rotated.filter((r) => !(destSlug && r.destination?.slug === destSlug)),
  ].slice(0, max);
}

export const safariQuestionBySlugQuery = `*[${VALID} && slug.current == $slug][0]{
  ${LINK_FIELDS},
  body,
  "heroImage": select(defined(heroImage.asset) => {
    "url": heroImage.asset->url,
    "alt": heroImage.alt,
    "width": heroImage.asset->metadata.dimensions.width,
    "height": heroImage.asset->metadata.dimensions.height
  }),
  "destination": destination->{
    _id,
    title,
    "slug": slug.current,
    "heroUrl": coalesce(heroImage.image.asset->url, heroImage.galleryImage->image.asset->url)
  },
  "relatedJourneys": relatedJourneys[defined(@->slug.current) && @->slug.current != "null" && @->isActive != false]->{
    _id,
    title,
    "slug": slug.current,
    summary,
    duration,
    price,
    star,
    "starIcon": starIcon.asset->url,
    "imageUrl": heroImage.asset->url,
    alt,
    region->{ title }
  },
  lastReviewed,
  seoTitle,
  seoDescription,
  _updatedAt,
  "related": *[${VALID}] | ${ORDER}[0...60]{${LINK_FIELDS}}
}`;

// Cut text to <= max characters on a whole word.
export function clipWords(text: string, max = 155): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,;:.\-–—]+$/, "")}…`;
}

export function portableToPlain(blocks?: PortableTextBlock[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) =>
      b?._type === "block" && Array.isArray(b.children)
        ? b.children
            .map((c) => ("text" in c && typeof c.text === "string" ? c.text : ""))
            .join("")
        : "",
    )
    .filter(Boolean)
    .join("\n")
    .trim();
}

// Short answer, or the start of the full answer if it is missing.
export function shortAnswerOf(q: { shortAnswer?: string; body?: PortableTextBlock[] }): string {
  const s = (q.shortAnswer || "").trim();
  return s || clipWords(portableToPlain(q.body), 320);
}

export function questionTitle(q: SafariQuestion): string {
  const own = (q.seoTitle || "").trim();
  if (own) return own;
  const base = q.question.trim();
  return base.length + BRAND.length <= 60 ? `${base}${BRAND}` : base;
}

export function questionDescription(q: SafariQuestion): string {
  const own = (q.seoDescription || "").trim();
  return clipWords(own || shortAnswerOf(q) || q.question, 155);
}

export function questionUrl(slug: string): string {
  return `${SITE_URL}${QUESTIONS_PATH}/${slug}/`;
}

export function formatReviewed(date?: string): string | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return null;
  const d = new Date(`${date.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
