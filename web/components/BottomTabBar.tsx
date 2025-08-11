// components/BottomTabBar.tsx
"use client";

import Link from "next/link";
import { Home, Search, CalendarCheck2, User2, BookOpen } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";

export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

export default function BottomTabBar() {
  const { isSignedIn } = useUser();

  return (
    <nav
      className="
        md:hidden fixed bottom-0 inset-x-0 z-[60]
        h-[56px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur
        border-t border-black/10 dark:border-white/10
        flex items-center justify-around px-4
      "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Home */}
      <Link href="/" className="flex flex-col items-center gap-1 text-xs">
        <Home size={20} />
        <span>Home</span>
      </Link>

      {/* Search */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_SHEET))}
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
  );
}
