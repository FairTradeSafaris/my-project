import { useEffect, useState } from "react";
import { client as sanityClient } from "@/lib/sanity";
import { Journey, FilterOptions } from "@/components/journey-finder/types";
import {
  parseDurationDays,
  parsePriceNumber,
} from "@/components/journey-finder/utils";

export function useFilterOptions() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    countries: [],
    signature: [],
    style: [],
    feature: [],
    stars: [],
    durations: [],
    prices: [],
  });

  const [optionsJourneys, setOptionsJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"][0...1000]{
        _id,
        title,
        region->{ title },
        destinations[]->{
          title,
          region,
          ranking
        },
        "interests": travelStyleRefs[]->{ title, category },
        duration,
        star,
        price
      }`,
      )
      .then((data: Journey[]) => {
        setOptionsJourneys(data);

        const regions = Array.from(
          new Set(data.map((j) => j.region?.title).filter(Boolean)),
        ) as string[];

        const countries = Array.from(
          new Set(
            data
              .flatMap((j) => (j.destinations || []).map((d) => d.title))
              .filter(Boolean),
          ),
        ) as string[];

        const signatureSet = new Set<string>();
        const styleSet = new Set<string>();
        const featureSet = new Set<string>();

        data.forEach((j) => {
          (j.interests || []).forEach((interest) => {
            if (!interest?.title || !interest?.category?.title) return;

            const categoryTitle = interest.category.title.toLowerCase();

            switch (categoryTitle) {
              case "signature safari experience":
                signatureSet.add(interest.title);
                break;
              case "travel style":
                styleSet.add(interest.title);
                break;
              case "trip feature":
                featureSet.add(interest.title);
                break;
            }
          });
        });

        const stars = Array.from(
          new Set(
            data
              .map((j) => j.star)
              .filter((s): s is string => typeof s === "string"),
          ),
        );

        const durationNumbers = data
          .map((j) => parseDurationDays(j.duration))
          .filter((n) => Number.isFinite(n) && n > 0);

        const priceNumbers = data
          .map((j) => parsePriceNumber(j.price))
          .filter((n) => Number.isFinite(n) && n > 1);

        setFilterOptions({
          regions,
          countries,
          signature: Array.from(signatureSet).sort(),
          style: Array.from(styleSet).sort(),
          feature: Array.from(featureSet).sort(),
          stars,
          durations: durationNumbers,
          prices: priceNumbers,
        });
      });
  }, []);

  const globalDurationRange: [number, number] = (() => {
    const ds = filterOptions.durations.filter((n) => n > 0);
    return ds.length ? [Math.min(...ds), Math.max(...ds)] : [0, 0];
  })();

  const globalPriceRange: [number, number] = (() => {
    const ps = filterOptions.prices.filter((n) => n > 1);
    return ps.length ? [Math.min(...ps), Math.max(...ps)] : [0, 0];
  })();

  return {
    filterOptions,
    optionsJourneys,
    globalDurationRange,
    globalPriceRange,
  };
}
