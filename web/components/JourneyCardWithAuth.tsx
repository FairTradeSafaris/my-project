"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/useWishlist";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCardWithAuth({
  journeyId,
  slug,
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
  isWishlisted = false,
  className,
}: JourneyCardProps) {
  const { user } = useUser();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pendingWishlist, setPendingWishlist] = useState(false);
  const [localWishlisted, setLocalWishlisted] = useState(isWishlisted);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toggleWishlist, loading } = useWishlist(journeyId);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(consent === "accepted");
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const userId = isClientReady && hasConsent ? (user?.id ?? null) : null;

  const buildPriceBadge = (val?: number | string) => {
    if (!val) return "Price on request";
    const num =
      typeof val === "string" ? Number(val.replace(/[, ]+/g, "")) : val;
    if (Number.isNaN(num) || num <= 0) return "Price on request";
    return `From ${num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    })} p/p sharing`;
  };

  const getHeartColorClass = () => {
    if (pendingWishlist) return "fill-[#a35c2d] text-[#a35c2d]";
    return localWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-700";
  };

  const handleWishlistToggle = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      window.location.href = "/sign-in";
      return;
    }

    setPendingWishlist(true);
    await toggleWishlist();
    setPendingWishlist(false);
    setLocalWishlisted((prev) => !prev);

    if (!isMobile) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const priceBadge = buildPriceBadge(price);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/africansafariitineraries/${slug}/`;

  return (
    <div className={`relative w-full max-w-sm mx-auto ${className || ""}`}>
      {showToast && !isMobile && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-xs font-medium px-4 py-2 rounded shadow z-[9999]">
          {localWishlisted
            ? "Saved to your wishlist"
            : "Removed from your wishlist"}
        </div>
      )}

      {copied && (
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-4 py-2 rounded shadow z-[9999]">
          Link copied!
        </div>
      )}

      <div className="relative h-64 overflow-hidden rounded-xl shadow-md z-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || title}
            fill
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1024px) 360px"
          />
        )}

        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <button
            className="bg-white/90 hover:bg-white text-black p-1 rounded-full shadow"
            onClick={handleWishlistToggle}
            disabled={loading || !userId}
            aria-label={
              localWishlisted ? "Remove from Wishlist" : "Save to Wishlist"
            }
          >
            <Heart className={`w-5 h-5 ${getHeartColorClass()}`} />
          </button>

          <div className="relative">
            <button
              className="bg-white/90 hover:bg-white text-black p-1 rounded-full shadow"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShareOpen((prev) => !prev);
              }}
              aria-label="Share Itinerary"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>

            {shareOpen && (
              <div className="absolute top-10 left-0 bg-white border shadow-md rounded-md p-2 w-48 text-sm z-50">
                <p className="font-medium mb-2">Share this safari:</p>
                <button
                  className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded"
                  onClick={async () => {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setShareOpen(false);
                  }}
                >
                  📋 Copy Link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(title + " - " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded"
                >
                  💬 Share on WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Check out this safari&body=${encodeURIComponent(title + "\n" + shareUrl)}`}
                  className="block w-full text-left py-1 px-2 hover:bg-gray-100 rounded"
                >
                  📧 Share via Email
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-2 right-2 bg-[#d2b48c] text-black text-sm font-bold px-4 py-1 rounded shadow-md">
          {priceBadge}
        </div>
      </div>

      <div className="relative -mt-8 mx-3 bg-white dark:bg-white rounded-2xl p-6 z-10">
        {(duration || region) && (
          <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-1">
            {duration}
            {region && ` • ${region}`}
          </p>
        )}

        <h3 className="text-base font-bold line-clamp-2 mb-2">{title}</h3>

        {summary && (
          <div className="mb-3">
            <p
              className={`text-sm text-gray-600 ${showFullSummary ? "" : "line-clamp-3"}`}
            >
              {summary}
            </p>
            {summary.length > 120 && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowFullSummary((v) => !v);
                }}
                className="mt-1 inline-block text-xs text-[#a35c2d] font-semibold underline cursor-pointer"
              >
                {showFullSummary ? "Show Less" : "Read More"}
              </span>
            )}
          </div>
        )}

        {star > 0 && (
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="text-gray-800">Luxury Level:</span>
            <div className="flex gap-1">
              {[...Array(star)].map((_, i) => (
                <Image
                  key={i}
                  src={starIcon || "/default-star.svg"}
                  alt="Luxury Star"
                  width={16}
                  height={16}
                />
              ))}
            </div>
          </div>
        )}

        {isFeatured && (
          <div className="w-full bg-[#d2b48c] text-black text-[10px] px-2 py-1 rounded-full mb-3 text-center">
            ★ Featured Journey
          </div>
        )}

        <div className="mt-auto flex gap-2">
          <Link
            href={`/africansafariitineraries/${slug}/`}
            className="flex-1 text-center bg-white text-black text-sm font-medium py-2.5 rounded-md border border-black hover:bg-black hover:text-white transition-all duration-300"
          >
            View Itinerary
          </Link>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIframeLoaded(false);
              setBookingOpen(true);
            }}
            className="flex-1 bg-black text-white text-sm py-2 rounded-md"
          >
            Start Planning
          </button>
        </div>
      </div>

      {bookingOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="relative w-full md:w-[85vw] h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 z-30 text-black hover:text-red-500 text-2xl font-bold"
              onClick={() => setBookingOpen(false)}
              aria-label="Close Booking Modal"
            >
              &times;
            </button>

            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <span className="text-3xl animate-bounce">🧭</span>
                <p className="mt-2 text-sm text-gray-600 font-medium">
                  Planning your safari...
                </p>
              </div>
            )}

            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-full relative z-20"
              style={{ border: "none" }}
              loading="eager"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
