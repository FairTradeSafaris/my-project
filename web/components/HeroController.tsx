"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client as sanityClient } from "@/lib/sanity";
import { Fragment } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

function MultiSelectDropdown({
  label,
  options,
  selected,
  setSelected,
}: {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (val: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div className="relative w-full z-50" onBlur={handleBlur}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-pointer rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm text-black"
        >
          {selected.length > 0 ? (
            selected.join(", ")
          ) : (
            <span className="text-black">{label}</span>
          )}
          <ChevronUpDownIcon
            className="absolute right-2 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-black/10">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleSelection(option)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                  className="mr-2 pointer-events-none"
                />
                <span className="text-sm text-black">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  action?: "none" | "homeFilters" | "typeSearch";
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

/* ---------- Home dropdown filters ---------- */
function HomeFilters() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [destination, setDestination] = useState<string[]>([]);
  const [luxury, setLuxury] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const result: {
          interests: { title: string }[];
          luxuryRaw: (string | null | undefined)[];
        } = await sanityClient.fetch(
          `{
  "interests": *[_type == "travelInterest" && isTopInterest == true][0...5] {
    title
  },
  "luxuryRaw": *[_type == "journey"].star
}
`
        );

        const topInterests = result.interests.map((i) => i.title);
        const luxuryUnique = Array.from(
          new Set(result.luxuryRaw.filter((s): s is string => !!s))
        ).slice(0, 5);

        setDestinations(topInterests);
        setLuxuryLevels(luxuryUnique);
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };

    fetchFilters();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const qs = new URLSearchParams();
        destination.forEach((d) => qs.append("interest", d));
        luxury.forEach((l) => qs.append("luxury", l));
        router.push(`/journey?${qs.toString()}`);
      }}
      className="relative z-[999] mt-5 mx-auto hidden md:flex bg-white/75 dark:bg-black/60 backdrop-blur-md text-black rounded-xl px-4 py-4 shadow-2xl flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10 dark:border-white/10 transition-all duration-300"
      role="search"
      aria-label="Find your safari"
    >
      <MultiSelectDropdown
        label="I want to experience…"
        options={destinations}
        selected={destination}
        setSelected={setDestination}
      />

      <MultiSelectDropdown
        label="Luxury Level"
        options={luxuryLevels}
        selected={luxury}
        setSelected={setLuxury}
      />

      <button
        type="submit"
        className="bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto mt-4 md:mt-0"
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
  variant = "banner",
}: {
  bgUrl?: string;
  pageLabel?: string;
  headline?: string;
  sub?: string;
  children?: React.ReactNode;
  variant?: "home" | "banner";
}) {
  const isHome = variant === "home";

  return (
    <section
      className={`
    relative 
    w-full 
    ${isHome ? "aspect-[16/9] md:h-auto" : "h-[500px] md:h-[500px]"}
    pt-24 md:pt-28
  `}
      id="hero"
    >
      <Image
        src={bgUrl || "/hero.webp"}
        alt="Hero background"
        fill
        className={`
          transition-all duration-700 
          object-center 
          ${isHome ? "object-contain" : "object-cover"}
        `}
        priority
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full text-white">
        {pageLabel && (
          <span className="uppercase tracking-wide text-white/80 text-xs md:text-sm mb-1">
            {pageLabel}
          </span>
        )}
        {headline && (
          <h1
            className={`font-extrabold leading-tight ${
              isHome
                ? "text-4xl sm:text-5xl md:text-6xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            } mb-2 drop-shadow-md`}
          >
            {headline}
          </h1>
        )}
        {sub && (
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl mb-2 md:mb-4 leading-snug drop-shadow">
            {sub}
          </p>
        )}

        {children && <div className="mt-3 w-full max-w-5xl">{children}</div>}
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
    action?: "none" | "homeFilters" | "typeSearch"; // ✅ <-- ADD THIS LINE
    backgroundImages?: Array<{
      alt?: string;
      asset?: { _ref?: string; _type?: string; url?: string };
    }>;
  };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hero, setHero] = useState<HeroDoc | null>(null);
  const [bgUrl, setBgUrl] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    if (!heroData) return; // ✅ no fetch needed, data comes from ClientLayout

    const doc: HeroDoc = {
      scope: "default",
      pageLabel: undefined,
      customScope: undefined,
      headline: heroData.headline,
      subheadline: heroData.subheadline,
      action: heroData.action || "none",
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

  const onType = useCallback(
    (value: string) => {
      if (hero?.action !== "typeSearch") return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("q", value.trim());
        params.set("open", "true");

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }, 300);
    },
    [hero?.action]
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
              className="w-full bg-transparent text-base md:text-sm text-black outline-none placeholder:text-black"
              onChange={(e) => onType(e.target.value)}
              aria-label="Search journeys"
            />
          </div>
          <div className="mt-3 flex md:hidden mx-auto w-full max-w-md items-center gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search journeys…"
              className="w-full bg-transparent text-base md:text-sm text-black outline-none placeholder:text-black"
              onChange={(e) => onType(e.target.value)}
              aria-label="Search journeys"
            />
          </div>
        </>
      ) : null}
    </HeroView>
  );
}
