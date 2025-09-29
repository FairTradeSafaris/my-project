"use client";

import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Filters, FilterKey, FilterOptions } from "./types";
import { formatMoney } from "./utils";

type CollapsedMap = {
  region: boolean;
  country: boolean;
  star: boolean;
  duration: boolean;
  price: boolean;
  types: boolean;
  signature: boolean;
  style: boolean;
  feature: boolean;
};

type Props = {
  filterOptions: FilterOptions;
  availableCountries: string[];
  availableSignature: string[];
  availableStyle: string[];
  availableFeature: string[];
  availableDurationRange: [number, number];
  availablePriceRange: [number, number];
  priceFilterEnabled: boolean;
  selectedFilters: Filters;
  collapsed: CollapsedMap;
  setCollapsed: React.Dispatch<React.SetStateAction<CollapsedMap>>;
  onToggleType: (type: string) => void;
  onToggleCountry: (country: string) => void;
  onToggleStar: (star: string) => void;
  onToggleSignature: (value: string) => void;
  onToggleStyle: (value: string) => void;
  onToggleFeature: (value: string) => void;
  onSetSimpleFilter: (
    key: Extract<FilterKey, "region" | "star">,
    value: string
  ) => void;
  onDurationChange: (range: [number, number]) => void;
  onPriceChange: (range: [number, number]) => void;
  filterLabels: {
    signature: string;
    style: string;
    feature: string;
  } | null;
};

export default function FiltersPanel({
  filterOptions,
  availableCountries,
  availableSignature,
  availableStyle,
  availableFeature,
  availableDurationRange,
  availablePriceRange,
  priceFilterEnabled,
  selectedFilters,
  collapsed,
  setCollapsed,
  onToggleCountry,
  onToggleStar,
  onToggleSignature,
  onToggleStyle,
  onToggleFeature,
  onSetSimpleFilter,
  onDurationChange,
  onPriceChange,
  filterLabels,
}: Props) {
  const groups = [
    { label: "Regions", items: filterOptions.regions, filterKey: "region" },
    {
      label: "Countries",
      items: availableCountries,
      filterKey: "country",
      multi: true,
    },
    {
      label: "Luxury Level",
      items: filterOptions.stars,
      filterKey: "star",
      multi: true,
    },
    { label: "Duration", items: [], filterKey: "duration" },
    { label: "Price", items: [], filterKey: "price" },
    {
      label: filterLabels?.signature || "Signature Safari Experiences",
      items: availableSignature,
      filterKey: "signature",
      multi: true,
    },
    {
      label: filterLabels?.style || "Travel Styles",
      items: availableStyle,
      filterKey: "style",
      multi: true,
    },
    {
      label: filterLabels?.feature || "Trip Features",
      items: availableFeature,
      filterKey: "feature",
      multi: true,
    },
  ];

  return (
    <>
      {groups.map((group) => (
        <div key={group.label} className="mb-5">
          <button
            className="flex justify-between items-center w-full text-xs tracking-wide font-semibold text-gray-600 mb-4 uppercase border-t pt-4"
            onClick={() =>
              setCollapsed((prev) => ({
                ...prev,
                [group.filterKey]: !prev[group.filterKey as keyof typeof prev],
              }))
            }
          >
            <span>{group.label}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                collapsed[group.filterKey as keyof typeof collapsed]
                  ? "rotate-180"
                  : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {!collapsed[group.filterKey as keyof typeof collapsed] && (
            <div className="flex flex-wrap gap-4">
              {group.filterKey === "duration" ? (
                <div className="w-full">
                  <Slider
                    range
                    min={availableDurationRange[0]}
                    max={availableDurationRange[1]}
                    value={selectedFilters.duration}
                    onChange={(value) => {
                      if (Array.isArray(value) && value.length === 2) {
                        onDurationChange([
                          value[0] as number,
                          value[1] as number,
                        ]);
                      }
                    }}
                    trackStyle={[{ backgroundColor: "#a35c2d", height: 6 }]}
                    railStyle={{ backgroundColor: "#e2e2e2", height: 6 }}
                    handleStyle={[
                      {
                        backgroundColor: "#fff",
                        borderColor: "#a35c2d",
                        height: 18,
                        width: 18,
                        marginTop: -6,
                        borderRadius: "9999px",
                        boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                      },
                      {
                        backgroundColor: "#fff",
                        borderColor: "#a35c2d",
                        height: 18,
                        width: 18,
                        marginTop: -6,
                        borderRadius: "9999px",
                        boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                      },
                    ]}
                  />
                  <div className="flex justify-between text-sm mt-3 font-medium text-gray-800">
                    <span>{selectedFilters.duration[0]} Days</span>
                    <span>{selectedFilters.duration[1]} Days</span>
                  </div>
                </div>
              ) : group.filterKey === "price" ? (
                <div className="w-full">
                  <Slider
                    range
                    min={availablePriceRange[0]}
                    max={availablePriceRange[1]}
                    value={selectedFilters.price}
                    disabled={!priceFilterEnabled}
                    onChange={(value) => {
                      if (!priceFilterEnabled) return;
                      if (Array.isArray(value) && value.length === 2) {
                        onPriceChange([value[0] as number, value[1] as number]);
                      }
                    }}
                    trackStyle={[{ backgroundColor: "#a35c2d", height: 6 }]}
                    railStyle={{ backgroundColor: "#e2e2e2", height: 6 }}
                    handleStyle={[
                      {
                        backgroundColor: "#fff",
                        borderColor: "#a35c2d",
                        height: 18,
                        width: 18,
                        marginTop: -6,
                        borderRadius: "9999px",
                        boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                      },
                      {
                        backgroundColor: "#fff",
                        borderColor: "#a35c2d",
                        height: 18,
                        width: 18,
                        marginTop: -6,
                        borderRadius: "9999px",
                        boxShadow: "0 0 0 2px rgba(163, 92, 45, 0.15)",
                      },
                    ]}
                  />
                  <div className="flex justify-between text-sm mt-3 font-medium text-gray-800">
                    <span>{formatMoney(selectedFilters.price[0])}</span>
                    <span>{formatMoney(selectedFilters.price[1])}</span>
                  </div>
                  {!priceFilterEnabled && (
                    <p className="mt-2 text-xs text-gray-600">
                      Pricing is on request for the current selection.
                    </p>
                  )}
                </div>
              ) : group.filterKey === "star" ? (
                <div className="flex flex-col gap-2">
                  {group.items.map((level) => {
                    const isChecked = selectedFilters.star.includes(level);
                    return (
                      <label
                        key={level}
                        className="flex items-center text-sm text-gray-700 space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleStar(level)}
                          className="form-checkbox text-[#a35c2d]"
                        />
                        <span>{level} Star</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                group.items.map((item) => {
                  const selectedValue =
                    selectedFilters[group.filterKey as keyof Filters];
                  const isActive = group.multi
                    ? Array.isArray(selectedValue) &&
                      (selectedValue as string[]).includes(item)
                    : selectedValue === item;

                  return (
                    <button
                      key={item}
                      onClick={() => {
                        const key = group.filterKey as FilterKey;
                        if (group.multi) {
                          if (key === "country") onToggleCountry(item);
                          else if (key === "signature") onToggleSignature(item);
                          else if (key === "style") onToggleStyle(item);
                          else if (key === "feature") onToggleFeature(item);
                        } else {
                          if (key === "region")
                            onSetSimpleFilter("region", isActive ? "" : item);
                          else if (key === "star") onToggleStar(item);
                        }
                      }}
                      className={`px-2.5 py-[2px] rounded-full text-[11px] font-medium border transition-all ${
                        isActive
                          ? "bg-[#a35c2d] text-white border-[#a35c2d]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
