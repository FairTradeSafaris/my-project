"use client";

import React from "react";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
//import { FaStar, FaRegStar } from "react-icons/fa"; // or your icon library of choice

// Types
type Journey = {
  title: string;
  summary: string;
  slug?: { current: string };
  duration?: string;
  price?: string;
  heroUrl?: string;
  alt?: string;
  ctaText?: string;
  wetuLink?: string;
  region?: { title: string };
  country?: { title: string; flag?: string };
  star?: string;
  starIcon?: string;
  travelStyle?: string[];
  featuredOnHome?: boolean;
};

type Filters = {
  region: string;
  country: string[];
  star: string;
  types: string[];
  duration: [number, number]; // <- change from string to range
};

type FilterOptions = {
  regions: string[];
  countries: string[];
  styles: string[];
  stars: string[];
  durations: number[]; // <- list of day values
};

type FilterKey = keyof Filters;

export default function JourneyFinderClient() {
  const [visibleCount, setVisibleCount] = useState(9);
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    useSearchParams().get("q") || ""
  );
  const [collapsed, setCollapsed] = useState({
    region: false,
    country: false,
    star: false,
    types: false,
    duration: false,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    countries: [],
    styles: [],
    stars: [],
    durations: [],
  });

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country:
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("destination")
        ? [
            decodeURIComponent(
              new URLSearchParams(window.location.search).get("destination")!
            ),
          ]
        : [],
    star:
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("luxury")
        ? decodeURIComponent(
            new URLSearchParams(window.location.search).get("luxury")!
          )
        : "",
    types: [],
    duration: [0, 100], // temporary default
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setVisibleCount((prev) => prev + 9);
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef.current]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const queryTitle = query.get("q");
    const shouldOpen = query.get("open") === "true";

    sanityClient
      .fetch(
        `*[_type == "journey"][0...${visibleCount}] {
          title, summary, slug, duration, price,
          "heroUrl": heroImage.asset->url,
          alt, ctaText, wetuLink,
          region->{ title }, country->{ title, "flag": flag.asset->url },
          star, "starIcon": starIcon.asset->url,
          travelStyle, "featuredOnHome": featuredOnHome
        }`
      )
      .then((data: Journey[]) => {
        setAllJourneys((prev) => [
          ...prev,
          ...data.filter(
            (j) => !prev.some((p) => p.slug?.current === j.slug?.current)
          ),
        ]);

        if (queryTitle && shouldOpen) {
          const found = data.find(
            (j) => j.title.toLowerCase() === queryTitle.toLowerCase()
          );
          if (found) {
            setSelectedJourney(found);
            setSearchTerm("");
            const url = new URL(window.location.href);
            url.searchParams.delete("open");
            window.history.replaceState({}, "", url.toString());
          }
        }
      });
  }, [visibleCount]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"][0...1000] {
          region->{ title }, 
          country->{ title },
          travelStyle,
          duration,
          star
        }`
      )
      .then((data: Journey[]) => {
        const regions = Array.from(
          new Set(data.map((j) => j.region?.title).filter(Boolean))
        ) as string[];

        const countries = Array.from(
          new Set(data.map((j) => j.country?.title).filter(Boolean))
        ) as string[];

        const styles = Array.from(
          new Set(data.flatMap((j) => j.travelStyle || []))
        );

        const stars = Array.from(
          new Set(
            data
              .map((j) => j.star)
              .filter((s): s is string => typeof s === "string")
          )
        );

        // Extract duration as numbers from strings like "10 Days / 9 Nights"
        const durationNumbers = data
          .map((j) => {
            const match = j.duration?.match(/^(\d+)/); // get leading number
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((n): n is number => n !== null);

        const min = Math.min(...durationNumbers);
        const max = Math.max(...durationNumbers);

        // Set the filters
        setFilterOptions({
          regions,
          countries,
          styles,
          stars,
          durations: durationNumbers,
        });

        // Also set default duration range if not set
        setSelectedFilters((prev) => ({
          ...prev,
          duration: [min, max],
        }));
      });
  }, []);

  useEffect(() => {
    // Build dynamic GROQ filter based on selectedFilters (except duration!)
    const groqFilters = [];
    if (selectedFilters.region)
      groqFilters.push(`region->title == "${selectedFilters.region}"`);
    if (selectedFilters.country.length > 0)
      groqFilters.push(
        `country->title in ${JSON.stringify(selectedFilters.country)}`
      );
    if (selectedFilters.star)
      groqFilters.push(`star == "${selectedFilters.star}"`);
    if (selectedFilters.types.length > 0) {
      const styleFilters = selectedFilters.types
        .map((style) => `"${style}" in travelStyle`)
        .join(" || ");
      groqFilters.push(`(${styleFilters})`);
    }

    // Don't add duration to GROQ - filter that on the client!
    const groqWhere =
      groqFilters.length > 0
        ? `*[ _type == "journey" && ${groqFilters.join(" && ")} ]`
        : '*[ _type == "journey" ]';

    sanityClient
      .fetch(
        `${groqWhere}{
        title, summary, slug, duration, price,
        "heroUrl": heroImage.asset->url,
        alt, ctaText, wetuLink,
        region->{ title }, country->{ title, "flag": flag.asset->url },
        star, "starIcon": starIcon.asset->url,
        travelStyle, "featuredOnHome": featuredOnHome
      }`
      )
      .then((data: Journey[]) => {
        // Filter by search term and duration on client
        const filtered = data.filter((j) => {
          const text = `${j.title} ${j.summary}`.toLowerCase();
          const matchesSearch = text.includes(searchTerm.toLowerCase());
          const journeyDuration = parseInt(
            j.duration?.match(/^(\d+)/)?.[1] || "0",
            10
          );
          const matchesDuration =
            journeyDuration >= selectedFilters.duration[0] &&
            journeyDuration <= selectedFilters.duration[1];
          return matchesSearch && matchesDuration;
        });
        setFilteredJourneys(filtered);
        setAllJourneys(data); // Also update allJourneys to match new data
      });
  }, [searchTerm, selectedFilters]);

  useEffect(() => {
    if (
      filterOptions.countries.length === 0 &&
      filterOptions.stars.length === 0
    )
      return;
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("destination");
    const star = urlParams.get("luxury");
    setSelectedFilters((prev) => ({
      ...prev,
      country: country ? [decodeURIComponent(country)] : [],
      star: star ? decodeURIComponent(star) : "",
    }));
  }, [filterOptions]);

  const toggleType = (type: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const toggleCountry = (country: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      country: prev.country.includes(country)
        ? prev.country.filter((c) => c !== country)
        : [...prev.country, country],
    }));
  };

  const renderFilterGroups = (): React.ReactElement => {
    const groups = [
      { label: "Regions", items: filterOptions.regions, filterKey: "region" },
      {
        label: "Countries",
        items: filterOptions.countries,
        filterKey: "country",
        multi: true,
      },
      {
        label: "Interests & Activities",
        items: filterOptions.styles,
        filterKey: "types",
        multi: true,
      },
      {
        label: "Luxury Level", // Add star rating group
        items: filterOptions.stars,
        filterKey: "star",
      },
      {
        label: "Duration", // Add duration filter group
        items: [],
        filterKey: "duration",
      },
    ];

    return (
      <>
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            {/* Toggle Button for Each Group */}
            <button
              className="flex justify-between items-center w-full text-xs tracking-wide font-semibold text-gray-600 mb-4 uppercase border-t pt-4"
              onClick={() =>
                setCollapsed((prev) => ({
                  ...prev,
                  [group.filterKey]:
                    !prev[group.filterKey as keyof typeof prev],
                }))
              }
            >
              <span>{group.label}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  collapsed[group.filterKey as keyof typeof collapsed]
                    ? "rotate-180"
                    : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Filter content */}
            {!collapsed[group.filterKey as keyof typeof collapsed] && (
              <div className="flex flex-wrap gap-4">
                {/* Duration Slider */}
                {group.filterKey === "duration" ? (
                  <div className="w-full">
                    <Slider
                      range
                      min={Math.min(...filterOptions.durations)}
                      max={Math.max(...filterOptions.durations)}
                      defaultValue={selectedFilters.duration}
                      onChange={(value) => {
                        if (Array.isArray(value) && value.length === 2) {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            duration: [value[0], value[1]],
                          }));
                        }
                      }}
                      trackStyle={[{ backgroundColor: "#a35c2d", height: 6 }]}
                      railStyle={{ backgroundColor: "#e2e2e2", height: 6 }}
                      handleStyle={[
                        {
                          backgroundColor: "#fff",
                          borderColor: "#a35c2d",
                          height: 18,
                          width: 18,
                          marginTop: -6,
                          borderRadius: "9999px",
                          boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                        },
                        {
                          backgroundColor: "#fff",
                          borderColor: "#a35c2d",
                          height: 18,
                          width: 18,
                          marginTop: -6,
                          borderRadius: "9999px",
                          boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                        },
                      ]}
                    />

                    <div className="flex justify-between text-sm mt-3 font-medium text-gray-800">
                      <span>{selectedFilters.duration[0]} Days</span>
                      <span>{selectedFilters.duration[1]} Days</span>
                    </div>
                  </div>
                ) : group.filterKey === "star" ? (
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((level) => {
                      const isActive = selectedFilters.star === level;
                      return (
                        <button
                          key={level}
                          onClick={() =>
                            setSelectedFilters((prev) => ({
                              ...prev,
                              star: prev.star === level ? "" : level,
                            }))
                          }
                          className={`px-4 py-1 rounded-full text-sm border transition-all ${
                            isActive
                              ? "bg-[#a35c2d] text-white border-[#a35c2d]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Other filters (Regions, Countries, Travel Styles)
                  group.items.map((item) => {
                    const isActive =
                      group.filterKey === "country"
                        ? selectedFilters.country.includes(item)
                        : group.multi
                          ? selectedFilters.types.includes(item)
                          : selectedFilters[group.filterKey as FilterKey] ===
                            item;

                    return (
                      <button
                        key={item}
                        onClick={() => {
                          const key = group.filterKey as FilterKey;
                          if (key === "country") toggleCountry(item);
                          else if (group.multi) toggleType(item);
                          else {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              [key]: prev[key] === item ? "" : item,
                            }));
                          }
                        }}
                        className={`px-2.5 py-[2px] rounded-full text-[11px] font-medium border transition-all ${
                          isActive
                            ? "bg-[#a35c2d] text-white border-[#a35c2d]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderSelectedFiltersSummary = () => {
    const countryText = selectedFilters.country.join(", ");
    const typeText = selectedFilters.types.join(", ");
    const regionText = selectedFilters.region;
    const parts = [];
    if (countryText) parts.push(`in ${countryText}`);
    if (regionText) parts.push(`within ${regionText}`);
    if (typeText) parts.push(`with experiences like ${typeText}`);
    if (parts.length === 0) return null;
    return (
      <p className="mb-6 text-gray-700 text-sm italic">
        You are viewing journeys {parts.join(", ")}.
      </p>
    );
  };

  if (!allJourneys.length && !filterOptions.regions.length) {
    return null; // Or a loading spinner
  }

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-[85vw] max-w-sm bg-[#fdf8f3] h-full p-5 pt-6 overflow-y-auto relative border-l border-gray-200 shadow-xl">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2.5 mb-4 bg-[#a35c2d] text-white text-sm font-semibold rounded-md shadow hover:bg-[#8d4f26] transition"
            >
              Show Results & Close
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Filter your adventure
            </h2>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Filter your adventure
              </h2>
              <button
                onClick={() =>
                  setSelectedFilters({
                    region: "",
                    country: [],
                    star: "",
                    types: [],
                    duration: [
                      Math.min(...filterOptions.durations),
                      Math.max(...filterOptions.durations),
                    ],
                  })
                }
                className="text-sm text-[#a35c2d] hover:underline"
              >
                Clear All
              </button>
            </div>

            {renderFilterGroups()}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full py-3 bg-black text-white rounded-md"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

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

      {/* Sticky Mobile Filter Button */}

      {/* Layout */}
      <section className="relative flex">
        <aside className="w-72 p-6 border-r bg-[#f5f3ef] hidden lg:block relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-800">Filters</h2>
            <button
              onClick={() =>
                setSelectedFilters({
                  region: "",
                  country: [],
                  star: "",
                  types: [],
                  duration: [0, 0], // this will be overwritten by useEffect later
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>
          {renderFilterGroups()}
        </aside>

        <section className="flex-1 p-6 lg:ml-12">
          <div className="fixed bottom-0 left-0 w-full z-50 bg-[#fdf8f3] border-t border-gray-200 px-4 py-3 flex gap-3 justify-center lg:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#a35c2d] rounded-md shadow hover:bg-[#8d4f26] transition"
            >
              Refine Results 🔍
            </button>
            <button
              onClick={() =>
                setSelectedFilters({
                  region: "",
                  country: [],
                  star: "",
                  types: [],
                  duration: [
                    Math.min(...filterOptions.durations),
                    Math.max(...filterOptions.durations),
                  ],
                })
              }
              className="flex-1 py-2.5 text-sm font-semibold text-[#a35c2d] border border-[#a35c2d] bg-white rounded-md shadow hover:bg-[#f5f3ef] transition"
            >
              Clear All
            </button>
          </div>

          <div className="fixed bottom-0 left-0 w-full z-50 bg-[#fdf8f3] border-t border-gray-200 px-4 py-3 flex gap-3 justify-center lg:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#a35c2d] rounded-md shadow hover:bg-[#8d4f26] transition"
            >
              Refine Results 🔍
            </button>
            <button
              onClick={() =>
                setSelectedFilters({
                  region: "",
                  country: [],
                  star: "",
                  types: [],
                  duration: [
                    Math.min(...filterOptions.durations),
                    Math.max(...filterOptions.durations),
                  ],
                })
              }
              className="flex-1 py-2.5 text-sm font-semibold text-[#a35c2d] border border-[#a35c2d] bg-white rounded-md shadow hover:bg-[#f5f3ef] transition"
            >
              Clear All
            </button>
          </div>

          {renderSelectedFiltersSummary()}
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
                    isFeatured={j.featuredOnHome === true}
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
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedJourney(null)}
        >
          <div
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedJourney.wetuLink ? (
              <>
                {/* Unified Header */}
                <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md relative px-4 pt-4 pb-6">
                  {/* Close Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedJourney(null)}
                      className="text-2xl font-bold text-gray-800 hover:text-black z-10"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:pr-10">
                    {/* Logo + Title/Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <img
                        src="/logos/logo-top.png"
                        alt="Fair Trade Safaris"
                        className="h-10 w-auto"
                      />
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                          {selectedJourney.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {selectedJourney.duration} •{" "}
                          {selectedJourney.region?.title}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    {selectedJourney.star && (
                      <div className="flex items-center gap-1 sm:justify-end justify-center">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={
                              selectedJourney.starIcon || "/default-star.svg"
                            }
                            alt="star"
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              i >= parseInt(selectedJourney.star || "0")
                                ? "opacity-30"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Wetu Iframe */}
                <iframe
                  src={selectedJourney.wetuLink}
                  className="w-full h-[calc(100%-80px)]"
                  style={{ border: "none" }}
                  allowFullScreen
                  loading="lazy"
                />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-600 text-lg">
                No itinerary available.
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={loadMoreRef} className="h-5 mt-12" />
    </main>
  );
}
