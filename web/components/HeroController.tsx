"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client as sanityClient } from "@/lib/sanity";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

/* -------------------- MultiSelectDropdown -------------------- */
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

/* -------------------- Sanity image helpers -------------------- */
const builder = imageUrlBuilder(sanityClient);
const urlFor = (src: SanityImageSource) => builder.image(src).width(1920).url();

/* ---------- export this ---------- */
export type HeroData = {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  action?: "none" | "homeFilters" | "typeSearch";
  backgroundImages?: Array<
    | {
        // legacy single image
        alt?: string;
        asset?: { _ref?: string; _type?: string; url?: string };
        _type?: string | undefined;
      }
    | {
        // responsive object from schema
        _type?: "responsiveBackground";
        alt?: string;
        desktopImage?: SanityImageSource | { asset?: { url?: string } };
        mobileImage?: SanityImageSource | { asset?: { url?: string } };
      }
  >;
  primaryLink?: {
    href: string;
    label: string;
  };
};
/* -------------------------------- */

type HeroAssetLegacy = {
  asset?: { url?: string } | SanityImageSource;
  alt?: string;
  _type?: string;
};

type HeroAssetResponsive = {
  _type?: "responsiveBackground";
  desktopImage?: SanityImageSource | { asset?: { url?: string } };
  mobileImage?: SanityImageSource | { asset?: { url?: string } };
  alt?: string;
};

type HeroDoc = {
  scope: "default" | "home" | "journeys" | "blog" | "books" | "custom";
  customScope?: string;
  pageLabel?: string;
  headline?: string;
  subheadline?: string;
  action?: "none" | "homeFilters" | "typeSearch";
  backgroundImages?: (HeroAssetLegacy | HeroAssetResponsive)[];
  primaryCTA?: string;
  secondaryCTA?: string;
  primaryLink?: {
    href: string;
    label: string;
  };
};

type ActionMode = NonNullable<HeroDoc["action"]>;

/* -------------------- Filters -------------------- */
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
            "interests": *[_type == "travelInterest" && isTopInterest == true] | order(sortOrder asc) { title },
            "luxuryRaw": *[_type == "journey"].star
          }`,
        );

        const topInterests = result.interests.map((i) => i.title);
        const luxuryUnique = Array.from(
          new Set(result.luxuryRaw.filter((s): s is string => !!s)),
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
        destination.forEach((d) => qs.append("signature", d));

        luxury.forEach((l) => qs.append("luxury", l));
        router.push(`/africansafariitineraries?${qs.toString()}`);
      }}
      className="relative z-[999] mt-5 mx-auto hidden md:flex bg-white/75  backdrop-blur-md text-black rounded-xl px-4 py-4 shadow-2xl flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10  transition-all duration-300"
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

/* -------------------- Presentational Hero -------------------- */
function HeroView({
  bgUrlDesktop,
  bgUrlMobile,
  pageLabel,
  headline,
  sub,
  children,
  variant = "banner",
  alt,
  primaryLink,
  breadcrumbs,
}: {
  bgUrlDesktop?: string;
  bgUrlMobile?: string;
  pageLabel?: string;
  headline?: string;
  sub?: string;
  children?: React.ReactNode;
  variant?: "home" | "banner";
  alt?: string;
  primaryLink?: {
    href: string;
    label: string;
  };
  breadcrumbs?: { label: string; href: string }[];
}) {
  const isHome = variant === "home";
  const desktopSrc = bgUrlDesktop || bgUrlMobile || "/sunset-safari.webp";
  const mobileSrc = bgUrlMobile || bgUrlDesktop || "/sunset-safari.webp";

  return (
    <section
      className={`
    relative w-full
    ${isHome ? "h-[75vh] md:h-[80vh]" : "h-[500px] md:h-[500px]"}
    ${isHome ? "pt-24 md:pt-28" : ""}
  `}
      id="hero"
    >
      {/* Mobile art-directed image */}
      {/* Mobile image – DO NOT preload this */}
      <Image
        src={mobileSrc}
        alt={alt || "Hero background"}
        fill
        sizes="100vw"
        className="md:hidden object-cover object-center"
      />

      {/* Desktop image – THIS is preloaded for LCP */}
      <Image
        src={desktopSrc}
        alt={alt || "Hero background"}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hidden md:block object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full text-white">
        {breadcrumbs && (
          <div className="mb-3 text-sm text-white/80">
            {breadcrumbs.map((item, i) => (
              <span key={item.href}>
                {i > 0 && " / "}
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        )}
        {pageLabel && (
          <span className="uppercase tracking-wide text-white/80 text-xs md:text-sm mb-1">
            {pageLabel}
          </span>
        )}

        {headline ? (
          <h1
            className={`font-extrabold leading-tight ${
              isHome
                ? "text-4xl sm:text-5xl md:text-6xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            } mb-2 drop-shadow-md`}
          >
            {headline}
          </h1>
        ) : (
          <h1 className="sr-only">
            Luxury African Safaris That Make a Difference
          </h1> // fallback H1
        )}

        {sub && (
          <>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl mb-2 leading-snug drop-shadow">
              {sub}
            </p>
          </>
        )}

        {children && (
          <div className="mt-3 w-full max-w-5xl text-center">
            {children}

            {primaryLink && (
              <div className="mt-4">
                <Link
                  href={primaryLink.href}
                  className="text-white/90 text-sm font-medium hover:text-white transition underline-offset-4 hover:underline"
                >
                  {primaryLink.label} →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------- Type guards & helpers (no `any`) -------------------- */

/** A shape like { asset: { url: string } } */
type WithAssetUrl = { asset?: { url?: string } };

/** Return a usable URL from either a SanityImageSource or an {asset:{url}} shape */
function toUrl(
  src?: SanityImageSource | WithAssetUrl | null,
): string | undefined {
  if (!src) return "/sunset-safari.webp";

  if (
    typeof src === "object" &&
    src !== null &&
    "_ref" in src &&
    typeof (src as { _ref: unknown })._ref === "string"
  ) {
    return urlFor(src as SanityImageSource);
  }

  if (typeof src === "object" && src !== null && "asset" in src) {
    const asset = (src as WithAssetUrl).asset;

    if (asset && typeof asset === "object") {
      if ("_ref" in asset && typeof asset._ref === "string") {
        return urlFor(src as SanityImageSource);
      }

      if ("url" in asset && typeof asset.url === "string") {
        return asset.url;
      }
    }
  }

  return "/sunset-safari.webp"; // fallback
}

function isResponsiveItem(x: unknown): x is HeroAssetResponsive {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    o._type === "responsiveBackground" ||
    "desktopImage" in o ||
    "mobileImage" in o
  );
}

/** Extract first desktop/mobile URLs from heroData (responsive or legacy) */
function deriveBgUrls(items?: HeroData["backgroundImages"]): {
  desktop?: string;
  mobile?: string;
  alt?: string;
} {
  if (!items || items.length === 0) return {};

  const first = items[0];

  // Responsive object
  if (isResponsiveItem(first)) {
    return {
      desktop: toUrl(first.desktopImage ?? null),
      mobile: toUrl(first.mobileImage ?? null),
      alt: first.alt,
    };
  }

  // Legacy single image
  const legacy = first as HeroAssetLegacy;

  const directUrl =
    typeof legacy?.asset === "object" && legacy.asset && "url" in legacy.asset
      ? legacy.asset.url
      : undefined;

  return {
    desktop: directUrl,
    mobile: directUrl,
    alt: legacy.alt,
  };
}

/* -------------------- Controller -------------------- */
export default function HeroController({
  heroData,
  breadcrumbs,
}: {
  heroData?: HeroData;
  breadcrumbs?: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hero, setHero] = useState<HeroDoc | null>(null);
  const [bgDesktop, setBgDesktop] = useState<string | undefined>(undefined);
  const [bgMobile, setBgMobile] = useState<string | undefined>(undefined);

  const HIDE_ON: RegExp[] = [
    /^\/(sign-in|sign-up)/,
    /^\/dashboard/,
    /^\/api/,
    /^\/project-portal/,
  ];
  const hideHero = pathname ? HIDE_ON.some((rx) => rx.test(pathname)) : false;
  useEffect(() => {
    if (!heroData) return;

    const doc: HeroDoc = {
      scope: "default",
      pageLabel: undefined,
      customScope: undefined,
      headline: heroData.headline,
      subheadline: heroData.subheadline,
      action: heroData.action || "none",
      backgroundImages: heroData.backgroundImages as (
        | HeroAssetLegacy
        | HeroAssetResponsive
      )[],
      primaryCTA: heroData.primaryCTA,
      secondaryCTA: heroData.secondaryCTA,
      primaryLink: heroData.primaryLink,
    };

    setHero(doc);

    console.log("🔍 heroData.backgroundImages:", heroData.backgroundImages);

    const allImagesHaveUrl = (heroData.backgroundImages ?? []).every(
      (img) => "url" in img && typeof img.url === "string",
    );

    console.log("🔎 Do all hero images have a `url` field?:", allImagesHaveUrl);

    const { desktop, mobile } = deriveBgUrls(heroData.backgroundImages);
    console.log("✅ derived background URLs:", { desktop, mobile });

    setBgDesktop(desktop);
    setBgMobile(mobile);
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
    [hero?.action],
  );

  const initialQ = searchParams?.get("q") ?? "";

  useEffect(() => {
    if (inputRef.current && initialQ && inputRef.current.value === "") {
      inputRef.current.value = initialQ;
    }
  }, [initialQ]);

  if (hideHero) return null;

  if (!hero) {
    // Reserve vertical space while hero is loading to prevent CLS
    return <div className="min-h-[520px] sm:min-h-[640px]" />;
  }

  const action: ActionMode = hero.action || "none";
  console.log("🎯 HERO ACTION:", action);
  const showHomeFilters = action === "homeFilters";
  const showTypeSearch = action === "typeSearch";

  return (
    <HeroView
      breadcrumbs={breadcrumbs}
      bgUrlDesktop={bgDesktop}
      bgUrlMobile={bgMobile}
      alt={heroData?.backgroundImages?.[0]?.alt}
      pageLabel={hero.pageLabel}
      headline={hero.headline}
      sub={hero.subheadline}
      primaryLink={hero.primaryLink}
      variant={isHome ? "home" : "banner"}
    >
      {showHomeFilters && (
        <>
          <HomeFilters />

          {/* Mobile trigger button */}
          <div className="md:hidden mt-4 w-full flex justify-center">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("fts:open-search-sheet"))
              }
              className="text-sm px-4 py-2 border border-white text-white rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
            >
              Start Planning
            </button>
          </div>
        </>
      )}

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
