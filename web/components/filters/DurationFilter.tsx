"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";

type DurationFilterProps = {
  selectedRange: [number, number];
  onChangeRange: (range: [number, number]) => void;
  availableDurations: number[];
};

const DurationFilter: React.FC<DurationFilterProps> = ({
  selectedRange,
  onChangeRange,
  availableDurations,
}) => {
  const min = Math.min(...availableDurations);
  const max = Math.max(...availableDurations);

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">Trip Duration (Days)</label>
      <div className="mb-2 text-sm text-gray-600">
        {selectedRange[0]} - {selectedRange[1]} days
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={1}
        value={selectedRange}
        onValueChange={(value) => onChangeRange([value[0], value[1]])}
      >
        <Slider.Track className="bg-gray-300 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-[#a35c2d] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-white border border-[#a35c2d] rounded-full shadow-md cursor-pointer"
          aria-label="Minimum duration"
        />
        <Slider.Thumb
          className="block w-4 h-4 bg-white border border-[#a35c2d] rounded-full shadow-md cursor-pointer"
          aria-label="Maximum duration"
        />
      </Slider.Root>
    </div>
  );
};

export default DurationFilter;
