"use client";

import { useState } from "react";
import { FilterOption, FilterSection, ShowMoreButton } from "./FilterUI";

type CountryOption = {
  title: string;
  ranking?: number;
};

type Props = {
  countries: CountryOption[];
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
  onClear: () => void;
  loading: boolean;
};

// Batch 18: restyled as large checkboxes (same options, order and "show more" at 6).
export default function CountryFilter({
  countries,
  selectedCountries,
  onToggleCountry,
  onClear,
  loading,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const sortedCountries = [...countries].sort((a, b) => {
    const aRank = a.ranking ?? 999;
    const bRank = b.ranking ?? 999;
    return aRank - bRank;
  });

  const visibleCountries = showAll
    ? sortedCountries
    : sortedCountries.slice(0, 6);

  return (
    <FilterSection
      title="Countries"
      defaultOpen
      count={selectedCountries.length}
      onClear={onClear}
    >
      {loading ? (
        <p className="text-[13px] text-[#8a7766]">Loading countries…</p>
      ) : countries.length === 0 ? (
        <p className="text-[13px] text-[#8a7766]">No countries found</p>
      ) : (
        <>
          <div className="flex flex-col">
            {visibleCountries.map((c) => (
              <FilterOption
                key={c.title}
                label={c.title}
                checked={selectedCountries.includes(c.title)}
                onChange={() => onToggleCountry(c.title)}
              />
            ))}
          </div>

          {sortedCountries.length > 6 && (
            <ShowMoreButton
              open={showAll}
              hidden={sortedCountries.length - 6}
              onClick={() => setShowAll((v) => !v)}
            />
          )}
        </>
      )}
    </FilterSection>
  );
}
