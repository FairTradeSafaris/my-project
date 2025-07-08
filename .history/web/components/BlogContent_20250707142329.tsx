"use client";

import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

type Block =
  | {
      _type: "heroImage";
      image: { asset: SanityImageSource };
      text?: string;
      alignment?: string;
    }
  | {
      _type: "textImage";
      image: { asset: SanityImageSource };
      text: string;
      align?: "left" | "right";
    }
  | {
      _type: "galleryBlock";
      images: { asset: SanityImageSource }[];
    }
  | {
      _type: "smartCarousel";
      slides: {
        image: { asset: SanityImageSource };
        caption?: string;
        buttonText?: string;
        buttonLink?: string;
      }[];
    };

export default function BlogContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-16">
      {blocks?.map((block, index) => {
        switch (block._type) {
          case "heroImage":
            return (
              <section key={index} className="text-center">
                {block.image?.asset?.url && (
                  <Image
                    src={block.image.asset.url}
                    alt={block.text || "Hero"}
                    width={1200}
                    height={600}
                    className="w-full object-cover rounded"
                  />
                )}
                {block.text && (
                  <h2 className={`text-3xl mt-4 text-${block.alignment}`}>
                    {block.text}
                  </h2>
                )}
              </section>
            );

          case "textImage":
            return (
              <section
                key={index}
                className={`flex flex-col md:flex-row ${
                  block.align === "right" ? "md:flex-row-reverse" : ""
                } items-center gap-6`}
              >
                {block.image?.asset?.url && (
                  <Image
                    src={block.image.asset.url}
                    alt={block.text || "Image"}
                    width={600}
                    height={400}
                    className="w-full md:w-1/2 rounded object-cover"
                  />
                )}
                <p className="md:w-1/2 text-lg">{block.text}</p>
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
              <div key={index} className="prose max-w-none">
                {block.body?.map((pt: any, i: number) => (
                  <p key={i}>{pt.children?.map((c: any) => c.text).join("")}</p>
                ))}
              </div>
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
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}
              >
                {block.images?.map((img: any, i: number) => (
                  <Image
                    key={i}
                    src={img.asset?.url}
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
                  {block.slides?.map((slide: any, i: number) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-full sm:w-[80%] snap-center"
                    >
                      <Image
                        src={slide.image?.asset?.url}
                        alt={slide.caption || `Slide ${i + 1}`}
                        width={1200}
                        height={600}
                        className="w-full h-96 object-cover rounded"
                      />
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
                  ))}
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
