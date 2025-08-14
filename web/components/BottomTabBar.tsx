"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, CalendarCheck2, User2, BookOpen, X } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { client as sanityClient } from "@/lib/sanity";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const CLOSE_SEARCH_SHEET = "fts:close-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

// Multi-select dropdown
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
    <div className="relative w-full" onBlur={handleBlur}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-pointer rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none text-sm text-black"
        >
          {selected.length > 0 ? selected.join(", ") : <span>{label}</span>}
          <ChevronUpDownIcon
            className="absolute right-2 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-black/10">
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

export default function BottomTabBar() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLuxury, setSelectedLuxury] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const TABBAR_BASE_HEIGHT = 56;

  // Sync open state with global event dispatch
  const setOpenWithEvents = (state: boolean) => {
    setOpen(state);
    window.dispatchEvent(
      new CustomEvent(state ? OPEN_SEARCH_SHEET : CLOSE_SEARCH_SHEET)
    );
  };

  // Fetch filter options
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    sanityClient
      .fetch(
        `{
          "interests": *[_type == "travelInterest" && isTopInterest == true][0...5] { title },
          "luxuryRaw": *[_type == "journey"].star
        }`
      )
      .then(
        (data: {
          interests: { title: string }[];
          luxuryRaw: (string | null | undefined)[];
        }) => {
          if (!mounted) return;
          const topInterests = data.interests.map((i) => i.title);
          const luxuryUnique = Array.from(
            new Set(data.luxuryRaw.filter((s): s is string => !!s))
          ).slice(0, 5);
          setInterests(topInterests);
          setLuxuryLevels(luxuryUnique);
        }
      )
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for global "open search" events
  useEffect(() => {
    const handler = () => setOpenWithEvents(true);
    window.addEventListener(OPEN_SEARCH_SHEET, handler);
    return () => {
      window.removeEventListener(OPEN_SEARCH_SHEET, handler);
    };
  }, []);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const qs = new URLSearchParams();
    selectedInterests.forEach((d) => qs.append("interest", d));
    selectedLuxury.forEach((l) => qs.append("luxury", l));
    const url = `/journeys?${qs.toString()}`;
    router.push(url);
    setOpenWithEvents(false);
  };

  return (
    <>
      {/* Slide-up Search Sheet */}
      {open && (
        <>
          <button
            aria-label="Close search"
            onClick={() => setOpenWithEvents(false)}
            className="fixed inset-0 z-[69] md:hidden bg-black/50 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="md:hidden fixed inset-x-0 z-[70] rounded-t-2xl bg-white text-neutral-900 shadow-2xl"
            style={{
              bottom: `calc(${TABBAR_BASE_HEIGHT}px + env(safe-area-inset-bottom))`,
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <h2 className="text-sm font-semibold">
                Start Your Transformational Journey
              </h2>
              <button
                type="button"
                onClick={() => setOpenWithEvents(false)}
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
              <MultiSelectDropdown
                label="I want to experience…"
                options={interests}
                selected={selectedInterests}
                setSelected={setSelectedInterests}
              />

              <MultiSelectDropdown
                label="Luxury Level"
                options={luxuryLevels}
                selected={selectedLuxury}
                setSelected={setSelectedLuxury}
              />

              <button
                type="submit"
                className="mt-1 w-full rounded-lg bg-neutral-900 text-white py-2.5 text-sm font-semibold active:scale-95"
              >
                Start My Safari
              </button>
            </form>
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t border-black/10 dark:border-white/10 flex items-center justify-around px-4"
        style={{
          height: `calc(${TABBAR_BASE_HEIGHT}px + env(safe-area-inset-bottom))`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Link href="/" className="flex flex-col items-center gap-1 text-xs">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpenWithEvents(true)}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Open safari filters"
        >
          <Search size={20} />
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_BOOK_SHEET))}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Open booking portal"
        >
          <CalendarCheck2 size={20} />
          <span>Book call</span>
        </button>

        <Link
          href={isSignedIn ? "/books" : "/sign-up"}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
          aria-label="Claim your free book"
        >
          <BookOpen size={20} />
          <span>Free Book</span>
        </Link>

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
