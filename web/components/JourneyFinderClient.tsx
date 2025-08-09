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
    region: false,
    country: false,
    star: false,
    duration: false,
    price: false,
    types: false,
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

  // Fetch option data
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"][0...1000]{
          region->{ title },
          countries[]->{ title },
          travelStyle,
          duration,
          star,
          price
        }`
      )
      .then((data: Journey[]) => {
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
          new Set(data.flatMap((j) => j.travelStyle || []))
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
    scopedPool.forEach((j) => (j.travelStyle || []).forEach((x) => s.add(x)));
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

    if (selectedFilters.star)
      groqFilters.push(`star == "${selectedFilters.star}"`);
    if (selectedFilters.types.length > 0) {
      const styleFilters = selectedFilters.types
        .map((style) => `"${style}" in travelStyle`)
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
          travelStyle, "featuredOnHome": featuredOnHome
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
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("destination");
    const star = urlParams.get("luxury");
    setSelectedFilters((prev) => ({
      ...prev,
      country: country ? [decodeURIComponent(country)] : [],
      star: star ? decodeURIComponent(star) : "",
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
    setSelectedFilters((prev) => ({ ...prev, [key]: value }) as Filters);
  };

  const clearAll = () =>
    setSelectedFilters({
      region: "",
      country: [],
      star: "",
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
          <div className="fixed bottom-0 left-0 w-full z-50 bg-[#fdf8f3] border-t border-gray-200 px-4 py-3 flex gap-3 justify-center lg:hidden">
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
                    price={
                      parsePriceNumber(j.price) <= 1
                        ? "Price on request"
                        : j.price || ""
                    }
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
                <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md relative px-4 pt-4 pb-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedJourney(null)}
                      className="text-2xl font-bold text-gray-800 hover:text-black z-10"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:pr-10">
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

                    {selectedJourney.star && (
                      <div className="flex items-center gap-1 sm:justify-end justify-center">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={
                              selectedJourney.starIcon || "/default-star.svg"
                            }
                            alt="star"
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${i >= parseInt(selectedJourney.star || "0") ? "opacity-30" : ""}`}
                          />
                        ))}
                      </div>
                    )}
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
