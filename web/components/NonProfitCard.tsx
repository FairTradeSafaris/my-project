"use client";

import { useState } from "react";
import Image from "@/components/SanityImage";
import { PortableText } from "@portabletext/react";
import type { NonProfit } from "@/types/nonProfit";

type Props = {
  org: NonProfit;
};

export default function NonProfitCard({ org }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    // Batch 23: homepage-style card (display only)
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#ebe1d3] bg-white shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)]">
      {/* Logo Section */}
      {org.logo && (
        <div className="flex h-32 items-center justify-center border-b border-[#efe5d6] bg-[#fbf8f3] px-6 py-5">
          <div className="flex items-center justify-center w-full max-w-[160px] max-h-[64px]">
            <Image
              src={org.logo}
              alt={org.name}
              width={160}
              height={64}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-3">
          {/* Description + Toggle */}
          {org.description && (
            <div className="relative text-[16px] leading-7 text-[#5c4a3d]">
              <div
                className={
                  expanded
                    ? "max-h-[500px] transition-all duration-300 ease-in-out"
                    : "line-clamp-4 transition-all duration-300 ease-in-out"
                }
              >
                <PortableText value={org.description} />
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="float-right mt-2 text-[14px] font-semibold text-[#24170f] underline decoration-[#c9974f] decoration-2 underline-offset-4 transition hover:text-[#a35c2d]"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-4 pt-6">
          {/* Social Links */}
          {Array.isArray(org.socials) && org.socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {org.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#ebe1d3] bg-[#fbf8f3] px-3 py-2 text-[14px] font-medium text-[#3c2a1e] transition hover:border-[#c9a57f]"
                >
                  {social.icon?.asset?.url ? (
                    <Image
                      src={social.icon.asset.url}
                      alt={social.platform}
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  ) : (
                    <span className="capitalize">{social.platform}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {org.ctaLabel && org.ctaLink && (
            <a
              href={org.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#24170f]/25 bg-white px-6 text-[15px] font-semibold text-[#24170f] transition-colors duration-300 hover:border-[#a35c2d] hover:text-[#a35c2d]"
            >
              {org.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
