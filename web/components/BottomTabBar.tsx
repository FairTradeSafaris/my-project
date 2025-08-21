"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, Search, CalendarCheck2, User2, BookOpen, X } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { client as sanityClient } from "@/lib/sanity";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";

export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const CLOSE_SEARCH_SHEET = "fts:close-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

type HelperKey = "search" | "book" | "bookFree" | "account";

const helperMessages: Record<HelperKey, string[]> = {
  search: ["Start your safari now", "Explore journeys that matter"],
  book: ["Need help planning?", "Talk to a safari expert"],
  bookFree: ["Claim your free book", "Your ethical safari guide awaits"],
  account: ["Sign in to personalize", "Track your bookings"],
};

export default function BottomTabBar() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [luxuryLevels, setLuxuryLevels] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLuxury, setSelectedLuxury] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [visibleHelper, setVisibleHelper] = useState<{
    key: HelperKey;
    message: string;
  } | null>(null);
  const [tooltipX, setTooltipX] = useState<number | null>(null);

  const TABBAR_BASE_HEIGHT = 56;

  const searchRef = useRef<HTMLButtonElement>(null);
  const bookRef = useRef<HTMLButtonElement>(null);
  const bookFreeRef = useRef<HTMLAnchorElement>(null);
  const accountRefSignedIn = useRef<HTMLDivElement>(null);
  const accountRefSignedOut = useRef<HTMLAnchorElement>(null);

  const setOpenWithEvents = (state: boolean) => {
    setOpen(state);
    window.dispatchEvent(
      new CustomEvent(state ? OPEN_SEARCH_SHEET : CLOSE_SEARCH_SHEET)
    );
  };

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
          setInterests(data.interests.map((i) => i.title));
          setLuxuryLevels(
            Array.from(
              new Set(data.luxuryRaw.filter((s): s is string => !!s))
            ).slice(0, 5)
          );
        }
      )
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => setOpenWithEvents(true);
    window.addEventListener(OPEN_SEARCH_SHEET, handler);
    return () => window.removeEventListener(OPEN_SEARCH_SHEET, handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.innerWidth > 768) return;

      const keys = Object.keys(helperMessages) as HelperKey[];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomMsg =
        helperMessages[randomKey][
          Math.floor(Math.random() * helperMessages[randomKey].length)
        ];

      setVisibleHelper({ key: randomKey, message: randomMsg });

      const refMap = {
        search: searchRef,
        book: bookRef,
        bookFree: bookFreeRef,
        account: isSignedIn ? accountRefSignedIn : accountRefSignedOut,
      } as Record<HelperKey, React.RefObject<Element>>;

      const rect = refMap[randomKey].current?.getBoundingClientRect();
      const centerX = rect ? rect.left + rect.width / 2 : null;

      if (centerX !== null && typeof window !== "undefined") {
        const left = Math.min(
          Math.max(centerX - 80, 8),
          window.innerWidth - 160
        );
        setTooltipX(left);
      }

      setTimeout(() => {
        setVisibleHelper(null);
        setTooltipX(null);
      }, 4000);
    }, 10000);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    selectedInterests.forEach((i) => params.append("interest", i));
    selectedLuxury.forEach((l) => params.append("luxury", l));
    router.push(`/journey?${params.toString()}`);
    setOpenWithEvents(false);
  };

  return (
    <>
      <AnimatePresence>
        {visibleHelper && tooltipX !== null && (
          <motion.div
            key={visibleHelper.key + visibleHelper.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[72px] z-[100] bg-white text-black px-4 py-2 text-sm rounded-2xl shadow-xl border border-gray-200 max-w-[80vw] text-center md:hidden"
            style={{ left: tooltipX }}
          >
            {visibleHelper.key === "search"
              ? "Start your trip"
              : visibleHelper.message}
            <div
              className="absolute top-full"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid white",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
          ref={searchRef}
          type="button"
          onClick={() => setOpenWithEvents(true)}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
        >
          <Search size={20} />
          <span>Trips</span>
        </button>

        <button
          ref={bookRef}
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_BOOK_SHEET))}
          className="flex flex-col items-center gap-1 text-xs active:scale-95"
        >
          <CalendarCheck2 size={20} />
          <span>Book Call</span>
        </button>

        <Link
          ref={bookFreeRef}
          href={isSignedIn ? "/books" : "/sign-up"}
          className="flex flex-col items-center gap-1 text-xs active:scale-95 transform"
          style={{ transformOrigin: "center center" }}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <span className="leading-[1rem]">Free Book</span>
        </Link>

        <SignedIn>
          <div
            ref={accountRefSignedIn}
            className="flex flex-col items-center gap-1 text-xs"
          >
            <CustomUserMenu />
            <span>Account</span>
          </div>
        </SignedIn>
        <SignedOut>
          <Link
            ref={accountRefSignedOut}
            href="/sign-in"
            className="flex flex-col items-center gap-1 text-xs"
          >
            <User2 size={20} />
            <span>Account</span>
          </Link>
        </SignedOut>
      </nav>
    </>
  );
}

// 👇 Move MultiSelectDropdown down here
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
        : [...selected, option]
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
