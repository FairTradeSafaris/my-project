"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../lib/sanityImage";
import type { Block, SanityImage } from "../types/block";
import { useState } from "react";
import Modal from "react-modal"; // ensure installed via: npm install react-modal

export default function BlogContent({ blocks }: { blocks: Block[] }) {
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null); // ✅ Correct placement

  return (
    <div className="space-y-0 font-sans text-lg text-gray-800 leading-relaxed">
      {blocks?.map((block, index) => {
        switch (block._type) {
          case "heroImage": {
            const imageUrl =
              block.image?.asset?.url || urlFor(block.image).url();
            return (
              <section
                key={index}
                className="relative text-center max-w-7xl mx-auto mb-6"
              >
                {block.image && (
                  <Image
                    src={imageUrl}
                    alt={block.text || "Hero Image"}
                    width={1600}
                    height={320}
                    className="w-full h-[320px] object-cover rounded"
                  />
                )}
                {block.text && (
                  <div
                    className={`absolute inset-0 flex items-center justify-${block.alignment || "center"} px-4`}
                  >
                    <h2 className="text-5xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
                      {block.text}
                    </h2>
                  </div>
                )}
              </section>
            );
          }

          case "textImage": {
            const imageUrl =
              block.image?.asset?.url ??
              (block.image ? urlFor(block.image).url() : null);
            return (
              <section
                key={index}
                className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row ${
                  block.align === "right" ? "md:flex-row-reverse" : ""
                } items-stretch gap-8 py-8`}
              >
                {imageUrl && (
                  <div className="w-full md:w-1/3 overflow-hidden rounded">
                    <Image
                      src={imageUrl}
                      alt={block.image?.alt || "Image"}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="w-full md:w-2/3 flex items-center">
                  <div className="prose max-w-none text-justify">
                    <PortableText value={block.text} />
                  </div>
                </div>
              </section>
            );
          }

          case "textBlock":
            return (
              <section key={index} className="max-w-7xl mx-auto px-6 pt-0">
                <div className="prose max-w-none text-justify">
                  <PortableText value={block.body} />
                </div>
              </section>
            );

          case "quoteBlock":
            return (
              <blockquote
                key={index}
                className="text-xl font-semibold italic text-center text-gray-700"
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
                {/* Optional caption below the preview */}
                {block.caption && (
                  <p className="text-center text-m text-gray-600 mt-3 italic">
                    {block.caption}
                  </p>
                )}
                {/* Video preview with overlay play button */}
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
                    <button className="text-white text-6xl opacity-80 group-hover:opacity-100">
                      ▶
                    </button>
                  </div>
                </div>

                {/* Modal full-size video */}
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
            const background = block.backgroundColor?.hex || "#f97316"; // default: orange-500
            const buttonTextColor = block.buttonColor?.hex || "#f97316"; // default: orange-600
            const buttonBg = block.buttonBackground?.hex || "#ffffff"; // default: white

            return (
              <div
                key={index}
                className="p-6 rounded text-center space-y-2"
                style={{ backgroundColor: background, color: "#ffffff" }}
              >
                <h3 className="text-xl font-bold">{block.headline}</h3>
                <p>{block.subtext}</p>
                {block.buttonText && block.link && (
                  <a
                    href={block.link}
                    className="inline-block px-4 py-2 rounded font-semibold"
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
              <div key={index} className="w-full h-[400px]">
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
              <div key={index} className="w-full">
                <iframe
                  src={block.iframeUrl}
                  height={block.height || 600}
                  className="w-full border-none"
                />
              </div>
            );

          case "galleryBlock":
            return (
              <section key={index} className="max-w-7xl mx-auto px-6 my-12">
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

          case "smartCarousel":
            return (
              <section key={index} className="max-w-7xl mx-auto px-6 my-12">
                <div className="relative w-full overflow-hidden rounded">
                  <div className="flex gap-4 snap-x overflow-x-auto scroll-smooth pb-4">
                    {block.slides?.map((slide, i) => {
                      const imageUrl = slide.image?.asset?.url
                        ? slide.image.asset.url
                        : slide.image?.asset?._ref
                          ? urlFor(slide.image).width(1200).height(600).url()
                          : null;

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
