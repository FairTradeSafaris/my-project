"use client";

import { useState } from "react";

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
    <div className="mb-6 max-w-xs">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Countries
        </label>

        {selectedCountries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-gray-500">Loading countries…</p>
      ) : countries.length === 0 ? (
        <p className="text-xs text-gray-500">No countries found</p>
      ) : (
        <>
          <div className="space-y-2">
            {visibleCountries.map((c) => (
              <label
                key={c.title}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="form-checkbox text-[#a35c2d]"
                  checked={selectedCountries.includes(c.title)}
                  onChange={() => onToggleCountry(c.title)}
                />
                <span>{c.title}</span>
              </label>
            ))}
          </div>

          {sortedCountries.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
