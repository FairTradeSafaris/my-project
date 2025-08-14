"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";

// NEW
import FiltersPanel from "./journey-finder/FiltersPanel";

import {
  Journey,
  Filters,
  FilterOptions,
  FilterKey,
} from "./journey-finder/types";
import {
  parseDurationDays,
  parsePriceNumber,
  clampRange,
} from "./journey-finder/utils";

export default function JourneyFinderClient() {
  const [visibleCount, setVisibleCount] = useState(9);
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [collapsed, setCollapsed] = useState({
    region: true,
    country: true,
    star: true,
    duration: true,
    price: true,
    types: true,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    countries: [],
    styles: [],
    stars: [],
    durations: [],
    prices: [],
  });

  const [optionsJourneys, setOptionsJourneys] = useState<Journey[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: [],
    star:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
            .getAll("luxury")
            .map(decodeURIComponent)
        : [],

    types:
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("interest")
        ? [
            decodeURIComponent(
              new URLSearchParams(window.location.search).get("interest")!
            ),
          ]
        : [],
    duration: [0, 100],
    price: [0, 999999],
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite loader
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) setVisibleCount((prev) => prev + 9);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Fetch visible journeys
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
      region->{ title }, countries[]->{ title, "flag": flag.asset->url },
      star, "starIcon": starIcon.asset->url,
      "interests": travelStyleRefs[]->title,
      "featuredOnHome": featuredOnHome
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

  // Fetch option data
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"][0...1000]{
      region->{ title },
      countries[]->{ title },
      "interests": travelStyleRefs[]->title,
      duration,
      star,
      price
    }`
      )

      .then((data: Journey[]) => {
        console.log(
          "🧠 Journey interests in options fetch:",
          data.map((j) => j.interests)
        );
        setOptionsJourneys(data);

        const regions = Array.from(
          new Set(data.map((j) => j.region?.title).filter(Boolean))
        ) as string[];
        const countries = Array.from(
          new Set(
            data
              .flatMap((j) => (j.countries || []).map((c) => c.title))
              .filter(Boolean)
          )
        ) as string[];

        const styles = Array.from(
          new Set(data.flatMap((j) => j.interests || []))
        );

        const stars = Array.from(
          new Set(
            data
              .map((j) => j.star)
              .filter((s): s is string => typeof s === "string")
          )
        );

        const durationNumbers = data
          .map((j) => parseDurationDays(j.duration))
          .filter((n) => Number.isFinite(n) && n > 0);

        const priceNumbers = data
          .map((j) => parsePriceNumber(j.price))
          .filter((n) => Number.isFinite(n) && n > 1);

        const minD = durationNumbers.length ? Math.min(...durationNumbers) : 0;
        const maxD = durationNumbers.length ? Math.max(...durationNumbers) : 0;
        const minP = priceNumbers.length ? Math.min(...priceNumbers) : 0;
        const maxP = priceNumbers.length ? Math.max(...priceNumbers) : 0;

        setFilterOptions({
          regions,
          countries,
          styles,
          stars,
          durations: durationNumbers,
          prices: priceNumbers,
        });

        setSelectedFilters((prev) => ({
          ...prev,
          duration: [minD, maxD],
          price: [minP, maxP],
        }));
      });
  }, []);

  // Pool after region/country
  const scopedPool = useMemo(() => {
    return optionsJourneys.filter((j) => {
      const inRegion = selectedFilters.region
        ? j.region?.title === selectedFilters.region
        : true;
      if (!inRegion) return false;

      if (selectedFilters.country.length === 0) return true;

      const jc = new Set((j.countries || []).map((c) => c.title));
      return selectedFilters.country.some((c) => jc.has(c));
    });
  }, [optionsJourneys, selectedFilters.region, selectedFilters.country]);

  const availableCountries = useMemo(() => {
    const pool = selectedFilters.region
      ? optionsJourneys.filter(
          (j) => j.region?.title === selectedFilters.region
        )
      : optionsJourneys;

    const cs = Array.from(
      new Set(
        pool
          .flatMap((j) => (j.countries || []).map((c) => c.title))
          .filter(Boolean)
      )
    ) as string[];

    return cs.sort();
  }, [optionsJourneys, selectedFilters.region]);

  const availableStyles = useMemo(() => {
    const s = new Set<string>();
    scopedPool.forEach((j) =>
      (j.interests || []).forEach((interest) => s.add(interest))
    );
    return Array.from(s).sort();
  }, [scopedPool]);

  const availableDurationRange = useMemo<[number, number]>(() => {
    const ds = scopedPool
      .map((j) => parseDurationDays(j.duration))
      .filter((n) => n > 0);
    if (!ds.length) return [0, 0];
    return [Math.min(...ds), Math.max(...ds)];
  }, [scopedPool]);

  const availablePriceRange = useMemo<[number, number]>(() => {
    const ps = scopedPool
      .map((j) => parsePriceNumber(j.price))
      .filter((n) => n > 1);
    if (!ps.length) return [0, 0];
    return [Math.min(...ps), Math.max(...ps)];
  }, [scopedPool]);

  const priceFilterEnabled = useMemo(
    () => availablePriceRange[0] > 0 && availablePriceRange[1] > 0,
    [availablePriceRange]
  );

  // React to REGION changes
  useEffect(() => {
    setSelectedFilters((prev) => {
      const nextCountries = prev.country.filter((c) =>
        availableCountries.includes(c)
      );
      const nextTypes = prev.types.filter((t) => availableStyles.includes(t));
      const nextDuration = availableDurationRange as [number, number];
      const nextPrice = availablePriceRange as [number, number];

      const arrEq = (a: string[], b: string[]) =>
        a.length === b.length && a.every((x, i) => x === b[i]);
      const tupEq = (a: [number, number], b: [number, number]) =>
        a[0] === b[0] && a[1] === b[1];

      const changed =
        !arrEq(prev.country, nextCountries) ||
        !arrEq(prev.types, nextTypes) ||
        !tupEq(prev.duration, nextDuration) ||
        !tupEq(prev.price, nextPrice);

      if (!changed) return prev;
      return {
        ...prev,
        country: nextCountries,
        types: nextTypes,
        duration: nextDuration,
        price: nextPrice,
      };
    });
  }, [
    selectedFilters.region,
    availableCountries,
    availableStyles,
    availableDurationRange,
    availablePriceRange,
  ]);

  // Clamp after availability changes
  useEffect(() => {
    if (selectedFilters.types.length) {
      const pruned = selectedFilters.types.filter((t) =>
        availableStyles.includes(t)
      );
      if (pruned.length !== selectedFilters.types.length) {
        setSelectedFilters((prev) => ({ ...prev, types: pruned }));
      }
    }

    const nextDuration: [number, number] = clampRange(
      selectedFilters.duration,
      availableDurationRange
    );
    if (
      nextDuration[0] !== selectedFilters.duration[0] ||
      nextDuration[1] !== selectedFilters.duration[1]
    ) {
      setSelectedFilters((prev) => ({ ...prev, duration: nextDuration }));
    }

    const nextPrice: [number, number] = clampRange(
      selectedFilters.price,
      availablePriceRange
    );
    if (
      nextPrice[0] !== selectedFilters.price[0] ||
      nextPrice[1] !== selectedFilters.price[1]
    ) {
      setSelectedFilters((prev) => ({ ...prev, price: nextPrice }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableStyles, availableDurationRange, availablePriceRange]);

  // Refresh dependents after country changes
  useEffect(() => {
    setSelectedFilters((prev) => {
      const nextTypes = prev.types.filter((t) => availableStyles.includes(t));
      const nextDuration = availableDurationRange;
      const nextPrice = availablePriceRange;
      return {
        ...prev,
        types: nextTypes,
        duration: nextDuration,
        price: nextPrice,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.country]);

  // Fetch + client filter
  useEffect(() => {
    const groqFilters: string[] = [];
    if (selectedFilters.region)
      groqFilters.push(`region->title == "${selectedFilters.region}"`);
    if (selectedFilters.country.length > 0)
      groqFilters.push(
        `count(countries[@->title in ${JSON.stringify(selectedFilters.country)}]) > 0`
      );

    if (selectedFilters.star.length > 0)
      groqFilters.push(`star in ${JSON.stringify(selectedFilters.star)}`);

    if (selectedFilters.types.length > 0) {
      const styleFilters = selectedFilters.types
        .map((style) => `"${style}" in travelStyleRefs[]->title`)
        .join(" || ");
      groqFilters.push(`(${styleFilters})`);
    }

    const groqWhere =
      groqFilters.length > 0
        ? `*[_type == "journey" && ${groqFilters.join(" && ")}]`
        : `*[_type == "journey"]`;

    sanityClient
      .fetch(
        `${groqWhere}{
      title, summary, slug, duration, price,
      "heroUrl": heroImage.asset->url,
      alt, ctaText, wetuLink,
      region->{ title }, countries[]->{ title, "flag": flag.asset->url },
      star, "starIcon": starIcon.asset->url,
      "interests": travelStyleRefs[]->title,
      "featuredOnHome": featuredOnHome
    }`
      )

      .then((data: Journey[]) => {
        const filtered = data.filter((j) => {
          const text = `${j.title} ${j.summary}`.toLowerCase();
          const matchesSearch = text.includes(searchTerm.toLowerCase());
          const journeyDuration = parseDurationDays(j.duration);
          const priceValue = parsePriceNumber(j.price);

          const matchesDuration =
            journeyDuration >= selectedFilters.duration[0] &&
            journeyDuration <= selectedFilters.duration[1];

          const matchesPrice =
            priceValue <= 1 ||
            (priceValue >= selectedFilters.price[0] &&
              priceValue <= selectedFilters.price[1]);

          return matchesSearch && matchesDuration && matchesPrice;
        });
        setFilteredJourneys(filtered);
        setAllJourneys(data);
      });
  }, [searchTerm, selectedFilters]);

  // URL params → filters (once options ready)
  useEffect(() => {
    if (
      filterOptions.countries.length === 0 &&
      filterOptions.stars.length === 0
    )
      return;

    const urlParams = new URLSearchParams(window.location.search); // ✅ Declare it here

    const interestParams = urlParams.getAll("interest").map(decodeURIComponent);
    const starParams = urlParams.getAll("luxury").map(decodeURIComponent);

    setSelectedFilters((prev) => ({
      ...prev,
      types: interestParams,
      star: starParams,
    }));
  }, [filterOptions]);

  const globalDurationRange = React.useMemo<[number, number]>(() => {
    const ds = filterOptions.durations.filter((n) => n > 0);
    if (!ds.length) return [0, 0];
    return [Math.min(...ds), Math.max(...ds)];
  }, [filterOptions.durations]);

  const globalPriceRange = React.useMemo<[number, number]>(() => {
    const ps = filterOptions.prices.filter((n) => n > 1);
    if (!ps.length) return [0, 0];
    return [Math.min(...ps), Math.max(...ps)];
  }, [filterOptions.prices]);

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

  const setSimpleFilter = (
    key: Extract<FilterKey, "region" | "star">,
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleStar = (value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      star: prev.star.includes(value)
        ? prev.star.filter((s) => s !== value)
        : [...prev.star, value],
    }));
  };

  const clearAll = () =>
    setSelectedFilters({
      region: "",
      country: [],
      star: [],
      types: [],
      duration: globalDurationRange,
      price: globalPriceRange,
    });

  const renderSelectedFiltersSummary = () => {
    const countryText = selectedFilters.country.join(", ");
    const typeText = selectedFilters.types.join(", ");
    const regionText = selectedFilters.region;
    const parts: string[] = [];
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

  if (!allJourneys.length && !filterOptions.regions.length) return null;

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-[85vw] max-w-sm bg-[#fdf8f3] h-full pt-[72px] px-5 pb-5 overflow-y-auto relative border-l border-gray-200 shadow-xl">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2.5 mb-4 bg-[#a35c2d] text-white text-sm font-semibold rounded-md shadow hover:bg-[#8d4f26] transition"
            >
              Show Results & Close
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Filter your adventure
              </h2>
              <button
                onClick={clearAll}
                className="text-sm text-[#a35c2d] hover:underline"
              >
                Clear All
              </button>
            </div>

            <FiltersPanel
              filterOptions={filterOptions}
              availableCountries={availableCountries}
              availableStyles={availableStyles}
              availableDurationRange={availableDurationRange}
              availablePriceRange={availablePriceRange}
              priceFilterEnabled={priceFilterEnabled}
              selectedFilters={selectedFilters}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              onToggleType={toggleType}
              onToggleCountry={toggleCountry}
              onSetSimpleFilter={setSimpleFilter}
              onToggleStar={toggleStar}
              onDurationChange={(r) =>
                setSelectedFilters((p) => ({ ...p, duration: r }))
              }
              onPriceChange={(r) =>
                setSelectedFilters((p) => ({ ...p, price: r }))
              }
            />

            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full py-3 bg黑 text-white rounded-md"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Hero */}

      {/* Layout */}
      <section className="relative flex">
        {/* Sidebar */}
        <aside className="w-72 p-6 border-r bg-[#f5f3ef] hidden lg:block relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-800">Filters</h2>
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <FiltersPanel
            filterOptions={filterOptions}
            availableCountries={availableCountries}
            availableStyles={availableStyles}
            availableDurationRange={availableDurationRange}
            availablePriceRange={availablePriceRange}
            priceFilterEnabled={priceFilterEnabled}
            selectedFilters={selectedFilters}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onToggleType={toggleType}
            onToggleCountry={toggleCountry}
            onSetSimpleFilter={setSimpleFilter}
            onToggleStar={toggleStar}
            onDurationChange={(r) =>
              setSelectedFilters((p) => ({ ...p, duration: r }))
            }
            onPriceChange={(r) =>
              setSelectedFilters((p) => ({ ...p, price: r }))
            }
          />
        </aside>

        {/* Main content */}
        <section className="flex-1 p-6 lg:ml-12">
          {/* Sticky Mobile Filter Buttons */}
          {/* Sticky Mobile Filter Bar (top, under navbar) */}
          {!showMobileFilters && (
            <div className="sticky top-[56px] z-[9998] bg-[#fdf8f3]/95 backdrop-blur border-b border-gray-200 px-4 py-2 flex gap-3 justify-center lg:hidden">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#a35c2d] rounded-md shadow hover:bg-[#8d4f26] transition"
              >
                Refine Results 🔍
              </button>
              <button
                onClick={clearAll}
                className="flex-1 py-2.5 text-sm font-semibold text-[#a35c2d] border border-[#a35c2d] bg-white rounded-md shadow hover:bg-[#f5f3ef] transition"
              >
                Clear All
              </button>
            </div>
          )}

          {renderSelectedFiltersSummary()}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.length > 0 ? (
              filteredJourneys.map((j, index) => (
                <JourneyCard
                  key={j.slug?.current || index}
                  title={j.title}
                  summary={j.summary}
                  imageUrl={j.heroUrl || ""}
                  alt={j.alt || j.title}
                  duration={j.duration || ""}
                  price={
                    parsePriceNumber(j.price) <= 1
                      ? "Price on request"
                      : j.price || ""
                  }
                  star={j.star ? parseInt(j.star) : 0}
                  starIcon={j.starIcon}
                  region={j.region?.title || ""}
                  isFeatured={j.featuredOnHome === true}
                  // ✅ This enables View Itinerary from the card
                  onViewItinerary={() => setSelectedJourney(j)}
                />
              ))
            ) : (
              <p className="text-gray-600">No journeys found.</p>
            )}
          </div>
        </section>
      </section>

      {/* Modal */}
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
                <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md relative px-4 pt-4 pb-4">
                  {/* Top Row: Logo & Close */}
                  <div className="flex justify-between items-start mb-4">
                    <img
                      src="/logos/logo-top.png"
                      alt="Fair Trade Safaris"
                      className="h-8 sm:h-10 w-auto"
                    />
                    <button
                      onClick={() => setSelectedJourney(null)}
                      className="text-2xl font-bold text-gray-800 hover:text-black"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Journey Info & Rating */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        {selectedJourney.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedJourney.duration} •{" "}
                        {selectedJourney.region?.title}
                      </p>
                    </div>

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

                  {/* CTA Button */}
                  <div className="mt-4 sm:mt-3">
                    <button
                      onClick={() =>
                        window.open(
                          "https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris",
                          "_blank"
                        )
                      }
                      className="w-full sm:w-auto px-4 py-2 bg-[#a35c2d] text-white text-sm font-semibold rounded-md shadow hover:bg-[#8d4f26] transition"
                    >
                      Start Planning Your Journey →
                    </button>
                  </div>
                </div>

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
