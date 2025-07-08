// components/BlogContent.tsx
"use client";

import React from "react";
import { PortableText } from "@portabletext/react";

export const BlogContent = ({ content }: { content: any }) => {
  const components = {
    types: {
      heroImage: ({ value }: any) => (
        <div
          className="w-full h-96 bg-cover bg-center mb-6"
          style={{ backgroundImage: `url(${value.image.asset?.url})` }}
        >
          {value.text && (
            <div
              className={`h-full w-full flex items-center justify-$
                {value.alignment || "center"}`}
            >
              <h2 className="text-white text-4xl font-bold bg-black/50 px-6 py-4 rounded">
                {value.text}
              </h2>
            </div>
          )}
        </div>
      ),
      textImage: ({ value }: any) => (
        <div
          className={`flex flex-col md:flex-row gap-6 py-6 ${value.align === "right" ? "md:flex-row-reverse" : ""}`}
        >
          <img
            src={value.image?.asset?.url}
            alt=""
            className="w-full md:w-1/2 object-cover rounded-lg"
          />
          <div className="md:w-1/2 text-gray-800 text-lg whitespace-pre-line">
            {value.text}
          </div>
        </div>
      ),
      quoteBlock: ({ value }: any) => (
        <blockquote className="text-2xl italic font-light text-center my-8 text-gray-700">
          “{value.quote}”
          {value.attribution && (
            <footer className="mt-2 text-sm">— {value.attribution}</footer>
          )}
        </blockquote>
      ),
      galleryBlock: ({ value }: any) => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
          {value.images.map((img: any, idx: number) => (
            <img
              key={idx}
              src={img.asset?.url}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      ),
      videoEmbed: ({ value }: any) => (
        <div className="aspect-w-16 aspect-h-9 my-6">
          <iframe
            src={value.url}
            title="Video"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      ),
      textBlock: ({ value }: any) => (
        <div className="prose max-w-none py-4">
          <PortableText value={value.body} />
        </div>
      ),
      ctaBlock: ({ value }: any) => (
        <div className="bg-orange-100 p-6 rounded-xl text-center my-8">
          <h3 className="text-xl font-semibold mb-2">{value.headline}</h3>
          <p className="mb-4">{value.subtext}</p>
          {value.buttonText && value.link && (
            <a
              href={value.link}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600"
            >
              {value.buttonText}
            </a>
          )}
        </div>
      ),
      mapBlock: ({ value }: any) => (
        <div className="my-6">
          <iframe
            src={value.mapUrl}
            title="Map"
            className="w-full h-80 rounded-lg border"
          ></iframe>
        </div>
      ),
      table: ({ value }: any) => (
        <div className="overflow-auto my-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>
              {value.rows.map((row: any, i: number) => (
                <tr key={i} className="border-b">
                  {row.cells.map((cell: string, j: number) => (
                    <td
                      key={j}
                      className="border px-4 py-2 text-sm text-gray-800"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
      zohoForm: ({ value }: any) => (
        <div className="my-10">
          <iframe
            src={value.iframeUrl}
            style={{ width: "100%", height: value.height || 600 }}
            frameBorder="0"
            title="Zoho Form"
          ></iframe>
        </div>
      ),
      smartCarousel: ({ value }: any) => (
        <div className="my-10 overflow-x-auto whitespace-nowrap flex gap-4">
          {value.slides.map((slide: any, i: number) => (
            <div
              key={i}
              className="inline-block w-[80%] md:w-[40%] rounded shadow-md bg-white"
            >
              <img
                src={slide.image?.asset?.url}
                alt=""
                className="w-full h-56 object-cover rounded-t"
              />
              <div className="p-4">
                {slide.caption && (
                  <p className="text-sm text-gray-700 mb-2">{slide.caption}</p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <a
                    href={slide.buttonLink}
                    className="text-sm bg-orange-500 text-white px-4 py-2 rounded-full inline-block hover:bg-orange-600"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  };

  return <PortableText value={content} components={components} />;
};

export default BlogContent;
