"use client";
import { Binoculars, PhoneCall, Info } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serverClient } from "@/lib/sanity.server";
import { Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"], // Add more weights if needed
});
type Destination = {
  slug: { current: string };
  title: string;
  image: string;
  subtitle?: string;
  description?: string;
  price?: string;
  bestTime?: string;
  highSeason?: string;
  rating?: number;
  reviews?: number;
  flagImage?: string;
  region?: string;
  tags?: string[];
  ranking?: number;
  featured?: boolean;
  mapLocation?: string;
  gallery?: string[]; // ✅ new field for image URLs
};

export default function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selected, setSelected] = useState<Destination | null>(null);
  const [formattedReviews, setFormattedReviews] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await serverClient.fetch(
        `*[_type == "destination"]{
    _id,
    slug,
    title,
    "image": heroImage.asset->url,
    subtitle,
    description,
    price,
    bestTime,
    highSeason,
    rating,
    reviews,
    "flagImage": flagImage.asset->url,
    region,
    tags,
    ranking,
    featured,
    mapLocation,
    "gallery": gallery[].asset->url // ✅ added
  }`
      );

      setDestinations(data);
      setSelected(data[0] || null);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selected?.reviews) {
      setFormattedReviews(selected.reviews.toLocaleString());
    }
  }, [selected]);

  if (!selected) return <div className="p-10 text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-xl font-bold">
            Safari. Reimagined.
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl">
            Travel with purpose. Explore Africa with heart.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-400px)]">
        {/* Sidebar */}
        <nav className="w-full md:w-72 bg-[var(--surface-dark)] border-b md:border-b-0 md:border-r border-[var(--border)]">
          <h2 className="text-xl font-semibold p-4 sm:p-6 border-b border-[var(--border)]">
            Top-rated Safari Countries
          </h2>
          <ul className="overflow-x-auto flex md:block whitespace-nowrap md:whitespace-normal no-scrollbar">
            {destinations.map((dest, i) => (
              <li
                key={dest.slug.current}
                onClick={() => setSelected(dest)}
                className={`cursor-pointer px-4 sm:px-6 py-3 border-b border-[var(--border)] flex items-center select-none transition-all duration-200 ${
                  selected.slug.current === dest.slug.current
                    ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                    : "text-[var(--onSurface-light)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
                }`}
              >
                <span className="mr-2 text-[var(--background)]">#{i + 1}</span>
                {dest.flagImage && (
                  <img
                    src={dest.flagImage}
                    alt={`${dest.title} flag`}
                    className="w-6 h-auto mr-2 object-contain inline-block"
                  />
                )}
                {dest.title}
              </li>
            ))}
          </ul>
        </nav>

        {/* Detail Content */}
        <section className="relative flex-1 p-6 md:p-10 text-white min-h-[calc(100vh-400px)]">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full">
            {selected.image && (
              <Image
                src={selected.image}
                alt={`${selected.title} background`}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Foreground */}
          <div className="relative z-10 space-y-6">
            {/* Country Name & Badge */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2
                className={`text-5xl leading-tight drop-shadow-md ${dancingScript.className}`}
              >
                {selected.title}
              </h2>
              <div className="bg-black/50 p-2 rounded-xl w-fit">
                <Image
                  src="/badges/fair-trade-paw.png" // path relative to /public
                  alt="Fair Trade Approved"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Subtitle / Description */}
            {selected.subtitle && (
              <p className="italic text-lg text-white/80">
                {selected.subtitle}
              </p>
            )}

            {selected.description && (
              <p className="text-white leading-relaxed">
                {selected.description}
              </p>
            )}

            {/* Tags */}
            {selected.tags && selected.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-6 text-white/90">
              {selected.bestTime && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <strong className="block text-white mb-1">
                    Best Time to Go
                  </strong>
                  {selected.bestTime}
                </div>
              )}
              {selected.highSeason && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <strong className="block text-white mb-1">High Season</strong>
                  {selected.highSeason}
                </div>
              )}
              {selected.mapLocation && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <strong className="block text-white mb-1">Location</strong>
                  <a
                    href={selected.mapLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-blue-200 hover:text-blue-300"
                  >
                    📍 View on Map
                  </a>
                </div>
              )}
            </div>

            {/* Rating */}
            {selected.rating && (
              <div className="flex items-center space-x-2 text-yellow-300 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={
                      i < Math.floor(selected.rating ?? 0)
                        ? "currentColor"
                        : "#4b5563"
                    }
                    stroke="currentColor"
                  />
                ))}
                <span>{selected.rating.toFixed(1)}/5</span>
                {selected.reviews && (
                  <span className="ml-2 text-white/80">
                    {formattedReviews} reviews
                  </span>
                )}
              </div>
            )}

            {/* Buttons */}
            {/* Call-to-Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button className="bg-[#E5D5B8] hover:bg-[#d4c3a3] text-black font-semibold text-base px-6 py-3 flex items-center gap-2">
                <Binoculars size={18} />
                Explore {selected.title} Itineraries
              </Button>

              <Button
                variant="outline"
                className="border-[#E5D5B8] text-[#E5D5B8] hover:bg-[#E5D5B8] hover:text-black font-semibold text-base px-6 py-3 flex items-center gap-2"
              >
                <Info size={18} />
                More About {selected.title}
              </Button>

              <Button
                variant="ghost"
                className="text-white hover:underline text-base px-6 py-3 flex items-center gap-2"
              >
                <PhoneCall size={18} />
                Book a Discovery Call
              </Button>
            </div>

            {/* Gallery */}
            {Array.isArray(selected?.gallery) &&
              selected.gallery.length > 0 && (
                <section className="mt-41">
                  <div className="mb-4">
                    <span className="text-2xl">📸</span>
                    <h3 className="text-xl font-semibold inline-block ml-2 align-middle">
                      Photo Highlights
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selected.gallery.map((img, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-lg border border-white/5 shadow-sm"
                      >
                        <Image
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-[100px] sm:h-[120px] object-cover transition-transform hover:scale-105 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </section>
      </div>
    </main>
  );
}
