"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../lib/sanityImage";
import type { Block, SanityImage } from "../types/block";
import { useState } from "react";
import Modal from "react-modal";

import { PortableTextReactComponents } from "@portabletext/react";

const portableComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: { value: SanityImage }) => (
      <Image
        src={urlFor(value).url()}
        alt={value.alt || "Image"}
        width={800}
        height={600}
        className="my-4 rounded"
      />
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-semibold my-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-semibold my-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-sm sm:text-base leading-snug mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-2 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-2 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-0 leading-snug">{children}</li>,
    number: ({ children }) => <li className="mb-0 leading-snug">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-black">{children}</strong>
    ),
  },
};

export default function BlogContent({ blocks }: { blocks: Block[] }) {
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0 font-sans text-base sm:text-lg text-gray-800 leading-relaxed">
      {blocks?.map((block, index) => {
        switch (block._type) {
          case "heroImage": {
            let imageUrl: string = "";

            if (block.image) {
              imageUrl = block.image.asset?.url || urlFor(block.image).url();
            } else if (block.galleryImage?.image) {
              imageUrl =
                block.galleryImage.image.asset?.url ||
                urlFor(block.galleryImage.image).url();
            }

            return (
              <section
                key={index}
                className="relative text-center max-w-7xl mx-auto mb-6"
              >
                {block.image && (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[5/2] max-h-[600px] rounded overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={block.text || "Hero Image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                {block.text && (
                  <div
                    className={`absolute inset-0 flex items-center justify-${block.alignment || "center"} px-4`}
                  >
                    <div className="max-w-sm mx-auto">
                      <h2 className="text-2xl sm:text-4xl font-bold text-white bg-black/60 px-4 py-3 rounded-lg leading-snug">
                        {block.text}
                      </h2>
                    </div>
                  </div>
                )}
              </section>
            );
          }

          case "textImage": {
            const imageUrl =
              block.image?.asset?.url ??
              block.galleryImage?.image?.asset?.url ??
              null;

            const altText =
              block.image?.alt || block.galleryImage?.alt || "Image";

            const imageSize = (block.imageSize || "md") as
              | "sm"
              | "md"
              | "lg"
              | "full";

            const imageSizeClass: Record<"sm" | "md" | "lg" | "full", string> =
              {
                sm: "md:w-1/4",
                md: "md:w-1/3",
                lg: "md:w-1/2",
                full: "md:w-full",
              };

            return (
              <section
                key={index}
                className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row ${
                  block.align === "right" ? "md:flex-row-reverse" : ""
                } gap-8 items-stretch`}
              >
                {imageUrl && (
                  <div className={`w-full ${imageSizeClass[imageSize]}`}>
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover rounded"
                      style={{ height: "100%" }}
                    />
                  </div>
                )}

                <div className="w-full flex items-center">
                  <div className="prose max-w-none text-left sm:text-justify w-full">
                    <PortableText
                      value={block.text}
                      components={portableComponents}
                    />
                  </div>
                </div>
              </section>
            );
          }

          case "textBlock":
            return (
              <section
                key={index}
                className="max-w-7xl mx-auto px-4 sm:px-6 pt-0"
              >
                <div className="prose max-w-none text-left sm:text-justify">
                  <PortableText
                    value={block.body}
                    components={portableComponents}
                  />
                </div>
              </section>
            );

          case "quoteBlock":
            return (
              <blockquote
                key={index}
                className="text-lg sm:text-xl font-medium italic text-center text-gray-700 px-4"
              >
                “{block.quote}”
                {block.attribution && (
                  <footer className="text-sm mt-2 text-gray-500">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );

          case "videoEmbed": {
            const isOpen = openVideoIndex === index;
            return (
              <div key={index} className="max-w-4xl mx-auto my-12 px-4">
                {block.caption && (
                  <p className="text-center text-sm sm:text-base text-gray-600 mt-3 italic">
                    {block.caption}
                  </p>
                )}
                <div
                  className="relative aspect-video rounded-lg overflow-hidden shadow-md group cursor-pointer"
                  onClick={() => setOpenVideoIndex(index)}
                >
                  <iframe
                    src={block.url}
                    className="w-full h-full pointer-events-none"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                    <button className="text-white text-4xl sm:text-6xl opacity-80 group-hover:opacity-100">
                      ▶
                    </button>
                  </div>
                </div>

                <Modal
                  isOpen={isOpen}
                  onRequestClose={() => setOpenVideoIndex(null)}
                  className="w-full max-w-5xl mx-auto my-20 bg-white rounded-lg overflow-hidden relative p-4"
                  overlayClassName="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                  ariaHideApp={false}
                >
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={block.url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setOpenVideoIndex(null)}
                      className="absolute top-3 right-3 bg-white text-black text-xl px-3 py-1 rounded-full shadow"
                    >
                      ✕
                    </button>
                  </div>
                </Modal>
              </div>
            );
          }

          case "ctaBlock": {
            const background = block.backgroundColor?.hex || "#f97316";
            const buttonTextColor = block.buttonColor?.hex || "#f97316";
            const buttonBg = block.buttonBackground?.hex || "#ffffff";

            return (
              <div
                key={index}
                className="p-6 rounded text-center space-y-2"
                style={{ backgroundColor: background, color: "#ffffff" }}
              >
                <h3 className="text-lg sm:text-xl font-bold">
                  {block.headline}
                </h3>
                <p className="text-sm sm:text-base">{block.subtext}</p>
                {block.buttonText && block.link && (
                  <a
                    href={block.link}
                    className="inline-block mt-2 px-4 py-2 w-full sm:w-auto rounded font-semibold text-center"
                    style={{
                      color: buttonTextColor,
                      backgroundColor: buttonBg,
                    }}
                  >
                    {block.buttonText}
                  </a>
                )}
              </div>
            );
          }

          case "mapBlock":
            return (
              <div key={index} className="w-full h-[300px] sm:h-[400px]">
                <iframe
                  src={block.mapUrl}
                  className="w-full h-full rounded"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            );

          case "zohoForm":
            return (
              <div key={index} className="w-full px-4">
                <iframe
                  src={block.iframeUrl}
                  height={block.height || 600}
                  className="w-full border-none"
                />
              </div>
            );

          case "galleryBlock":
            return (
              <section
                key={index}
                className="max-w-7xl mx-auto px-4 sm:px-6 my-12"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {block.images?.map((img: SanityImage, i: number) => (
                    <Image
                      key={i}
                      src={img.asset?.url || urlFor(img).url()}
                      alt={`Gallery Image ${i + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded"
                    />
                  ))}
                </div>
              </section>
            );
          case "table":
            return (
              <div
                key={index}
                className="overflow-x-auto my-8 rounded-lg border border-gray-300"
              >
                <table className="min-w-full table-auto text-sm text-left">
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex === 0
                            ? "bg-gray-100 font-semibold"
                            : "bg-white"
                        }
                      >
                        {row.cells.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border px-4 py-3 align-top"
                          >
                            <PortableText
                              value={
                                typeof cell === "string"
                                  ? [
                                      {
                                        _type: "block",
                                        children: [
                                          { _type: "span", text: cell },
                                        ],
                                      },
                                    ]
                                  : cell
                              }
                              components={{
                                block: {
                                  normal: ({ children }) => (
                                    <p className="text-sm">{children}</p>
                                  ),
                                },
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "smartCarousel":
            return (
              <section
                key={index}
                className="max-w-7xl mx-auto px-4 sm:px-6 my-12"
              >
                <div className="relative w-full overflow-hidden rounded">
                  <div className="flex gap-4 snap-x overflow-x-auto scroll-smooth pb-4">
                    {block.slides?.map((slide, i) => {
                      const imageUrl = slide.image?.asset?.url
                        ? slide.image.asset.url
                        : urlFor(slide.image).width(1200).height(600).url();

                      return (
                        <div
                          key={i}
                          className="flex-shrink-0 w-full sm:w-[80%] snap-center"
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={slide.caption || `Slide ${i + 1}`}
                              width={1200}
                              height={600}
                              className="w-full h-96 object-cover rounded"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center">
                              Image Not Available
                            </div>
                          )}
                          <div className="mt-2 text-center">
                            {slide.caption && <p>{slide.caption}</p>}
                            {slide.buttonText && slide.buttonLink && (
                              <a
                                href={slide.buttonLink}
                                className="inline-block mt-2 bg-black text-white px-4 py-2 rounded"
                              >
                                {slide.buttonText}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
