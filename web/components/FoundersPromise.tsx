"use client";

// Batch 20: calm restyle (display only). Same Sanity headline, intro, S.A.F.E.
// list, impact text, buttons, background texture and line art.
// - No fade/slide-in animations: the text is visible straight away (it used
//   to start invisible until framer-motion loaded).
// - The "Read more" clamp now only applies on phones; on desktop the full
//   text shows (it was cut off on desktop with no way to open it).
import Image from "@/components/SanityImage";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { useState } from "react";
import type { FoundersPromiseBlock } from "@/types/types";
import {
  homeBody,
  homeButton,
  homeCard,
  homeContainer,
  homeEyebrow,
  homeH2,
  homeSection,
} from "@/components/home/homeStyles";

type Props = { data: FoundersPromiseBlock };

function splitOnce(s: string) {
  const m = String(s).match(/^\s*([^–—-]+?)\s*[–—-]\s*(.+)\s*$/);
  return m ? { title: m[1], detail: m[2] } : { title: s, detail: "" };
}

/* Phone-only "Read more" clamp */
function ClampMobile({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className={
          open
            ? ""
            : "max-h-[200px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:max-h-none md:overflow-visible md:[mask-image:none]"
        }
      >
        {children}
      </div>
      <button
        type="button"
        className="mt-3 text-[15px] font-semibold text-[#a35c2d] underline underline-offset-4 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

const proseClass = `${homeBody} space-y-3 [&_strong]:font-semibold [&_strong]:text-[#24170f]`;

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
    <section className={`relative isolate overflow-hidden bg-[#f7f3ec] text-[#24170f] ${homeSection}`}>
      {/* Background texture (from Sanity), softened */}
      {backgroundImage?.asset?.url && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage.asset.url}
            alt={backgroundImage.alt || "Background"}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#f7f3ec]/80" />
        </div>
      )}

      <div className={homeContainer}>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={homeH2}>
            Travel with integrity.
            <br />
            Impact with intention.
          </h2>
          {lineArtImage?.asset?.url && (
            <div className="relative mx-auto mt-4 aspect-[360/153] w-[220px] opacity-80 md:w-[260px]">
              <Image
                src={lineArtImage.asset.url}
                alt=""
                aria-hidden
                fill
                sizes="260px"
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 lg:grid-cols-2 lg:gap-8">
          <div className={`flex flex-col p-6 sm:p-8 ${homeCard}`}>
            <p className={homeEyebrow}>Our Promise</p>
            <h3 className="mt-2 text-[24px] font-semibold leading-snug text-[#24170f] md:text-[26px]">
              {headline}
            </h3>
            <div className="mt-4 flex-1">
              <ClampMobile>
                <div className={proseClass}>
                  <PortableText value={intro} />
                </div>
                <ul className="mt-5 space-y-3">
                  {safelist.map((item, i) => {
                    const { title, detail } = splitOnce(item);
                    return (
                      <li key={i} className={`flex gap-3 ${homeBody}`}>
                        <span className="mt-[11px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c9974f]" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-[#24170f]">{title}</strong>
                          {detail && ` – ${detail}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </ClampMobile>
            </div>
            {buttonText && buttonLink && (
              <div className="mt-6 border-t border-[#efe5d6] pt-6">
                <Link href={buttonLink} className={homeButton}>
                  {buttonText}
                </Link>
              </div>
            )}
          </div>

          {impactContent && (
            <div className={`flex flex-col p-6 sm:p-8 ${homeCard}`}>
              <p className={homeEyebrow}>Travel with Purpose</p>
              <h3 className="mt-2 text-[24px] font-semibold leading-snug text-[#24170f] md:text-[26px]">
                {impactContent.title}
              </h3>
              <div className="mt-4 flex-1">
                <ClampMobile>
                  <div className={proseClass}>
                    <PortableText value={impactContent.body} />
                  </div>
                </ClampMobile>
              </div>
              {impactContent.ctaText && impactContent.ctaLink && (
                <div className="mt-6 border-t border-[#efe5d6] pt-6">
                  <Link href={impactContent.ctaLink} className={homeButton}>
                    {impactContent.ctaText}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
