// page.tsx
"use client";

import { useState, useEffect } from "react";
import { client as sanityClient } from "../../../lib/sanity";

import JourneyCard from "@/components/JourneyCard";
import { useSearchParams } from "next/navigation";

// ✅ Type Definitions

type Journey = {
  title: string;
  summary: string;
  slug?: { current: string };
  duration?: string;
  price?: string; // ✅ Add this line
  heroUrl?: string;
  alt?: string;
  ctaText?: string;
  wetuLink?: string;
  region?: { title: string };
  country?: { title: string; flag?: string };
  star?: string;
  starIcon?: string; // ✅ Add this
  travelStyle?: string[];
};

type Filters = {
  region: string;
  country: string;
  star: string;
  types: string[];
};

type FilterKey = keyof Filters;

export default function JourneyFinderPage() {
  const searchParams = useSearchParams();
  const prefillQuery = searchParams.get("q") || "";

  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [searchTerm, setSearchTerm] = useState(prefillQuery);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: "",
    star: "",
    types: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [] as string[],
    countries: [] as string[],
    styles: [] as string[],
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryTitle = searchParams.get("q");
    const shouldOpen = searchParams.get("open") === "true";

    sanityClient
      .fetch(
        `*[_type == "journey"]{
        title,
        summary,
        slug,
        duration,
        price,
        "heroUrl": heroImage.asset->url,
        alt,
        ctaText,
        wetuLink,
        region->{ title },
        country->{ title, "flag": flag.asset->url },
        star,
        "starIcon": starIcon.asset->url,
        travelStyle
      }`
      )
      .then((data: Journey[]) => {
        setAllJourneys(data);
        setFilteredJourneys(data);

        const regions = Array.from(
          new Set(
            data.map((j) => j.region?.title).filter((t): t is string => !!t)
          )
        );

        const countries = Array.from(
          new Set(
            data.map((j) => j.country?.title).filter((t): t is string => !!t)
          )
        );

        const styles = Array.from(
          new Set(data.flatMap((j) => j.travelStyle || []))
        );

        setFilterOptions({ regions, countries, styles });

        // Auto-select and open modal if query param matches
        if (queryTitle && shouldOpen) {
          const found = data.find(
            (j) => j.title.toLowerCase() === queryTitle.toLowerCase()
          );
          if (found) setSelectedJourney(found);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch journey data from Sanity:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = allJourneys.filter((j) => {
      const text = `${j.title} ${j.summary}`.toLowerCase();
      const matches =
        text.includes(searchTerm.toLowerCase()) &&
        (!selectedFilters.region ||
          j.region?.title === selectedFilters.region) &&
        (!selectedFilters.country ||
          j.country?.title === selectedFilters.country) &&
        (!selectedFilters.star || j.star === selectedFilters.star) &&
        (selectedFilters.types.length === 0 ||
          (j.travelStyle &&
            selectedFilters.types.some((type) =>
              j.travelStyle!.includes(type)
            )));
      return matches;
    });
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

      <section className="relative flex">
        <aside className="w-72 p-6 border-r bg-[#f5f3ef] hidden lg:block relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-800">Filters</h2>
            <button
              onClick={() =>
                setSelectedFilters({
                  region: "",
                  country: "",
                  star: "",
                  types: [],
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {[
            {
              label: "Regions",
              items: filterOptions.regions,
              filterKey: "region",
            },
            {
              label: "Countries",
              items: filterOptions.countries,
              filterKey: "country",
            },
            {
              label: "Travel Style",
              items: filterOptions.styles,
              filterKey: "types",
              multi: true,
            },
          ].map((group) => (
            <div key={group.label} className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      const key = group.filterKey as FilterKey;
                      if (group.multi) toggleType(item);
                      else {
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [key]: prev[key] === item ? "" : item,
                        }));
                      }
                    }}
                    className={`px-3 py-1 rounded-full border text-sm transition-all ${
                      group.multi
                        ? selectedFilters.types.includes(item)
                        : selectedFilters[group.filterKey as FilterKey] === item
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

        <section className="flex-1 p-6 lg:ml-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.length > 0 ? (
              filteredJourneys.map((j, index) => (
                <div key={index} onClick={() => setSelectedJourney(j)}>
                  <JourneyCard
                    title={j.title}
                    summary={j.summary}
                    imageUrl={j.heroUrl || ""}
                    alt={j.alt || j.title}
                    duration={j.duration || ""}
                    price={j.price || ""}
                    star={j.star ? parseInt(j.star) : 0}
                    starIcon={j.starIcon}
                    region={j.region?.title || ""}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No journeys found.</p>
            )}
          </div>
        </section>
      </section>
      {selectedJourney && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedJourney(null)}
        >
          <div className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[60vw] lg:w-[45vw] bg-white shadow-2xl z-50 p-6 overflow-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">{selectedJourney.title}</h2>
              <button
                onClick={() => setSelectedJourney(null)}
                className="text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="mt-4 text-gray-700">{selectedJourney.summary}</p>
            {selectedJourney.wetuLink && (
              <div className="mt-6 rounded overflow-hidden">
                <iframe
                  src={selectedJourney.wetuLink}
                  className="w-full h-[400px]"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
