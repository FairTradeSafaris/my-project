// components/filters/JourneyFilters.tsx
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { client as sanity } from "@/lib/sanity";

type RegionOption = { title: string };

function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = useCallback(
    (
      patch: Record<string, string | null | undefined>,
      opts?: { replace?: boolean }
    ) => {
      const sp = new URLSearchParams(searchParams?.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "") sp.delete(k);
        else sp.set(k, String(v));
      }
      const url = `${pathname}?${sp.toString()}`;
      if (opts?.replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const get = useCallback(
    (k: string) => searchParams?.get(k) ?? "",
    [searchParams]
  );

  return { get, set, all: searchParams };
}

export default function JourneyFilters() {
  const { get, set, all } = useQueryState();
  const [isPending, startTransition] = useTransition();
  const applyBtnRef = useRef<HTMLButtonElement>(null);

  // Remote data
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Local UI state mirrors URL params
  const [region, setRegion] = useState(get("region"));
  const [nMin, setNMin] = useState(get("nightsMin"));
  const [nMax, setNMax] = useState(get("nightsMax"));
  const [priceMax, setPriceMax] = useState(get("priceMax"));

  // Keep local in sync with URL (back/forward etc.)
  useEffect(() => {
    setRegion(get("region"));
    setNMin(get("nightsMin"));
    setNMax(get("nightsMax"));
    setPriceMax(get("priceMax"));
  }, [all, get]);

  // Fetch region options from Sanity
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data: string[] = await sanity.fetch(
          `array::unique(*[_type=="journey" && defined(region->title)].region->title)`
        );
        if (cancelled) return;

        const opts = (data || [])
          .map((t) => String(t).trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
          .map((title) => ({ title }));

        setRegions(opts);
      } catch (err) {
        // Log and fall back to empty list

        console.error("JourneyFilters: regions fetch failed", err);
        if (!cancelled) setRegions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const parseNum = (v: string): string => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? String(Math.floor(n)) : "";
  };

  const apply = useCallback(() => {
    startTransition(() => {
      set(
        {
          region: region || null,
          nightsMin: parseNum(nMin) || null,
          nightsMax: parseNum(nMax) || null,
          priceMax: parseNum(priceMax) || null,
          open: null,
          page: null,
        },
        { replace: true }
      );
    });
  }, [nMax, nMin, priceMax, region, set]);

  const clear = useCallback(() => {
    setRegion("");
    setNMin("");
    setNMax("");
    setPriceMax("");

    startTransition(() => {
      set(
        {
          region: null,
          nightsMin: null,
          nightsMax: null,
          priceMax: null,
          open: null,
          page: null,
        },
        { replace: true }
      );
    });
  }, [set]);

  const hasActive = useMemo(
    () => Boolean(region || nMin || nMax || priceMax),
    [region, nMin, nMax, priceMax]
  );

  return (
    <section
      className="mx-auto w-full max-w-5xl rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur text-neutral-900"
      aria-busy={loading || isPending}
    >
      <form
        className="grid grid-cols-2 gap-3 md:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        {/* Region */}
        <label className="col-span-2 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            disabled={loading}
            aria-label="Region"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.title} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>
        </label>

        {/* Nights Min */}
        <label className="col-span-1 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">
            Nights (min)
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={nMin}
            onChange={(e) => setNMin(e.target.value)}
            placeholder="e.g. 5"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="Minimum nights"
          />
        </label>

        {/* Nights Max */}
        <label className="col-span-1 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">
            Nights (max)
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={nMax}
            onChange={(e) => setNMax(e.target.value)}
            placeholder="e.g. 10"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="Maximum nights"
          />
        </label>

        {/* Price Max */}
        <label className="col-span-2 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">
            Budget (max USD)
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="e.g. 6000"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="Maximum budget in USD"
          />
        </label>

        {/* Actions */}
        <div className="col-span-2 md:col-span-6 mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={!hasActive || isPending}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Clear
          </button>
          <button
            ref={applyBtnRef}
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white active:scale-95 disabled:opacity-70"
          >
            {isPending ? "Applying…" : "Apply filters"}
          </button>
        </div>
      </form>
    </section>
  );
}
