"use client";

import Image from "@/components/SanityImage";
import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import { urlFor } from "@/lib/sanityImage";
import { sanitySized, sanitySrcSet } from "@/lib/sanityImageLoader";
import LineArt from "@/components/LineArt";
import type { Block } from "@/types/block";
import {
  homeBody,
  homeButton,
  homeButtonOutline,
  homeCard,
  homeContainer,
  homeH2,
  homeH3,
} from "@/components/home/homeStyles";

// Batch 22: core (pillar) pages use the same calm style as the homepage
// (batch 20): 1440 container, the same heading / 16px body sizes, cream and
// white surfaces, clean cards. Display only: every Sanity block, field, word
// and image is rendered as before, in the same order with the same tags.
function Container({ children }: { children: ReactNode }) {
  return <div className={homeContainer}>{children}</div>;
}
const CREAM = "bg-[#f7f3ec]";
// v2 (homepage "Featured Connection" look): content sits in white cards on
// cream; Sanity "neutral" sections flip to white with soft cream cards so
// the page alternates.
const surface = (neutral: boolean) =>
  neutral
    ? { section: "bg-white", card: "rounded-2xl border border-[#ebe1d3] bg-[#fbf8f3] shadow-[0_1px_2px_rgba(36,23,15,0.03),0_14px_32px_-24px_rgba(36,23,15,0.25)]" }
    : { section: CREAM, card: homeCard };
const ART = ["savanna", "elephant-acacia", "giraffes", "antelope", "lions-acacia", "wildebeest"] as const;

type Span = { _type?: string; text?: string; marks?: string[] };
type PT = PTBlock & { children?: Span[]; markDefs?: { _key: string; _type: string }[] };

/** A closing paragraph that is only a link starting with "→" (e.g. "→ Read
 *  the full story…") is shown as the card's outlined button. Same text/link. */
function isArrowLink(b?: PT): boolean {
  if (!b || b._type !== "block" || (b.style && b.style !== "normal") || b.listItem) return false;
  const kids = (b.children ?? []).filter((c) => (c.text ?? "").trim() !== "");
  if (kids.length !== 1) return false;
  const linkKeys = new Set((b.markDefs ?? []).filter((m) => m._type === "link").map((m) => m._key));
  return (kids[0].text ?? "").trim().startsWith("→") && (kids[0].marks ?? []).some((m) => linkKeys.has(m));
}

type PTBlock = { _type?: string; style?: string; listItem?: string };

/**
 * A text block with several h3 sub-sections (e.g. destinations or numbered
 * steps) is shown as an intro + a grid of white cards, one per h3. Same blocks
 * in the same order; only the layout differs. A closing paragraph after the
 * last sub-section (longer than the others) stays outside the cards.
 */
function splitIntoCards(body: unknown): {
  intro: PTBlock[];
  groups: PTBlock[][];
  outro: PTBlock[];
} | null {
  if (!Array.isArray(body)) return null;
  const blocks = body as PTBlock[];
  const h3 = blocks.filter((b) => b?._type === "block" && b.style === "h3").length;
  if (h3 < 3) return null;
  const intro: PTBlock[] = [];
  const groups: PTBlock[][] = [];
  for (const b of blocks) {
    if (b?._type === "block" && b.style === "h3") groups.push([b]);
    else if (groups.length) groups[groups.length - 1].push(b);
    else intro.push(b);
  }
  // no h2/h3 nesting inside a card (keeps the heading outline as it is)
  if (groups.some((g) => g.slice(1).some((b) => b.style === "h2"))) return null;
  const outro: PTBlock[] = [];
  const last = groups[groups.length - 1];
  const others = groups.slice(0, -1).map((g) => g.length);
  if (last.length > 2 && last.length > Math.max(...others)) {
    outro.push(last.pop() as PTBlock);
  }
  return { intro, groups, outro };
}

type ImageLike =
  | {
      url?: string;
      alt?: string;
      caption?: string;
      credit?: string;
      asset?: { url?: string; _ref?: string };
    }
  | null
  | undefined;

type PortableProps = { children?: ReactNode };

const getUrl = (img: ImageLike): string | null => {
  if (!img) return null;
  if (img.url) return img.url;
  if (img.asset?.url) return img.asset.url;
  if (img.asset?._ref) return urlFor({ asset: { _ref: img.asset._ref } }).url();
  return null;
};

const portableComponents: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }: PortableProps) => (
      <h2 className={`${homeH2} mb-5`}>{children}</h2>
    ),
    h3: ({ children }: PortableProps) => (
      <h3 className={`${homeH3} mb-3 mt-8 first:mt-0`}>{children}</h3>
    ),
    normal: ({ children }: PortableProps) => (
      <p className={`${homeBody} mb-4 last:mb-0 empty:hidden`}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: PortableProps) => (
      <ul className={`${homeBody} mb-4 list-disc space-y-1.5 pl-5 marker:text-[#c9974f]`}>{children}</ul>
    ),
    number: ({ children }: PortableProps) => (
      <ol className={`${homeBody} mb-4 list-decimal space-y-1.5 pl-5 marker:text-[#a35c2d]`}>{children}</ol>
    ),
  },

  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        // #9a4f22 passes WCAG AA (4.5:1+) on white and on the #f7f3ec cream
        className="font-medium text-[#9a4f22] underline decoration-[#c9974f] decoration-1 underline-offset-4 transition-colors hover:text-[#24170f]"
      >
        {children}
      </a>
    ),
  },
};

const buttonComponents: Partial<PortableTextReactComponents> = {
  block: { normal: ({ children }: PortableProps) => <div>{children}</div> },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href ?? "#"} target="_blank" rel="noopener noreferrer" className={homeButtonOutline}>
        {children}
      </a>
    ),
  },
};

/** Section heading (h2) on the left, the rest on the right, inside a card. */
function SplitProse({ body, art }: { body: PT[]; art: number }) {
  const first = body[0];
  const hasHead = first?._type === "block" && first.style === "h2";
  if (!hasHead) {
    return (
      <div className="max-w-[880px]">
        <PortableText value={body as never} components={portableComponents} />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-12">
      <div>
        <PortableText value={[first] as never} components={portableComponents} />
        <LineArt name={ART[art % ART.length]} className="mt-2 hidden w-32 text-[#c9974f]/70 md:block" />
      </div>
      <div className="max-w-[760px]">
        <PortableText value={body.slice(1) as never} components={portableComponents} />
      </div>
    </div>
  );
}

export default function PillarContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col text-[#24170f]">
      {blocks?.map((block, index) => {
        // v2: a textBlock that continues the textImage before it (Sanity
        // padding "top" then "bottom") is shown inside that same card.
        const prevB = index > 0 ? blocks[index - 1] : undefined;
        if (
          block._type === "textBlock" &&
          prevB?._type === "textImage" &&
          prevB.padding === ("top" as string) &&
          block.padding === ("bottom" as string) &&
          (prevB.backgroundStyle === "neutral") === (block.backgroundStyle === "neutral")
        ) {
          return null;
        }
        switch (block._type) {
          /* HERO */
          case "zohoForm": {
            if (!block.iframeUrl) return null;

            return (
              <section
                key={index}
                className={`bg-white ${
                  index === 0 ? "pt-12 pb-6" : "pt-6 pb-12"
                }`}
              >
                <Container>
                  <div className={`${homeCard} mx-auto w-full max-w-5xl overflow-hidden p-2 sm:p-4`}>
                    <iframe
                      src={block.iframeUrl}
                      width="100%"
                      height={block.height || 600}
                      frameBorder="0"
                      className="w-full"
                    />
                  </div>
                </Container>
              </section>
            );
          }
          case "heroBlock": {
            const src = getUrl(block.image);

            return (
              <section key={index} className="relative w-full h-[60vh] min-h-[420px]">
                {src && (
                  <Image
                    src={src}
                    alt={block.image?.alt ?? "Safari"}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a100a]/80 via-[#1a100a]/45 to-[#1a100a]/20 flex items-center justify-center text-center px-6">
                  <div className="flex flex-col items-center text-center gap-6">
                    <h2 className="text-white text-[32px] md:text-[48px] font-semibold leading-tight max-w-4xl">
                      {block.text}
                    </h2>

                    {block.heroCTA?.text && block.heroCTA?.link && (
                      <a
                        href={block.heroCTA.link}
                        className="inline-flex h-12 items-center rounded-xl bg-[#fbf6ef] px-6 text-[15px] font-semibold text-[#24170f] transition hover:bg-white"
                      >
                        {block.heroCTA.text}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            );
          }
          case "ctaCardGrid": {
            return (
              <section key={index} className="bg-white py-8 md:py-12">
                <Container>
                  {(block.title || block.intro) && (
                    <div className="max-w-3xl mb-8">
                      {block.title && (
                        <h2 className={`${homeH2} mb-4`}>
                          {block.title}
                        </h2>
                      )}
                      {block.intro && (
                        <p className={homeBody}>{block.intro}</p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {block.cards?.map((card, i) => {
                      const src = getUrl(card.image);

                      const href = card.internalLink?.slug?.current
                        ? `/${card.internalLink.slug.current}`
                        : card.externalUrl || "#";

                      return (
                        <div
                          key={i}
                          className={`${homeCard} flex flex-col overflow-hidden ${
                            block.cards?.length === 1 ? "lg:col-span-2" : ""
                          }`}
                        >
                          {src && (
                            <div className="w-full">
                              <img
                                src={sanitySized(src, 1200)}
                                srcSet={sanitySrcSet(src, [480, 768, 1080, 1440])}
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                alt={card.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-[240px] object-cover"
                              />
                            </div>
                          )}

                          <div className="flex flex-1 flex-col p-6">
                          {card.eyebrow && (
                            <span className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#a35c2d]">
                              {card.eyebrow}
                            </span>
                          )}

                          <h3 className={`${homeH3} mb-2`}>
                            {card.title}
                          </h3>

                          {card.description && (
                            <p className={`${homeBody} mb-5`}>
                              {card.description}
                            </p>
                          )}

                          {card.ctaLabel && (
                            <a
                              href={href}
                              className={`${homeButton} mt-auto self-start`}
                            >
                              {card.ctaLabel}
                            </a>
                          )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Container>
              </section>
            );
          }

          /* TEXT + IMAGE */

          case "textImage": {
            const src = getUrl(block.image);
            const isRight = block.align === "right";
            const sf = surface(block.backgroundStyle === "neutral");
            const nextB = blocks[index + 1];
            const cont =
              nextB?._type === "textBlock" &&
              block.padding === ("top" as string) &&
              nextB.padding === ("bottom" as string) &&
              (nextB.backgroundStyle === "neutral") === (block.backgroundStyle === "neutral")
                ? ((nextB.body ?? []) as PT[])
                : [];
            const all = [...((block.text ?? []) as PT[]), ...cont];
            const button = isArrowLink(all[all.length - 1]) ? all[all.length - 1] : undefined;
            const textBlocks = button ? all.slice(0, -1) : all;
            const tall = all.length > 4;

            return (
              <section key={index} className={`py-6 md:py-8 ${sf.section}`}>
                <Container>
                  <div className={`${sf.card} grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-12 md:gap-10 md:p-9`}>
                    {/* IMAGE */}
                    {src && (
                      <div className={`md:col-span-5 ${isRight ? "order-2" : ""} ${tall ? "md:sticky md:top-28 md:self-start" : "md:self-center"}`}>
                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#f2e7db]">
                          <Image
                            src={src}
                            alt={block.image?.alt ?? ""}
                            fill
                            sizes="(min-width: 1440px) 560px, (min-width: 768px) 40vw, 100vw"
                            className="object-cover"
                          />
                        </div>

                        {(block.image?.caption || block.image?.credit) && (
                          <div className="text-[14px] leading-6 text-[#6f5c4d] mt-3">
                            {block.image?.caption}
                            {block.image?.credit && (
                              <span className="block">
                                {block.image.credit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TEXT */}
                    <div className={`min-w-0 ${src ? "md:col-span-7" : "md:col-span-12"} ${isRight ? "order-1" : ""} self-center`}>
                      <div className="max-w-[760px]">
                        <PortableText
                          value={textBlocks as never}
                          components={portableComponents}
                        />
                      </div>
                      {button && (
                        <div className="mt-6 border-t border-[#efe5d6] pt-6">
                          <PortableText value={[button] as never} components={buttonComponents} />
                        </div>
                      )}
                    </div>
                  </div>
                </Container>
              </section>
            );
          }

          /* TEXT */
          case "textBlock": {
            const sf = surface(block.backgroundStyle === "neutral");
            const cards = splitIntoCards(block.body);

            return (
              <section key={index} className={`py-8 md:py-12 ${sf.section}`}>
                <Container>
                  {cards ? (
                    <>
                      {cards.intro.length > 0 && (
                        <div className="mb-7 max-w-[880px]">
                          <PortableText
                            value={cards.intro as never}
                            components={portableComponents}
                          />
                        </div>
                      )}
                      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {cards.groups.map((g, gi) => (
                          <div key={gi} className={`${sf.card} p-6 md:p-7`}>
                            <PortableText
                              value={g as never}
                              components={portableComponents}
                            />
                          </div>
                        ))}
                      </div>
                      {cards.outro.length > 0 && (
                        <div className="mt-7 max-w-[880px]">
                          <PortableText
                            value={cards.outro as never}
                            components={portableComponents}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={`${sf.card} p-6 sm:p-8 md:p-10`}>
                      <SplitProse body={(block.body ?? []) as PT[]} art={index} />
                    </div>
                  )}
                </Container>
              </section>
            );
          }

          /* GALLERY */

          case "galleryBlock": {
            return (
              <section
                key={index}
                className={`bg-white ${
                  index === 0 ? "pt-12 pb-6" : "pt-6 pb-12"
                }`}
              >
                <Container>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {block.images?.map((img, i) => {
                      const src = getUrl(img);
                      if (!src) return null;

                      return (
                        <Image
                          key={i}
                          src={src}
                          alt={img.alt ?? ""}
                          width={500}
                          height={400}
                          className="rounded-2xl w-full h-auto"
                        />
                      );
                    })}
                  </div>
                </Container>
              </section>
            );
          }

          /* CTA */

          case "ctaBlock": {
            return (
              <section
                key={index}
                className="relative overflow-hidden py-12 md:py-16 text-center"
                style={{
                  backgroundColor: block.backgroundColor?.hex ?? "#000",
                }}
              >
                <LineArt
                  name="savanna"
                  className="pointer-events-none absolute bottom-0 left-1/2 w-[1200px] max-w-none -translate-x-1/2 text-white/[0.07]"
                />
                <div className="relative">
                <Container>
                  <div className="mx-auto max-w-3xl">
                  <h3 className="text-[26px] md:text-[34px] font-semibold leading-tight tracking-[-0.01em] text-white mb-3">
                    {block.headline}
                  </h3>

                  <p className="text-[16px] md:text-[17px] leading-7 text-white/85 mb-7">{block.subtext}</p>

                  {block.buttonText && block.link && (
                    <a
                      href={block.link}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#fbf6ef] px-7 text-[15px] font-semibold text-[#24170f] transition-colors hover:bg-white"
                    >
                      {block.buttonText}
                      <span aria-hidden>&rarr;</span>
                    </a>
                  )}
                  </div>
                </Container>
                </div>
              </section>
            );
          }
          /* JOURNEY STEPS */

          case "journeySteps": {
            return (
              <section key={index} className={`py-12 md:py-16 ${CREAM}`}>
                <Container>
                  {block.headline && (
                    <h2 className={`${homeH2} mb-4`}>
                      {block.headline}
                    </h2>
                  )}

                  {block.intro && (
                    <p className={`${homeBody} max-w-3xl mb-8`}>
                      {block.intro}
                    </p>
                  )}

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {block.steps?.map((step, i) => (
                      <div key={i} className={`${homeCard} flex gap-5 p-6`}>
                        <div className="text-[28px] font-semibold leading-none text-[#c9974f]">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div>
                          <h3 className={`${homeH3} mb-2`}>
                            {step.title}
                          </h3>

                          <p className={homeBody}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            );
          }
          case "videoEmbed": {
            if (!block.url) return null;

            return (
              <section
                key={index}
                className={`bg-white ${
                  index === 0 ? "pt-12 pb-6" : "pt-6 pb-12"
                }`}
              >
                <Container>
                  <div className="w-full max-w-4xl mx-auto">
                    {block.caption && (
                      <h3 className={`${homeH3} text-center mb-5`}>
                        {block.caption}
                      </h3>
                    )}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#24170f]">
                      <iframe
                        src={block.url}
                        title="Video"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </Container>
              </section>
            );
          }
          case "safariBuilderBlock": {
            return (
              <section key={index} className={`py-12 md:py-16 ${CREAM} text-center`}>
                <Container>
                  <LineArt name="elephant-acacia" className="mx-auto mb-5 w-28 text-[#a35c2d]/70" />
                  {block.headline && (
                    <h2 className={`${homeH2} mb-4`}>
                      {block.headline}
                    </h2>
                  )}

                  {block.subtext && (
                    <p className={`${homeBody} max-w-2xl mx-auto mb-7`}>
                      {block.subtext}
                    </p>
                  )}

                  <button
                    onClick={() => {
                      const event = new CustomEvent("openSafariBuilder", {
                        detail: {
                          mode: block.mode || "crm",
                        },
                      });
                      window.dispatchEvent(event);
                    }}
                    className={homeButton}
                  >
                    {block.buttonText || "Start My Safari"}
                  </button>
                </Container>
              </section>
            );
          }
          case "bestTimeBlock": {
            const section = block.section;
            if (!section) return null;

            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            const formatRange = (start: number, end: number) => {
              const startName = monthNames[start - 1];
              const endName = monthNames[end - 1];
              return `${startName} – ${endName}`;
            };

            return (
              <section key={index} className={`py-10 md:py-14 ${CREAM}`}>
                {/* HEADER */}
                <Container>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-10 items-end mb-7">
                    <div>
                      <h2 className={homeH2}>
                        {section.title}
                      </h2>
                    </div>

                    <div className="max-w-xl">
                      {section.intro && (
                        <p className={homeBody}>
                          {section.intro}
                        </p>
                      )}
                    </div>
                  </div>
                </Container>

                {/* FULL WIDTH IMAGE */}
                <Container>
                <div className="mb-6 w-full">
                  {/* Batch 4: was a plain 2.4 MB PNG, preloaded in <head>.
                      Now lazy and resized by next/image (local file). */}
                  <div className="relative w-full h-[180px] md:h-[260px] overflow-hidden rounded-2xl">
                    <Image
                      src="/images/best-time.png"
                      alt="Luxury African safari landscape"
                      fill
                      sizes="100vw"
                      // q60 keeps every variant under 100 KB (q75 = 116 KB)
                      quality={60}
                      className="object-cover"
                    />
                  </div>
                </div>
                </Container>

                {/* REGIONS */}
                <Container>
                  <div className="grid md:grid-cols-2 gap-5">
                    {section.regions?.map((regionBlock, i) => (
                      <div key={i} className={`${homeCard} p-6 md:p-7`}>
                        {/* REGION TITLE */}
                        <h3 className={`${homeH3} mb-4`}>
                          {regionBlock.region?.title}
                        </h3>

                        {/* PERIODS */}
                        <div className="divide-y divide-[#efe5d6]">
                          {regionBlock.periods
                            ?.sort(
                              (a, b) => (a.priority ?? 99) - (b.priority ?? 99),
                            )
                            .map((p, j) => (
                              <div key={j} className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:gap-5">
                                {/* MONTH */}
                                <div className="shrink-0 text-[15px] font-semibold leading-7 text-[#a35c2d] sm:w-[170px]">
                                  {formatRange(p.startMonth, p.endMonth)}
                                </div>

                                {/* TEXT */}
                                <div className="text-[16px] leading-7 text-[#24170f]">
                                  <span
                                    className={`${p.highlight ? "font-semibold" : "font-medium"}`}
                                  >
                                    {p.label}
                                  </span>
                                  {p.description && (
                                    <div className="text-[15px] leading-6 text-[#5c4a3d] mt-0.5">
                                      {p.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NOTE */}
                  {section.note && (
                    <div className="mt-6 max-w-3xl">
                      <p className="text-[15px] leading-7 text-[#5c4a3d]">
                        {section.note}
                      </p>
                    </div>
                  )}
                </Container>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
