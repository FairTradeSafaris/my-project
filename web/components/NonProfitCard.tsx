"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { NonProfit } from "@/types/nonProfit";

type Props = {
  org: NonProfit;
};

export default function NonProfitCard({ org }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-[#e4dbd1] shadow-sm hover:shadow-md transition duration-300 flex flex-col">
      {/* Logo Section */}
      {org.logo && (
        <div className="bg-[#f8f5f0] px-6 py-5 border-b border-[#e7ded5] flex items-center justify-center h-32">
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
            <div className="relative text-sm text-gray-700 leading-relaxed">
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
                className="mt-2 text-xs text-[#5a3e2b] font-medium hover:underline transition float-right"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-6 space-y-3 mt-auto">
          {/* Social Links */}
          {Array.isArray(org.socials) && org.socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {org.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-[#f2ebe4] text-[#3c2a1e] hover:bg-[#e4d7cb] transition font-medium"
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
              className="inline-block w-full text-center px-5 py-2 bg-[#5a3e2b] text-white rounded-full hover:bg-[#3a291e] transition font-semibold text-sm tracking-wide"
            >
              {org.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
