"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Search } from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";
import { client as sanityClient } from "../lib/sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Sanity image builder
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: SanityImageSource) =>
  builder.image(source).width(1920).url();

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

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"]{
          country->{title},
          star
        }`
      )
      .then((data: { country?: { title?: string }; star?: string }[]) => {
        const dests = Array.from(
          new Set(data.map((j) => j.country?.title).filter(Boolean))
        ) as string[];
        const lux = Array.from(
          new Set(data.map((j) => j.star).filter((s): s is string => !!s))
        );
        setDestinations(dests);
        setLuxuryLevels(lux);
      });
  }, []);

  const sharedFormProps = {
    destinations,
    luxuryLevels,
    selectedDestination,
    setSelectedDestination,
    selectedLuxury,
    setSelectedLuxury,
  };

  return (
    <section className="relative h-[45vh] md:h-[90vh] max-h-[600px] w-full pt-24 md:pt-28 overflow-hidden bg-[var(--background)] text-[var(--text)]">
      {/* Background Image */}
      <Image
        src={sanityImage || "/hero.webp"}
        alt="Safari background"
        fill
        className="object-[center_25%] md:object-center object-cover transition-all duration-700"
        priority
        fetchPriority="high"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full animate-fadeInSlow">
        <h1 className="text-3xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-md leading-tight animate-fadeIn">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-sm md:text-2xl text-white/90 max-w-xl mb-4 drop-shadow-md leading-snug animate-fadeInSlow delay-200">
          {subheadline ||
            "Experience Africa through the eyes of locals, guided by purpose, powered by heart."}
        </p>

        {isDesktop && <SearchForm {...sharedFormProps} />}
      </div>

      {/* Mobile Sticky CTA */}
      {!isDesktop && !showForm && (
        <div className="fixed bottom-6 right-4 z-[100]">
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-3 rounded-xl bg-[#E5CBA2] text-[#3A2E1F] hover:bg-[#e0c197] transition-all shadow-md ring-1 ring-black/10 flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <Search className="w-4 h-4 -ml-1" strokeWidth={2} />
            <span className="pt-[1px]">Start My Safari</span>
          </button>
        </div>
      )}

      {/* Mobile Form */}
      {!isDesktop && showForm && (
        <div className="fixed bottom-0 left-0 w-full z-[100] bg-white/90 backdrop-blur-lg border-t border-black/10 p-4">
          <SearchForm
            {...sharedFormProps}
            isMobile
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </section>
  );
}

// 🔍 Search Form Component
function SearchForm({
  destinations,
  luxuryLevels,
  selectedDestination,
  setSelectedDestination,
  selectedLuxury,
  setSelectedLuxury,
  isMobile = false,
  onClose,
}: {
  destinations: string[];
  luxuryLevels: string[];
  selectedDestination: string;
  setSelectedDestination: (v: string) => void;
  selectedLuxury: string;
  setSelectedLuxury: (v: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestination) params.append("destination", selectedDestination);
    if (selectedLuxury) params.append("luxury", selectedLuxury);
    router.push(`/journey?${params.toString()}`);
    if (isMobile && onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        isMobile
          ? "flex flex-col gap-3"
          : "mt-4 bg-white/70 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-xl px-4 py-4 shadow-2xl flex flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10 dark:border-white/10 transition-all duration-300 animate-fadeInSlow"
      }`}
    >
      {isMobile && onClose && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-black underline mb-1"
          >
            Close
          </button>
        </div>
      )}

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
        className={`${
          isMobile
            ? "px-5 py-3 rounded-xl bg-[#E5CBA2] text-[#3A2E1F] font-semibold text-sm shadow-md ring-1 ring-black/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            : "bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto"
        }`}
      >
        <Search className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
        {isMobile ? "Start My Safari" : ""}
      </button>
    </form>
  );
}

// 🔽 Reusable Select Component
function SelectBlock({
  icon,
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
  return (
    <div className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition">
      <div className="text-black/60">{icon}</div>
      <select
        className="bg-transparent outline-none text-sm w-full text-black appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.length === 0 ? (
          <option disabled>Loading...</option>
        ) : (
          options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
