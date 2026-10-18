"use client";

import React from "react";
import { FilterOption, FilterSection } from "./FilterUI";

interface StarFilterProps {
  selectedStars: number[];
  availableStars: number[];
  onToggleStar: (star: number) => void;
  onClear?: () => void;
}

// Batch 18: restyled as large checkboxes (same options).
export default function StarFilter({
  selectedStars,
  availableStars,
  onToggleStar,
  onClear,
}: StarFilterProps) {
  return (
    <FilterSection
      title="Luxury level"
      defaultOpen
      count={selectedStars.length}
      onClear={onClear}
    >
      <div className="flex flex-col">
        {availableStars.map((star) => {
          const on = selectedStars.includes(star);
          return (
            <FilterOption
              key={star}
              checked={on}
              onChange={() => onToggleStar(star)}
              label={`${star} Star${star > 1 ? "s" : ""}`}
            />
          );
        })}
      </div>
    </FilterSection>
  );
}
