"use client";

// Batch 18: same single-choice region filter, shown as radio buttons instead of a
// drop-down (display only; "" still means all regions).
import React, { useId } from "react";
import { FilterOption, FilterSection } from "./FilterUI";

interface RegionFilterProps {
  regions: string[];
  selectedRegion: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export default function RegionFilter({
  regions,
  selectedRegion,
  loading,
  onChange,
}: RegionFilterProps) {
  // unique group name: the desktop panel and the phone sheet can both exist
  const groupName = `region-${useId()}`;
  return (
    <FilterSection
      title="Region"
      defaultOpen
      count={selectedRegion ? 1 : 0}
    >
      {loading ? (
        <p className="text-[13px] text-[#8a7766]">Loading regions…</p>
      ) : (
        <div className="flex flex-col" role="radiogroup" aria-label="Region">
          <FilterOption
            type="radio"
            name={groupName}
            label="All regions"
            checked={!selectedRegion}
            onChange={() => onChange("")}
          />
          {regions.map((region) => (
            <FilterOption
              key={region}
              type="radio"
              name={groupName}
              label={region}
              checked={selectedRegion === region}
              onChange={() => onChange(region)}
            />
          ))}
        </div>
      )}
    </FilterSection>
  );
}
