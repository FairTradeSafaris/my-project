"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { FoundersPromiseBlock } from "@/types/types";

/* ------------------------------
   Motion (desktop only)
-------------------------------- */
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => m.motion.div),
  { ssr: false, loading: () => null },
);

type Props = { data: FoundersPromiseBlock };

function splitOnce(s: string) {
  const m = String(s).match(/^\s*([^–—-]+?)\s*[–—-]\s*(.+)\s*$/);
  return m ? { title: m[1], detail: m[2] } : { title: s, detail: "" };
}

/* ------------------------------
   Mobile clamp
-------------------------------- */
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
        style={{
          overflow: open ? "visible" : "hidden",
          maxHeight: open ? "none" : `${collapsedHeight}px`,
          WebkitMaskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 70%, transparent)",
          maskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 70%, transparent)",
        }}
      >
        {children}
      </div>

      <button
        type="button"
        className="mt-3 md:hidden text-sm font-medium text-black"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

/* ==============================
   Component
================================ */
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
      relative z-0
      pt-28 sm:pt-32 md:pt-[220px]
      pb-24 sm:pb-28 md:pb-36
      px-5 sm:px-6 md:px-8
      bg-cover bg-center bg-no-repeat text-black
    `}
    >
      {/* Background */}
      {backgroundImage?.asset?.url && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage.asset.url}
            alt={backgroundImage.alt || "Background"}
            fill
            sizes="100vw"
            className="object-cover object-[center] md:object-[50%_30%] brightness-[0.97] contrast-[0.95] grayscale-[10%]"
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
        </div>
      )}

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 w-full h-20 sm:h-24 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #e6d8c7, rgba(200,161,101,0))",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-28 sm:h-32 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(200,161,101,0), #e6d8c7)",
        }}
      />

      {/* SECTION HEADER */}
      <div className="relative z-20 max-w-4xl mx-auto text-center mb-14 md:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Travel with integrity.
          <br />
          Impact with intention.
        </h2>

        {/* LINE ART */}
        {lineArtImage?.asset?.url && (
          <MotionDiv
            className="hidden md:block mx-auto mt-2 -mb-40 w-[360px] aspect-[18/11] pointer-events-none"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="relative w-full h-full">
              <Image
                src={lineArtImage.asset.url}
                alt=""
                aria-hidden
                fill
                sizes="360px"
                className="object-contain"
              />
            </div>
          </MotionDiv>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* LEFT CARD */}
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 min-h-[450px] p-8 rounded-md shadow-md backdrop-blur-sm"
          style={{ backgroundColor: "#e6d8c7" }}
        >
          <span className="inline-block mb-4 text-xs uppercase tracking-widest border border-black px-4 py-1 rounded-full">
            Our Promise
          </span>

          <h3 className="text-3xl font-bold mb-4">{headline}</h3>

          <ClampMobile>
            <PortableText value={intro} />

            <ul className="mt-4 list-disc pl-5 space-y-2">
              {safelist.map((item, i) => {
                const { title, detail } = splitOnce(item);
                return (
                  <li key={i}>
                    <strong>{title}</strong>
                    {detail && ` – ${detail}`}
                  </li>
                );
              })}
            </ul>
          </ClampMobile>

          {/* ACTION SECTION */}
          {buttonText && buttonLink && (
            <div className="mt-10 pt-6 border-t border-black/20">
              <Link
                href={buttonLink}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black text-white font-semibold tracking-wide hover:bg-[#5c4033] transition-colors duration-300"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </MotionDiv>

        {/* RIGHT CARD */}
        {impactContent && (
          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="w-full lg:w-1/2 min-h-[450px] p-8 rounded-md shadow-md backdrop-blur-sm"
            style={{ backgroundColor: "#e6d8c7" }}
          >
            <span className="inline-block mb-4 text-xs uppercase tracking-widest border border-black px-4 py-1 rounded-full">
              Travel with Purpose
            </span>

            <h3 className="text-3xl font-bold mb-4">{impactContent.title}</h3>

            <ClampMobile>
              <PortableText value={impactContent.body} />
            </ClampMobile>

            {/* ACTION SECTION */}
            {impactContent.ctaText && impactContent.ctaLink && (
              <div className="mt-10 pt-6 border-t border-black/20">
                <Link
                  href={impactContent.ctaLink}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black text-white font-semibold tracking-wide hover:bg-[#5c4033] transition-colors duration-300"
                >
                  {impactContent.ctaText}
                </Link>
              </div>
            )}
          </MotionDiv>
        )}
      </div>

      {/* Reduced motion */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
