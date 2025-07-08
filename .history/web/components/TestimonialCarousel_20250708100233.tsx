"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";

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
      <div className="relative bg-white rounded-[20px] shadow-md text-center px-4 pt-14 pb-12 min-w-[260px] max-w-xs mx-3 flex flex-col overflow-visible transition hover:shadow-lg hover:scale-105 duration-300 cursor-pointer">
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
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white bg-white shadow-inner flex items-center justify-center overflow-hidden z-10">
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
    <section className="bg-white pt-24 pb-16 px-4 font-sans relative overflow-visible">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-16">
          {settings?.heading || "Client Feedback"}{" "}
          <span className="text-[#b49a7f]">& Testimonials</span>
        </h2>

        <div className="relative flex items-center justify-center overflow-visible">
          <div className="relative w-full max-w-7xl mx-auto flex items-center justify-center px-0 overflow-visible">
            {/* Left Arrow */}
            <button
              onClick={prev}
              aria-label="Previous testimonials"
              className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 z-10 bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Cards */}
            <div className="overflow-visible w-full" ref={containerRef}>
              <div className="flex transition-transform duration-500">
                {cardsToShow.map((t, i) => (
                  <Card key={i} t={t} />
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={next}
              aria-label="Next testimonials"
              className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 z-10 bg-[#b49a7f] text-white p-2 rounded-full shadow-md hover:scale-105 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
