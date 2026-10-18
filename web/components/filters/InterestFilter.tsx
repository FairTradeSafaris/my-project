"use client";

import React, { useState } from "react";
import { FilterOption, FilterSection, ShowMoreButton } from "./FilterUI";

interface InterestFilterProps {
  title?: string;
  selectedInterests: string[];
  availableInterests: {
    title: string;
    isTopInterest?: boolean;
  }[];
  onToggleInterest: (interest: string) => void;
  onClear?: () => void;
}

// Batch 18: restyled as large checkboxes (same options: top ones first, then 5 more
// with "show more").
export default function InterestFilter({
  title = "Interests",
  selectedInterests,
  availableInterests,
  onToggleInterest,
  onClear,
}: InterestFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const topInterests = availableInterests.filter((i) => i.isTopInterest);
  const otherInterests = availableInterests.filter((i) => !i.isTopInterest);

  const visibleOthers = showAll ? otherInterests : otherInterests.slice(0, 5);

  const renderChip = (interest: { title: string }) => (
    <FilterOption
      key={interest.title}
      label={interest.title}
      checked={selectedInterests.includes(interest.title)}
      onChange={() => onToggleInterest(interest.title)}
    />
  );

  if (availableInterests.length === 0) {
    return (
      <FilterSection title={title}>
        <p className="text-[13px] italic text-[#8a7766]">
          No interests available.
        </p>
      </FilterSection>
    );
  }

  return (
    <FilterSection
      title={title}
      count={selectedInterests.length}
      onClear={onClear}
    >
      <div className="flex flex-col">
        {topInterests.map(renderChip)}
        {visibleOthers.map(renderChip)}
      </div>

      {otherInterests.length > 5 && (
        <ShowMoreButton
          open={showAll}
          hidden={otherInterests.length - 5}
          onClick={() => setShowAll(!showAll)}
        />
      )}
    </FilterSection>
  );
}
