// lib/ambassadorSettings.ts (batch 12)
// Reads the "Ambassador Settings" singleton from Sanity and merges it with
// safe defaults, so the page never shows an empty, null or NaN value even if
// the document is missing or a field was cleared.
//
// Text fields may contain tokens that are filled from the numbers, so wording
// never goes out of step with the rates:
//   {commission} {discount} {minTrip} {minPayout} {groupMin} {days}
//   {excluded} {exampleTrip} {exampleEarn}
import { client } from "@/lib/sanity";
import type { PortableTextBlock } from "@portabletext/types";

export type TitleText = { title: string; text: string };
export type Faq = { question: string; answer: string };

export type AmbassadorSettings = {
  enabled: boolean;
  commissionPercent: number;
  excludedText: string;
  friendDiscount: number;
  minTripValue: number;
  friendDiscountMinText: string;
  groupMinGuests: number;
  groupRuleText: string;
  cookieDays: number;
  minPayout: number;
  payoutTerms: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  introTitle: string;
  introText: string;
  stepsTitle: string;
  steps: TitleText[];
  calculatorTitle: string;
  calculatorText: string;
  whoTitle: string;
  whoFor: TitleText[];
  impactTitle: string;
  impactQuote: { quote: string; name: string; role: string; imageUrl: string } | null;
  impactPoints: TitleText[];
  formTitle: string;
  formIntro: string;
  closedText: string;
  faqTitle: string;
  faqs: Faq[];
  terms: PortableTextBlock[];
  stripTitle: string;
  stripText: string;
  stripButtonLabel: string;
  stripImageUrl: string;
  seoTitle: string;
  seoDescription: string;
};

export const FALLBACK_HERO_IMAGE = "/images/Serengeti-2-cheetahs-sitting-on-mound-1-scaled.jpg";
export const FALLBACK_STRIP_IMAGE = "/images/hero.webp";

const block = (key: string, text: string): PortableTextBlock =>
  ({
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
  }) as unknown as PortableTextBlock;

export const DEFAULT_TERMS: PortableTextBlock[] = [
  block("t1", "Commission is {commission}% of the safari package price paid by the client you refer. It does not include {excluded}, taxes or third-party fees."),
  block("t2", "A referral counts when a new client enquires within {days} days of clicking your link, or gives your referral code when they enquire."),
  block("t3", "Commission is earned when the client pays their deposit and becomes payable 30 days after they return home. No commission is due on any amount that is cancelled or refunded."),
  block("t4", "We pay monthly once at least US${minPayout} is owed to you."),
  block("t5", "Your friend's US${discount} discount applies once per new client, on a first booking of US${minTrip} or more, and cannot be combined with other offers."),
  block("t6", "Group hosts: when you host {groupMin} or more paying guests, your own place is covered instead of commission on that trip."),
  block("t7", "Please don't bid on the Fair Trade Safaris name in paid search, make claims we haven't agreed, or send spam. We may update or end the programme or an ambassadorship at any time; commission you have already earned will still be paid."),
];

export const DEFAULTS: AmbassadorSettings = {
  enabled: true,
  commissionPercent: 5,
  excludedText: "international flights, park fees and visas",
  friendDiscount: 250,
  minTripValue: 5000,
  friendDiscountMinText: "Applies to their first safari of US${minTrip} or more",
  groupMinGuests: 8,
  groupRuleText:
    "Host a group of {groupMin} or more paying guests and your own place on the safari is covered, instead of commission on that trip.",
  cookieDays: 90,
  minPayout: 50,
  payoutTerms:
    "Commission is earned when your referral pays their deposit, and paid 30 days after they return home. We pay monthly once at least US${minPayout} is owed.",
  heroEyebrow: "The Fair Trade Safaris Ambassador Programme",
  heroTitle: "Become a Fair Trade Safaris Ambassador",
  heroSubtitle:
    "Share the Africa you love. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.",
  heroImageUrl: FALLBACK_HERO_IMAGE,
  heroImageAlt: "Two cheetahs resting on a termite mound in the Serengeti",
  introTitle: "Your stories brought you here. Now they can bring others.",
  introText:
    "Our safari affiliate program is built for people, not platforms. Past guests, travel creators and community leaders recommend the safaris they believe in, and we look after every detail of the custom journey. You earn {commission}% of the safari package, your friend gets US${discount} off, and every trip supports local guides and communities.",
  stepsTitle: "How it works",
  steps: [
    { title: "Apply in two minutes", text: "Tell us a little about you and the people you'd share with. We read every application personally and reply within a few working days." },
    { title: "Share your link", text: "You get a personal code and link. Anyone who enquires within {days} days of clicking is linked to you, and your friends get US${discount} off." },
    { title: "Earn {commission}%", text: "When your referral books, you earn {commission}% of their safari package. We pay you after they're home with their stories." },
  ],
  calculatorTitle: "See what you could earn",
  calculatorText:
    "Slide to a typical custom safari and how many friends might book in a year. Commission is on the safari package, not {excluded}.",
  whoTitle: "Who it's for",
  whoFor: [
    { title: "Past guests", text: "You've been on safari with us and your friends keep asking about it." },
    { title: "Travel creators", text: "Bloggers, photographers and storytellers with an audience that loves meaningful travel." },
    { title: "Group leaders", text: "Clubs, churches, alumni and community groups who'd love to travel together." },
    { title: "Wildlife lovers", text: "Conservation and photography people who want their trips to do some good." },
  ],
  impactTitle: "Every safari you share does some good",
  impactQuote: null,
  impactPoints: [
    { title: "Locally guided", text: "Your referrals travel with local guides and partners who know the land best." },
    { title: "Fair by design", text: "Fair pay and fair partnerships are built into every safari we plan." },
    { title: "Community first", text: "Each journey supports the communities and wildlife that make Africa extraordinary." },
  ],
  formTitle: "Apply to become an ambassador",
  formIntro:
    "No big following needed, just a genuine love for Africa. We'll be in touch within a few working days with your personal code and link.",
  closedText: "Applications are paused for now. Leave us a note on the contact page and we'll let you know when they reopen.",
  faqTitle: "Questions, answered",
  faqs: [
    { question: "Who can become an ambassador?", answer: "Anyone who loves Africa and travel that does good: past guests, travel creators, group leaders and wildlife lovers. You don't need a big following." },
    { question: "How much can I earn?", answer: "{commission}% of the safari package your referral books, not including {excluded}. On a US${exampleTrip} safari that's US${exampleEarn}." },
    { question: "What does my friend get?", answer: "US${discount} off their first safari of US${minTrip} or more when they book through your link or code." },
    { question: "How long does my link last?", answer: "{days} days from the moment someone clicks it. Your friend can also give your code when they enquire, by form, phone or WhatsApp." },
    { question: "When do I get paid?", answer: "Commission is earned when your referral pays their deposit, and paid 30 days after they return home. We pay monthly once at least US${minPayout} is owed." },
    { question: "What if I bring a whole group?", answer: "Host {groupMin} or more paying guests and your own place on the safari is covered, instead of commission on that trip." },
    { question: "Does it cost anything to join?", answer: "No. It's free to join and there's nothing to buy." },
  ],
  terms: DEFAULT_TERMS,
  stripTitle: "Love Africa as much as we do?",
  stripText:
    "Join our Ambassador Programme. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.",
  stripButtonLabel: "Become an Ambassador",
  stripImageUrl: FALLBACK_STRIP_IMAGE,
  seoTitle: "Safari Affiliate & Ambassador Program – Earn {commission}% | Fair Trade Safaris",
  seoDescription:
    "Join our safari affiliate and ambassador programme. Earn {commission}% on every safari you refer, and your friends get ${discount} off.",
};

// ── helpers ────────────────────────────────────────────────────────────
const str = (v: unknown, d: string) => (typeof v === "string" && v.trim() ? v.trim() : d);
const num = (v: unknown, d: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : d;
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);

function list<T>(v: unknown, clean: (x: Record<string, unknown>) => T | null, d: T[]): T[] {
  if (!Array.isArray(v)) return d;
  const out = v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map(clean)
    .filter((x): x is T => x !== null);
  return out.length ? out : d;
}
const cleanTT = (x: Record<string, unknown>): TitleText | null => {
  const title = str(x.title, "");
  const text = str(x.text, "");
  return title ? { title, text } : null;
};
const cleanFaq = (x: Record<string, unknown>): Faq | null => {
  const question = str(x.question, "");
  const answer = str(x.answer, "");
  return question && answer ? { question, answer } : null;
};

export const money = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "0";

/** Fill {tokens} in a string from the numbers. */
export function makeFill(s: AmbassadorSettings) {
  const exampleTrip = 10000;
  const tokens: Record<string, string> = {
    commission: String(s.commissionPercent),
    discount: money(s.friendDiscount),
    minTrip: money(s.minTripValue),
    minPayout: money(s.minPayout),
    groupMin: String(s.groupMinGuests),
    days: String(s.cookieDays),
    excluded: s.excludedText,
    exampleTrip: money(exampleTrip),
    exampleEarn: money((exampleTrip * s.commissionPercent) / 100),
  };
  return (text: string) => text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
}

const QUERY = `*[_type == "ambassadorSettings" && _id == "ambassadorSettings"][0]{
  ...,
  "heroImageUrl": heroImage.asset->url,
  "heroImageAlt": heroImage.alt,
  "stripImageUrl": stripImage.asset->url,
  "impactQuoteImageUrl": impactQuote.image.asset->url
}`;

export async function getAmbassadorSettings(): Promise<AmbassadorSettings> {
  let raw: Record<string, unknown> | null = null;
  try {
    raw = await client.fetch(QUERY, {}, { next: { revalidate: 300 } });
  } catch (err) {
    console.error("[ambassadorSettings] fetch failed, using defaults", err);
  }
  return mergeSettings(raw);
}

export function mergeSettings(raw: Record<string, unknown> | null): AmbassadorSettings {
  const r = raw ?? {};
  const D = DEFAULTS;
  const q = (r.impactQuote ?? null) as Record<string, unknown> | null;
  const quoteText = q ? str(q.quote, "") : "";
  const terms =
    Array.isArray(r.terms) && r.terms.some((b) => b && (b as { _type?: string })._type === "block")
      ? (r.terms as PortableTextBlock[])
      : D.terms;

  return {
    enabled: bool(r.enabled, D.enabled),
    commissionPercent: num(r.commissionPercent, D.commissionPercent, 0, 50),
    excludedText: str(r.excludedText, D.excludedText),
    friendDiscount: num(r.friendDiscount, D.friendDiscount),
    minTripValue: num(r.minTripValue, D.minTripValue),
    friendDiscountMinText: str(r.friendDiscountMinText, D.friendDiscountMinText),
    groupMinGuests: Math.round(num(r.groupMinGuests, D.groupMinGuests, 1, 500)),
    groupRuleText: str(r.groupRuleText, D.groupRuleText),
    cookieDays: Math.round(num(r.cookieDays, D.cookieDays, 1, 365)),
    minPayout: num(r.minPayout, D.minPayout),
    payoutTerms: str(r.payoutTerms, D.payoutTerms),
    heroEyebrow: str(r.heroEyebrow, D.heroEyebrow),
    heroTitle: str(r.heroTitle, D.heroTitle),
    heroSubtitle: str(r.heroSubtitle, D.heroSubtitle),
    heroImageUrl: str(r.heroImageUrl, D.heroImageUrl),
    heroImageAlt: str(r.heroImageAlt, r.heroImageUrl ? "Safari landscape" : D.heroImageAlt),
    introTitle: str(r.introTitle, D.introTitle),
    introText: str(r.introText, D.introText),
    stepsTitle: str(r.stepsTitle, D.stepsTitle),
    steps: list(r.steps, cleanTT, D.steps),
    calculatorTitle: str(r.calculatorTitle, D.calculatorTitle),
    calculatorText: str(r.calculatorText, D.calculatorText),
    whoTitle: str(r.whoTitle, D.whoTitle),
    whoFor: list(r.whoFor, cleanTT, D.whoFor),
    impactTitle: str(r.impactTitle, D.impactTitle),
    impactQuote: q && quoteText
      ? { quote: quoteText, name: str(q.name, ""), role: str(q.role, ""), imageUrl: str(r.impactQuoteImageUrl, "") }
      : null,
    impactPoints: list(r.impactPoints, cleanTT, D.impactPoints),
    formTitle: str(r.formTitle, D.formTitle),
    formIntro: str(r.formIntro, D.formIntro),
    closedText: str(r.closedText, D.closedText),
    faqTitle: str(r.faqTitle, D.faqTitle),
    faqs: list(r.faqs, cleanFaq, D.faqs),
    terms,
    stripTitle: str(r.stripTitle, D.stripTitle),
    stripText: str(r.stripText, D.stripText),
    stripButtonLabel: str(r.stripButtonLabel, D.stripButtonLabel),
    stripImageUrl: str(r.stripImageUrl, D.stripImageUrl),
    seoTitle: str(r.seoTitle, D.seoTitle),
    seoDescription: str(r.seoDescription, D.seoDescription),
  };
}
