"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";

// NEW
import FiltersPanel from "./journey-finder/FiltersPanel";
import CountryDrawer from "./journey-finder/CountryDrawer";

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
  const [filtersReady, setFiltersReady] = useState(false);
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [drawerState, setDrawerState] = useState<{
    open: boolean;
    journey: Journey | null;
    destination?: any; // or a proper Destination type if defined
  }>({ open: false, journey: null });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  useEffect(() => {
    if (!filtersReady) return;

    const qParam = searchParams.get("q");

    if (justClearedRef.current) {
      justClearedRef.current = false; // skip once
      return;
    }

    if (qParam) {
      setSearchTerm(qParam);
    }
  }, [filtersReady, searchParams]);
  const justClearedRef = useRef(false); // 👈 Add this here
  const [collapsed, setCollapsed] = useState({
    region: true,
    country: true,
    star: true,
    duration: true,
    price: true,
    types: true,
    signature: true,
    style: true,
    feature: true,
  });

  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  useEffect(() => {
    const isModalOpen = selectedJourney !== null || drawerState.open;
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [selectedJourney, drawerState.open]);

  useEffect(() => {
    const openHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const q = detail?.q;
      if (q) return; // 🔒 If a search term exists, it means `typeSearch` — skip opening filters
      setIsSearchSheetOpen(true);
    };

    const closeHandler = () => setIsSearchSheetOpen(false);

    window.addEventListener("fts:open-search-sheet", openHandler);
    window.addEventListener("fts:close-search-sheet", closeHandler);

    return () => {
      window.removeEventListener("fts:open-search-sheet", openHandler);
      window.removeEventListener("fts:close-search-sheet", closeHandler);
    };
  }, []);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    countries: [],
    signature: [], // ✅ add this
    style: [],
    feature: [], // ✅ add this
    stars: [],
    durations: [],
    prices: [],
  });
  const [optionsJourneys, setOptionsJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: [],
    star: [],
    signature: [],
    style: [],
    feature: [],
    types: [], // ✅ Add this line
    duration: [0, 100],
    price: [0, 999999],
  });

  const journeysTopRef = useRef<HTMLDivElement | null>(null);
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
    region->{ title },
    countries[]->{
      title,
      "flag": flag.asset->url,
      travelInfo,
      highlights,
      practicalStuff,
      mapLocation
    },
    star, "starIcon": starIcon.asset->url,
    "interests": travelStyleRefs[]->{title, category, isTopInterest},
    "featuredOnHome": featuredOnHome
  }`
      )

      .then((data: Journey[]) => {
        console.log("📦 Fetched visible journeys:", data);

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
    "interests": travelStyleRefs[]->{ title, category },
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

        const signatureSet = new Set<string>();
        const styleSet = new Set<string>();
        const featureSet = new Set<string>();

        data.forEach((j) => {
          console.log("🔬 Interest categories for:", j.title, j.interests);
          (j.interests || []).forEach(
            (interest: { title?: string; category?: string }) => {
              if (!interest?.title || !interest?.category) return;
              const normalizedCategory = {
                signature: "Signature Safari Experience",
                style: "Travel Style",
                feature: "Trip Feature",
              }[interest.category?.toLowerCase() || ""];

              switch (normalizedCategory) {
                case "Signature Safari Experience":
                  signatureSet.add(interest.title);
                  break;
                case "Travel Style":
                  styleSet.add(interest.title);
                  break;
                case "Trip Feature":
                  featureSet.add(interest.title);
                  break;
              }
            }
          );
        });

        const signature = Array.from(signatureSet).sort();
        const style = Array.from(styleSet).sort();
        const feature = Array.from(featureSet).sort();

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
          signature,
          style,
          feature,
          stars,
          durations: durationNumbers,
          prices: priceNumbers,
        });
        console.log("🧪 Parsed filter options:", {
          style,
          stars,
          filterOptionsAfterSet: filterOptions,
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

  const availableSignature = useMemo(() => {
    const s = new Set<string>();
    scopedPool.forEach((j) =>
      (j.interests || []).forEach(
        (interest: { title?: string; category?: string }) => {
          const normalizedCategory = {
            signature: "Signature Safari Experience",
            style: "Travel Style",
            feature: "Trip Feature",
          }[interest.category?.toLowerCase() || ""];

          if (
            normalizedCategory === "Signature Safari Experience" &&
            interest.title
          ) {
            s.add(interest.title);
          }
        }
      )
    );
    return Array.from(s).sort();
  }, [scopedPool]);

  const availableStyle = useMemo(() => {
    const s = new Set<string>();
    scopedPool.forEach((j) =>
      (j.interests || []).forEach(
        (interest: { title?: string; category?: string }) => {
          const normalizedCategory = {
            signature: "Signature Safari Experience",
            style: "Travel Style",
            feature: "Trip Feature",
          }[interest.category?.toLowerCase() || ""];

          if (normalizedCategory === "Travel Style" && interest.title) {
            s.add(interest.title);
          }
        }
      )
    );
    return Array.from(s).sort();
  }, [scopedPool]);

  const availableFeature = useMemo(() => {
    const s = new Set<string>();
    scopedPool.forEach((j) =>
      (j.interests || []).forEach(
        (interest: { title?: string; category?: string }) => {
          const normalizedCategory = {
            signature: "Signature Safari Experience",
            style: "Travel Style",
            feature: "Trip Feature",
          }[interest.category?.toLowerCase() || ""];

          if (normalizedCategory === "Trip Feature" && interest.title) {
            s.add(interest.title);
          }
        }
      )
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
      const nextTypes = prev.types.filter((t) => availableStyle.includes(t));
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
    availableStyle,
    availableDurationRange,
    availablePriceRange,
  ]);

  // Clamp after availability changes
  useEffect(() => {
    if (selectedFilters.types.length) {
      const pruned = selectedFilters.types.filter((t) =>
        availableStyle.includes(t)
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
  }, [availableStyle, availableDurationRange, availablePriceRange]);

  // Refresh dependents after country changes
  useEffect(() => {
    setSelectedFilters((prev) => {
      const nextTypes = prev.types.filter((t) => availableStyle.includes(t));
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
    if (!filtersReady) return;

    const groqFilters: string[] = [];
    if (selectedFilters.region)
      groqFilters.push(`region->title == "${selectedFilters.region}"`);
    if (selectedFilters.country.length > 0)
      groqFilters.push(
        `count(countries[@->title in ${JSON.stringify(selectedFilters.country)}]) > 0`
      );

    if (selectedFilters.star.length > 0)
      groqFilters.push(`star in ${JSON.stringify(selectedFilters.star)}`);

    const interestFilters = ["signature", "style", "feature"].flatMap((key) =>
      (selectedFilters[key as keyof Filters] as string[]).map(
        (val) => `"${val}" in travelStyleRefs[]->title`
      )
    );

    if (interestFilters.length > 0) {
      groqFilters.push(`(${interestFilters.join(" || ")})`);
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
        "interests": travelStyleRefs[]->{title, category, isTopInterest},
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
        console.log("🔍 Filtering breakdown:");
        console.log("Search term:", searchTerm);
        console.log("Duration filter:", selectedFilters.duration);
        console.log("Price filter:", selectedFilters.price);
        console.log("Filtered result count:", filtered.length);
        console.log("All fetched items:", data);

        setAllJourneys(data);
      });
  }, [searchTerm, selectedFilters, filtersReady]);

  // URL params → filters (once options ready)
  // ✅ URL params → filters (only once after filterOptions are ready)

  useEffect(() => {
    if (filtersReady) return;

    // Wait until all relevant filterOptions are populated
    if (
      filterOptions.signature.length === 0 &&
      filterOptions.style.length === 0 &&
      filterOptions.feature.length === 0 &&
      filterOptions.stars.length === 0
    ) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const interestParams = urlParams.getAll("interest").map(decodeURIComponent);
    const luxuryParams = urlParams.getAll("luxury").map(decodeURIComponent);
    const openParam = urlParams.get("open");

    const interestToFilterMap: Partial<Filters> = {
      signature: [],
      style: [],
      feature: [],
    };

    interestParams.forEach((val) => {
      if (filterOptions.signature.includes(val)) {
        interestToFilterMap.signature!.push(val);
      } else if (filterOptions.style.includes(val)) {
        interestToFilterMap.style!.push(val);
      } else if (filterOptions.feature.includes(val)) {
        interestToFilterMap.feature!.push(val);
      }
    });

    const validStars = luxuryParams.filter((val) =>
      filterOptions.stars.includes(val)
    );

    setSelectedFilters((prev) => ({
      ...prev,
      ...interestToFilterMap,
      star: validStars,
    }));

    const queryParam = urlParams.get("q");

    // ✅ Only open drawer if no search term is present
    if (openParam === "true" && !queryParam) {
      window.dispatchEvent(new CustomEvent("fts:open-search-sheet"));
    }

    console.log("✅ Filters applied from URL:", {
      signature: interestToFilterMap.signature,
      style: interestToFilterMap.style,
      feature: interestToFilterMap.feature,
      stars: validStars,
    });

    setFiltersReady(true);
  }, [
    filterOptions.signature,
    filterOptions.style,
    filterOptions.feature,
    filterOptions.stars,
    filtersReady,
  ]);

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

  const toggleSignature = (value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      signature: prev.signature.includes(value)
        ? prev.signature.filter((s) => s !== value)
        : [...prev.signature, value],
    }));
  };

  const clearAll = () => {
    justClearedRef.current = true;

    const newFilters: Filters = {
      region: "",
      country: [],
      star: [],
      types: [],
      signature: [],
      style: [],
      feature: [],
      duration: globalDurationRange,
      price: globalPriceRange,
    };

    setSelectedFilters(newFilters);
    setSearchTerm("");

    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("open");
    window.history.replaceState({}, "", url.pathname);

    // Reset the filter cycle
    setFiltersReady(false);
    setTimeout(() => setFiltersReady(true), 0);
  };

  const toggleStyle = (value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      style: prev.style.includes(value)
        ? prev.style.filter((s) => s !== value)
        : [...prev.style, value],
    }));
  };
  const handleShowResultsAndScroll = () => {
    setShowMobileFilters(false);
    setTimeout(() => {
      journeysTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const toggleFeature = (value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      feature: prev.feature.includes(value)
        ? prev.feature.filter((f) => f !== value)
        : [...prev.feature, value],
    }));
  };

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

  if (!allJourneys.length && !filterOptions.regions.length) {
    console.log("⛔ No journeys or filters loaded yet.");
    return (
      <div style={{ padding: "2rem", color: "#444" }}>Loading journeys...</div>
    );
  }

  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-[85vw] max-w-sm bg-[#fdf8f3] h-full pt-[72px] px-5 pb-5 overflow-y-auto relative border-l border-gray-200 shadow-xl">
            <button
              onClick={handleShowResultsAndScroll}
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
              availableSignature={availableSignature}
              availableStyle={availableStyle}
              availableFeature={availableFeature}
              availableDurationRange={availableDurationRange}
              availablePriceRange={availablePriceRange}
              priceFilterEnabled={priceFilterEnabled}
              selectedFilters={selectedFilters}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              onToggleCountry={toggleCountry}
              onSetSimpleFilter={setSimpleFilter}
              onToggleStar={toggleStar}
              onToggleSignature={toggleSignature}
              onToggleStyle={toggleStyle}
              onToggleFeature={toggleFeature}
              onToggleType={toggleType}
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
            availableSignature={availableSignature}
            availableStyle={availableStyle}
            availableFeature={availableFeature}
            availableDurationRange={availableDurationRange}
            availablePriceRange={availablePriceRange}
            priceFilterEnabled={priceFilterEnabled}
            selectedFilters={selectedFilters}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onToggleCountry={toggleCountry}
            onSetSimpleFilter={setSimpleFilter}
            onToggleStar={toggleStar}
            onToggleSignature={toggleSignature}
            onToggleStyle={toggleStyle}
            onToggleFeature={toggleFeature}
            onToggleType={toggleType}
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
          {!showMobileFilters && !isSearchSheetOpen && (
            <div className="sticky top-[56px] z-[30] bg-[#fdf8f3]/95 backdrop-blur border-b border-gray-200 px-4 py-2 flex gap-3 justify-center lg:hidden">
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

          <div ref={journeysTopRef} />
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
          className="fixed inset-0 z-[99999] bg-black/60 flex justify-end items-start"
          onClick={() => setSelectedJourney(null)}
        >
          <div
            className="relative w-full h-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white shadow-2xl z-[100000] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedJourney.wetuLink ? (
              <>
                <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md px-4 py-3 z-[100001]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-1">
                      <div className="flex items-center justify-center sm:justify-start">
                        <img
                          src="/logos/logo-top.png"
                          alt="Fair Trade Safaris"
                          className="h-7 sm:h-8 w-auto mx-auto sm:mx-0"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 mt-2 sm:mt-0">
                          {selectedJourney.title}
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start items-center text-sm text-gray-600 gap-2 mt-0.5">
                          <span>
                            {selectedJourney.duration} •{" "}
                            {selectedJourney.region?.title}
                          </span>
                          {selectedJourney.star && (
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <img
                                  key={i}
                                  src={
                                    selectedJourney.starIcon ||
                                    "/default-star.svg"
                                  }
                                  alt="star"
                                  className={`w-4 h-4 ${
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
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            "https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris",
                            "_blank"
                          )
                        }
                        className="px-3 py-1.5 text-xs bg-[#a35c2d] text-white font-semibold rounded shadow hover:bg-[#8d4f26] transition"
                      >
                        Start Planning
                      </button>

                      <button
                        onClick={async () => {
                          if (!selectedJourney?.countries?.[0]?.title) return;

                          const countryTitle =
                            selectedJourney.countries[0].title;

                          const destination = await sanityClient.fetch(
                            `*[_type == "destination" && title == $title][0]{
        title,
        travelInfo,
        highlights,
        practicalStuff,
        mapLocation,
        "flag": flagImage.asset->url
      }`,
                            { title: countryTitle }
                          );

                          if (!destination) {
                            console.warn(
                              "❌ No destination found for:",
                              countryTitle
                            );
                            return;
                          }

                          setDrawerState({
                            open: true,
                            journey: selectedJourney,
                            destination,
                          });
                        }}
                        className="px-3 py-1.5 text-xs border border-[#a35c2d] text-[#a35c2d] font-semibold rounded shadow hover:bg-[#f5f3ef] transition"
                      >
                        About This Country
                      </button>

                      <button
                        onClick={() => setSelectedJourney(null)}
                        className="absolute top-2 right-3 sm:static text-lg font-bold text-gray-800 hover:text-black"
                        aria-label="Close"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>

                <iframe
                  src={selectedJourney.wetuLink}
                  className="flex-grow w-full border-none"
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

      {drawerState.open && drawerState.destination && (
        <CountryDrawer
          destination={drawerState.destination}
          onClose={() => setDrawerState({ open: false, journey: null })}
        />
      )}
    </main>
  );
}
