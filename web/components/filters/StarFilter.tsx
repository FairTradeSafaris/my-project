"use client";

import React from "react";

interface StarFilterProps {
  selectedStars: number[];
  availableStars: number[]; // new prop
  onToggleStar: (star: number) => void;
  onClear?: () => void;
}

export default function StarFilter({
  selectedStars,
  availableStars,
  onToggleStar,
  onClear,
}: StarFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          Luxury Level
        </label>
        {onClear && selectedStars.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-[#a35c2d] hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-2">
        {availableStars.map((star) => (
          <label key={star} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="form-checkbox text-[#a35c2d]"
              checked={selectedStars.includes(star)}
              onChange={() => onToggleStar(star)}
            />
            <span>
              {star} Star{star > 1 && "s"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
