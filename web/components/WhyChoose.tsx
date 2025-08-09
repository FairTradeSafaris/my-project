"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[];
  sideImage?: { asset: { url: string }; alt?: string };
  reasons: {
    icon?: { asset: { url: string }; alt?: string };
    title: string;
    description: string;
  }[];
};

type WhyChooseProps = { data: WhyChooseBlock };

export default function WhyChoose({ data }: WhyChooseProps) {
  const { sectionTitle, sideImage, reasons } = data;

  return (
    <section
      className="
        relative py-12
        bg-[var(--background)] text-[var(--foreground)]
        transition-colors duration-300
      "
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {/* Left Image */}
        {sideImage?.asset?.url && (
          <div className="w-full h-full">
            <img
              src={sideImage.asset.url}
              alt={sideImage.alt || "Why Travel Visual"}
              className="w-full h-full object-cover shadow-lg rounded-xl"
            />
          </div>
        )}

        {/* Right Content */}
        <div className="space-y-10 pt-2 min-h-[400px]">
          <PortableText
            value={sectionTitle}
            components={{
              block: {
                normal: ({ children }) => (
                  <h2 className="text-4xl font-bold leading-tight font-poppins">
                    {children}
                  </h2>
                ),
                center: ({ children }) => (
                  <h2 className="text-4xl font-bold leading-tight text-center font-poppins">
                    {children}
                  </h2>
                ),
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-extrabold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
              },
            }}
          />

          {reasons.map((item, index) => (
            <div key={index} className="flex items-start gap-5">
              {item.icon?.asset?.url && (
                <div
                  className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center
                                bg-[color:rgba(var(--background-rgb),0.35)]"
                >
                  <img
                    src={item.icon.asset.url}
                    alt={item.icon.alt || item.title || "Icon"}
                    className="h-14 w-14 object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="leading-relaxed text-justify opacity-90">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
