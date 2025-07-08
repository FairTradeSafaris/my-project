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

      {/* Filters & Grid */}
      <section className="relative flex">
        {/* Sidebar Filters */}
        <aside className="w-72 p-6 border-r bg-[#f5f3ef] hidden lg:block relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-md font-semibold text-gray-800">Filters</h2>
            <button
              onClick={() =>
                setSelectedFilters({ region: "", country: "", star: "", types: [] })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {[
            { label: "Regions", items: filterOptions.regions, filterKey: "region" },
            { label: "Countries", items: filterOptions.countries, filterKey: "country" },
            { label: "Travel Style", items: filterOptions.styles, filterKey: "types", multi: true },
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
