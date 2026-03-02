"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, CalendarCheck2, User2, BookOpen, X } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { client as sanityClient } from "@/lib/sanity";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Event constants
export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const CLOSE_SEARCH_SHEET = "fts:close-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

// -------------------------------
// ✅ Parent: Handles Cookie Consent
// -------------------------------
export default function BottomTabBar() {
  const [hasConsent, setHasConsent] = useState(false);

  // Check localStorage for consent
  useEffect(() => {
    const stored = localStorage.getItem("cookieConsent");
    if (stored === "accepted") setHasConsent(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cookieConsent" && e.newValue === "accepted") {
        setHasConsent(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!hasConsent) return null; // Don’t render until consent is given

  return <BottomTabBarWithUser />;
}

// -------------------------------
// ✅ Subcomponent: Safe to use `useUser()` here
// -------------------------------
function BottomTabBarWithUser() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLuxury, setSelectedLuxury] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const TABBAR_BASE_HEIGHT = 56;
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let count = 0;
    let lastIndex: number | null = null;

    const interval = setInterval(() => {
      if (count >= 5) {
        clearInterval(interval);
        setActiveTooltipIndex(null);
        return;
      }

      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * 4);
      } while (nextIndex === lastIndex);

      setActiveTooltipIndex(nextIndex);
      lastIndex = nextIndex;
      count++;

      setTimeout(() => setActiveTooltipIndex(null), 2500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const setOpenWithEvents = (state: boolean) => {
    setOpen((prev) => {
      if (prev === state) return prev; // ⛔ Prevent redundant dispatch/renders
      if (state) {
        window.dispatchEvent(new CustomEvent(OPEN_SEARCH_SHEET));
      } else {
        window.dispatchEvent(new CustomEvent(CLOSE_SEARCH_SHEET));
      }
      return state;
    });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    sanityClient
      .fetch(
        `{
          "interests": *[_type == "travelInterest" && isTopInterest == true] | order(sortOrder asc) { title },
          "luxuryRaw": *[_type == "journey"].star
        }`,
      )
      .then(
        (data: {
          interests: { title: string }[];
          luxuryRaw: (string | null | undefined)[];
        }) => {
          if (!mounted) return;
          setInterests(data.interests.map((i) => i.title));
          setLuxuryLevels(
            Array.from(
              new Set(data.luxuryRaw.filter((s): s is string => !!s)),
            ).slice(0, 5),
          );
        },
      )
      .finally(() => mounted && setLoading(false));

    const openHandler = () => setOpenWithEvents(true);
    window.addEventListener(OPEN_SEARCH_SHEET, openHandler);

    return () => {
      mounted = false;
      window.removeEventListener(OPEN_SEARCH_SHEET, openHandler);
    };
  }, []);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    selectedInterests.forEach((i) => params.append("signature", i));
    selectedLuxury.forEach((l) => params.append("luxury", l));
    router.push(`/africansafariitineraries?${params.toString()}`);
    setOpenWithEvents(false);
  };

  return (
    <>
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
            className="md:hidden fixed inset-x-0 bottom-0 z-[70] bg-white text-neutral-900 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <h2 className="text-sm font-semibold">
                Discover Your Journey of a Lifetime
              </h2>
              <button
                type="button"
                onClick={() => setOpenWithEvents(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              className="px-4 pb-4 pt-2 flex flex-col gap-3"
            >
              {loading ? (
                <p className="text-sm text-gray-500">Loading options...</p>
              ) : (
                <>
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
                </>
              )}
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

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t border-black/10 dark:border-white/10 grid grid-cols-5 items-center text-center"
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
          className="relative flex flex-col items-center gap-1 text-xs active:scale-95"
        >
          {activeTooltipIndex === 0 && (
            <TooltipBubble text="Start your safari now" top="-top-16" />
          )}
          <Search size={20} />
          <span>Trips</span>
        </button>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_BOOK_SHEET))}
          className="relative flex flex-col items-center gap-1 text-xs active:scale-95"
        >
          {activeTooltipIndex === 1 && (
            <TooltipBubble text="Talk to a safari expert" top="-top-22" />
          )}
          <CalendarCheck2 size={20} />
          <span>Book Call</span>
        </button>

        <Link
          href={isSignedIn ? "/books" : "/sign-up"}
          className="relative flex flex-col items-center gap-1 text-xs active:scale-95"
        >
          {activeTooltipIndex === 2 && (
            <TooltipBubble
              text={
                isSignedIn ? "Access your free book" : "Claim your free book"
              }
              top="-top-22"
            />
          )}
          <div className="w-5 h-5 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <span className="leading-[1rem]">Free Book</span>
        </Link>

        <div className="relative flex flex-col items-center gap-1 text-xs">
          {activeTooltipIndex === 3 && (
            <TooltipBubble text="Track your bookings" top="-top-18" />
          )}
          <SignedIn>
            <div className="flex flex-col items-center gap-1">
              <CustomUserMenu />
              <span>Account</span>
            </div>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in/">
              <User2 size={20} />
              <span>Account</span>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </>
  );
}

// TooltipBubble and MultiSelectDropdown remain unchanged
function TooltipBubble({ text, top }: { text: string; top: string }) {
  return (
    <div className={`absolute ${top} right-0 z-50`}>
      <div className="relative bg-white text-black px-3 py-1.5 text-xs rounded-[18px] shadow-xl text-center pb-3">
        {text}
        <div
          className="absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45"
          style={{ boxShadow: "none" }}
        />
      </div>
    </div>
  );
}

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
    setSelected(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
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
          className="relative w-full cursor-pointer rounded-md border border-black/10 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none text-base text-black"
        >
          {selected.length > 0 ? selected.join(", ") : <span>{label}</span>}
          <ChevronUpDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 z-[9999] w-full rounded-xl bg-white shadow-2xl max-h-[300px] overflow-auto border border-gray-200 text-black">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleSelection(option)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                  className="mr-2 pointer-events-none"
                />
                <span className="text-base">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
