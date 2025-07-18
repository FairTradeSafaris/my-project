"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";

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
};

type FilterKey = keyof Filters;

export default function JourneyFinderClient() {
  const [visibleCount, setVisibleCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    useSearchParams().get("q") || ""
  );
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: [],
    star: "",
    types: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [] as string[],
    countries: [] as string[],
    styles: [] as string[],
  });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        setLoadingMore(true);
        setVisibleCount((prev) => prev + 9);
      }
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadingMore]);

  const loadMoreJourneys = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 9);
      setLoadingMore(false);
    }, 500);
  };

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

        const regions = Array.from(
          new Set(data.map((j) => j.region?.title).filter(Boolean))
        ) as string[];
        const countries = Array.from(
          new Set(data.map((j) => j.country?.title).filter(Boolean))
        ) as string[];
        const styles = Array.from(
          new Set(data.flatMap((j) => j.travelStyle || []))
        );

        setFilterOptions({ regions, countries, styles });

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

        setLoadingMore(false);
      })
      .catch((err) => {
        console.error("Error fetching journeys:", err);
        setLoadingMore(false);
      });
  }, [visibleCount]);

  useEffect(() => {
    const filtered = allJourneys.filter((j) => {
      const text = `${j.title} ${j.summary}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());
      const matchesRegion =
        !selectedFilters.region || j.region?.title === selectedFilters.region;
      const matchesCountry =
        selectedFilters.country.length === 0 ||
        selectedFilters.country.includes(j.country?.title || "");
      const matchesStar =
        !selectedFilters.star || j.star === selectedFilters.star;
      const matchesType =
        selectedFilters.types.length === 0 ||
        selectedFilters.types.some((type) => j.travelStyle?.includes(type));
      return (
        matchesSearch &&
        matchesRegion &&
        matchesCountry &&
        matchesStar &&
        matchesType
      );
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

  const toggleCountry = (country: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      country: prev.country.includes(country)
        ? prev.country.filter((c) => c !== country)
        : [...prev.country, country],
    }));
  };

  const renderFilterGroups = () => {
    const groups = [
      { label: "Regions", items: filterOptions.regions, filterKey: "region" },
      {
        label: "Countries",
        items: filterOptions.countries,
        filterKey: "country",
        multi: true,
      },
      {
        label: "Travel Style",
        items: filterOptions.styles,
        filterKey: "types",
        multi: true,
      },
    ];

    return groups.map((group) => (
      <div key={group.label} className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">
          {group.label}
        </h3>
        <div className="flex flex-wrap gap-2">
          {group.items.map((item) => {
            const isActive =
              group.filterKey === "country"
                ? selectedFilters.country.includes(item)
                : group.multi
                  ? selectedFilters.types.includes(item)
                  : selectedFilters[group.filterKey as FilterKey] === item;

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
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    ));
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

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden">
          <div className="w-[85vw] bg-white h-full p-6 overflow-y-auto relative">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Filter your adventure
            </h2>
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

      {/* Mobile Button */}
      <div className="lg:hidden p-4 flex justify-end">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#a35c2d] text-white rounded-md font-medium"
        >
          Refine Results <span className="text-xl">🔍</span>
        </button>
      </div>

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

          {allJourneys.length >= visibleCount && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreJourneys}
                disabled={loadingMore}
                className="px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
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

      <div ref={loadMoreRef} />
    </main>
  );
}
