"use client";

import Image from "next/image";
import Link from "next/link";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCard({
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
  className,
}: JourneyCardProps) {
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

  const priceBadge = buildPriceBadge(price);

  return (
    <div className={`relative w-full max-w-sm mx-auto ${className || ""}`}>
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden rounded-xl shadow-md">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt || title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover"
          />
        )}

        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-[#d2b48c] text-black text-sm font-bold px-4 py-1 rounded shadow-md">
          {priceBadge}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative -mt-8 mx-3 bg-white rounded-2xl p-6 shadow-lg border border-[#e5e1db]">
        {(duration || region) && (
          <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-1">
            {duration}
            {region && ` • ${region}`}
          </p>
        )}

        <h3 className="text-base font-bold line-clamp-2 mb-2">{title}</h3>

        {summary && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{summary}</p>
        )}

        {star > 0 && (
          <div className="flex items-center gap-2 mb-3 text-sm">
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

        {/* SEO SAFE LINK */}
        <Link
          href={`/africansafariitineraries/${slug}/`}
          className="block w-full text-center bg-white text-black text-sm font-medium py-2.5 rounded-md border border-black hover:bg-black hover:text-white transition-all duration-300"
        >
          View Itinerary
        </Link>
      </div>
    </div>
  );
}
