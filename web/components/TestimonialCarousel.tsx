"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import Link from "next/link";

export default function TestimonialCarousel() {
  const { settings, cardsToShow, next, prev } = useTestimonials();
  const containerRef = useRef<HTMLDivElement>(null);

  const renderStars = (count = 5) =>
    Array.from({ length: count }, (_, i) => (
      <svg
        key={i}
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09L5.5 12.5.622 8.91l6.684-.91L10 2l2.694 6 6.684.91L14.5 12.5l1.378 5.59z" />
      </svg>
    ));

  const Card = ({ t }: { t: Testimonial }) => {
    const content = (
      <div className="relative bg-white rounded-[20px] shadow-md text-center px-4 pt-14 pb-16 min-w-[260px] max-w-xs mx-3 flex flex-col overflow-visible transition hover:shadow-lg hover:scale-105 duration-300 cursor-pointer">
        <div className="absolute top-0 left-0 right-0 bg-[#b49a7f] rounded-t-[20px] py-2 flex flex-col items-center">
          <div className="flex justify-center space-x-1">
            {renderStars(t.rating || 5)}
          </div>
          {t.regionVisited && (
            <span className="text-xs text-white font-semibold mt-1">
              {t.regionVisited}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-col relative">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-5">
            {t.text}
          </p>
          {t.text.length > 200 && (
            <span className="text-xs text-[#b49a7f] font-semibold mt-2">
              Read More
            </span>
          )}
          <p className="mt-2 text-sm italic text-gray-800">{t.name}</p>
        </div>

        {t.sourceLogo?.asset?.url && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white bg-white shadow-inner flex items-center justify-center overflow-hidden z-10">
            <Image
              src={t.sourceLogo.asset.url}
              alt="Review Source"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        )}
      </div>
    );

    return t.sourceLink ? (
      <a
        href={t.sourceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {content}
      </a>
    ) : (
      content
    );
  };

  return (
    <section className="relative isolate bg-white pt-10 pb-6 px-4 font-sans overflow-visible">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block bg-black/22"
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-16">
            {settings?.heading || "Client Feedback"}{" "}
            <span className="text-[#b49a7f]">& Testimonials</span>
          </h2>

          {/* Desktop Layout */}
          <div className="relative hidden sm:flex items-center justify-center overflow-visible">
            <button
              onClick={prev}
              aria-label="Previous testimonials"
              className="absolute top-1/2 -translate-y-1/2 -left-6 z-10 bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              className="overflow-visible w-full px-2 sm:px-0"
              ref={containerRef}
            >
              <div className="flex transition-transform duration-500 justify-center sm:justify-start">
                {cardsToShow.map((t, i) => (
                  <Card key={i} t={t} />
                ))}
              </div>
            </div>

            <button
              onClick={next}
              aria-label="Next testimonials"
              className="absolute top-1/2 -translate-y-1/2 -right-6 z-10 bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="flex sm:hidden flex-col items-center space-y-4 mt-4">
            <div className="overflow-visible w-full px-2" ref={containerRef}>
              <div className="flex transition-transform duration-500 justify-center">
                {cardsToShow.map((t, i) => (
                  <Card key={i} t={t} />
                ))}
              </div>
            </div>

            <div className="flex space-x-6 mt-4">
              <button
                onClick={prev}
                aria-label="Previous testimonials"
                className="bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonials"
                className="bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Testimonials Link */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/videoTestimonials"
            className="text-[#b49a7f] text-base font-semibold underline hover:text-[#a5835e] transition"
          >
            Look at our video testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}
