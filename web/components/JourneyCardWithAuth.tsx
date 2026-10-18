"use client";

// The one itinerary card (everyone sees this one).
// Same structure as before: price on the photo, days / region line, title,
// summary, luxury rating and a "View Itinerary" button, refined for
// typography, spacing and a consistent 4:3 photo.
import Image from "@/components/SanityImage";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "@/hooks/useWishlist";
import type { JourneyCardProps } from "@/types/journey";

function priceAmount(val?: number | string): string | null {
  if (val === undefined || val === null || val === "") return null;
  const num =
    typeof val === "string" ? Number(val.replace(/[, ]+/g, "")) : val;
  if (Number.isNaN(num) || num <= 0) return null;
  return `US$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

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
  star = 0,
  starIcon,
  isFeatured,
  isWishlisted = false,
  className,
}: JourneyCardProps) {
  const { user } = useUser();
  const [pendingWishlist, setPendingWishlist] = useState(false);
  const [localWishlisted, setLocalWishlisted] = useState(isWishlisted);
  const { toggleWishlist, loading } = useWishlist(journeyId);

  const href = `/africansafariitineraries/${slug}/`;
  const amount = priceAmount(price);
  const days = duration ? duration.split("/")[0].trim() : "";
  const stars = Math.max(0, Math.min(5, Number(star) || 0));

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

  return (
    <article
      className={`@container group relative flex h-full w-full flex-col ${className || ""}`}
    >
      {/* PHOTO (fixed 4:3 so every card lines up) */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#f2e7db] shadow-[0_10px_28px_-16px_rgba(36,23,15,0.45)]"
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || title}
            fill
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
        )}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

        {/* PRICE TAG */}
        <span className="absolute right-3 top-3 inline-flex items-baseline gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[12px] leading-none text-[#5c4a3d] shadow-[0_4px_14px_rgba(0,0,0,0.16)] backdrop-blur-sm @max-[18rem]:flex-col @max-[18rem]:items-end @max-[18rem]:gap-1 @max-[18rem]:rounded-xl @max-[18rem]:py-2">
          {amount ? (
            <>
              <span className="inline-flex items-baseline gap-1">
                <span>From</span>
                <span className="text-[14px] font-bold tabular-nums text-[#24170f]">
                  {amount}
                </span>
              </span>
              <span className="@max-[18rem]:text-[11px]">p/p sharing</span>
            </>
          ) : (
            <span className="font-semibold text-[#24170f]">
              Price on request
            </span>
          )}
        </span>
      </Link>

      {/* SAVE (heart) */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        disabled={loading}
        aria-label={localWishlisted ? "Remove from saved trips" : "Save trip"}
        className="absolute left-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#3c2a1e] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:opacity-60"
      >
        <Heart
          className={`h-4 w-4 ${
            pendingWishlist || localWishlisted
              ? "fill-[#a35c2d] text-[#a35c2d]"
              : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {/* TEXT PANEL (overlaps the photo, as before) */}
      <div className="relative z-10 mx-3 -mt-10 flex flex-1 flex-col rounded-2xl border border-[#ebe1d3] bg-white px-5 pb-5 pt-5 @max-[18rem]:px-4 @max-[18rem]:pb-4 shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-18px_rgba(36,23,15,0.30)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_2px_4px_rgba(36,23,15,0.05),0_22px_44px_-20px_rgba(36,23,15,0.42)] sm:px-6 sm:pb-6">
        {(days || region) && (
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a35c2d]">
            {days && <span>{days}</span>}
            {days && region && (
              <span className="h-1 w-1 rounded-full bg-[#d9b48a]" aria-hidden />
            )}
            {region && <span>{region}</span>}
          </p>
        )}

        {isFeatured && (
          <span className="mt-2 w-fit rounded-full bg-[#f2e7db] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5d4037]">
            Featured journey
          </span>
        )}

        <h3 className="mt-2 line-clamp-2 min-h-[2.7em] text-[18px] font-semibold leading-[1.35] tracking-[-0.01em] text-[#24170f]">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {title}
          </Link>
        </h3>

        {summary && (
          <p className="mt-2.5 line-clamp-3 text-[14px] leading-[1.6] text-[#5c4a3d]">
            {summary}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex min-h-[20px] items-center justify-between border-t border-[#efe5d6] pt-4">
            {stars > 0 ? (
              <>
                <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7766]">
                  Luxury<span className="@max-[18rem]:hidden"> level</span>
                </span>
                <span
                  className="flex items-center gap-1"
                  aria-label={`Luxury level ${stars} out of 5`}
                >
                  {Array.from({ length: stars }).map((_, i) =>
                    starIcon ? (
                      <Image
                        key={i}
                        src={starIcon}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    ) : (
                      <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-[#c9974f]"
                        aria-hidden
                      >
                        <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
                      </svg>
                    ),
                  )}
                </span>
              </>
            ) : (
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7766]">
                Tailor-made
              </span>
            )}
          </div>

          <span className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#24170f] text-[14px] font-semibold tracking-[0.01em] text-white transition-colors duration-300 group-hover:bg-[#5d4037]">
            View Itinerary
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </article>
  );
}
