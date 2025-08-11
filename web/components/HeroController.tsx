"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client as sanityClient } from "@/lib/sanity";

const builder = imageUrlBuilder(sanityClient);
const urlFor = (src: SanityImageSource) => builder.image(src).width(1920).url();

/* ---------- export this ---------- */
export type HeroData = {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  backgroundImages?: Array<{
    alt?: string;
    asset?: { _ref?: string; _type?: string; url?: string };
  }>;
};
/* -------------------------------- */

type HeroAsset = {
  asset?: { url?: string } | SanityImageSource;
  alt?: string;
};

type HeroDoc = {
  scope: "default" | "home" | "journeys" | "blog" | "books" | "custom";
  customScope?: string;
  pageLabel?: string;
  headline?: string;
  subheadline?: string;
  action?: "none" | "homeFilters" | "typeSearch";
  backgroundImages?: HeroAsset[];
  primaryCTA?: string;
  secondaryCTA?: string;
};

type ActionMode = NonNullable<HeroDoc["action"]>;
/* ---------- Events ---------- */
const OPEN = {
  JOURNEY_SEARCH: "fts:open-search-sheet",
} as const;

/* ---------- Home dropdown filters ---------- */
function HomeFilters() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [destination, setDestination] = useState("");
  const [luxury, setLuxury] = useState("");

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "journey"]{ country->{title}, star }`)
      .then((rows: { country?: { title?: string }; star?: string }[]) => {
        const dests = Array.from(
          new Set(rows.map((j) => j.country?.title).filter(Boolean))
        ) as string[];
        const lux = Array.from(
          new Set(rows.map((j) => j.star).filter((s): s is string => !!s))
        );
        setDestinations(dests);
        setLuxuryLevels(lux);
      })
      .catch(() => {});
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (destination) qs.set("destination", destination);
    if (luxury) qs.set("luxury", luxury);
    router.push(`/journeys?${qs.toString()}`);
  };

  return (
    <form
      onSubmit={go}
      className="mt-5 mx-auto hidden md:flex bg-white/75 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-xl px-4 py-4 shadow-2xl flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10 dark:border-white/10 transition-all duration-300"
      role="search"
      aria-label="Find your safari"
    >
      <label className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition">
        <span className="text-black/60 text-sm shrink-0">Destination</span>
        <select
          className="bg-transparent outline-none text-sm w-full text-black appearance-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          aria-label="Destination"
        >
          <option value="">Choose a destination</option>
          {destinations.length === 0 ? (
            <option disabled>Loading…</option>
          ) : (
            destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))
          )}
        </select>
      </label>

      <label className="flex items-center gap-2 border border-black/10 rounded-lg px-4 py-2.5 w-full bg-white/90 hover:bg-white transition">
        <span className="text-black/60 text-sm shrink-0">Luxury Level</span>
        <select
          className="bg-transparent outline-none text-sm w-full text-black appearance-none"
          value={luxury}
          onChange={(e) => setLuxury(e.target.value)}
          aria-label="Luxury level"
        >
          <option value="">Select luxury level</option>
          {luxuryLevels.length === 0 ? (
            <option disabled>Loading…</option>
          ) : (
            luxuryLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))
          )}
        </select>
      </label>

      <button
        type="submit"
        className="bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto"
      >
        Search
      </button>
    </form>
  );
}

/* ---------- Presentational Hero ---------- */
function HeroView({
  bgUrl,
  pageLabel,
  headline,
  sub,
  children,
}: {
  bgUrl?: string;
  pageLabel?: string;
  headline?: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="relative h-[45vh] md:h-[90vh] max-h-[600px] w-full pt-24 md:pt-28 overflow-hidden"
      id="hero"
    >
      <Image
        src={bgUrl || "/hero.webp"}
        alt="Hero background"
        fill
        className="object-[center_25%] md:object-center object-cover transition-all duration-700"
        priority
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full text-white">
        {pageLabel ? (
          <span className="uppercase tracking-wide text-white/80 text-xs md:text-sm mb-1">
            {pageLabel}
          </span>
        ) : null}
        {headline ? (
          <h1 className="text-3xl md:text-6xl font-extrabold mb-2 leading-tight">
            {headline}
          </h1>
        ) : null}
        {sub ? (
          <p className="text-sm md:text-2xl text-white/90 max-w-xl mb-2 md:mb-4 leading-snug">
            {sub}
          </p>
        ) : null}

        {children ? (
          <div className="mt-3 w-full max-w-5xl">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Controller ---------- */
export default function HeroController({
  heroData,
}: {
  heroData?: {
    headline?: string;
    subheadline?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
    backgroundImages?: Array<{
      alt?: string;
      asset?: { _ref?: string; _type?: string; url?: string };
    }>;
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hero, setHero] = useState<HeroDoc | null>(null);
  const [bgUrl, setBgUrl] = useState<string | undefined>(undefined);

  // If parent provided heroData, use it and skip fetching
  useEffect(() => {
    if (!heroData) return;

    const doc: HeroDoc = {
      scope: "default",
      pageLabel: undefined,
      customScope: undefined,
      headline: heroData.headline,
      subheadline: heroData.subheadline,
      action: "none",
      backgroundImages: heroData.backgroundImages,
      primaryCTA: heroData.primaryCTA,
      secondaryCTA: heroData.secondaryCTA,
    };

    setHero(doc);

    const first = doc.backgroundImages?.[0]?.asset;
    if (first && typeof first === "object" && "url" in first && first.url) {
      setBgUrl(first.url as string);
    } else if (first) {
      setBgUrl(urlFor(first as SanityImageSource));
    } else {
      setBgUrl(undefined);
    }
  }, [heroData]);

  const HIDE_ON: RegExp[] = [
    /^\/(sign-in|sign-up)/,
    /^\/dashboard/,
    /^\/api/,
    /^\/project-portal/,
  ];
  const hideHero = HIDE_ON.some((rx) => rx.test(pathname));

  const pageKey = useMemo(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg || "home";
  }, [pathname]);

  const queryAndParams = useMemo(() => {
    const known = new Set(["home", "journeys", "blog", "books", "default"]);
    if (known.has(pageKey)) {
      return {
        query: `*[_type=="hero" && scope==$scope][0]{
          scope,
          customScope,
          pageLabel,
          headline,
          subheadline,
          action,
          backgroundImages[]{asset->{_id, url}, alt},
          primaryCTA,
          secondaryCTA
        }`,
        params: { scope: pageKey },
      };
    }
    return {
      query: `*[_type=="hero" && scope=="custom" && customScope==$key][0]{
        scope,
        customScope,
        pageLabel,
        headline,
        subheadline,
        action,
        backgroundImages[]{asset->{_id, url}, alt},
        primaryCTA,
        secondaryCTA
      }`,
      params: { key: pageKey },
    };
  }, [pageKey]);

  useEffect(() => {
    // If parent provided heroData, don't fetch from Sanity.
    if (heroData) return;

    let mounted = true;
    sanityClient
      .fetch<HeroDoc | null>(queryAndParams.query, queryAndParams.params)
      .then((doc) => {
        if (!mounted) return;
        setHero(doc ?? null);

        const first = doc?.backgroundImages?.[0]?.asset;
        if (first && typeof first === "object" && "url" in first && first.url) {
          setBgUrl(first.url as string);
        } else if (first) {
          setBgUrl(urlFor(first as SanityImageSource));
        } else {
          setBgUrl(undefined);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setHero(null);
        setBgUrl(undefined);
      });

    return () => {
      mounted = false;
    };
  }, [heroData, queryAndParams]);

  // Search helpers (declared unconditionally to keep hook order stable)
  const openJourneySearch = useCallback(
    (q: string) => {
      const base = "/journeys";
      const url = q
        ? `${base}?q=${encodeURIComponent(q)}&open=search`
        : `${base}?open=search`;

      if (pathname.startsWith(base)) {
        window.dispatchEvent(
          new CustomEvent(OPEN.JOURNEY_SEARCH, { detail: { q } })
        );
      } else {
        router.push(url);
      }
    },
    [pathname, router]
  );

  const onType = useCallback(
    (value: string) => {
      if (hero?.action !== "typeSearch") return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        openJourneySearch(value.trim());
      }, 300);
    },
    [hero?.action, openJourneySearch]
  );

  const initialQ = searchParams.get("q") ?? "";
  useEffect(() => {
    if (inputRef.current && initialQ && inputRef.current.value === "") {
      inputRef.current.value = initialQ;
    }
  }, [initialQ]);

  /* ---- Early return moved AFTER all hooks above ---- */
  if (hideHero || !hero) return null;

  const action: ActionMode = hero.action || "none";
  const showHomeFilters = action === "homeFilters";
  const showTypeSearch = action === "typeSearch";

  return (
    <HeroView
      bgUrl={bgUrl}
      pageLabel={hero.pageLabel}
      headline={hero.headline}
      sub={hero.subheadline}
    >
      {showHomeFilters ? <HomeFilters /> : null}

      {showTypeSearch ? (
        <>
          <div className="mt-2 hidden md:flex mx-auto max-w-xl items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-lg backdrop-blur">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search journeys…"
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              onChange={(e) => onType(e.target.value)}
              aria-label="Search journeys"
            />
          </div>
          <div className="mt-3 flex md:hidden mx-auto w-full max-w-md items-center gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search journeys…"
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              onChange={(e) => onType(e.target.value)}
              aria-label="Search journeys"
            />
          </div>
        </>
      ) : null}
    </HeroView>
  );
}
