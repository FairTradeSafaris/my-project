"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/useWishlist";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCardWithAuth({
  journeyId,
  slug,
  title,
  imageUrl,
  alt,
  price,
  duration,
  region,
  isWishlisted = false,
  className,
}: JourneyCardProps) {
  const { user } = useUser();

  const [bookingOpen, setBookingOpen] = useState(false);

  const [pendingWishlist, setPendingWishlist] = useState(false);
  const [localWishlisted, setLocalWishlisted] = useState(isWishlisted);

  const { toggleWishlist, loading } = useWishlist(journeyId);

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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      window.location.href = "/sign-in";
      return;
    }

    setPendingWishlist(true);
    await toggleWishlist();
    setPendingWishlist(false);
    setLocalWishlisted((prev) => !prev);
  };

  const priceBadge = buildPriceBadge(price);

  return (
    <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
      <div className="relative h-64 overflow-hidden rounded-xl shadow-md">
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
            disabled={loading || !user}
            aria-label={
              localWishlisted ? "Remove from Wishlist" : "Save to Wishlist"
            }
          >
            <Heart
              className={`w-5 h-5 ${
                pendingWishlist
                  ? "fill-[#a35c2d] text-[#a35c2d]"
                  : localWishlisted
                    ? "fill-pink-500 text-pink-500"
                    : "text-gray-700"
              }`}
            />
          </button>

          <button
            className="bg-white/90 hover:bg-white text-black p-1 rounded-full shadow"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            aria-label="Share Itinerary"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="absolute top-2 right-2 bg-[#d2b48c] text-black text-sm font-bold px-4 py-1 rounded shadow-md">
          {priceBadge}
        </div>
      </div>

      <div className="relative -mt-8 mx-3 bg-white rounded-2xl p-6 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        {(duration || region) && (
          <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-1">
            {duration}
            {region && ` • ${region}`}
          </p>
        )}

        <h3 className="text-base font-bold mb-1 line-clamp-2">{title}</h3>

        <p className="text-sm text-gray-600 mb-3">
          Private, tailor-made safari
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setBookingOpen(true);
            }}
            className="w-full bg-black text-white text-sm py-2.5 rounded-md font-semibold"
          >
            Start Planning
          </button>

          <Link
            href={`/africansafariitineraries/${slug}/`}
            className="text-center text-sm text-black underline"
          >
            View itinerary
          </Link>
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
            >
              &times;
            </button>

            <iframe
              src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
