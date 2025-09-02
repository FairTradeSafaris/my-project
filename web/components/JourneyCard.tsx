"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

type Props = {
  journeyId: string;
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  alt?: string;
  price?: number | string;
  duration?: string;
  region?: string;
  country?: string;
  starIcon?: string;
  star?: number;
  metaIcons?: React.ReactNode;
  isFeatured?: boolean;
  onViewItinerary?: () => void;
  isWishlisted?: boolean; // ✅ from WishlistSection
};

export default function JourneyCard({
  journeyId,
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
  onViewItinerary,
  isWishlisted,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pendingWishlist, setPendingWishlist] = useState(false);

  // ✅ Use toggle only (isWishlisted is now passed in)
  const { toggleWishlist, loading } = useWishlist(journeyId);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const buildPriceBadge = (val?: number | string) => {
    if (val === undefined || val === null || val === "")
      return "Price on request";
    const num =
      typeof val === "string" ? Number(val.replace(/[, ]+/g, "")) : val;
    if (Number.isNaN(num) || num <= 0) return "Price on request";
    return `From ${num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    })} p/p sharing`;
  };

  const priceBadge = buildPriceBadge(price);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    setPendingWishlist(true);
    await toggleWishlist();
    setPendingWishlist(false);

    if (!isMobile) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-sm bg-transparent relative">
      {showToast && !isMobile && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-xs font-medium px-4 py-2 rounded shadow z-[9999]">
          {isWishlisted
            ? "Saved to your wishlist"
            : "Removed from your wishlist"}
        </div>
      )}

      <div
        className="relative rounded-t-lg overflow-hidden cursor-pointer h-64"
        onClick={(e) => {
          e.stopPropagation();
          onViewItinerary?.();
        }}
      >
        <button
          className="absolute top-2 left-2 z-20 bg-white/90 hover:bg-white text-black p-1 rounded-full shadow"
          onClick={handleWishlistToggle}
          disabled={loading}
          aria-label={
            isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"
          }
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              pendingWishlist
                ? "fill-[#a35c2d] text-[#a35c2d]"
                : isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
            }`}
          />
        </button>

        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || "Journey image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        )}

        <div className="absolute top-2 right-2 bg-[#d2b48c] text-black text-sm font-bold px-4 py-1 rounded shadow-md z-10">
          {priceBadge}
        </div>
      </div>

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
                {showFullSummary ? "Show Less" : "Read More"}
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
                  <Image
                    key={i}
                    src={starIcon || "/default-star.svg"}
                    alt="Luxury Star"
                    width={16}
                    height={16}
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

        <div className="mt-auto flex flex-row gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewItinerary?.();
            }}
            className="flex-1 text-center bg-white border border-black text-black text-sm font-semibold py-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
          >
            View Itinerary
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookingOpen(true);
            }}
            className="flex-1 text-center bg-black text-white text-sm font-semibold py-2 rounded-md shadow-md hover:bg-neutral-800 transition-colors"
          >
            Start Planning
          </button>
        </div>
      </div>

      {bookingOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-xl z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
              <div className="flex items-center gap-3">
                <Image
                  src="/logos/logo-top.png"
                  alt="Fair Trade Safaris"
                  width={100}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Start Planning
                </span>
              </div>

              <button
                className="text-black hover:text-red-500 transition-colors"
                onClick={handleWishlistToggle}
                disabled={loading}
                aria-label={
                  isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    pendingWishlist
                      ? "fill-[#a35c2d] text-[#a35c2d]"
                      : isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                  }`}
                />
              </button>

              <button
                onClick={() => setBookingOpen(false)}
                className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

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
