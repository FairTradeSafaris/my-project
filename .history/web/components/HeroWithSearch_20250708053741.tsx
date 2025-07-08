"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client as sanity } from "@/lib/sanity";
import { MapPin, Users, Search } from "lucide-react";
import styles from "./Hero.module.css";

// Type for sanity image objects
type SanityImage = {
  asset: {
    url: string;
  };
};

export default function HeroWithSearch() {
  const [sanityImage, setSanityImage] = useState<string | null>(null);
  const [headline, setHeadline] = useState<string>("");
  const [subheadline, setSubheadline] = useState<string>("");

  useEffect(() => {
    const fetchHeroContent = async () => {
      const result = await sanity.fetch(
        `*[_type == "hero"][0]{
          headline,
          subheadline,
          backgroundImages[]{asset->{url}}
        }`
      );

      if (result) {
        setHeadline(result.headline);
        setSubheadline(result.subheadline);

        const urls =
          (result.backgroundImages as SanityImage[])?.map(
            (img) => img.asset.url
          ) || [];

        if (urls.length > 0) {
          const random = Math.floor(Math.random() * urls.length);
          setTimeout(() => setSanityImage(urls[random]), 100); // delay to simulate fade-in
        }
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <section className={styles.wrapper}>
      {/* Static Fast Image */}
      <Image
        src="/hero.webp"
        alt="Static hero fallback"
        fill
        className="object-cover object-center opacity-80 transition-opacity duration-500 ease-in"
        priority
        fetchPriority="high"
      />

      {/* Dynamic Sanity Image (fades in over static) */}
      {sanityImage && (
        <Image
          src={sanityImage}
          alt="Safari hero background"
          fill
          className="object-cover object-center absolute top-0 left-0 w-full h-full"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 min-h-[72px]">
          {subheadline ||
            "Plan your once-in-a-lifetime journey with local experts who care."}
        </p>

        {/* Search Box */}
        <div className="bg-white/5 text-white rounded-1xl px-4 py-4 shadow-xl flex flex-col md:flex-row items-stretch gap-3 md:gap-3 w-full max-w-4xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <MapPin className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Where to?"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

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

          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <Users className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Guests"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

          <button className="bg-white text-black rounded-4xl px-6 py-3 font-semibold hover:bg-gray-200 transition text-sm w-full md:w-auto flex items-center justify-center">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Fade Animation Style */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            filter: blur(8px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
