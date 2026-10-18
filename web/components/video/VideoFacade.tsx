"use client";
// components/video/VideoFacade.tsx (batch 25)
// Lightweight YouTube player: a real thumbnail <img> and a play button are in
// the page HTML; the youtube-nocookie player only loads after a tap.
import { useState } from "react";
import { FTS_VIDEO } from "./ftsVideo";

export default function VideoFacade({ priority = false }: { priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const v = FTS_VIDEO;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#24170f] shadow-[0_1px_2px_rgba(36,23,15,0.04),0_18px_40px_-24px_rgba(36,23,15,0.45)]">
      {playing ? (
        <iframe
          src={v.playerUrl}
          title={v.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play video: ${v.title} (${v.durationLabel})`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={v.thumbnailMax}
            srcSet={`${v.thumbnailHq} 480w, ${v.thumbnailMax} 1280w`}
            sizes="(min-width: 1024px) 760px, 100vw"
            alt={v.alt}
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#1a100a]/55 via-transparent to-transparent" aria-hidden="true" />
          <span
            className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7f3ec]/95 text-[#24170f] shadow-lg transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-4 rounded-lg bg-[#1a100a]/70 px-3 py-1.5 text-[14px] font-medium text-[#f7f3ec]" aria-hidden="true">
            Watch · {v.durationLabel}
          </span>
        </button>
      )}
    </div>
  );
}
