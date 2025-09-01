"use client";
import Image from "next/image";

type Destination = {
  slug?: { current?: string };
  title: string;
  flagImage?: string;
};

export default function CountryTabs({
  items,
  selectedSlug,
  onSelect,
}: {
  items: Destination[];
  selectedSlug?: string;
  onSelect: (d: Destination) => void;
}) {
  return (
    <div className="relative bg-[var(--surface-dark)]">
      {/* edge fades on mobile */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[var(--surface-dark)] to-transparent md:hidden" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[var(--surface-dark)] to-transparent md:hidden" />

      <div
        role="tablist"
        aria-label="Top-rated Safari Countries"
        className="
          flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-3
          md:block md:overflow-visible md:px-0 md:py-0
        "
      >
        {items.map((dest, i) => {
          const active = selectedSlug === dest.slug?.current;
          return (
            <button
              key={dest.slug?.current ?? dest.title}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(dest)}
              className={`
                snap-start shrink-0 inline-flex items-center gap-2 rounded-full
                border px-3 py-2 text-sm transition
                ${
                  active
                    ? "bg-[var(--accent)] text-[var(--background)] border-[var(--accent)]"
                    : "bg-[var(--surface-dark)] text-[var(--onSurface-light)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
                }
              `}
            >
              <span className="opacity-70 text-xs">#{i + 1}</span>
              {dest.flagImage ? (
                <span className="relative w-5 h-3">
                  <Image
                    src={dest.flagImage}
                    alt=""
                    fill
                    className="rounded-[2px] object-cover"
                    sizes="20px"
                  />
                </span>
              ) : null}
              <span className="whitespace-nowrap">{dest.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
