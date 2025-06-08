// page.tsx
"use client";

import { useState, useEffect } from "react";
import sanityClient from "../../../lib/sanity";
import JourneyCard from "@/components/JourneyCard";

// ✅ Type Definitions

type Journey = {
  title: string;
  summary: string;
  slug?: { current: string };
  duration?: string;
  heroUrl?: string;
  alt?: string;
  ctaText?: string;
  wetuLink?: string;
  region?: string;
  country?: string;
  star?: string;
  travelStyle?: string[];
};

type Filters = {
  region: string;
  country: string;
  star: string;
  types: string[];
};

type FilterKey = keyof Filters;

// ✅ Component

export default function JourneyFinderPage() {
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: "",
    star: "",
    types: [],
  });

  const filterGroups = [
    {
      label: "Regions",
      items: [
        "East Africa",
        "Southern Africa",
        "West Africa",
        "Indian Ocean",
        "North Africa",
      ],
      filterKey: "region" as FilterKey,
    },
    {
      label: "Countries",
      items: [
        "Kenya",
        "Tanzania",
        "South Africa",
        "Botswana",
        "Zambia",
        "Namibia",
      ],
      filterKey: "country" as FilterKey,
    },
    {
      label: "Travel Style",
      items: ["Luxury", "Cultural", "Adventure", "Wildlife"],
      filterKey: "types" as FilterKey,
      multi: true,
    },
  ];

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"]{
          title,
          summary,
          slug,
          duration,
          "heroUrl": heroImage.asset->url,
          alt,
          ctaText,
          wetuLink,
          region,
          country,
          star,
          travelStyle
        }`
      )
      .then((data: Journey[]) => {
        console.log("✅ Sanity journey data loaded:", data);
        setAllJourneys(data);
        setFilteredJourneys(data);
      })
      .catch((error) => {
        console.error("❌ Failed to fetch journey data from Sanity:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = allJourneys.filter((j) => {
      const text = `${j.title} ${j.summary}`.toLowerCase();
      const matches =
        text.includes(searchTerm.toLowerCase()) &&
        (!selectedFilters.region ||
          (j.region &&
            j.region.toLowerCase() === selectedFilters.region.toLowerCase())) &&
        (!selectedFilters.country ||
          (j.country &&
            j.country.toLowerCase() ===
              selectedFilters.country.toLowerCase())) &&
        (!selectedFilters.star ||
          (j.star &&
            j.star.toLowerCase() === selectedFilters.star.toLowerCase())) &&
        (selectedFilters.types.length === 0 ||
          (j.travelStyle &&
            selectedFilters.types.some((type) =>
              j
                .travelStyle!.map((t) => t.toLowerCase())
                .includes(type.toLowerCase())
            )));
      console.log("🔍 Evaluated:", { title: j.title, matches });
      return matches;
    });
    console.log("🎯 Filtered results:", filtered);
    setFilteredJourneys(filtered);
  }, [searchTerm, selectedFilters, allJourneys]);

  const toggleType = (type: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Hero */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('../sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl">
            Experience the untamed wilderness.
          </h1>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl w-full max-w-2xl shadow-md">
            <input
              type="text"
              placeholder="Search journeys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded border text-white placeholder-white bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* Layout */}
      <section className="relative flex">
        <aside className="w-72 p-6 border-r bg-[#f5f3ef] hidden lg:block relative z-10">
          {filterGroups.map((group) => (
            <div key={group.label} className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      const key = group.filterKey;
                      if (group.multi) {
                        toggleType(item);
                      } else {
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [key]: prev[key] === item ? "" : item,
                        }));
                      }
                    }}
                    className={`px-3 py-1 rounded-full border text-sm transition-all ${
                      group.multi
                        ? selectedFilters.types.includes(item)
                        : selectedFilters[group.filterKey] === item
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="flex-1 p-6 lg:ml-72">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.length > 0 ? (
              filteredJourneys.map((j, index) => (
                <div key={index} onClick={() => setSelectedJourney(j)}>
                  <JourneyCard
                    title={j.title}
                    summary={j.summary}
                    imageUrl={j.heroUrl || ""}
                    alt={j.alt || j.title}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No journeys found.</p>
            )}
          </div>
        </section>
      </section>

      {/* Drawer */}
      {selectedJourney && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedJourney(null)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[60vw] lg:w-[45vw] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold text-black">
                  {selectedJourney.title}
                </h2>
                <button
                  onClick={() => setSelectedJourney(null)}
                  className="text-2xl text-black"
                >
                  &times;
                </button>
              </div>
              <p className="text-gray-700 mt-4">{selectedJourney.summary}</p>
              <div className="mt-6 rounded overflow-hidden flex-grow">
                <iframe
                  src={selectedJourney.wetuLink}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
