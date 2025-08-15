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

  const featuredLogos = [
    { src: "/logos/nbc.svg", alt: "NBC" },
    { src: "/logos/usa-today.svg", alt: "USA Today" },
    { src: "/logos/fox.svg", alt: "FOX" },
    { src: "/logos/CBS_logo.svg", alt: "CBS" },
  ];

  return (
    <section className="relative isolate bg-white text-black py-14 sm:py-16 md:py-20 overflow-hidden font-sans">
      {/* Dark mode overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block bg-black/20"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-stretch">
        {/* Left Image */}
        {sideImage?.asset?.url && (
          <div className="w-full h-full">
            <img
              src={sideImage.asset.url}
              alt={sideImage.alt || "Why Travel Visual"}
              className="w-full h-full object-cover rounded-xl shadow max-h-[360px] md:max-h-none"
            />
          </div>
        )}

        {/* Right Content */}
        <div className="space-y-8 sm:space-y-9 md:space-y-10 pt-1 min-h-[380px]">
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
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="text-left leading-7 sm:leading-8 text-[0.985rem] sm:text-base text-gray-800 opacity-90 break-words">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* As Seen On */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 mt-14 sm:mt-16">
        <div className="py-5 sm:py-6 border-t border-black/10">
          <p className="text-center text-xs tracking-[0.3em] uppercase opacity-70 mb-4">
            As Seen On
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 sm:gap-x-16 gap-y-6 opacity-80">
            {featuredLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-6 sm:h-7 md:h-8 w-auto grayscale opacity-80"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
