"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { FoundersPromiseBlock } from "@/types/types";

const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false }
);

type Props = { data: FoundersPromiseBlock };

function splitOnce(s: string) {
  const m = String(s).match(/^\s*([^–—-]+?)\s*[–—-]\s*(.+)\s*$/);
  return m ? { title: m[1], detail: m[2] } : { title: s, detail: "" };
}

function ClampMobile({
  children,
  collapsedHeight = 190,
}: {
  children: React.ReactNode;
  collapsedHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className="md:overflow-visible"
        style={{
          overflow: open ? "visible" : "hidden",
          maxHeight: open ? "none" : `${collapsedHeight}px`,
          WebkitMaskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 68%, transparent)",
          maskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 78%, transparent)",
        }}
      >
        {children}
      </div>

      <button
        type="button"
        className="mt-3 md:hidden text-sm font-medium text-white/70 hover:text-white"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

export default function FoundersPromise({ data }: Props) {
  const {
    headline,
    intro,
    safelist = [],
    buttonText,
    buttonLink,
    backgroundImage,
    lineArtImage,
    impactContent,
  } = data;

  return (
    <section
      className={`
        relative
        pt-24 sm:pt-28 md:pt-32
        pb-24 sm:pb-28 md:pb-36
        px-5 sm:px-6 md:px-8
        bg-cover bg-center bg-no-repeat text-white
      `}
      style={{
        backgroundImage: backgroundImage?.asset?.url
          ? `url(${backgroundImage.asset.url})`
          : "none",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0 pointer-events-none" />

      {/* ✅ Fixed: Top fade matches previous gray tone */}
      <div
        className="absolute top-0 left-0 w-full h-20 sm:h-24 z-10 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, #e4e4e4, rgba(0, 0, 0, 0))`,
        }}
      />

      {/* Bottom white fade — optional, unchanged */}
      {/* Bottom fade — visible in light mode only */}
      <div
        className="absolute bottom-0 left-0 w-full h-20 sm:h-24 z-10 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `linear-gradient(to top, white, rgba(255, 255, 255, 0))`,
        }}
      />

      {/* Line Art */}
      {lineArtImage?.asset?.url && (
        <MotionDiv
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <Image
            src={lineArtImage.asset.url}
            alt={lineArtImage.alt || "Bird bridge illustration"}
            className="object-contain w-[220px] sm:w-[280px] md:w-[360px]"
            width={360}
            height={220}
          />
        </MotionDiv>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-8 sm:gap-12 lg:gap-20">
        {/* Left Card */}
        <MotionDiv
          id="promise"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`
            w-full lg:w-1/2 min-h-[450px]
            border border-white/10 rounded-md shadow-md
            p-6 sm:p-8 md:p-10
            flex flex-col justify-between
            backdrop-blur-sm
          `}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <div>
            <div
              className={`
                mb-4 text-[10px] sm:text-xs uppercase tracking-widest
                border border-white px-3 py-1 sm:px-4 rounded-full inline-block
                whitespace-nowrap text-white
              `}
            >
              Our Promise
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
              {headline}
            </h2>

            <ClampMobile>
              <div className="text-[0.985rem] sm:text-base text-white/80 leading-7 sm:leading-8">
                <PortableText value={intro} />
              </div>

              <ul className="mt-4 list-disc pl-5 space-y-2 text-[0.985rem] sm:text-base text-white/80">
                {safelist.map((item, idx) => {
                  const { title, detail } = splitOnce(item);
                  return (
                    <li key={idx}>
                      <strong>{title}</strong>
                      {detail && ` – ${detail}`}
                    </li>
                  );
                })}
              </ul>
            </ClampMobile>
          </div>

          {buttonLink && buttonText && (
            <Link
              href={buttonLink}
              className={`
                mt-8 inline-flex items-center justify-center
                whitespace-nowrap
                text-sm sm:text-base leading-none
                px-5 sm:px-6 py-3
                rounded-full font-semibold
                bg-white text-black hover:bg-gray-200 transition
                min-w-[200px]
                self-start
              `}
              aria-label={buttonText}
              title={buttonText}
            >
              {buttonText}
            </Link>
          )}
        </MotionDiv>

        {/* Right Card */}
        {impactContent && (
          <MotionDiv
            id="sustainability"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className={`
              w-full lg:w-1/2 min-h-[450px]
              border border-white/10 rounded-md shadow-md
              p-6 sm:p-8 md:p-10
              flex flex-col justify-between
              backdrop-blur-sm
            `}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          >
            <div>
              <div
                className={`
                  mb-4 text-[10px] sm:text-xs uppercase
                  tracking-widest border border-white
                  px-3 py-1 sm:px-4 rounded-full inline-block
                  whitespace-nowrap text-white
                `}
              >
                Travel with Purpose
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                {impactContent.title}
              </h3>

              <ClampMobile>
                <div className="text-[0.985rem] sm:text-base text-white/80 leading-7 sm:leading-8">
                  <PortableText value={impactContent.body} />
                </div>
              </ClampMobile>
            </div>

            {impactContent.ctaLink && impactContent.ctaText && (
              <Link
                href={impactContent.ctaLink}
                className={`
                  mt-8 inline-flex items-center justify-center
                  whitespace-nowrap
                  uppercase tracking-wide sm:tracking-wider
                  text-xs sm:text-sm leading-none
                  px-5 sm:px-6 py-3
                  border-2 border-white text-white
                  rounded-full font-semibold
                  hover:bg-white hover:text-black transition
                  min-w-[200px]
                  self-start
                `}
                aria-label={impactContent.ctaText}
                title={impactContent.ctaText}
              >
                {impactContent.ctaText}
              </Link>
            )}
          </MotionDiv>
        )}
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
