import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import {
  parseDurationDays,
  parsePriceNumber,
} from "@/components/journey-finder/utils";

import type { Journey, Filters } from "@/components/journey-finder/types";

export function useFilteredJourneys() {
  const searchParams = useSearchParams();

  const [visibleCount, setVisibleCount] = useState(9);
  const [filtersReady, setFiltersReady] = useState(false);
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [visibleJourneys, setVisibleJourneys] = useState<Journey[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") ?? "");

  const justClearedRef = useRef(false);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: [],
    star: [],
    types: [],
    signature: [],
    style: [],
    feature: [],
    duration: [0, 100],
    price: [0, 999999],
  });

  // ✅ Stable setter to avoid hook re-deps
  const setSelectedFiltersStable = useCallback(
    (updater: React.SetStateAction<Filters>) => {
      setSelectedFilters(updater);
    },
    []
  );

  // ✅ NEW: Toggle country logic
  const toggleCountry = (country: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      country: prev.country.includes(country)
        ? prev.country.filter((c) => c !== country)
        : [...prev.country, country],
    }));
  };

  // ✅ Fetch all journeys once
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"]{
          _id,
          title, summary, slug { current }, duration, price,
          "heroUrl": heroImage.asset->url,
          alt, ctaText, wetuLink,
          region->{ title },
          countries[]->{ title, "flag": flag.asset->url },
          star, "starIcon": starIcon.asset->url,
          "interests": travelStyleRefs[]->{title, category, isTopInterest},
          "featuredOnHome": featuredOnHome
        }`
      )
      .then((data: Journey[]) => {
        setAllJourneys(data);
      });
  }, []);

  // 🔍 Apply filters
  useEffect(() => {
    if (!filtersReady) return;

    const filtered = allJourneys.filter((j) => {
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

      const matchesRegion = selectedFilters.region
        ? j.region?.title === selectedFilters.region
        : true;

      const matchesCountry =
        selectedFilters.country.length === 0
          ? true
          : (j.countries || []).some((c) =>
              selectedFilters.country.includes(c.title)
            );

      const matchesStar =
        selectedFilters.star.length === 0 ||
        selectedFilters.star.includes(j.star || "");

      const interestTitlesByCategory = {
        signature: new Set<string>(),
        style: new Set<string>(),
        feature: new Set<string>(),
      };

      (j.interests || []).forEach((interest) => {
        const cat = interest.category?.toLowerCase();
        const title = interest.title;
        if (cat && title && cat in interestTitlesByCategory) {
          interestTitlesByCategory[
            cat as keyof typeof interestTitlesByCategory
          ].add(title);
        }
      });

      const matchesSignature = selectedFilters.signature.every((s) =>
        interestTitlesByCategory.signature.has(s)
      );
      const matchesStyle = selectedFilters.style.every((s) =>
        interestTitlesByCategory.style.has(s)
      );
      const matchesFeature = selectedFilters.feature.every((f) =>
        interestTitlesByCategory.feature.has(f)
      );

      const matchesTypes =
        selectedFilters.types.length === 0 ||
        selectedFilters.types.every((t) =>
          interestTitlesByCategory.style.has(t)
        );

      return (
        matchesSearch &&
        matchesDuration &&
        matchesPrice &&
        matchesRegion &&
        matchesCountry &&
        matchesStar &&
        matchesSignature &&
        matchesStyle &&
        matchesFeature &&
        matchesTypes
      );
    });

    setFilteredJourneys(filtered);
    setVisibleJourneys(filtered.slice(0, visibleCount));
  }, [
    searchTerm,
    filtersReady,
    visibleCount,
    allJourneys,
    selectedFilters.region,
    selectedFilters.country.join(","),
    selectedFilters.star.join(","),
    selectedFilters.types.join(","),
    selectedFilters.signature.join(","),
    selectedFilters.style.join(","),
    selectedFilters.feature.join(","),
    selectedFilters.duration[0],
    selectedFilters.duration[1],
    selectedFilters.price[0],
    selectedFilters.price[1],
  ]);

  // ✅ Update visible slice
  useEffect(() => {
    setVisibleJourneys(filteredJourneys.slice(0, visibleCount));
  }, [visibleCount, filteredJourneys]);

  return {
    visibleCount,
    setVisibleCount,
    allJourneys,
    filteredJourneys,
    visibleJourneys,
    selectedFilters,
    setSelectedFilters: setSelectedFiltersStable,
    searchTerm,
    setSearchTerm,
    filtersReady,
    setFiltersReady,
    justClearedRef,
    toggleCountry, // ✅ make sure this is returned!
  };
}
