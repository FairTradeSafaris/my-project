// app/affiliate-program/page.tsx (batch 12)
// Fair Trade Safaris Ambassador Programme - join page.
// Everything editable lives in Sanity > Ambassador Settings; every value has a
// fallback in lib/ambassadorSettings.ts so nothing renders blank.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { CameraIcon, GlobeAltIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { getAmbassadorSettings, makeFill, money } from "@/lib/ambassadorSettings";
import EarningsCalculator from "./EarningsCalculator";
import AmbassadorSignupForm from "./AmbassadorSignupForm";
import StickyApply from "./StickyApply";
import Reveal from "./Reveal";
import LineArt from "@/components/LineArt";
import styles from "./affiliate.module.css";
import FtsVideoSection from "@/components/video/FtsVideoSection"; // batch 25

export const revalidate = 300;

const SITE = "https://www.fairtradesafaris.com";
const PATH = "/affiliate-program/";
const abs = (u: string) => (u.startsWith("http") ? u : `${SITE}${u}`);

export async function generateMetadata(): Promise<Metadata> {
  const s = await getAmbassadorSettings();
  const fill = makeFill(s);
  const title = fill(s.seoTitle);
  const description = fill(s.seoDescription);
  const image = abs(s.heroImageUrl);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE}${PATH}` },
    openGraph: {
      title,
      description,
      url: `${SITE}${PATH}`,
      siteName: "Fair Trade Safaris",
      type: "website",
      images: [{ url: image, alt: s.heroImageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const AUDIENCE_ICONS = [HeartIcon, CameraIcon, UserGroupIcon, GlobeAltIcon];

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.24em]";

// Batch 15: one container, one vertical rhythm and one 12-column grid for
// every section, so all left edges and second columns line up.
const wrap = "mx-auto w-full max-w-7xl px-6 lg:px-10";
const pad = "py-24 sm:py-32";
const grid = "grid gap-y-10 lg:grid-cols-12 lg:gap-x-12";

export default async function AffiliateProgramPage() {
  const s = await getAmbassadorSettings();
  const fill = makeFill(s);

  // Fill {tokens} inside the portable-text terms
  const terms = s.terms.map((b) => {
    const blk = b as PortableTextBlock & { children?: { text?: string }[] };
    if (!Array.isArray(blk.children)) return b;
    return { ...blk, children: blk.children.map((c) => (typeof c.text === "string" ? { ...c, text: fill(c.text) } : c)) };
  }) as PortableTextBlock[];

  const facts = [
    { k: `${s.commissionPercent}%`, v: "commission on every safari" },
    { k: `US$${money(s.friendDiscount)}`, v: "off for your friends" },
    { k: `${s.cookieDays} days`, v: "your link is remembered" },
    { k: `${s.groupMinGuests}+ guests`, v: "and your own place is covered" },
  ];

  const rules = [
    { t: "Commission", d: `${s.commissionPercent}% of the safari package your referral books. Not included: ${s.excludedText}.` },
    { t: "Your friend's welcome", d: `US$${money(s.friendDiscount)} off. ${fill(s.friendDiscountMinText).replace(/\.+$/, "")}.` },
    { t: "Groups", d: fill(s.groupRuleText) },
    { t: "Getting paid", d: fill(s.payoutTerms) },
    { t: "Your link", d: `Remembered for ${s.cookieDays} days. Friends can also give your code by form, phone or WhatsApp.` },
    { t: "Minimum payout", d: `US$${money(s.minPayout)}. Anything less rolls over to the next month.` },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: fill(f.question),
      acceptedAnswer: { "@type": "Answer", text: fill(f.answer) },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Ambassadors", item: `${SITE}/ambassadors/` },
      { "@type": "ListItem", position: 3, name: "Ambassador Programme", item: `${SITE}${PATH}` },
    ],
  };

  return (
    <main className="bg-[#fbf6ef] text-[#24170f]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[max(640px,92svh)] items-end overflow-hidden bg-[#24170f] text-[#fbf6ef]">
        <div className="absolute inset-0 -z-10">
          <Image
            src={s.heroImageUrl}
            alt={s.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${styles.heroImg}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a100a] via-[#1a100a]/55 to-[#1a100a]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a100a]/70 via-transparent to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-32 sm:pb-16 sm:pt-36 lg:px-10">
          <nav aria-label="Breadcrumb" className={`${styles.rise} mb-8 text-xs text-[#e9dccb]`}>
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/ambassadors/" className="hover:text-white">Ambassadors</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white">Ambassador Programme</li>
            </ol>
          </nav>

          <p className={`${eyebrow} ${styles.rise} text-[#e2c39c]`}>{fill(s.heroEyebrow)}</p>
          <h1 className={`${styles.rise2} mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl`}>
            {fill(s.heroTitle)}
          </h1>
          <p className={`${styles.rise3} mt-6 max-w-2xl text-lg leading-relaxed text-[#efe4d6] sm:text-xl`}>
            {fill(s.heroSubtitle)}
          </p>
          <div className={`${styles.rise4} mt-9 flex flex-wrap items-center gap-3`}>
            <a
              href="#apply"
              className="group inline-flex items-center gap-2 rounded-full bg-[#fbf6ef] px-7 py-3.5 text-sm font-semibold text-[#24170f] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e2c39c]/60"
            >
              {s.enabled ? "Apply to join" : "Register interest"}
              <span aria-hidden className="transition group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="#earnings"
              className="inline-flex items-center gap-2 rounded-full border border-[#fbf6ef]/40 px-7 py-3.5 text-sm font-semibold text-[#fbf6ef] transition hover:border-[#fbf6ef] hover:bg-white/10"
            >
              See what you could earn
            </a>
          </div>

          <dl className={`${styles.rise4} mt-14 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/15 bg-[#1a100a]/55 md:grid-cols-4`}>
            {facts.map((f, i) => (
              <div
                key={f.v}
                className={`px-5 py-5 sm:px-7 ${i % 2 === 1 ? "border-l border-white/15" : ""} ${i >= 2 ? "border-t border-white/15 md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <dt className="text-2xl font-bold text-white sm:text-3xl">{f.k}</dt>
                <dd className="mt-1 text-xs leading-snug text-[#e9dccb] sm:text-sm">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────── */}
      <section className={`${wrap} ${pad}`}>
        <div className={grid}>
          <Reveal className="lg:col-span-4">
            <p className={`${eyebrow} text-[#8a5a33]`}>Why become an ambassador</p>
            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.introTitle)}</h2>
          </Reveal>
          <Reveal className="lg:col-span-8 lg:pt-9" delay={120}>
            <p className="max-w-[40rem] text-lg leading-[1.8] text-[#4a3527] lg:text-xl lg:leading-[1.75]">{fill(s.introText)}</p>
          </Reveal>
          {/* the rhino gets its own row: lots of air above, sitting on the
              right edge of the grid as a quiet sign-off (left-aligned on phones) */}
          <Reveal className="lg:col-span-8 lg:col-start-5" delay={200}>
            <div className="max-w-[40rem]">
              <LineArt name="rhino" className="mt-6 w-56 text-[#b8916a] sm:w-64 lg:ml-auto lg:mt-10 lg:w-[300px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      {/* batch 25: short film */}
      <FtsVideoSection pageUrl="https://www.fairtradesafaris.com/affiliate-program/" eyebrow="See who you'd be recommending" />

      <section className="bg-[#f3e9dd]" aria-labelledby="how-title">
        <div className={`${wrap} ${pad}`}>
          <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className={`${eyebrow} text-[#8a5a33]`}>Simple by design</p>
              <h2 id="how-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.stepsTitle)}</h2>
            </div>
            <a href="#apply" className="text-sm font-semibold text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-[6px] hover:text-[#24170f]">
              Start your application
            </a>
          </Reveal>
          <ol className={`mt-14 grid gap-6 ${s.steps.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {s.steps.map((st, i) => (
              <Reveal as="li" key={`${st.title}-${i}`} delay={i * 110} className="group relative">
                <div className="relative h-full overflow-hidden rounded-[28px] bg-[#fbf6ef] p-8 ring-1 ring-[#e6d8c8] transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:shadow-[0_30px_60px_-30px_rgba(60,42,30,0.45)] sm:p-10">
                  <span aria-hidden className="absolute left-8 top-0 h-[3px] w-12 bg-[#a47148] transition-all duration-500 group-hover:left-0 group-hover:w-full sm:left-10" />
                  <span className="text-5xl font-extrabold leading-none text-[#d8bf9f]" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 text-xl font-semibold text-[#24170f]">{fill(st.title)}</h3>
                  {st.text && <p className="mt-3 leading-relaxed text-[#4a3527]">{fill(st.text)}</p>}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ──────────────────────────────── */}
      <section id="earnings" className={`relative scroll-mt-24 bg-[#24170f] text-[#fbf6ef] ${styles.grain}`} aria-labelledby="earn-title">
        <div className={`${wrap} ${pad}`}>
          <Reveal className="max-w-2xl">
            <p className={`${eyebrow} text-[#e2c39c]`}>Earnings calculator</p>
            <h2 id="earn-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.calculatorTitle)}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#e9dccb]">{fill(s.calculatorText)}</p>
          </Reveal>
          <Reveal className="mt-14" delay={120}>
            <EarningsCalculator
              commissionPercent={s.commissionPercent}
              friendDiscount={s.friendDiscount}
              minTripValue={s.minTripValue}
              groupMinGuests={s.groupMinGuests}
              excludedText={s.excludedText}
            />
          </Reveal>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────── */}
      <section className={`${wrap} ${pad}`} aria-labelledby="who-title">
        <Reveal className="max-w-2xl">
          <p className={`${eyebrow} text-[#8a5a33]`}>Made for storytellers</p>
          <h2 id="who-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.whoTitle)}</h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-[#e6d8c8] ring-1 ring-[#e6d8c8] sm:grid-cols-2 lg:grid-cols-4">
          {s.whoFor.map((w, i) => {
            const Icon = AUDIENCE_ICONS[i % AUDIENCE_ICONS.length];
            return (
              <Reveal key={`${w.title}-${i}`} delay={i * 90} className="group bg-[#fbf6ef] p-8 transition-colors duration-500 hover:bg-[#f3e9dd] sm:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f3e9dd] text-[#5d4037] ring-1 ring-[#e6d8c8] transition duration-500 group-hover:bg-[#5d4037] group-hover:text-[#fbf6ef]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-7 text-xl font-semibold text-[#24170f]">{fill(w.title)}</h3>
                {w.text && <p className="mt-2 text-[15px] leading-relaxed text-[#4a3527]">{fill(w.text)}</p>}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── IMPACT BAND ──────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden text-[#fbf6ef]" aria-labelledby="impact-title">
        <Image src={s.stripImageUrl} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-[#1a100a]/75" />
        <div className={`${wrap} ${pad}`}>
          {s.impactQuote ? (
            <Reveal as="article" className="mx-auto max-w-4xl text-center">
              <h2 id="impact-title" className="sr-only">{fill(s.impactTitle)}</h2>
              <span aria-hidden className="text-7xl font-extrabold leading-none text-[#e2c39c]">&ldquo;</span>
              <blockquote className="mt-2 text-2xl font-medium leading-snug sm:text-3xl">{s.impactQuote.quote}</blockquote>
              {(s.impactQuote.name || s.impactQuote.role) && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  {s.impactQuote.imageUrl && (
                    <Image src={s.impactQuote.imageUrl} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-[#e2c39c]/60" />
                  )}
                  <p className="text-left text-sm">
                    {s.impactQuote.name && <span className="block font-semibold">{s.impactQuote.name}</span>}
                    {s.impactQuote.role && <span className="block text-[#e9dccb]">{s.impactQuote.role}</span>}
                  </p>
                </div>
              )}
            </Reveal>
          ) : (
            <>
              <Reveal className="max-w-3xl">
                <p className={`${eyebrow} text-[#e2c39c]`}>Travel that gives back</p>
                <h2 id="impact-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.impactTitle)}</h2>
              </Reveal>
              <div className="mt-14 grid gap-10 border-t border-white/20 pt-10 md:grid-cols-3">
                {s.impactPoints.map((p, i) => (
                  <Reveal key={`${p.title}-${i}`} delay={i * 110}>
                    <h3 className="text-xl font-semibold">{fill(p.title)}</h3>
                    {p.text && <p className="mt-3 leading-relaxed text-[#e9dccb]">{fill(p.text)}</p>}
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── THE DETAILS ──────────────────────────────────────── */}
      <section className={`${wrap} ${pad}`} aria-labelledby="rules-title">
        <div className={grid}>
          <Reveal className="lg:col-span-4">
            <p className={`${eyebrow} text-[#8a5a33]`}>The details</p>
            <h2 id="rules-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">The fine print, in plain words</h2>
            <p className="mt-5 leading-relaxed text-[#4a3527]">
              No platforms, no logins on other sites. Everything is tracked by our own team, so phone and WhatsApp referrals count too.
            </p>
          </Reveal>
          <dl className="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
            {rules.map((r, i) => (
              <Reveal key={r.t} delay={(i % 2) * 90} className="border-t border-[#e0d0bd] py-7">
                <dt className="text-xl font-semibold text-[#24170f]">{r.t}</dt>
                <dd className="mt-2 leading-relaxed text-[#4a3527]">{r.d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
        {/* closing illustration, with its own breathing room above */}
        <LineArt name="savanna" className="mt-24 hidden w-full text-[#d3bb9c] sm:block lg:mt-32" />
        <LineArt name="giraffes" className="mx-auto mt-20 w-64 text-[#d3bb9c] sm:hidden" />
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-[#f3e9dd]" aria-labelledby="faq-title">
        <div className={`${wrap} ${pad} ${grid}`}>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className={`${eyebrow} text-[#8a5a33]`}>FAQ</p>
              <h2 id="faq-title" className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{fill(s.faqTitle)}</h2>
              <p className="mt-5 leading-relaxed text-[#4a3527]">
                Still wondering?{" "}
                <Link href="/contact/" className="font-semibold text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-4 hover:text-[#24170f]">
                  Ask our team
                </Link>
                .
              </p>
              <LineArt name="antelope" className="mt-14 hidden w-44 text-[#b8916a] lg:block" />
            </div>
          </div>
          <div className="divide-y divide-[#dccbb8] border-y border-[#dccbb8] lg:col-span-8">
            {s.faqs.map((f, i) => (
              <details key={`${f.question}-${i}`} className={`${styles.faq} group`}>
                <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d4037]/30">
                  <span className="text-lg font-semibold text-[#24170f] transition group-hover:text-[#5d4037]">{fill(f.question)}</span>
                  <span
                    aria-hidden
                    className={`${styles.faqIcon} mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c9a57f] text-lg leading-none text-[#5d4037] transition-transform duration-300`}
                  >
                    +
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl pb-7 leading-relaxed text-[#4a3527]">{fill(f.answer)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY ────────────────────────────────────────────── */}
      <section id="apply" className={`scroll-mt-24 ${wrap} ${pad}`} aria-labelledby="apply-title">
        <div className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_40px_100px_-50px_rgba(60,42,30,0.55)] ring-1 ring-[#e6d8c8] lg:grid-cols-12">
          <div className={`relative isolate flex flex-col bg-[#24170f] p-8 text-[#fbf6ef] sm:p-12 lg:col-span-5 ${styles.grain}`}>
            <p className={`${eyebrow} text-[#e2c39c]`}>Join the programme</p>
            <h2 id="apply-title" className="mt-4 text-3xl font-bold leading-tight">{fill(s.formTitle)}</h2>
            <p className="mt-5 leading-relaxed text-[#e9dccb]">{fill(s.formIntro)}</p>
            <ul className="mt-10 space-y-5 text-[15px]">
              {[
                `${s.commissionPercent}% on every safari you refer`,
                `US$${money(s.friendDiscount)} off for your friends`,
                `Your own place covered when you host ${s.groupMinGuests}+ guests`,
                `Paid monthly, after your friends are home`,
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[#d9b48a]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-12">
              <LineArt name="wildebeest" className="w-full max-w-[340px] text-[#d9b48a]/70" />
            </div>
          </div>
          <div className="p-8 sm:p-12 lg:col-span-7">
            {s.enabled ? (
              <AmbassadorSignupForm />
            ) : (
              <div className="flex min-h-[320px] flex-col justify-center">
                <h3 className="text-2xl font-bold">Applications are paused</h3>
                <p className="mt-3 max-w-md leading-relaxed text-[#4a3527]">{fill(s.closedText)}</p>
                <Link href="/contact/" className="mt-6 inline-flex w-fit rounded-full bg-[#5d4037] px-6 py-3 text-sm font-semibold text-[#fbf6ef] hover:bg-[#3c2a1e]">
                  Contact us
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <details id="terms" className={`${styles.faq} group mx-auto mt-10 max-w-4xl scroll-mt-28 rounded-[24px] bg-[#f3e9dd] px-6 sm:px-10`}>
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
            <span className="text-lg font-semibold">Programme terms</span>
            <span aria-hidden className={`${styles.faqIcon} grid h-8 w-8 place-items-center rounded-full border border-[#c9a57f] text-lg text-[#5d4037] transition-transform duration-300`}>
              +
            </span>
          </summary>
          <div className="pb-8 text-[15px] leading-relaxed text-[#4a3527] [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
            <PortableText value={terms} />
          </div>
        </details>
      </section>

      <StickyApply label={`Earn ${s.commissionPercent}% as an ambassador`} />
    </main>
  );
}
