"use client";

// Batch 18: shared look for the itinerary filters (display only).
// Calm, readable style: collapsible sections with a clear heading and a
// chevron, large native checkboxes / radio buttons with big click areas.
import React, { useId, useState } from "react";

export function FilterSection({
  title,
  count = 0,
  summary,
  defaultOpen = false,
  onClear,
  children,
}: {
  title: string;
  /** number picked in this group, shown as "Title (2)" */
  count?: number;
  /** text shown instead of a count, e.g. "5–9 days" */
  summary?: string;
  defaultOpen?: boolean;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const extra = summary ? ` (${summary})` : count > 0 ? ` (${count})` : "";
  return (
    <section className="border-b border-[#eee5d8] last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex w-full items-center justify-between gap-3 py-4 text-left text-[16px] font-semibold text-[#24170f] transition-colors hover:text-[#a35c2d] focus:outline-none focus-visible:text-[#a35c2d]"
        >
          <span>
            {title}
            {extra && <span className="font-normal text-[#a35c2d]">{extra}</span>}
          </span>
          <svg
            viewBox="0 0 20 20"
            className={`h-5 w-5 shrink-0 text-[#8a7766] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div id={bodyId} hidden={!open} className="pb-5">
        {children}
        {onClear && (count > 0 || summary) && (
          <div>
          <button
            type="button"
            onClick={onClear}
            className="mt-2 text-[14px] text-[#8a7766] underline underline-offset-4 transition hover:text-[#a35c2d]"
          >
            Clear {title.toLowerCase()}
          </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** One large, easy-to-read checkbox or radio row. */
export function FilterOption({
  label,
  checked,
  onChange,
  type = "checkbox",
  name,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label className="flex min-h-[40px] cursor-pointer select-none items-center gap-3 rounded-md py-1.5 text-[15px] leading-snug text-[#3c2a1e] transition-colors hover:text-[#24170f]">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#a35c2d]"
      />
      <span className={checked ? "font-medium text-[#24170f]" : ""}>{label}</span>
    </label>
  );
}

export function ShowMoreButton({
  open,
  hidden,
  onClick,
}: {
  open: boolean;
  hidden: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="mt-1 inline-flex min-h-[36px] items-center gap-1 text-[14px] font-medium text-[#a35c2d] transition hover:text-[#5d4037]"
    >
      {open ? "Show fewer" : `Show ${hidden} more`}
      <svg viewBox="0 0 16 16" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// Slider look shared by the duration and price filters.
export const sliderRootClass =
  "relative flex h-7 w-full touch-none select-none items-center";
export const sliderTrackClass =
  "relative h-[4px] grow rounded-full bg-[#e9dfd1]";
export const sliderRangeClass = "absolute h-full rounded-full bg-[#a35c2d]";
export const sliderThumbClass =
  "block h-6 w-6 cursor-grab rounded-full border-2 border-[#a35c2d] bg-white shadow-[0_2px_6px_rgba(36,23,15,0.2)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#a35c2d]/25 active:cursor-grabbing";
