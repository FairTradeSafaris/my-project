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
    <section className="relative isolate bg-[#e6d8c7] text-black py-14 sm:py-16 md:py-20 overflow-hidden font-sans">
      {/* Dark mode overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-stretch">
        {/* Left Image */}
        {sideImage?.asset?.url && (
          <div className="w-full aspect-[4/5] md:aspect-auto max-h-[360px] md:max-h-none overflow-hidden rounded-xl shadow">
            <img
              src={sideImage.asset.url}
              alt={sideImage.alt || "Why Travel Visual"}
              className="w-full h-full object-cover"
              width={400}
              height={500}
              loading="lazy"
            />
          </div>
        )}

        {/* Right Content */}
        <div className="space-y-6 md:space-y-8 pt-4 min-h-[380px]">
          <PortableText
            value={sectionTitle}
            components={{
              block: {
                normal: ({ children }) => (
                  <h2 className="text-[1.875rem] sm:text-4xl font-bold leading-tight font-poppins text-gray-900">
                    {children}
                  </h2>
                ),
                center: ({ children }) => (
                  <h2 className="text-[1.875rem] sm:text-4xl font-bold leading-tight text-center font-poppins text-gray-900">
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

          {reasons?.map((item, index) => (
            <div key={index} className="flex items-start gap-4 sm:gap-5">
              {item.icon?.asset?.url && (
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#f0eee9] shadow-sm">
                  <img
                    src={item.icon.asset.url}
                    alt={item.icon.alt || item.title || "Icon"}
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-12 md:w-12 object-contain"
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </div>
              )}

              <div className="min-w-0">
                {item.title ? (
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                ) : (
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                )}

                {item.description ? (
                  <p className="text-left leading-7 sm:leading-8 text-[0.985rem] sm:text-base text-gray-800 opacity-90 break-words">
                    {item.description}
                  </p>
                ) : (
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
