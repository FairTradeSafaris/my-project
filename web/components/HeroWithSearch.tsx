"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Users, Search } from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../lib/sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);
const urlFor = (source: SanityImageSource) =>
  builder.image(source).width(1920).url();

export default function HeroWithSearch({
  data,
}: {
  data: {
    headline: string;
    subheadline: string;
    imageUrl?: SanityImageSource;
  };
}) {
  const { headline, subheadline, imageUrl } = data;
  const sanityImage = imageUrl ? urlFor(imageUrl) : null;

  const [showForm, setShowForm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <section className="relative min-h-[90vh] w-full pt-24 md:pt-28 overflow-hidden bg-[var(--background)] text-[var(--text)]">
      {/* Background Image */}
      <Image
        src={sanityImage || "/hero.webp"}
        alt="Safari background"
        fill
        className="object-cover object-center transition-all duration-700"
        priority
        fetchPriority="high"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full animate-fadeInSlow">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3 text-white drop-shadow-md leading-tight animate-fadeIn">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-xl mb-6 drop-shadow-md leading-snug animate-fadeInSlow delay-200">
          {subheadline ||
            "Experience Africa through the eyes of locals, guided by purpose, powered by heart."}
        </p>

        {isDesktop && <SearchForm />}
      </div>

      {/* Mobile Sticky CTA */}
      {!isDesktop && !showForm && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4">
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
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-lg border-t border-black/10 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowForm(false);
            }}
            className="flex flex-col gap-3"
          >
            <InputBlock icon={<MapPin />} placeholder="Where to?" type="text" />
            <SelectBlock icon={<MapPin />} />
            <InputBlock icon={<Users />} placeholder="Guests" type="text" />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#E5CBA2] text-[#3A2E1F] font-semibold text-sm shadow-md ring-1 ring-black/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Start My Safari
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

// 🔍 Search Form
function SearchForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-4 bg-white/70 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-xl px-4 py-4 shadow-2xl flex flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10 dark:border-white/10 transition-all duration-300 animate-fadeInSlow"
    >
      <InputBlock icon={<MapPin />} placeholder="Where to?" type="text" />
      <SelectBlock icon={<MapPin />} />
      <InputBlock icon={<Users />} placeholder="Guests" type="text" />
      <button
        type="submit"
        className="bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}

// 📦 Input Field
function InputBlock({
  icon,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition">
      <div className="text-black/60">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full text-black placeholder-black/60"
      />
    </div>
  );
}

// ⬇️ Select Field
function SelectBlock({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition">
      <div className="text-black/60">{icon}</div>
      <select
        className="bg-transparent outline-none text-sm w-full text-black appearance-none"
        defaultValue=""
      >
        <option value="" disabled hidden>
          Choose a destination
        </option>
        <option>Tanzania</option>
        <option>South Africa</option>
        <option>Botswana</option>
        <option>Kenya</option>
      </select>
    </div>
  );
}
