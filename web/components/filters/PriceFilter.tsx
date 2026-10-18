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

type PriceFilterProps = {
  selectedRange: [number, number];
  onChangeRange: (range: [number, number]) => void;
  availablePrices: number[];
};

// Batch 18: restyled (same range, step and behaviour).
const PriceFilter: React.FC<PriceFilterProps> = ({
  selectedRange,
  onChangeRange,
  availablePrices,
}) => {
  const min = Math.min(...availablePrices);
  const max = Math.max(...availablePrices);
  const narrowed = selectedRange[0] > min || selectedRange[1] < max;

  return (
    <FilterSection
      title="Price (USD)"
      summary={
        narrowed
          ? `$${selectedRange[0].toLocaleString()}–$${selectedRange[1].toLocaleString()}`
          : undefined
      }
      onClear={() => onChangeRange([min, max])}
    >
      <p className="mb-3 text-[16px] font-semibold tabular-nums text-[#24170f]">
        ${selectedRange[0].toLocaleString()} – $
        {selectedRange[1].toLocaleString()}
      </p>

      <Slider.Root
        className={sliderRootClass}
        min={min}
        max={max}
        step={100}
        value={selectedRange}
        onValueChange={(value) => onChangeRange([value[0], value[1]])}
      >
        <Slider.Track className={sliderTrackClass}>
          <Slider.Range className={sliderRangeClass} />
        </Slider.Track>
        <Slider.Thumb className={sliderThumbClass} aria-label="Minimum price" />
        <Slider.Thumb className={sliderThumbClass} aria-label="Maximum price" />
      </Slider.Root>
      {isFinite(min) && isFinite(max) && (
        <div className="mt-1.5 flex justify-between text-[13px] tabular-nums text-[#8a7766]">
          <span>${min.toLocaleString()}</span>
          <span>${max.toLocaleString()}</span>
        </div>
      )}
    </FilterSection>
  );
};

export default PriceFilter;
