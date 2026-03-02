"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CustomUserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative z-[100]">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-8 h-8 min-w-[32px] min-h-[32px] object-cover rounded-full border border-gray-300 dark:border-neutral-700"
        />
      </button>

      {/* Menu: UP on mobile, DOWN on desktop */}
      {open && (
        <div
          role="menu"
          className={`
            absolute right-0
            bottom-full mb-2          /* mobile: pop up */
            md:bottom-auto md:top-full md:mt-2 md:mb-0  /* desktop: pop down */
            w-72 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden
            ring-1 ring-black/10 dark:ring-white/10
            animate-in fade-in-0
            md:slide-in-from-top-2
            slide-in-from-bottom-2
          `}
        >
          {/* Arrow (auto positions with responsive classes) */}
          <div
            className="
              absolute right-4 w-3 h-3 rotate-45
              bg-white dark:bg-neutral-900 ring-1 ring-black/10 dark:ring-white/10
              -bottom-2 md:-top-2 md:bottom-auto
            "
          />

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
            <p className="font-semibold text-sm text-gray-800 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {/* Links */}
          <ul className="text-sm divide-y divide-gray-100 dark:divide-neutral-800">
            <li>
              <Link
                href="/client-home/"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                onClick={() => setOpen(false)}
              >
                🏠{" "}
                <span className="text-gray-800 dark:text-white">
                  Client Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/books/"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                onClick={() => setOpen(false)}
              >
                📚{" "}
                <span className="text-gray-800 dark:text-white">
                  Ultimate Guides to Africa
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/user-profile"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                onClick={() => setOpen(false)}
              >
                ⚙️{" "}
                <span className="text-gray-800 dark:text-white">
                  Manage Account
                </span>
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 transition"
              >
                🚪 <span>Sign Out</span>
              </button>
            </li>
          </ul>

          {/* Footer */}
          <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-neutral-800">
            Secured by Clerk
          </div>
        </div>
      )}
    </div>
  );
}
