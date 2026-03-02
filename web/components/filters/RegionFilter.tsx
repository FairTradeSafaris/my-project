import React from "react";

interface RegionFilterProps {
  regions: string[];
  selectedRegion: string;
  loading: boolean;
  onChange: (value: string) => void;
}

export default function RegionFilter({
  regions,
  selectedRegion,
  loading,
  onChange,
}: RegionFilterProps) {
  return (
    <div className="mb-6 max-w-xs">
      <label
        htmlFor="region"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Region
      </label>
      <select
        id="region"
        name="region"
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
