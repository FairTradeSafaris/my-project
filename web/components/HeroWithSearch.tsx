"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Search as SearchIcon, X } from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";
import { client as sanityClient } from "../lib/sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { OPEN_SEARCH_SHEET } from "@/lib/event";

/* =========================
   Sanity image builder
   ========================= */
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: SanityImageSource) =>
  builder.image(source).width(1920).url();

/* =========================
   Select + Form
   ========================= */

type SearchFormProps = {
  destinations: string[];
  luxuryLevels: string[];
  selectedDestination: string;
  setSelectedDestination: (v: string) => void;
  selectedLuxury: string;
  setSelectedLuxury: (v: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
};

function SelectBlock({
  icon,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const id = useMemo(
    () => `sel-${label.toLowerCase().replace(/\s+/g, "-")}`,
    [label]
  );
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition"
    >
      <span className="text-black/60" aria-hidden>
        {icon}
      </span>
      <select
        id={id}
        aria-label={label}
        className="bg-transparent outline-none text-sm w-full text-black appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.length === 0 ? (
          <option disabled>Loading…</option>
        ) : (
          options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))
        )}
      </select>
    </label>
  );
}

function SearchForm({
  destinations,
  luxuryLevels,
  selectedDestination,
  setSelectedDestination,
  selectedLuxury,
  setSelectedLuxury,
  isMobile = false,
  onClose,
}: SearchFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination) params.set("destination", selectedDestination);
    if (selectedLuxury) params.set("luxury", selectedLuxury);
    router.push(`/journey?${params.toString()}`);
    if (isMobile && onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isMobile
          ? "flex flex-col gap-3"
          : "mt-5 bg-white/75 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-xl px-4 py-4 shadow-2xl flex flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10 dark:border-white/10 transition-all duration-300"
      }
    >
      <SelectBlock
        icon={<MapPin />}
        label="Destination"
        value={selectedDestination}
        onChange={setSelectedDestination}
        options={destinations}
        placeholder="Choose a destination"
      />

      <SelectBlock
        icon={<Star />}
        label="Luxury Level"
        value={selectedLuxury}
        onChange={setSelectedLuxury}
        options={luxuryLevels}
        placeholder="Select luxury level"
      />

      <button
        type="submit"
        className={
          isMobile
            ? "px-5 py-3 rounded-xl bg-[#E5CBA2] text-[#3A2E1F] font-semibold text-sm shadow-md ring-1 ring-black/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            : "bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto"
        }
      >
        <SearchIcon className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
        {isMobile ? "Start My Safari" : "Search"}
      </button>
    </form>
  );
}

/* =========================
   HERO with integrated search
   ========================= */

export default function HeroWithSearch({
  data = {},
}: {
  data?: {
    headline?: string;
    subheadline?: string;
    imageUrl?: SanityImageSource;
  };
}) {
  const { headline, subheadline, imageUrl } = data;
  const sanityImage = imageUrl ? urlFor(imageUrl) : null;

  const [showForm, setShowForm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedLuxury, setSelectedLuxury] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Desktop detection
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch options from Sanity
  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "journey"]{ country->{title}, star }`)
      .then((rows: { country?: { title?: string }; star?: string }[]) => {
        const dests = Array.from(
          new Set(rows.map((j) => j.country?.title).filter(Boolean))
        ) as string[];
        const lux = Array.from(
          new Set(rows.map((j) => j.star).filter((s): s is string => !!s))
        );
        setDestinations(dests);
        setLuxuryLevels(lux);
      });
  }, []);

  // Auto-open mobile sheet if ?start=1 or #start is present
  useEffect(() => {
    const shouldStart =
      searchParams.get("start") === "1" ||
      (typeof window !== "undefined" && window.location.hash.includes("start"));
    if (!isDesktop && shouldStart) setShowForm(true);
  }, [searchParams, isDesktop]);

  // Listen for global OPEN_SEARCH_SHEET (from BottomTabBar, header, etc.)
  useEffect(() => {
    const onOpen = () => {
      document
        .getElementById("hero")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.innerWidth < 768) setShowForm(true);
    };
    window.addEventListener(OPEN_SEARCH_SHEET, onOpen as EventListener);
    return () =>
      window.removeEventListener(OPEN_SEARCH_SHEET, onOpen as EventListener);
  }, []);

  // Close helper: also cleans ?start=1 and unlocks scroll
  const closeMobileForm = () => {
    setShowForm(false);
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("start");
    router.replace(`${pathname}?${sp.toString()}`.replace(/\?$/, ""), {
      scroll: false,
    });
  };

  // Body scroll lock while sheet open
  useEffect(() => {
    if (!isDesktop) {
      document.body.style.overflow = showForm ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm, isDesktop]);

  // ESC / outside click for the sheet
  const sheetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showForm) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobileForm();
    const onDown = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node))
        closeMobileForm();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [showForm]);

  const sharedFormProps: SearchFormProps = {
    destinations,
    luxuryLevels,
    selectedDestination,
    setSelectedDestination,
    selectedLuxury,
    setSelectedLuxury,
  };

  return (
    <section
      id="hero"
      className="relative h-[45vh] md:h-[90vh] max-h-[600px] w-full pt-24 md:pt-28 overflow-hidden bg-[var(--background)] text-[var(--text)]"
    >
      {/* Background */}
      <Image
        src={sanityImage || "/hero.webp"}
        alt="Safari background"
        fill
        className="object-[center_25%] md:object-center object-cover transition-all duration-700"
        priority
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full">
        <h1 className="text-3xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-md leading-tight">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-sm md:text-2xl text-white/90 max-w-xl mb-2 md:mb-4 drop-shadow-md leading-snug">
          {subheadline ||
            "Experience Africa through the eyes of locals, guided by purpose, powered by heart."}
        </p>

        {/* DESKTOP: inline search form */}
        {isDesktop && <SearchForm {...sharedFormProps} />}
      </div>

      {/* MOBILE: app-like sheet */}
      {!isDesktop && showForm && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-[2px]" />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            aria-modal="true"
            role="dialog"
          >
            <div
              ref={sheetRef}
              className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
                <div className="font-semibold text-sm text-neutral-800">
                  Find your safari
                </div>
                <button
                  onClick={closeMobileForm}
                  aria-label="Close"
                  className="p-2 rounded-lg hover:bg-neutral-100 active:scale-95 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <SearchForm
                  {...sharedFormProps}
                  isMobile
                  onClose={closeMobileForm}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
