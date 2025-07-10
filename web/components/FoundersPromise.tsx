"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import type { FoundersPromiseBlock } from "@/types/types";

// Dynamically import motion.div to avoid ESM export issue
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

type Props = {
  data: FoundersPromiseBlock;
};

export default function FoundersPromise({ data }: Props) {
  const {
    headline,
    intro,
    safelist,
    buttonText,
    buttonLink,
    backgroundImage,
    lineArtImage,
    impactContent,
  } = data;

  return (
    <section
      className="relative pt-32 pb-36 px-6 bg-cover bg-center bg-no-repeat text-black"
      style={{
        backgroundImage: backgroundImage?.asset?.url
          ? `url(${backgroundImage.asset.url})`
          : "none",
      }}
    >
      {/* Optional Fade Overlays */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdf6ee] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fefbf6] to-transparent z-10 pointer-events-none" />

      {/* Animated Bird Bridge */}
      {lineArtImage?.asset?.url && (
        <MotionDiv
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
        >
          <Image
            src={lineArtImage.asset.url}
            alt={lineArtImage.alt || "Bird bridge illustration"}
            className="object-contain w-[240px] sm:w-[300px] md:w-[360px]"
            width={360}
            height={220}
          />
        </MotionDiv>
      )}

      {/* Content Layout */}
      <div className="relative z-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-20">
        {/* Left Column */}
        <div
          className="w-full lg:w-1/2 h-full min-h-[500px] border border-black/10 p-10 rounded-md shadow-md flex flex-col justify-between backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <div>
            <div className="mb-4 text-xs uppercase tracking-widest border border-black px-4 py-1 rounded-full inline-block">
              Our Promise
            </div>
            <h2 className="text-3xl font-bold mb-4">{headline}</h2>
            <div className="text-base text-black/80 leading-relaxed mb-6">
              <PortableText value={intro} />
            </div>
            <ul className="list-disc pl-5 space-y-2 text-m text-black/80">
              {safelist.map((item, idx) => {
                const [title, detail] = item.split("–");
                return (
                  <li key={idx}>
                    <strong>{title.trim()}</strong> – {detail?.trim()}
                  </li>
                );
              })}
            </ul>
          </div>
          {buttonLink && buttonText && (
            <Link
              href={buttonLink}
              className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              {buttonText}
            </Link>
          )}
        </div>

        {/* Right Column */}
        {impactContent && (
          <div
            className="w-full lg:w-1/2 h-full min-h-[450px] border border-black/10 p-10 rounded-md shadow-md flex flex-col justify-between backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <div>
              <div className="mb-4 text-xs uppercase tracking-widest border border-black px-4 py-1 rounded-full inline-block">
                Travel with Purpose
              </div>
              <h3 className="text-3xl font-bold mb-4">{impactContent.title}</h3>
              <div className="text-base text-black/80 leading-relaxed mb-6">
                <PortableText value={impactContent.body} />
              </div>
            </div>
            {impactContent.ctaLink && impactContent.ctaText && (
              <Link
                href={impactContent.ctaLink}
                className="mt-8 inline-block px-6 py-3 border-2 border-black text-black font-semibold uppercase text-sm tracking-wide rounded-full hover:bg-black hover:text-white transition"
              >
                {impactContent.ctaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
