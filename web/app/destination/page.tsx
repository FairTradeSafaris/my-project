"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    slug: "botswana",
    name: "Botswana",
    rating: 4.7,
    reviews: 1320,
    image: "/destinations/botswana.jpg",
    subtitle: "#2 of 8 Major Safari Countries",
    description:
      "Botswana offers pristine wilderness, luxury safaris, and excellent wildlife density.",
    bestTime: "May to October",
    highSeason: "June to October",
    price: "$300 to $1000/day",
  },
  {
    slug: "tanzania",
    name: "Tanzania",
    rating: 4.6,
    reviews: 980,
    image: "/destinations/tanzania.jpg",
    subtitle: "#3 of 8 Major Safari Countries",
    description:
      "Tanzania offers the Serengeti and Mount Kilimanjaro with epic views.",
    bestTime: "June to October",
    highSeason: "July to September",
    price: "$250 to $900/day",
  },
  {
    slug: "kenya",
    name: "Kenya",
    rating: 4.5,
    reviews: 1050,
    image: "/destinations/kenia.jpg",
    subtitle: "#4 of 8 Major Safari Countries",
    description:
      "Kenya is home to the Great Migration and beautiful savannahs.",
    bestTime: "July to October",
    highSeason: "August to September",
    price: "$200 to $800/day",
  },
  {
    slug: "botswana1",
    name: "Botswana",
    rating: 4.7,
    reviews: 1320,
    image: "/destinations/botswana.jpg",
    subtitle: "#2 of 8 Major Safari Countries",
    description:
      "Botswana offers pristine wilderness, luxury safaris, and excellent wildlife density.",
    bestTime: "May to October",
    highSeason: "June to October",
    price: "$300 to $1000/day",
  },
  {
    slug: "tanzania1",
    name: "Tanzania",
    rating: 4.6,
    reviews: 980,
    image: "/destinations/tanzania.jpg",
    subtitle: "#3 of 8 Major Safari Countries",
    description:
      "Tanzania offers the Serengeti and Mount Kilimanjaro with epic views.",
    bestTime: "June to October",
    highSeason: "July to September",
    price: "$250 to $900/day",
  },
  {
    slug: "kenya1",
    name: "Kenya",
    rating: 4.5,
    reviews: 1050,
    image: "/destinations/kenia.jpg",
    subtitle: "#4 of 8 Major Safari Countries",
    description:
      "Kenya is home to the Great Migration and beautiful savannahs.",
    bestTime: "July to October",
    highSeason: "August to September",
    price: "$200 to $800/day",
  },
];

export default function DestinationPage() {
  const [selected, setSelected] = useState(destinations[0]);
  const [formattedReviews, setFormattedReviews] = useState("");

  useEffect(() => {
    setFormattedReviews(selected.reviews.toLocaleString());
  }, [selected]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 max-w-xl">
            Experience the untamed wilderness.
          </h1>
          <div className="bg-white/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl w-full max-w-2xl shadow-md">
            <input
              type="text"
              placeholder="Search journeys..."
              className="w-full px-4 py-3 rounded border text-white placeholder-white bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-400px)]">
        {/* Sidebar */}
        <nav className="w-full md:w-72 bg-[var(--surface-dark)] border-b md:border-b-0 md:border-r border-[var(--border)]">
          <h2 className="text-xl font-semibold p-4 sm:p-6 border-b border-[var(--border)]">
            Top-rated Safari Countries
          </h2>
          <ul className="overflow-x-auto flex md:block whitespace-nowrap md:whitespace-normal no-scrollbar">
            {destinations.map((dest, i) => (
              <li
                key={dest.slug}
                onClick={() => setSelected(dest)}
                className={`cursor-pointer px-4 sm:px-6 py-3 border-b border-[var(--border)] flex items-center select-none transition-all duration-200 ${
                  selected.slug === dest.slug
                    ? "bg-[var(--accent)] text-[var(--background)] font-semibold"
                    : "text-[var(--onSurface-light)] hover:bg-[var(--accent)] hover:text-[var(--background)]"
                }`}
              >
                <span className="mr-2 text-[var(--background)]">#{i + 1}</span>
                {dest.name}
              </li>
            ))}
          </ul>
        </nav>

        {/* Detail Panel */}
        <section className="relative flex-1 p-4 sm:p-6 md:p-10 text-white min-h-[calc(100vh-400px)]">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={selected.image}
              alt={`${selected.name} background`}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative">
            {/* Smaller badge top-right with margin */}
            <div className="absolute top-2 right-2 p-2 border border-yellow-400 rounded bg-black/70 text-yellow-400 text-xs font-bold text-center w-16 z-20">
              TOP
              <br />
              RATED
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto my-1"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="7"></circle>
                <path d="M8 21l4-4 4 4"></path>
              </svg>
              #{selected.subtitle.match(/\d+/)}
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mt-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold underline mb-2">
                  {selected.name}
                </h1>

                <div className="flex items-center flex-wrap space-x-1 mb-2 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={
                        i < Math.floor(selected.rating)
                          ? "currentColor"
                          : "#4b5563"
                      }
                      stroke="currentColor"
                    />
                  ))}
                  <span className="ml-3 font-semibold">
                    {selected.rating.toFixed(1)}/5
                  </span>
                  <span className="ml-2 underline cursor-pointer text-white">
                    {formattedReviews} Reviews
                  </span>
                </div>

                <p className="mb-3 italic font-semibold text-white">
                  {selected.subtitle}
                </p>

                <div className="leading-relaxed text-white">
                  {selected.description}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-white">
              <div className="flex items-center space-x-2">
                <DollarSign size={20} />
                <div>
                  <div>Rates (USD)</div>
                  <div className="font-semibold">{selected.price}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <div>
                  <div>Best Time to Go</div>
                  <div className="font-semibold">{selected.bestTime}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <div>
                  <div>High Season</div>
                  <div className="font-semibold">{selected.highSeason}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                {selected.name} Safaris &gt;
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold"
              >
                {selected.name} Operators &gt;
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
