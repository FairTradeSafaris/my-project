"use client";

import React, { useEffect, useState } from "react";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";
import type { Journey } from "./journey-finder/types";
import { useDestinationOptions } from "@/hooks/filters/useCountryOptions";
import JourneyFiltersSidebar from "@/components/JourneyFiltersSidebar";
import { useUser } from "@clerk/nextjs";
import { useWishlistGrid } from "@/hooks/useWishlistGrid";
import { useSearchParams } from "next/navigation";

export default function JourneyFinderClientWithAuth() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [regionLoading, setRegionLoading] = useState(true);

  const { destinations, loading: destinationsLoading } =
    useDestinationOptions(selectedRegion);
  const searchParams = useSearchParams();
  const qParam = searchParams?.get("q") ?? "";
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  useEffect(() => {
    if (!qParam || destinationsLoading || !destinations.length) return;

    const match = destinations.find(
      (d) =>
        d.title.toLowerCase().replace(/\s+/g, "-") ===
        qParam.toLowerCase().replace(/\s+/g, "-"),
    );

    if (match && !selectedCountries.includes(match.title)) {
      setSelectedCountries([match.title]);
    }
  }, [qParam, destinationsLoading, destinations, selectedCountries]);

  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const [selectedDuration, setSelectedDuration] = useState<
    [number, number] | null
  >(null);
  const [selectedPrice, setSelectedPrice] = useState<[number, number] | null>(
    null,
  );

  const [availableDurations, setAvailableDurations] = useState<number[]>([]);
  const [availablePrices, setAvailablePrices] = useState<number[]>([]);

  const [onlyShowWishlisted, setOnlyShowWishlisted] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { isLoaded, user } = useUser();
  const [hasConsent, setHasConsent] = useState(false);

  const userId = hasConsent && isLoaded && user?.id ? user.id : null;

  const toggle = <T,>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>,
  ) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(consent === "accepted");
  }, []);
  useEffect(() => {
    if (!hasConsent) return;

    const luxuryParams = searchParams?.getAll("luxury") ?? [];
    const signatureParamsRaw = searchParams?.getAll("signature") ?? [];
    const interestParamsRaw = searchParams?.getAll("interest") ?? [];

    if (luxuryParams.length > 0) {
      const parsed = luxuryParams
        .map((l) => parseInt(l))
        .filter((n) => !isNaN(n));
      setSelectedStars(parsed);
    }

    if (signatureParamsRaw.length > 0) {
      const decoded = signatureParamsRaw.map((s) =>
        decodeURIComponent(s.replace(/\+/g, " ")),
      );
      setSelectedSignature(decoded);
    }

    if (interestParamsRaw.length > 0) {
      const decoded = interestParamsRaw.map((s) =>
        decodeURIComponent(s.replace(/\+/g, " ")),
      );
      setSelectedInterests(decoded);
    }
  }, [hasConsent, searchParams]);

  const { wishlistedMap } = useWishlistGrid(journeys, userId);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "journey"]{
          _id,
          title,
          slug,
          summary,
          duration,
          price,
          star,
          "starIcon": starIcon.asset->url,
          region->{ title },
          destinations[]->{ title, region },
          "interests": travelStyleRefs[]->{ title, isTopInterest, category },
          "heroUrl": heroImage.asset->url,
          alt,
          featuredOnHome
        }`,
      )
      .then((data: Journey[]) => {
        setJourneys(data);
        setLoading(false);

        const regionTitles = data
          .map((j) => j.region?.title)
          .filter((r): r is string => Boolean(r));
        setRegions([...new Set(regionTitles)]);
        setRegionLoading(false);

        const priceVals = data
          .map((j) => j.price)
          .filter((p) => typeof p === "number") as number[];
        const durationVals = data
          .map((j) => parseInt(j.duration?.match(/\d+/)?.[0] ?? "0", 10))
          .filter((d) => !isNaN(d));

        const sortedPrices = [...new Set(priceVals)].sort((a, b) => a - b);
        const sortedDurations = [...new Set(durationVals)].sort(
          (a, b) => a - b,
        );

        setAvailablePrices(sortedPrices);
        setAvailableDurations(sortedDurations);

        if (sortedPrices.length > 0) {
          setSelectedPrice([
            sortedPrices[0],
            sortedPrices[sortedPrices.length - 1],
          ]);
        }

        if (sortedDurations.length > 0) {
          setSelectedDuration([
            sortedDurations[0],
            sortedDurations[sortedDurations.length - 1],
          ]);
        }
      });
  }, []);

  const filteredJourneys = journeys.filter((j) => {
    if (!selectedDuration || !selectedPrice) return false;

    const matchRegion =
      !selectedRegion ||
      (j.destinations || []).some(
        (d) =>
          typeof d.region === "string" &&
          d.region.toLowerCase() === selectedRegion.toLowerCase(),
      );

    const destinationTitles = (j.destinations || []).map((d) => d.title);

    const matchCountry =
      selectedCountries.length === 0 ||
      selectedCountries.some((c) => destinationTitles.includes(c));

    const matchStar =
      selectedStars.length === 0 ||
      (typeof j.star === "string" && selectedStars.includes(parseInt(j.star)));

    const matchesCategory = (values: string[], category: string) =>
      values.length === 0 ||
      values.some((val) =>
        j.interests?.some((i) => i.title === val && i.category === category),
      );

    const journeyDuration = parseInt(j.duration?.match(/\d+/)?.[0] ?? "0", 10);
    const matchDuration =
      journeyDuration >= selectedDuration[0] &&
      journeyDuration <= selectedDuration[1];

    const journeyPrice = parseFloat(j.price || "0");
    const matchPrice =
      journeyPrice >= selectedPrice[0] && journeyPrice <= selectedPrice[1];

    const isWishlisted = wishlistedMap[j._id] === true;

    return (
      matchRegion &&
      matchCountry &&
      matchStar &&
      matchesCategory(selectedSignature, "signature") &&
      matchesCategory(selectedInterests, "style") &&
      matchesCategory(selectedActivities, "feature") &&
      matchDuration &&
      matchPrice &&
      (!onlyShowWishlisted || isWishlisted)
    );
  });
  console.log("DEBUG selectedInterests:", selectedInterests);
  console.log("DEBUG first journey interests:", journeys[0]?.interests);
  const availableStars = Array.from(
    new Set(
      journeys
        .map((j) => (typeof j.star === "string" ? parseInt(j.star) : NaN))
        .filter((n) => !isNaN(n)),
    ),
  ).sort((a, b) => b - a);

  const scopedJourneys =
    selectedCountries.length === 0
      ? journeys
      : journeys.filter((j) =>
          (j.destinations || []).some((d) =>
            selectedCountries.includes(d.title),
          ),
        );

  const getAvailableByCategory = (category: string) =>
    Array.from(
      new Map(
        scopedJourneys
          .flatMap((j) => j.interests || [])
          .filter((i) => i.category === category)
          .map((i) => [
            i.title,
            { title: i.title, isTopInterest: i.isTopInterest },
          ]),
      ).values(),
    );

  const availableSignature = getAvailableByCategory("signature");
  const availableInterests = getAvailableByCategory("style");
  const availableActivities = getAvailableByCategory("feature");

  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">African Safari Itineraries</h1>

        <div className="lg:hidden mb-4 text-right">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="bg-[#a35c2d] text-white px-4 py-2 rounded"
          >
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block lg:col-span-1">
            <JourneyFiltersSidebar
              regions={regions}
              selectedRegion={selectedRegion}
              regionLoading={regionLoading}
              onChangeRegion={setSelectedRegion}
              countries={destinations}
              selectedCountries={selectedCountries}
              destinationsLoading={destinationsLoading}
              onToggleCountry={(v) => toggle(v, setSelectedCountries)}
              onClearCountries={() => setSelectedCountries([])}
              selectedStars={selectedStars}
              availableStars={availableStars}
              onToggleStar={(v) => toggle(v, setSelectedStars)}
              onClearStars={() => setSelectedStars([])}
              selectedSignature={selectedSignature}
              availableSignature={availableSignature}
              onToggleSignature={(v) => toggle(v, setSelectedSignature)}
              onClearSignature={() => setSelectedSignature([])}
              selectedInterests={selectedInterests}
              availableInterests={availableInterests}
              onToggleInterest={(v) => toggle(v, setSelectedInterests)}
              onClearInterests={() => setSelectedInterests([])}
              selectedActivities={selectedActivities}
              availableActivities={availableActivities}
              onToggleActivity={(v) => toggle(v, setSelectedActivities)}
              onClearActivities={() => setSelectedActivities([])}
              selectedDuration={
                selectedDuration ?? [
                  availableDurations[0] ?? 0,
                  availableDurations.at(-1) ?? 0,
                ]
              }
              onChangeDuration={setSelectedDuration}
              availableDurations={availableDurations}
              selectedPrice={
                selectedPrice ?? [
                  availablePrices[0] ?? 0,
                  availablePrices.at(-1) ?? 0,
                ]
              }
              onChangePrice={setSelectedPrice}
              availablePrices={availablePrices}
              onlyShowWishlisted={onlyShowWishlisted}
              onToggleWishlisted={() => setOnlyShowWishlisted((prev) => !prev)}
            />
          </aside>

          <section className="lg:col-span-3">
            {loading ? (
              <p className="text-gray-500">Loading journeys...</p>
            ) : filteredJourneys.length === 0 ? (
              <p className="text-gray-500">No journeys found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJourneys.map((j) => (
                  <JourneyCard
                    key={j._id}
                    journeyId={j._id}
                    slug={j.slug?.current || ""}
                    title={j.title}
                    summary={j.summary}
                    imageUrl={j.heroUrl || "/fallback.jpg"}
                    alt={j.alt || j.title}
                    duration={j.duration || ""}
                    price={
                      !isNaN(parseFloat(j.price || "")) &&
                      parseFloat(j.price || "") > 1
                        ? j.price
                        : "Price on request"
                    }
                    star={j.star ? parseInt(j.star) : 0}
                    starIcon={j.starIcon}
                    region={j.region?.title || ""}
                    isFeatured={j.featuredOnHome === true}
                    isWishlisted={wishlistedMap[j._id] === true}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden">
          <div className="w-4/5 bg-white p-4 h-full overflow-y-auto">
            <JourneyFiltersSidebar
              isMobile
              onCloseMobile={() => setShowMobileFilters(false)}
              regions={regions}
              selectedRegion={selectedRegion}
              regionLoading={regionLoading}
              onChangeRegion={setSelectedRegion}
              countries={destinations}
              selectedCountries={selectedCountries}
              destinationsLoading={destinationsLoading}
              onToggleCountry={(v) => toggle(v, setSelectedCountries)}
              onClearCountries={() => setSelectedCountries([])}
              selectedStars={selectedStars}
              availableStars={availableStars}
              onToggleStar={(v) => toggle(v, setSelectedStars)}
              onClearStars={() => setSelectedStars([])}
              selectedSignature={selectedSignature}
              availableSignature={availableSignature}
              onToggleSignature={(v) => toggle(v, setSelectedSignature)}
              onClearSignature={() => setSelectedSignature([])}
              selectedInterests={selectedInterests}
              availableInterests={availableInterests}
              onToggleInterest={(v) => toggle(v, setSelectedInterests)}
              onClearInterests={() => setSelectedInterests([])}
              selectedActivities={selectedActivities}
              availableActivities={availableActivities}
              onToggleActivity={(v) => toggle(v, setSelectedActivities)}
              onClearActivities={() => setSelectedActivities([])}
              selectedDuration={selectedDuration ?? [0, 0]} // ✅ fallback
              onChangeDuration={setSelectedDuration}
              availableDurations={availableDurations}
              selectedPrice={selectedPrice ?? [0, 0]}
              onChangePrice={setSelectedPrice}
              availablePrices={availablePrices}
              onlyShowWishlisted={onlyShowWishlisted}
              onToggleWishlisted={() => setOnlyShowWishlisted((prev) => !prev)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
