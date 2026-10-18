// lib/safariQuestions.ts (batch 17)
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

// For the "Questions about <country>" section on a destination page.
export const destinationQuestionsProjection = `*[${VALID} && references(^._id)] | ${ORDER}[0...8]{${LINK_FIELDS}}`;

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
  "related": *[${VALID} && slug.current != $slug] | ${ORDER}[0...40]{${LINK_FIELDS}}
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
