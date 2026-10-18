"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getImageProps } from "next/image";
import { isSanityImage, sanityLoader } from "@/lib/sanityImageLoader";
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
  tone = "default",
}: {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (val: string[]) => void;
  /** Batch 21: "home" = larger, calmer controls for the homepage hero */
  tone?: "default" | "home";
}) {
  const home = tone === "home";
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
          className={
            home
              ? "relative w-full cursor-pointer truncate rounded-xl border border-[#e9dccb] bg-[#fbf6ef] py-3.5 pl-4 pr-11 text-left text-[16px] text-[#24170f] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e2c39c]/60"
              : "relative w-full cursor-pointer rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm text-black"
          }
        >
          {selected.length > 0 ? (
            selected.join(", ")
          ) : (
            <span className={home ? "text-[#5c4a3d]" : "text-black"}>{label}</span>
          )}
          <ChevronUpDownIcon
            className={home ? "absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a7766]" : "absolute right-2 top-2.5 h-5 w-5 text-gray-400"}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className={home ? "absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-[#ebe1d3] bg-white py-1 text-left shadow-xl" : "absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-black/10"}>
            {options.map((option) => (
              <div
                key={option}
                className={home ? "flex cursor-pointer items-center px-4 py-3 hover:bg-[#f7f3ec]" : "flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleSelection(option)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                  className={home ? "pointer-events-none mr-3 h-4 w-4 accent-[#5d4037]" : "mr-2 pointer-events-none"}
                />
                <span className={home ? "text-[16px] text-[#24170f]" : "text-sm text-black"}>{option}</span>
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
function HomeFilters({ tone = "default" }: { tone?: "default" | "home" }) {
  const home = tone === "home";
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
      className={
        home
          ? "relative z-[999] hidden w-full max-w-3xl flex-col items-stretch gap-3 rounded-2xl border border-white/15 bg-[#1a100a]/55 p-3 backdrop-blur-md md:flex md:flex-row"
          : "relative z-[999] mt-5 mx-auto hidden md:flex bg-white/75  backdrop-blur-md text-black rounded-xl px-4 py-4 shadow-2xl flex-col md:flex-row items-stretch gap-3 w-full max-w-3xl border border-black/10  transition-all duration-300"
      }
      role="search"
      aria-label="Find your safari"
    >
      <MultiSelectDropdown
        label="I want to experience…"
        options={destinations}
        selected={destination}
        setSelected={setDestination}
        tone={tone}
      />

      <MultiSelectDropdown
        label="Luxury Level"
        options={luxuryLevels}
        selected={luxury}
        setSelected={setLuxury}
        tone={tone}
      />

      <button
        type="submit"
        className={
          home
            ? "flex w-full shrink-0 items-center justify-center rounded-xl bg-[#e2c39c] px-8 py-3.5 text-[16px] font-semibold text-[#24170f] transition hover:bg-[#ecd3b2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e2c39c]/60 md:w-auto"
            : "bg-black text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center w-full md:w-auto mt-4 md:mt-0"
        }
      >
        Search
      </button>
    </form>
  );
}

/* -------------------- Art-directed hero image -------------------- */
function HeroPicture({
  desktopSrc,
  mobileSrc,
  alt,
  extra = false,
  onLoad,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt?: string;
  /** Batch 21: a later rotating slide (decorative, normal priority) */
  extra?: boolean;
  onLoad?: () => void;
}) {
  const common = {
    alt: extra ? "" : alt || "Hero background",
    fill: true,
    sizes: "100vw",
    quality: 70,
  } as const;
  // Batch 4: Sanity hero images are requested from Sanity's image CDN
  // (sized per srcset width) instead of Vercel's /_next/image optimizer.
  const loaderFor = (src: string) =>
    isSanityImage(src) ? { loader: sanityLoader } : {};
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopSrc, ...loaderFor(desktopSrc) });
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: mobileSrc,
    ...(extra ? {} : { priority: true }),
    ...loaderFor(mobileSrc),
  });

  if (extra) {
    return (
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
        <img {...rest} alt="" loading="eager" fetchPriority="low" onLoad={onLoad} className="object-cover object-center" />
      </picture>
    );
  }

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      <img {...rest} fetchPriority="high" className="object-cover object-center" />
    </picture>
  );
}

/* -------------------- Batch 21: calm homepage hero rotation -------------------- */
// Slide 0 is the normal server-rendered, high-priority HeroPicture (LCP and
// SEO unchanged). The other slides mount only after the page has loaded,
// then fade in slowly (1.2s) every 7s. No rotation for prefers-reduced-motion;
// paused while the tab is hidden. A slide is only shown once its image loaded.
type Slide = { desktop: string; mobile: string };
const SLIDE_MS = 7000;
const FADE_MS = 1200;

function HeroRotation({ slides }: { slides: Slide[] }) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const loaded = useRef<boolean[]>(slides.map((_, i) => i === 0));
  const activeRef = useRef(0);

  // Mount the extra slides only after load (+ a short idle pause).
  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      t = setTimeout(() => setReady(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (t) clearTimeout(t);
    };
  }, [slides.length]);

  // Advance every 7s while the tab is visible.
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const cur = activeRef.current;
      for (let step = 1; step < slides.length; step++) {
        const next = (cur + step) % slides.length;
        if (loaded.current[next]) {
          activeRef.current = next;
          setPrev(cur);
          setActive(next);
          return;
        }
      }
    };
    const run = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      if (document.visibilityState === "visible") timer = setInterval(tick, SLIDE_MS);
    };
    run();
    document.addEventListener("visibilitychange", run);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", run);
    };
  }, [ready, slides.length]);

  if (!ready) return null;

  return (
    <div aria-hidden="true">
      {slides.map((sl, i) =>
        i === 0 ? null : (
          <div
            key={i}
            data-slide={i}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              transitionDuration: `${FADE_MS}ms`,
              opacity: i === active || (i === prev && active !== 0) ? 1 : 0,
              zIndex: i === active ? 3 : i === prev ? 2 : 1,
            }}
          >
            <HeroPicture
              extra
              desktopSrc={sl.desktop}
              mobileSrc={sl.mobile}
              onLoad={() => {
                loaded.current[i] = true;
              }}
            />
          </div>
        ),
      )}
    </div>
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
  headlineAs = "h1",
  slides,
  look = "default",
}: {
  headlineAs?: "h1" | "p";
  /** Batch 23: "calm" = homepage-style banner (core pages opt in) */
  look?: "default" | "calm";
  /** Batch 21: homepage only, all background images for the rotation */
  slides?: Slide[];
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
  const calm = !isHome && look === "calm";
  const desktopSrc = bgUrlDesktop || bgUrlMobile || "/sunset-safari.webp";
  const mobileSrc = bgUrlMobile || bgUrlDesktop || "/sunset-safari.webp";

  if (isHome) {
    // Batch 21: homepage hero in the ambassador-page style. Left-aligned
    // eyebrow, H1 (same Sanity text), subheadline and the same search filters
    // (restyled) over a dark gradient; background slowly rotates through the
    // Sanity images.
    return (
      <section
        className="relative flex min-h-[max(560px,80svh)] w-full items-end bg-[#24170f] text-[#fbf6ef] md:min-h-[max(620px,86svh)]"
        id="hero"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0">
            <HeroPicture desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt={alt} />
          </div>
          {slides && slides.length > 1 && <HeroRotation slides={slides} />}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1a100a] via-[#1a100a]/55 to-[#1a100a]/25" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1a100a]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6 pb-14 pt-32 sm:pb-20 sm:pt-36 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e2c39c] sm:text-xs">
            {pageLabel || "Fair Trade Safaris"}
          </p>
          {headlineAs === "p" ? (
            headline ? (
              <p className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {headline}
              </p>
            ) : null
          ) : (
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {headline || "Luxury African Safaris That Make a Difference"}
            </h1>
          )}
          {sub && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#efe4d6] sm:text-xl">
              {sub}
            </p>
          )}
          {children && <div className="mt-9 w-full max-w-3xl">{children}</div>}
          {primaryLink && (
            <div className="mt-5">
              <Link
                href={primaryLink.href}
                className="text-[15px] font-medium text-[#efe4d6] underline decoration-[#e2c39c]/60 underline-offset-4 transition hover:text-white hover:decoration-[#e2c39c]"
              >
                {primaryLink.label} &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (calm) {
    // Batch 23: homepage-style banner for the core pages (display only). Same
    // image (server-rendered, high priority), same breadcrumbs, label,
    // headline tag, subheadline, search and link; text left-aligned in the
    // 1440 container over the homepage's dark brown gradient.
    return (
      <section className="relative flex h-[440px] w-full items-end pt-20 md:h-[500px] md:pt-24" id="hero">
        <HeroPicture desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt={alt} />

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1a100a]/90 via-[#1a100a]/45 to-[#1a100a]/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1a100a]/60 via-transparent to-transparent" />

        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6 pb-10 text-[#fbf6ef] sm:px-8 md:pb-12 lg:px-12 xl:px-16">
          {breadcrumbs && (
            <div className="mb-4 text-[14px] text-[#e9dccb]">
              {breadcrumbs.map((item, i) => (
                <span key={item.href}>
                  {i > 0 && " / "}
                  <Link href={item.href} className="hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </span>
              ))}
            </div>
          )}
          {pageLabel && (
            <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.24em] text-[#e2c39c]">
              {pageLabel}
            </span>
          )}

          {headline && headlineAs === "p" ? (
            <p className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {headline}
            </p>
          ) : headlineAs === "p" ? null : headline ? (
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
          ) : (
            <h1 className="sr-only">
              Luxury African Safaris That Make a Difference
            </h1>
          )}

          {sub && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#efe4d6] sm:text-xl">
              {sub}
            </p>
          )}

          {children && (
            <div className="mt-6 w-full max-w-3xl">
              {children}

              {primaryLink && (
                <div className="mt-5">
                  <Link
                    href={primaryLink.href}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#fbf6ef] px-6 text-[15px] font-semibold text-[#24170f] transition hover:bg-white"
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

  return (
    <section
      className={`
    relative w-full
    ${isHome ? "h-[75vh] md:h-[80vh]" : "h-[500px] md:h-[500px]"}
    ${isHome ? "pt-24 md:pt-28" : "pt-20 md:pt-24"}
  `}
      id="hero"
    >
      {/* LCP: art-directed hero via <picture>. The mobile <Image> used to be
          lazy-loaded (it is the mobile LCP element: 5.5s LCP on Lighthouse
          mobile). Now one <img>, eager + high priority, and the browser picks
          the mobile or desktop source, so only one file is downloaded. */}
      <HeroPicture desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt={alt} />

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

        {headline && headlineAs === "p" ? (
          // page renders its own <h1>; keep the hero headline as styled text
          <p
            className={`font-extrabold leading-tight ${
              isHome
                ? "text-4xl sm:text-5xl md:text-6xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            } mb-2 drop-shadow-md`}
          >
            {headline}
          </p>
        ) : headlineAs === "p" ? null : headline ? (
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
  return deriveItem(items[0]);
}

/** Batch 21: all slides (desktop + mobile URL per item) for the homepage rotation */
function deriveSlides(items?: HeroData["backgroundImages"]): Slide[] {
  if (!items) return [];
  return items
    .map((it) => deriveItem(it))
    .filter((d): d is { desktop: string; mobile: string } & typeof d => !!(d.desktop || d.mobile))
    .map((d) => ({
      desktop: (d.desktop || d.mobile) as string,
      mobile: (d.mobile || d.desktop) as string,
    }));
}

function deriveItem(first: NonNullable<HeroData["backgroundImages"]>[number]): {
  desktop?: string;
  mobile?: string;
  alt?: string;
} {
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

function toHeroDoc(heroData: HeroData): HeroDoc {
  return {
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
}

/* -------------------- Controller -------------------- */
export default function HeroController({
  heroData,
  breadcrumbs,
  headlineAs = "h1",
  look = "default",
}: {
  heroData?: HeroData;
  breadcrumbs?: { label: string; href: string }[];
  /** use "p" on pages that already render their own <h1> */
  headlineAs?: "h1" | "p";
  /** Batch 23: "calm" = homepage-style banner; other pages keep the default */
  look?: "default" | "calm";
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SEO: hero state is derived synchronously from props so the hero <h1>,
  // subheadline and LCP image are part of the server-rendered HTML. It used to
  // be set in useEffect (client only), so the raw HTML had only an empty
  // placeholder <div> and no H1 on the homepage and every page using this hero.
  const [hero, setHero] = useState<HeroDoc | null>(() =>
    heroData ? toHeroDoc(heroData) : null,
  );
  const [bgDesktop, setBgDesktop] = useState<string | undefined>(
    () => deriveBgUrls(heroData?.backgroundImages).desktop,
  );
  const [bgMobile, setBgMobile] = useState<string | undefined>(
    () => deriveBgUrls(heroData?.backgroundImages).mobile,
  );

  const HIDE_ON: RegExp[] = [
    /^\/(sign-in|sign-up)/,
    /^\/dashboard/,
    /^\/api/,
    /^\/project-portal/,
  ];
  const hideHero = pathname ? HIDE_ON.some((rx) => rx.test(pathname)) : false;
  useEffect(() => {
    if (!heroData) return;

    setHero(toHeroDoc(heroData));

    const { desktop, mobile } = deriveBgUrls(heroData.backgroundImages);
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
  const showHomeFilters = action === "homeFilters";
  const homeSlides = isHome ? deriveSlides(heroData?.backgroundImages) : undefined;
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
      headlineAs={headlineAs}
      slides={homeSlides}
      look={look}
    >
      {showHomeFilters && (
        <>
          <HomeFilters tone={isHome ? "home" : "default"} />

          {/* Mobile trigger button */}
          <div className={isHome ? "md:hidden w-full" : "md:hidden mt-4 w-full flex justify-center"}>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("fts:open-search-sheet"))
              }
              className={
                isHome
                  ? "inline-flex items-center gap-2 rounded-xl bg-[#e2c39c] px-7 py-3.5 text-[16px] font-semibold text-[#24170f] transition hover:bg-[#ecd3b2]"
                  : "text-sm px-4 py-2 border border-white text-white rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 transition"
              }
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
