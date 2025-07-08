"use client";

import Image from "next/image";
import { urlFor } from "../lib/sanityImage";
import type { Block, SanityImage } from "../types/block";

export default function BlogContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-0">
      {blocks?.map((block, index) => {
        switch (block._type) {
          case "heroImage": {
            const imageUrl =
              block.image?.asset?.url || urlFor(block.image).url();

            return (
              <section
                key={index}
                className="relative text-center max-w-7xl mx-auto mb-6" // added mb-6
              >
                {block.image && (
                  <Image
                    src={imageUrl}
                    alt={block.text || "Hero Image"}
                    width={1600}
                    height={320} // reduced height
                    className="w-full h-[320px] object-cover rounded"
                  />
                )}
                {block.text && (
                  <div
                    className={`absolute inset-0 flex items-center justify-${
                      block.alignment || "center"
                    } px-4`}
                  >
                    <h2 className="text-5xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
                      {block.text}
                    </h2>
                  </div>
                )}
              </section>
            );
          }

          case "textImage":
            const imageUrl =
              block.image?.asset?.url || urlFor(block.image).url();

            return (
              <section
                key={index}
                className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row ${
                  block.align === "right" ? "md:flex-row-reverse" : ""
                } items-start gap-8 py-8`}
              >
                {block.image && (
                  <div className="w-full md:w-auto max-h-[400px] overflow-hidden rounded flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={block.text || "Image"}
                      width={600}
                      height={400}
                      className="w-auto h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow text-lg text-gray-800 leading-relaxed">
                  {block.text}
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

          case "textBlock":
            return (
              <section key={index} className="max-w-7xl mx-auto px-0 pt-0">
                {" "}
                {/* remove top padding */}
                <div className="prose max-w-none text-gray-800">
                  {block.body.map((pt, i) => (
                    <p key={i}>{pt.children.map((c) => c.text).join("")}</p>
                  ))}
                </div>
              </section>
            );

          case "videoEmbed":
            return (
              <div key={index} className="aspect-video w-full">
                <iframe
                  src={block.url}
                  className="w-full h-full rounded"
                  allowFullScreen
                />
              </div>
            );

          case "ctaBlock":
            return (
              <div
                key={index}
                className="bg-orange-500 text-white p-6 rounded text-center space-y-2"
              >
                <h3 className="text-xl font-bold">{block.headline}</h3>
                <p>{block.subtext}</p>
                {block.buttonText && block.link && (
                  <a
                    href={block.link}
                    className="inline-block bg-white text-orange-600 px-4 py-2 rounded font-semibold"
                  >
                    {block.buttonText}
                  </a>
                )}
              </div>
            );

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
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
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
            );

          case "smartCarousel":
            return (
              <div
                key={index}
                className="relative w-full overflow-hidden rounded"
              >
                <div className="flex gap-4 snap-x overflow-x-auto scroll-smooth">
                  {block.slides?.map((slide, i) => {
                    const imageUrl =
                      slide.image?.asset?.url || urlFor(slide.image).url();
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
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
