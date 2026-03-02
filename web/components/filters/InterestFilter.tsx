"use client";

import React, { useState } from "react";

interface InterestFilterProps {
  title?: string; // ✅ New prop for customization
  selectedInterests: string[];
  availableInterests: {
    title: string;
    isTopInterest?: boolean;
  }[];
  onToggleInterest: (interest: string) => void;
  onClear?: () => void;
}

export default function InterestFilter({
  title = "Interests", // ✅ Default fallback
  selectedInterests,
  availableInterests,
  onToggleInterest,
  onClear,
}: InterestFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const topInterests = availableInterests.filter((i) => i.isTopInterest);
  const otherInterests = availableInterests.filter((i) => !i.isTopInterest);

  const visibleOthers = showAll ? otherInterests : otherInterests.slice(0, 5);

  const renderCheckbox = (interest: { title: string }) => (
    <label key={interest.title} className="flex items-center space-x-2 text-sm">
      <input
        type="checkbox"
        className="form-checkbox text-[#a35c2d]"
        checked={selectedInterests.includes(interest.title)}
        onChange={() => onToggleInterest(interest.title)}
      />
      <span>{interest.title}</span>
    </label>
  );

  if (availableInterests.length === 0) {
    return (
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">{title}</label>
        <p className="text-sm italic text-gray-500 mt-1">
          No interests available.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{title}</label>
        {onClear && selectedInterests.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-[#a35c2d] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        {topInterests.map(renderCheckbox)}
        {visibleOthers.map(renderCheckbox)}
      </div>

      {otherInterests.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs text-[#a35c2d] hover:underline"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
