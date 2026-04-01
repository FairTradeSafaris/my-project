"use client";

import Link from "next/link";

export const metadata = {
  title: "Offline — Fair Trade Safaris",
  description: "You’re offline. Try again when you’re back on the network.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  const retry = () => {
    // Attempt to reload the current page when back online
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black   p-6">
      <section className="w-full max-w-md rounded-2xl border border-neutral-200  p-6 shadow-sm">
        {/* Inline icon to avoid network requests */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 ">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 3C7.03 3 2.53 5.94 1 10.5h2.2A10.02 10.02 0 0 1 12 5c3.87 0 7.24 2.2 8.8 5.5H23C21.47 5.94 16.97 3 12 3Zm0 4a9 9 0 0 0-8.66 6.5h2.17A7 7 0 0 1 12 9a7 7 0 0 1 6.49 4.5h2.17A9 9 0 0 0 12 7Zm0 4a5 5 0 0 0-4.58 3.5h2.13A3 3 0 0 1 12 13a3 3 0 0 1 2.45 1.5h2.13A5 5 0 0 0 12 11Zm0 3.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold mb-2">You’re offline</h1>
        <p className="text-sm text-neutral-600  mb-6">
          No internet connection. You can still open pages you’ve already
          visited. When you’re back online, reload to continue exploring Fair
          Trade Safaris.
        </p>

        <div className="flex gap-3">
          <button
            onClick={retry}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 border border-neutral-300  hover:bg-neutral-50  transition"
            type="button"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 bg-black text-white   hover:opacity-90 transition"
          >
            Go Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Tip: Add this app to your home screen for quick access.
        </p>
      </section>
    </main>
  );
}
