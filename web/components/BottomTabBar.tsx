// components/BottomTabBar.tsx
"use client";

/**
 * IMPORTANT:
 * Ensure your <head> includes:
 * <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
 * so iOS exposes the safe-area variables.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, CalendarCheck2, User2, BookOpen, X } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { client as sanityClient } from "@/lib/sanity";

export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

export default function BottomTabBar() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Local slide-up sheet state
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [destination, setDestination] = useState("");
  const [luxury, setLuxury] = useState("");
  const [loading, setLoading] = useState(false);

  // Load options (same query as HomeFilters)
  useEffect(() => {
    let mounted = true;
    sanityClient
      .fetch(`*[_type == "journey"]{ country->{title}, star }`)
      .then((rows: { country?: { title?: string }; star?: string }[]) => {
        if (!mounted) return;
        const dests = Array.from(
          new Set(rows.map((j) => j.country?.title).filter(Boolean))
        ) as string[];
        const lux = Array.from(
          new Set(rows.map((j) => j.star).filter((s): s is string => !!s))
        );
        setDestinations(dests);
        setLuxuryLevels(lux);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Allow other parts of the app to open this sheet via event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(
      OPEN_SEARCH_SHEET,
      handler as unknown as EventListener
    );
    return () => {
      window.removeEventListener(
        OPEN_SEARCH_SHEET,
        handler as unknown as EventListener
      );
    };
  }, []);

  const openSearch = () => {
    setOpen(true);
  };

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const qs = new URLSearchParams();
    if (destination) qs.set("destination", destination);
    if (luxury) qs.set("luxury", luxury);
    const url = qs.toString() ? `/journeys?${qs.toString()}` : `/journeys`;
    router.push(url);
    setOpen(false);
  };

  // Height constants
  const TABBAR_BASE_HEIGHT = 56; // px

  return (
    <>
      {/* Slide-up sheet (mobile only) */}
      {open && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[69] md:hidden bg-black/50 backdrop-blur-sm"
          />

          {/* Panel (sits above the tab bar height + safe area) */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="
              md:hidden fixed inset-x-0 z-[70]
              rounded-t-2xl bg-white text-neutral-900 shadow-2xl
            "
            style={{
              bottom: `calc(${TABBAR_BASE_HEIGHT}px + env(safe-area-inset-bottom))`,
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <h2 className="text-sm font-semibold">Find your safari</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 active:scale-95"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              className="px-4 pb-4 pt-2 flex flex-col gap-3"
            >
              {/* Destination */}
              <label className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 bg-white">
                <span className="text-neutral-600 text-xs shrink-0">
                  Destination
                </span>
                <select
                  className="bg-transparent outline-none text-sm w-full text-neutral-900 appearance-none"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  aria-label="Destination"
                >
                  <option value="">
                    {loading || destinations.length === 0
                      ? "Loading…"
                      : "Choose a destination"}
                  </option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              {/* Luxury */}
              <label className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 bg-white">
                <span className="text-neutral-600 text-xs shrink-0">
                  Luxury Level
                </span>
                <select
                  className="bg-transparent outline-none text-sm w-full text-neutral-900 appearance-none"
                  value={luxury}
                  onChange={(e) => setLuxury(e.target.value)}
                  aria-label="Luxury level"
                >
                  <option value="">
                    {loading || luxuryLevels.length === 0
                      ? "Loading…"
                      : "Select luxury level"}
                  </option>
                  {luxuryLevels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="mt-1 w-full rounded-lg bg-neutral-900 text-white py-2.5 text-sm font-semibold active:scale-95"
              >
                Search
              </button>
            </form>
          </div>
        </>
      )}

      {/* Bottom mobile tab bar */}
      <nav
        className="
          md:hidden fixed bottom-0 inset-x-0 z-[60]
          bg-white/95 dark:bg-neutral-900/95 backdrop-blur
          border-t border-black/10 dark:border-white/10
          flex items-center justify-around px-4
        "
        style={{
          // Real height = base height + iOS safe area
          height: `calc(${TABBAR_BASE_HEIGHT}px + env(safe-area-inset-bottom))`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Home */}
        <Link href="/" className="flex flex-col items-center gap-1 text-xs">
          <Home size={20} />
          <span>Home</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={openSearch}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Open safari filters"
        >
          <Search size={20} />
          <span>Search</span>
        </button>

        {/* Book call */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_BOOK_SHEET))}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Open booking portal"
        >
          <CalendarCheck2 size={20} />
          <span>Book call</span>
        </button>

        {/* Claim Your Free Book */}
        <Link
          href={isSignedIn ? "/books" : "/sign-up"}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Claim your free book"
        >
          <BookOpen size={20} />
          <span>Free Book</span>
        </Link>

        {/* Account */}
        <SignedIn>
          <div className="flex flex-col items-center gap-1 text-xs">
            <CustomUserMenu />
            <span>Account</span>
          </div>
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="flex flex-col items-center gap-1 text-xs"
            aria-label="Sign in"
          >
            <User2 size={20} />
            <span>Account</span>
          </Link>
        </SignedOut>
      </nav>
    </>
  );
}
