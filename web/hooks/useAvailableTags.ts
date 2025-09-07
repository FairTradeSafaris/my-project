// app/hooks/useAvailableTags.ts
import { useMemo } from "react";
import { Journey } from "@/components/journey-finder/types"; // Adjust path if needed

export function useAvailableTags(journeys: Journey[]) {
  return useMemo(() => {
    const tags = {
      signature: new Set<string>(),
      style: new Set<string>(),
      feature: new Set<string>(),
    };

    journeys.forEach((j) =>
      (j.interests || []).forEach(({ category, title }) => {
        const key = category?.toLowerCase();
        if (title && key && tags[key as keyof typeof tags]) {
          tags[key as keyof typeof tags].add(title);
        }
      })
    );

    return {
      signature: Array.from(tags.signature).sort(),
      style: Array.from(tags.style).sort(),
      feature: Array.from(tags.feature).sort(),
    };
  }, [journeys]);
}
