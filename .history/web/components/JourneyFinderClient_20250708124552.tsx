"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";

// Journey type
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

// Filters
type Filters = {
  region: string;
  country: string;
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

  const searchParams = useSearchParams();
  const prefillQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(prefillQuery);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    region: "",
    country: "",
    star: "",
    types: [],
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
    return () => loadMoreRef.current && observer.unobserve(loadMoreRef.current);
  }, [loadingMore]);
  const [filterOptions, setFilterOptions] = useState({
    regions: [] as string[],
    countries: [] as string[],
    styles: [] as string[],
  });

  // Fetch data from Sanity
  useEffect(() => {
    const query = `
      *[_type == "journey"][0...${visibleCount}]{
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
        travelStyle,
        featuredOnHome
      }
    `;

    sanityClient.fetch(query).then((data: Journey[]) => {
      setAllJourneys((prev) => {
        const merged = [
          ...prev,
          ...data.filter((j) => !prev.some((p) => p.slug?.current === j.slug?.current)),
        ];
        return merged;
      });

      const regions = Array.from(new Set(data.map((j) => j.region?.title).filter(Boolean)));
      const countries = Array.from(new Set(data.map((j) => j.country?.title).filter(Boolean)));
      const styles = Array.from(new Set(data.flatMap((j) => j.travelStyle || [])));

      setFilterOptions({ regions, countries, styles });
      setLoadingMore(false);
    });
  }, [visibleCount]);

  // Filter on search + filters
  useEffect(() => {
    const filtered = allJourneys.filter((j) => {
      const text = `${j.title} ${j.summary}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());
      const matchesRegion = !selectedFilters.region || j.region?.title === selectedFilters.region;
      const matchesCountry = !selectedFilters.country || j.country?.title === selectedFilters.country;
      const matchesStar = !selectedFilters.star || j.star === selectedFilters.star;
      const matchesType =
        selectedFilters.types.length === 0 || selectedFilters.types.some((t) => j.travelStyle?.includes(t));

      return matchesSearch && matchesRegion && matchesCountry && matchesStar && matchesType;
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
