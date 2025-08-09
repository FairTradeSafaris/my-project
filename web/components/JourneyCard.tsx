"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  summary?: string;
  imageUrl?: string;
  alt?: string;
  price?: string;
  duration?: string;
  region?: string;
  country?: string;
  starIcon?: string;
  star?: number;
  metaIcons?: React.ReactNode;
  isFeatured: boolean;
};

export default function JourneyCard({
  title,
  summary,
  imageUrl,
  alt,
  price,
  duration,
  region,
  starIcon,
  star = 0,
  isFeatured,
}: Props) {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // ---- Price helpers --------------------------------------------------------
  const isPriceOnRequest = (val?: string) => {
    if (!val) return true;
    const clean = val.trim().toLowerCase();
    return clean === "price on request" || clean === "price on demand";
  };

  const buildPriceBadge = (val?: string) => {
    if (isPriceOnRequest(val)) return "Price on request";
    // keep numbers and commas/dots, but allow if it's already prefixed with $
    const hasDollar = val?.trim().startsWith("$");
    const numeric = (val || "").replace(/[^\d.,]/g, "");
    // if we lost everything, fall back to "Price on request"
    if (!numeric) return "Price on request";
    const amount = hasDollar ? `$${numeric.replace(/^\$/, "")}` : `$${numeric}`;
    return `From ${amount} p/p sharing`;
  };

  const priceBadge = buildPriceBadge(price);

  // ---- Render ---------------------------------------------------------------
  return (
    <div className="w-full max-w-sm bg-transparent">
      {/* Image with price tag */}
      <div className="relative rounded-t-lg overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || "Journey image"}
            width={400}
            height={256}
            className="w-full h-64 object-cover"
          />
        )}

        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-[#d2b48c] text-black text-sm font-bold px-4 py-1 rounded shadow-md z-10">
          {priceBadge}
        </div>
      </div>

      {/* Card Body */}
      <div className="-mt-10 bg-white border border-gray-100 rounded-xl shadow-lg p-5 mx-2 relative z-10 flex flex-col min-h-[250px]">
        {(duration || region) && (
          <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-1">
            {duration}
            {region && ` • ${region}`}
          </p>
        )}

        <h3 className="text-base font-bold text-gray-800 mb-1 leading-snug">
          {title}
        </h3>

        {summary && (
          <div className="mb-3">
            <p
              className={`text-sm text-gray-600 transition-all duration-200 ease-in-out ${
                showFullSummary ? "" : "line-clamp-3"
              }`}
            >
              {summary}
            </p>
            {summary.length > 120 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullSummary((prev) => !prev);
                }}
                className="mt-1 inline-block text-xs text-[#a35c2d] font-semibold underline cursor-pointer"
              >
                {showFullSummary ? "Show Less" : "Read More →"}
              </span>
            )}
          </div>
        )}

        {star > 0 && (
          <div className="relative group flex flex-col mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                Luxury Level:
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setShowMobileTooltip((prev) => !prev)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                    aria-label="Info about luxury levels"
                  >
                    ℹ️
                  </button>
                )}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(star)].map((_, i) => (
                  <img
                    key={i}
                    src={starIcon || "/default-star.svg"}
                    alt="Luxury Star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
            </div>

            {!isMobile && (
              <div className="absolute left-0 top-6 w-60 bg-white border border-gray-200 shadow-md rounded-md text-xs text-gray-700 p-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <p className="mb-1">
                  <strong>4 stars</strong>: Premium amenities and experiences
                </p>
                <p>
                  <strong>5 stars</strong>: Ultimate luxury and exclusivity
                </p>
              </div>
            )}

            {isMobile && showMobileTooltip && (
              <div className="absolute left-0 top-6 w-60 bg-white border border-gray-200 shadow-md rounded-md text-xs text-gray-700 p-3 z-50">
                <p className="mb-1">
                  <strong>4 stars</strong>: Premium amenities and experiences
                </p>
                <p>
                  <strong>5 stars</strong>: Ultimate luxury and exclusivity
                </p>
              </div>
            )}
          </div>
        )}

        {isFeatured && (
          <div className="inline-block bg-[#d2b48c] text-black text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm mb-2">
            ★ Featured Journey
          </div>
        )}

        {/* Start Planning -> open booking modal */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent parent card click
            setBookingOpen(true);
          }}
          className="mt-auto text-center bg-black text-white text-sm font-semibold py-2 rounded-md shadow-md hover:bg-neutral-800 transition-colors"
        >
          Start Planning →
        </button>
      </div>

      {/* Booking Modal (Zoho portal-embed) */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
              <div className="flex items-center gap-3">
                <img
                  src="/logos/logo-top.png"
                  alt="Fair Trade Safaris"
                  className="h-8 w-auto"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Start Planning
                </span>
              </div>
              <button
                onClick={() => setBookingOpen(false)}
                className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Iframe */}
            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-[calc(100%-56px)]"
              style={{ border: "none" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
