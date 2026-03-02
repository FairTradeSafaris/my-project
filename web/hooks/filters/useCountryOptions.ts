// /hooks/filters/useDestinationOptions.ts
import { useEffect, useState } from "react";
import { client as sanity } from "@/lib/sanity";

type DestinationOption = {
  title: string;
  region?: string;
  ranking?: number;
};

export function useDestinationOptions(selectedRegion: string) {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data: DestinationOption[] = await sanity.fetch(
          `*[_type == "destination"]{
            title,
            region,
            ranking
          }`,
        );

        if (cancelled) return;

        const filtered = data
          .filter((d) => {
            if (!selectedRegion) return true;
            return (
              d.region &&
              d.region.toLowerCase().trim() ===
                selectedRegion.toLowerCase().trim()
            );
          })
          .sort((a, b) => {
            const aRank = a.ranking ?? 999;
            const bRank = b.ranking ?? 999;
            return aRank - bRank;
          });

        setDestinations(filtered);
      } catch (err) {
        console.error("useDestinationOptions error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedRegion]);

  return { destinations, loading };
}
