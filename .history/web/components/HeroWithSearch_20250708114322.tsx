"use client";

import Image from "next/image";
import { MapPin, Users, Search } from "lucide-react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../lib/sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source).width(1920).url();
}

export default function HeroWithSearch({
  data,
}: {
  data: {
    headline: string;
    subheadline: string;
    imageUrl?: SanityImageSource; // accepts Sanity image object
  };
}) {
  const { headline, subheadline, imageUrl } = data;

  const sanityImage = imageUrl ? urlFor(imageUrl) : null;

  return (
    <section className="relative min-h-[90vh] w-full pt-24 md:pt-28 overflow-hidden">
      {/* Static Fallback Background */}
      <Image
        src="/hero.webp"
        alt="Safari fallback background"
        fill
        className="object-cover object-center opacity-80"
        priority
        fetchPriority="high"
      />

      {/* Dynamic Sanity Background */}
      {sanityImage && (
        <Image
          src={sanityImage}
          alt="Dynamic safari background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover object-center animate-fadeIn"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t z-10" />
      {/* Content */}
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] leading-tight">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-10 drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] leading-tight">
          {subheadline ||
            "Plan your once-in-a-lifetime journey with local experts who care."}
        </p>

        {/* Search Form */}
        <form
          aria-label="Safari Search Form"
          className="bg-white/5 text-white rounded-1xl px-4 py-4 shadow-xl flex flex-col md:flex-row items-stretch gap-3 md:gap-3 w-full max-w-4xl backdrop-blur-md border border-white/10"
        >
          {/* Where To */}
          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <MapPin className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Where to?"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

          {/* Destination Select */}
          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <MapPin className="w-5 h-5 text-white/70" />
            <select
              className="bg-transparent outline-none text-sm w-full text-white placeholder-white/60 appearance-none"
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

          {/* Guests */}
          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <Users className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Guests"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            aria-label="Search safaris"
            className="bg-white text-black rounded-4xl px-6 py-3 font-semibold hover:bg-gray-200 transition text-sm w-full md:w-auto flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
