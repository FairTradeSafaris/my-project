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

/* split only on the FIRST dash */
function splitOnce(s: string) {
  const m = String(s).match(/^\s*([^–—-]+?)\s*[–—-]\s*(.+)\s*$/);
  return m ? { title: m[1], detail: m[2] } : { title: s, detail: "" };
}

/* Mobile-only clamp with a COLORLESS fade (mask), desktop always open */
function ClampMobile({
  children,
  collapsedHeight = 190, // adjust if you want more/less preview
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
            : "linear-gradient(to bottom, black 78%, transparent)",
          maskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 78%, transparent)",
        }}
      >
        {children}
      </div>

      {/* link-style toggle: no background color */}
      <button
        type="button"
        className="mt-3 md:hidden text-sm font-medium text-black/70 hover:text-black"
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
        bg-cover bg-center bg-no-repeat text-black
      `}
      style={{
        backgroundImage: backgroundImage?.asset?.url
          ? `url(${backgroundImage.asset.url})`
          : "none",
      }}
    >
      {/* soft page fades */}
      <div
        className="absolute top-0 left-0 w-full h-20 sm:h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(var(--background-rgb), 1), rgba(var(--background-rgb), 0))`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-20 sm:h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(var(--background-rgb), 1), rgba(var(--background-rgb), 0))`,
        }}
      />

      {/* line art */}
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

      {/* content */}
      <div
        className={`
          relative z-20 max-w-7xl mx-auto
          flex flex-col lg:flex-row items-stretch justify-between
          gap-8 sm:gap-12 lg:gap-20
        `}
      >
        {/* left card */}
        <div
          id="promise"
          className={`
            w-full lg:w-1/2 min-h-[450px]
            border border-black/10 rounded-md shadow-md
            p-6 sm:p-8 md:p-10
            flex flex-col justify-between
            backdrop-blur-sm
          `}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <div>
            <div
              className={`
                mb-4 text-[10px] sm:text-xs uppercase tracking-widest
                border border-black px-3 py-1 sm:px-4 rounded-full inline-block
                whitespace-nowrap
              `}
            >
              Our Promise
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{headline}</h2>

            {/* ONE clamp wraps intro + bullets so both collapse on mobile */}
            <ClampMobile>
              <div className="text-[0.985rem] sm:text-base text-black/80 leading-7 sm:leading-8">
                <PortableText value={intro} />
              </div>

              <ul className="mt-4 list-disc pl-5 space-y-2 text-[0.985rem] sm:text-base text-black/80">
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
                bg-black text-white hover:bg-gray-800 transition
                min-w-[200px]
                self-start
              `}
              aria-label={buttonText}
              title={buttonText}
            >
              {buttonText}
            </Link>
          )}
        </div>

        {/* right card */}
        {impactContent && (
          <div
            id="sustainability"
            className={`
              w-full lg:w-1/2 min-h-[450px]
              border border-black/10 rounded-md shadow-md
              p-6 sm:p-8 md:p-10
              flex flex-col justify-between
              backdrop-blur-sm
            `}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <div>
              <div
                className={`
                  mb-4 text-[10px] sm:text-xs uppercase
                  tracking-widest border border-black
                  px-3 py-1 sm:px-4 rounded-full inline-block
                  whitespace-nowrap
                `}
              >
                Travel with Purpose
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                {impactContent.title}
              </h3>

              <ClampMobile>
                <div className="text-[0.985rem] sm:text-base text-black/80 leading-7 sm:leading-8">
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
                  border-2 border-black text-black
                  rounded-full font-semibold
                  hover:bg-black hover:text-white transition
                  min-w-[200px]
                  self-start
                `}
                aria-label={impactContent.ctaText}
                title={impactContent.ctaText}
              >
                {impactContent.ctaText}
              </Link>
            )}
          </div>
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
