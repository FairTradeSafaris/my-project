"use client";

import React, { Suspense, useEffect, useState } from "react";
import { client as sanityClient } from "@/lib/sanity";
import JourneyCard from "@/components/JourneyCard";
import type { Journey } from "./journey-finder/types";
import { JOURNEY_FINDER_QUERY } from "./journey-finder/query";
import { useDestinationOptions } from "@/hooks/filters/useCountryOptions";
import JourneyFiltersSidebar from "@/components/JourneyFiltersSidebar";
import { useUser } from "@clerk/nextjs";
import { useWishlistGrid } from "@/hooks/useWishlistGrid";
import { useSearchParams } from "next/navigation";
import StickySafariCTA from "@/components/StickySafariCTA";
import LineArt from "@/components/LineArt";
// Batch 13: the ONE itinerary finder for everyone (it used to be split into
// a "cookies accepted" and a "not accepted" copy). Filter logic and look are
// the accepted version's. A future redesign can replace just the JSX below.
// Batch 16: the trip list is now rendered on the server (the page passes the
// journeys in as initialJourneys), so the HTML already contains every trip.
// The same GROQ query (journey-finder/query.ts) is used on the server; the
// client only fetches if it was not given any journeys.
// Batch 18: filters restyled (display only): sticky filter card on desktop,
// a "Filters" bar + full-screen sheet on phones, small removable "active filter"
// chips and one "Clear all". Calm style: collapsible sections, large
// checkboxes. The filtering itself is unchanged.

// Filter options (regions, prices, durations) worked out from the journeys.
function deriveOptions(data: Journey[]) {
  const regionTitles = data
    .map((j) => j.region?.title)
    .filter((r): r is string => Boolean(r));
  const priceVals = data
    .map((j) => j.price)
    .filter((p) => typeof p === "number") as unknown as number[];
  const durationVals = data
    .map((j) => parseInt(j.duration?.match(/\d+/)?.[0] ?? "0", 10))
    .filter((d) => !isNaN(d));
  const prices = [...new Set(priceVals)].sort((a, b) => a - b);
  const durations = [...new Set(durationVals)].sort((a, b) => a - b);
  return {
    regions: [...new Set(regionTitles)],
    prices,
    durations,
    priceRange:
      prices.length > 0
        ? ([prices[0], prices[prices.length - 1]] as [number, number])
        : null,
    durationRange:
      durations.length > 0
        ? ([durations[0], durations[durations.length - 1]] as [number, number])
        : null,
  };
}

// Reads the URL query (?q=, ?luxury=, ...) in its own small component inside
// <Suspense>, so the rest of the finder (the trip list) can still be rendered
// on the server. Renders nothing.
function SearchParamsReader({
  onChange,
}: {
  onChange: (p: URLSearchParams | null) => void;
}) {
  const sp = useSearchParams();
  useEffect(() => {
    onChange(sp);
  }, [sp, onChange]);
  return null;
}

export default function JourneyFinderClient({
  initialJourneys,
}: {
  initialJourneys?: Journey[];
}) {
  const hasInitial = Array.isArray(initialJourneys);
  const [initialOptions] = useState(() =>
    deriveOptions(initialJourneys ?? []),
  );
  const [journeys, setJourneys] = useState<Journey[]>(initialJourneys ?? []);
  const [loading, setLoading] = useState(!hasInitial);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions, setRegions] = useState<string[]>(initialOptions.regions);
  const [regionLoading, setRegionLoading] = useState(!hasInitial);

  const { destinations, loading: destinationsLoading } =
    useDestinationOptions(selectedRegion);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null,
  );
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
  >(initialOptions.durationRange);
  const [selectedPrice, setSelectedPrice] = useState<[number, number] | null>(
    initialOptions.priceRange,
  );

  const [availableDurations, setAvailableDurations] = useState<number[]>(
    initialOptions.durations,
  );
  const [availablePrices, setAvailablePrices] = useState<number[]>(
    initialOptions.prices,
  );

  const [onlyShowWishlisted, setOnlyShowWishlisted] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { isLoaded, user } = useUser();
  const userId = isLoaded && user?.id ? user.id : null;

  const toggle = <T,>(
    value: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>,
  ) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  useEffect(() => {
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
  }, [searchParams]);

  const { wishlistedMap } = useWishlistGrid(journeys, userId);

  useEffect(() => {
    // Already rendered on the server with the journeys: nothing to fetch.
    if (hasInitial) return;
    sanityClient.fetch(JOURNEY_FINDER_QUERY).then((data: Journey[]) => {
      const o = deriveOptions(data);
      setJourneys(data);
      setLoading(false);
      setRegions(o.regions);
      setRegionLoading(false);
      setAvailablePrices(o.prices);
      setAvailableDurations(o.durations);
      if (o.priceRange) setSelectedPrice(o.priceRange);
      if (o.durationRange) setSelectedDuration(o.durationRange);
    });
  }, [hasInitial]);

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

  // ---- Batch 18: display helpers (no change to what is filtered) ----
  const fullDuration: [number, number] = [
    availableDurations[0] ?? 0,
    availableDurations.at(-1) ?? 0,
  ];
  const fullPrice: [number, number] = [
    availablePrices[0] ?? 0,
    availablePrices.at(-1) ?? 0,
  ];
  const durationNarrowed =
    !!selectedDuration &&
    (selectedDuration[0] > fullDuration[0] ||
      selectedDuration[1] < fullDuration[1]);
  const priceNarrowed =
    !!selectedPrice &&
    (selectedPrice[0] > fullPrice[0] || selectedPrice[1] < fullPrice[1]);

  type ActivePill = { key: string; label: string; onRemove: () => void };
  const activePills: ActivePill[] = [
    ...(selectedRegion
      ? [{ key: "r", label: selectedRegion, onRemove: () => setSelectedRegion("") }]
      : []),
    ...selectedCountries.map((c) => ({
      key: `c-${c}`,
      label: c,
      onRemove: () => toggle(c, setSelectedCountries),
    })),
    ...selectedStars.map((n) => ({
      key: `s-${n}`,
      label: `${n} Star${n > 1 ? "s" : ""}`,
      onRemove: () => toggle(n, setSelectedStars),
    })),
    ...selectedSignature.map((v) => ({
      key: `g-${v}`,
      label: v,
      onRemove: () => toggle(v, setSelectedSignature),
    })),
    ...selectedInterests.map((v) => ({
      key: `i-${v}`,
      label: v,
      onRemove: () => toggle(v, setSelectedInterests),
    })),
    ...selectedActivities.map((v) => ({
      key: `a-${v}`,
      label: v,
      onRemove: () => toggle(v, setSelectedActivities),
    })),
    ...(durationNarrowed && selectedDuration
      ? [{
          key: "d",
          label: `${selectedDuration[0]}–${selectedDuration[1]} days`,
          onRemove: () => setSelectedDuration(fullDuration),
        }]
      : []),
    ...(priceNarrowed && selectedPrice
      ? [{
          key: "p",
          label: `$${selectedPrice[0].toLocaleString()}–$${selectedPrice[1].toLocaleString()}`,
          onRemove: () => setSelectedPrice(fullPrice),
        }]
      : []),
    ...(onlyShowWishlisted
      ? [{ key: "w", label: "Saved journeys", onRemove: () => setOnlyShowWishlisted(false) }]
      : []),
  ];
  const activeCount = activePills.length;

  const clearAll = () => {
    setSelectedRegion("");
    setSelectedCountries([]);
    setSelectedStars([]);
    setSelectedSignature([]);
    setSelectedInterests([]);
    setSelectedActivities([]);
    setSelectedDuration(fullDuration);
    setSelectedPrice(fullPrice);
    setOnlyShowWishlisted(false);
  };

  // Cards without a page (no slug) are not drawn, so they are not counted.
  const shownCount = filteredJourneys.filter(
    (j) => j.slug?.current && j.slug.current !== "null",
  ).length;
  const shownLabel = `${shownCount} ${shownCount === 1 ? "safari" : "safaris"}`;

  // Phone sheet: lock page scroll behind it and close on Escape.
  useEffect(() => {
    if (!showMobileFilters) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMobileFilters(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [showMobileFilters]);

  const pillRow = (
    <>
      <span className="shrink-0 text-[14px] text-[#8a7766]">Filtered by:</span>
      {activePills.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={p.onRemove}
          aria-label={`Remove filter: ${p.label}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#f5efe6] px-2.5 py-1 text-[14px] text-[#3c2a1e] transition hover:bg-[#efe5d6]"
        >
          {p.label}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[#8a7766]" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ))}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="shrink-0 px-1 text-[14px] text-[#8a7766] underline underline-offset-4 hover:text-[#a35c2d]"
        >
          Clear all
        </button>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black px-4 py-6">
      <Suspense fallback={null}>
        <SearchParamsReader onChange={setSearchParams} />
      </Suspense>
      <div className="max-w-7xl mx-auto">
        {/* h2: the page (app/africansafariitineraries/page.tsx) already has
            the <h1> ("Safari. Reimagined."); same classes, so it looks the same */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 lg:mb-6">
          <h2 className="text-2xl font-bold">African Safari Itineraries</h2>
          {!loading && (
            <p className="hidden text-[15px] text-[#8a7766] lg:block" aria-live="polite">
              Showing <span className="font-medium text-[#24170f]">{shownLabel}</span>
              {activeCount > 0 ? " that match your filters" : ""}
            </p>
          )}
        </div>

        {/* Phone: filter bar + active filter pills (scroll sideways) */}
        <div className="mb-5 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              aria-haspopup="dialog"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#d9cbb8] bg-white px-4 text-[16px] font-medium text-[#24170f] transition hover:border-[#a35c2d]"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="M3 5h14M6 10h8M8.5 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="text-[#a35c2d]">({activeCount})</span>
              )}
            </button>
            {!loading && (
              <p className="text-[15px] text-[#8a7766]" aria-live="polite">
                <span>{shownLabel}</span>
              </p>
            )}
          </div>
          {activeCount > 0 && (
            <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pillRow}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:rounded-2xl [scrollbar-width:thin]">
            <JourneyFiltersSidebar
              resultCount={loading ? undefined : shownCount}
              activeCount={activeCount}
              onClearAll={clearAll}
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
              showWishlistToggle={!!userId}
              onToggleWishlisted={() => setOnlyShowWishlisted((prev) => !prev)}
            />
            </div>
          </aside>

          <section className="lg:col-span-3">
            {activeCount > 0 && (
              <div className="mb-5 hidden flex-wrap items-center gap-2 lg:flex">
                {pillRow}
              </div>
            )}
            {loading ? (
              <p className="text-gray-500">Loading journeys...</p>
            ) : filteredJourneys.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-[#ebe1d3] bg-white px-6 py-12 text-center">
                <LineArt
                  name="giraffes"
                  className="mx-auto mb-5 w-[180px] text-[#a35c2d] opacity-30"
                />
                <p className="text-[18px] font-semibold text-[#24170f]">No journeys found.</p>
                <p className="mt-2 text-[14px] text-[#5c4a3d]">
                  Try removing a filter, or let us design one around you.
                </p>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#24170f] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#5d4037]"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJourneys.map((j, index) => (
                  <React.Fragment key={j._id}>
                    {/* 👉 Inject custom card at position 2 (change index if needed) */}
                    {index === 0 && (
                      <div className="relative rounded-2xl overflow-hidden group h-full min-h-[420px]">
                        {/* Background Image */}
                        <img
                          src="/images/Custom-Tours.jpg" // 👉 replace with your image
                          alt="Tailor made safari"
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                        {/* Content */}
                        <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                          <div className="mb-4">
                            <p className="text-xs uppercase tracking-widest opacity-80 mb-2">
                              Tailor-Made Experience
                            </p>

                            <h3 className="text-2xl font-semibold leading-tight mb-3">
                              Your Safari. Your Story.
                            </h3>

                            <p className="text-sm opacity-90">
                              Designed around you — no templates, no limits.
                              Just unforgettable journeys crafted with purpose.
                            </p>
                          </div>
                          <a
                            href="https://bookings.fairtradesafaris.com/#/fairtradesafaris"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 bg-white text-black py-3 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition w-fit inline-block text-center"
                          >
                            Start Planning
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Normal journey card */}
                    <JourneyCard
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
                  </React.Fragment>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {showMobileFilters && (
        <div
          className="fixed inset-0 z-[10000] flex justify-end bg-[#24170f]/40 lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMobileFilters(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="h-full w-full max-w-[440px] shadow-2xl"
          >
            <JourneyFiltersSidebar
              isMobile
              onCloseMobile={() => setShowMobileFilters(false)}
              resultCount={loading ? undefined : shownCount}
              activeCount={activeCount}
              onClearAll={clearAll}
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
              showWishlistToggle={!!userId}
              onToggleWishlisted={() => setOnlyShowWishlisted((prev) => !prev)}
            />
          </div>
        </div>
      )}
      <StickySafariCTA />
    </main>
  );
}
