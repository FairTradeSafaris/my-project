"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export default function CustomUserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-[100]">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full focus:outline-none"
      >
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-8 h-8 min-w-[32px] min-h-[32px] object-cover rounded-full border border-gray-300 dark:border-neutral-700"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
          {/* Header */}
          <div className="px-4 py-3 border-b dark:border-neutral-700">
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
                href="/client-home"
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
                href="/books"
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
                href="/account"
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
          <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-600 border-t dark:border-neutral-700">
            Secured by Clerk
          </div>
        </div>
      )}
    </div>
  );
}
