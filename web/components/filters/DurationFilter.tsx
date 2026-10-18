"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  FilterSection,
  sliderRangeClass,
  sliderRootClass,
  sliderThumbClass,
  sliderTrackClass,
} from "./FilterUI";

type DurationFilterProps = {
  selectedRange: [number, number];
  onChangeRange: (range: [number, number]) => void;
  availableDurations: number[];
};

// Batch 18: restyled (same range, step and behaviour).
const DurationFilter: React.FC<DurationFilterProps> = ({
  selectedRange,
  onChangeRange,
  availableDurations,
}) => {
  const min = Math.min(...availableDurations);
  const max = Math.max(...availableDurations);
  const narrowed = selectedRange[0] > min || selectedRange[1] < max;

  return (
    <FilterSection
      title="Trip length"
      summary={narrowed ? `${selectedRange[0]}–${selectedRange[1]} days` : undefined}
      onClear={() => onChangeRange([min, max])}
    >
      <p className="mb-3 text-[16px] font-semibold tabular-nums text-[#24170f]">
        {selectedRange[0]} – {selectedRange[1]} days
      </p>

      <Slider.Root
        className={sliderRootClass}
        min={min}
        max={max}
        step={1}
        value={selectedRange}
        onValueChange={(value) => onChangeRange([value[0], value[1]])}
      >
        <Slider.Track className={sliderTrackClass}>
          <Slider.Range className={sliderRangeClass} />
        </Slider.Track>
        <Slider.Thumb className={sliderThumbClass} aria-label="Minimum duration" />
        <Slider.Thumb className={sliderThumbClass} aria-label="Maximum duration" />
      </Slider.Root>
      {isFinite(min) && isFinite(max) && (
        <div className="mt-1.5 flex justify-between text-[13px] tabular-nums text-[#8a7766]">
          <span>{min} days</span>
          <span>{max} days</span>
        </div>
      )}
    </FilterSection>
  );
};

export default DurationFilter;
