"use client";

import React from "react";
import RegionFilter from "@/components/filters/RegionFilter";
import CountryFilter from "@/components/filters/CountryFilter";
import StarFilter from "@/components/filters/StarFilter";
import InterestFilter from "@/components/filters/InterestFilter";
import DurationFilter from "@/components/filters/DurationFilter";
import PriceFilter from "@/components/filters/PriceFilter";
// Batch 18: calm, restyled panel (desktop: sticky card; phone: full-screen
// sheet with a "Show N safaris" footer). Collapsible sections, large
// checkboxes. Same filters, options and handlers.

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
  /** batch 13: the saved-journeys toggle only works when signed in */
  showWishlistToggle?: boolean;

  isMobile?: boolean;
  onCloseMobile?: () => void;

  /** batch 18 (display only): trips currently shown, number of active
   *  filters, and a reset for every filter at once */
  resultCount?: number;
  activeCount?: number;
  onClearAll?: () => void;
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
  showWishlistToggle = true,

  isMobile = false,
  onCloseMobile,

  resultCount,
  activeCount = 0,
  onClearAll,
}: Props) {
  const tripsLabel =
    typeof resultCount === "number"
      ? `${resultCount} ${resultCount === 1 ? "safari" : "safaris"}`
      : "";
  return (
    <div
      className={
        isMobile
          ? "relative flex h-full flex-col bg-white"
          : "relative rounded-2xl border border-[#ebe1d3] bg-white"
      }
    >
      {/* Header: "Filters" + number of safaris (and Clear all on desktop) */}
      <div
        className={`flex items-center justify-between gap-3 border-b border-[#eee5d8] px-6 ${
          isMobile ? "bg-white py-4" : "py-5"
        }`}
      >
        <div className="flex items-baseline gap-3">
          <p className="text-[20px] font-semibold text-[#24170f]">Filters</p>
          {tripsLabel && (
            <p className="text-[15px] text-[#8a7766]" aria-live="polite">
              {tripsLabel}
            </p>
          )}
        </div>
        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close filters"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#24170f] transition hover:bg-[#f5efe6]"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          onClearAll &&
          activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="shrink-0 text-[14px] text-[#8a7766] underline underline-offset-4 transition hover:text-[#a35c2d]"
            >
              Clear all
            </button>
          )
        )}
      </div>

      {/* Filter groups */}
      <div className={isMobile ? "flex-1 overflow-y-auto bg-white px-6 pb-6 pt-1" : "px-6 pb-2 pt-1"}>
        {/* Saved journeys toggle (signed-in visitors only) */}
        {showWishlistToggle && (
          <div className="border-b border-[#eee5d8] py-3">
            <label className="flex min-h-[40px] cursor-pointer items-center gap-3 text-[15px] text-[#3c2a1e]">
              <input
                type="checkbox"
                checked={onlyShowWishlisted}
                onChange={onToggleWishlisted}
                className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#a35c2d]"
              />
              Only show saved journeys
            </label>
          </div>
        )}

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

      {/* Phone footer: reset + see the results */}
      {isMobile && (
        <div className="flex items-center gap-3 border-t border-[#eee5d8] bg-white px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={activeCount === 0}
              className="h-12 shrink-0 rounded-xl px-3 text-[15px] text-[#5d4037] underline underline-offset-4 transition disabled:text-[#c4b6a6] disabled:no-underline"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#24170f] text-[16px] font-semibold text-white transition-colors hover:bg-[#5d4037]"
          >
            {tripsLabel ? `Show ${tripsLabel}` : "Show safaris"}
          </button>
        </div>
      )}
    </div>
  );
}
