"use client";

import React from "react";
import RegionFilter from "@/components/filters/RegionFilter";
import CountryFilter from "@/components/filters/CountryFilter";
import StarFilter from "@/components/filters/StarFilter";
import InterestFilter from "@/components/filters/InterestFilter";
import DurationFilter from "@/components/filters/DurationFilter";
import PriceFilter from "@/components/filters/PriceFilter";

type Props = {
  regions: string[];
  selectedRegion: string;
  regionLoading: boolean;
  onChangeRegion: (region: string) => void;

  countries: { title: string }[];
  selectedCountries: string[];
  destinationsLoading: boolean;
  onToggleCountry: (country: string) => void;
  onClearCountries: () => void;

  selectedStars: number[];
  availableStars: number[];
  onToggleStar: (star: number) => void;
  onClearStars: () => void;

  selectedSignature: string[];
  availableSignature: { title: string }[];
  onToggleSignature: (sig: string) => void;
  onClearSignature: () => void;

  selectedInterests: string[];
  availableInterests: { title: string; isTopInterest?: boolean }[];
  onToggleInterest: (interest: string) => void;
  onClearInterests: () => void;

  selectedActivities: string[];
  availableActivities: { title: string; isTopActivity?: boolean }[];
  onToggleActivity: (activity: string) => void;
  onClearActivities: () => void;

  selectedDuration: [number, number];
  onChangeDuration: (range: [number, number]) => void;
  availableDurations: number[];

  selectedPrice: [number, number];
  onChangePrice: (range: [number, number]) => void;
  availablePrices: number[];

  onlyShowWishlisted: boolean;
  onToggleWishlisted: () => void;

  isMobile?: boolean;
  onCloseMobile?: () => void;
};

export default function JourneyFiltersSidebar({
  regions,
  selectedRegion,
  regionLoading,
  onChangeRegion,

  countries,
  selectedCountries,
  destinationsLoading,
  onToggleCountry,
  onClearCountries,

  selectedStars,
  availableStars,
  onToggleStar,
  onClearStars,

  selectedSignature,
  availableSignature,
  onToggleSignature,
  onClearSignature,

  selectedInterests,
  availableInterests,
  onToggleInterest,
  onClearInterests,

  selectedActivities,
  availableActivities,
  onToggleActivity,
  onClearActivities,

  selectedDuration,
  onChangeDuration,
  availableDurations,

  selectedPrice,
  onChangePrice,
  availablePrices,

  onlyShowWishlisted,
  onToggleWishlisted,

  isMobile = false,
  onCloseMobile,
}: Props) {
  return (
    <div className="relative h-full flex flex-col bg-white">
      {/* ✅ Mobile Header with Apply + Close */}
      {isMobile && (
        <div className="flex items-center justify-between px-4 pt-20 pb-2 border-b">
          <div className="w-1/3">
            <button
              className="text-2xl text-[#a35c2d] font-bold px-3 py-1 rounded hover:bg-[#f1e4db] active:scale-95 transition"
              onClick={onCloseMobile}
              aria-label="Back"
            >
              ←
            </button>
          </div>
          <div className="w-1/3 text-center">
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="w-1/3">{/* right side empty for balance */}</div>
        </div>
      )}

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-6">
        {/* ❤️ Saved Journeys Toggle */}
        <div className="flex items-center gap-2 text-sm border-b pb-4">
          <input
            id="saved-only"
            type="checkbox"
            className="form-checkbox text-[#a35c2d]"
            checked={onlyShowWishlisted}
            onChange={onToggleWishlisted}
          />
          <label
            htmlFor="saved-only"
            className="flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>Only show saved journeys</span>
            <span role="img" aria-label="saved">
              ❤️
            </span>
          </label>
        </div>

        <RegionFilter
          {...{
            regions,
            selectedRegion,
            loading: regionLoading,
            onChange: onChangeRegion,
          }}
        />
        <CountryFilter
          {...{
            countries,
            selectedCountries,
            loading: destinationsLoading,
            onToggleCountry,
            onClear: onClearCountries,
          }}
        />
        <StarFilter
          {...{
            selectedStars,
            availableStars,
            onToggleStar,
            onClear: onClearStars,
          }}
        />
        <InterestFilter
          title="Signature Journeys"
          selectedInterests={selectedSignature}
          availableInterests={availableSignature}
          onToggleInterest={onToggleSignature}
          onClear={onClearSignature}
        />
        <InterestFilter
          title="Interests"
          selectedInterests={selectedInterests}
          availableInterests={availableInterests}
          onToggleInterest={onToggleInterest}
          onClear={onClearInterests}
        />
        <InterestFilter
          title="Activities"
          selectedInterests={selectedActivities}
          availableInterests={availableActivities}
          onToggleInterest={onToggleActivity}
          onClear={onClearActivities}
        />
        <DurationFilter
          {...{
            selectedRange: selectedDuration,
            onChangeRange: onChangeDuration,
            availableDurations,
          }}
        />
        <PriceFilter
          {...{
            selectedRange: selectedPrice,
            onChangeRange: onChangePrice,
            availablePrices,
          }}
        />
      </div>
    </div>
  );
}
