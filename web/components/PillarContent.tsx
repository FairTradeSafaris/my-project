"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import { urlFor } from "@/lib/sanityImage";
import Container from "@/components/layout/Container";
import type { Block } from "@/types/block";

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
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">{children}</h2>
    ),
    h3: ({ children }: PortableProps) => (
      <h3 className="text-2xl font-semibold mb-3">{children}</h3>
    ),
    normal: ({ children }: PortableProps) => (
      <p className="text-lg leading-relaxed mb-5 text-gray-700">{children}</p>
    ),
  },

  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-700 underline hover:text-amber-900"
      >
        {children}
      </a>
    ),
  },
};

export default function PillarContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col">
      {blocks?.map((block, index) => {
        switch (block._type) {
          /* HERO */
          case "zohoForm": {
            if (!block.iframeUrl) return null;

            return (
              <section
                key={index}
                className={`bg-white ${
                  index === 0 ? "pt-16 pb-8" : "pt-8 pb-16"
                }`}
              >
                <Container>
                  <div className="w-full max-w-7xl mx-auto">
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
              <section key={index} className="relative w-full h-[70vh]">
                {src && (
                  <Image
                    src={src}
                    alt={block.image?.alt ?? "Safari"}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-6">
                  <div className="flex flex-col items-center text-center gap-6">
                    <h2 className="text-white text-4xl md:text-6xl font-semibold max-w-4xl">
                      {block.text}
                    </h2>

                    {block.heroCTA?.text && block.heroCTA?.link && (
                      <a
                        href={block.heroCTA.link}
                        className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
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
              <section key={index} className="bg-white py-6">
                <Container>
                  {(block.title || block.intro) && (
                    <div className="max-w-2xl mb-10">
                      {block.title && (
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                          {block.title}
                        </h2>
                      )}
                      {block.intro && (
                        <p className="text-gray-600 text-lg">{block.intro}</p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {block.cards?.map((card, i) => {
                      console.log(card.image);
                      const src = getUrl(card.image);

                      const href = card.internalLink?.slug?.current
                        ? `/${card.internalLink.slug.current}`
                        : card.externalUrl || "#";

                      return (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            block.cards?.length === 1 ? "lg:col-span-2" : ""
                          }`}
                        >
                          {src && (
                            <div className="w-full mb-4">
                              <img
                                src={src}
                                alt={card.title}
                                className="rounded-lg w-full h-[240px] object-cover"
                              />
                            </div>
                          )}

                          {card.eyebrow && (
                            <span className="text-sm text-gray-500 mb-1">
                              {card.eyebrow}
                            </span>
                          )}

                          <h3 className="text-xl font-semibold mb-2">
                            {card.title}
                          </h3>

                          {card.description && (
                            <p className="text-gray-600 mb-4">
                              {card.description}
                            </p>
                          )}

                          {card.ctaLabel && (
                            <a
                              href={href}
                              className="mt-auto inline-block bg-black text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                            >
                              {card.ctaLabel}
                            </a>
                          )}
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

            const bg =
              block.backgroundStyle === "neutral" ? "bg-[#f5f1ea]" : "bg-white";

            const paddingMap = {
              default: "py-8",
              top: "pt-8 pb-0",
              bottom: "pt-0 pb-8",
              none: "",
            };

            const padding = paddingMap[block.padding ?? "default"];

            return (
              <section key={index} className={`${padding} ${bg}`}>
                <Container>
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* IMAGE */}
                    {src && (
                      <div className={`${isRight ? "order-2" : ""}`}>
                        <div className="relative w-full h-[420px] md:h-[480px] lg:h-[520px] overflow-hidden rounded-xl">
                          <Image
                            src={src}
                            alt={block.image?.alt ?? ""}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {(block.image?.caption || block.image?.credit) && (
                          <div className="text-sm text-gray-500 mt-3">
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
                    <div className={`max-w-xl ${isRight ? "order-1" : ""}`}>
                      <PortableText
                        value={block.text}
                        components={portableComponents}
                      />
                    </div>
                  </div>
                </Container>
              </section>
            );
          }

          /* TEXT */
          case "textBlock": {
            const bg =
              block.backgroundStyle === "neutral" ? "bg-[#f5f1ea]" : "bg-white";

            const paddingMap = {
              default: "pt-12 pb-12",
              top: "pt-12 pb-0",
              bottom: "pt-0 pb-12",
              none: "",
            };

            const padding = paddingMap[block.padding ?? "default"];

            return (
              <section key={index} className={`${padding} ${bg}`}>
                <Container>
                  <PortableText
                    value={block.body}
                    components={portableComponents}
                  />
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
                  index === 0 ? "pt-16 pb-8" : "pt-8 pb-16"
                }`}
              >
                <Container>
                  <div className="grid md:grid-cols-3 gap-6">
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
                          className="rounded-lg w-full h-auto"
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
                className="py-20 text-center"
                style={{
                  backgroundColor: block.backgroundColor?.hex ?? "#000",
                }}
              >
                <Container>
                  <h3 className="text-3xl font-semibold text-white mb-4">
                    {block.headline}
                  </h3>

                  <p className="text-white/80 mb-6">{block.subtext}</p>

                  {block.buttonText && block.link && (
                    <a
                      href={block.link}
                      className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold"
                    >
                      {block.buttonText}
                    </a>
                  )}
                </Container>
              </section>
            );
          }
          /* JOURNEY STEPS */

          case "journeySteps": {
            return (
              <section key={index} className="py-24 bg-[#f5f1ea]">
                <Container>
                  {block.headline && (
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                      {block.headline}
                    </h2>
                  )}

                  {block.intro && (
                    <p className="text-lg text-gray-700 max-w-2xl mb-16">
                      {block.intro}
                    </p>
                  )}

                  <div className="space-y-16">
                    {block.steps?.map((step, i) => (
                      <div key={i} className="flex gap-8">
                        <div className="text-5xl font-light text-gray-300">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {step.title}
                          </h3>

                          <p className="text-gray-700 leading-relaxed max-w-xl">
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
                  index === 0 ? "pt-16 pb-8" : "pt-8 pb-16"
                }`}
              >
                <Container>
                  <div className="w-full max-w-3xl mx-auto">
                    {block.caption && (
                      <h3 className="text-2xl font-semibold text-center mb-6">
                        {block.caption}
                      </h3>
                    )}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
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
              <section key={index} className="py-24 bg-[#f5f1ea] text-center">
                <Container>
                  {block.headline && (
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
                      {block.headline}
                    </h2>
                  )}

                  {block.subtext && (
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
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
                    className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
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
              <section key={index} className="py-16 bg-[#fcfbf8]">
                {/* HEADER */}
                <Container>
                  <div className="grid md:grid-cols-2 gap-10 items-start mb-12">
                    <div>
                      <h2 className="text-3xl md:text-[36px] font-medium tracking-tight leading-[1.2]">
                        {section.title}
                      </h2>
                    </div>

                    <div className="max-w-md">
                      {section.intro && (
                        <p className="text-base text-gray-600 leading-relaxed">
                          {section.intro}
                        </p>
                      )}
                    </div>
                  </div>
                </Container>

                {/* FULL WIDTH IMAGE */}
                <div className="my-8 w-full">
                  <div className="w-full h-[220px] md:h-[260px] overflow-hidden">
                    <img
                      src="/images/best-time.png"
                      alt="Luxury African safari landscape"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* REGIONS */}
                <Container>
                  <div className="grid md:grid-cols-2 gap-10">
                    {section.regions?.map((regionBlock, i) => (
                      <div key={i} className="border-t border-neutral-200 pt-6">
                        {/* REGION TITLE */}
                        <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight">
                          {regionBlock.region?.title}
                        </h3>

                        {/* PERIODS */}
                        <div className="space-y-4">
                          {regionBlock.periods
                            ?.sort(
                              (a, b) => (a.priority ?? 99) - (b.priority ?? 99),
                            )
                            .map((p, j) => (
                              <div key={j} className="flex items-start gap-3">
                                {/* MONTH */}
                                <div className="min-w-[110px] text-Xs font-semibold text-black">
                                  {formatRange(p.startMonth, p.endMonth)}
                                </div>

                                {/* TEXT */}
                                <div className="text-s text-gray-600 leading-relaxed">
                                  <span
                                    className={`${p.highlight ? "text-black font-medium" : ""}`}
                                  >
                                    {p.label}
                                  </span>
                                  {p.description && (
                                    <div className="text-gray-500 mt-0.5">
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
                    <div className="mt-12 border-t border-neutral-200 pt-6 max-w-xl">
                      <p className="text-sm text-gray-600 leading-relaxed">
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
