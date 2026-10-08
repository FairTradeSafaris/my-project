"use client";

import { useEffect, useState } from "react";

// Batch 3a: the first-visit splash is capped at SPLASH_MAX_MS (was ~9 s) and
// skipped for crawlers/automation, so it no longer delays the page for bots
// or holds back LCP. To revert, restore the previous timing block below.
const SPLASH_MAX_MS = 1000;
const BOT_UA =
  /bot|crawl|spider|slurp|mediapartners|google-inspectiontool|bingpreview|facebookexternalhit|embedly|preview/i;

const messages = [
  "Tracking Wildlife…",
  "Preparing Your Guide…",
  "Entering The Serengeti…",
];

export default function SafariLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (BOT_UA.test(navigator.userAgent) || navigator.webdriver) {
      setLoading(false);
      return;
    }

    const shown = sessionStorage.getItem("safariLoaderShown");

    if (shown) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("safariLoaderShown", "true");

    // Cycle the messages within the cap, then hide the overlay.
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, Math.floor(SPLASH_MAX_MS / messages.length));
    const done = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, SPLASH_MAX_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, []);

  // SEO: children are ALWAYS rendered (also on the server) so the page's H1 and
  // copy are in the raw HTML. Previously this returned null until mount and
  // hid children while loading, so crawlers that don't run JS saw an empty page.
  // The splash is now only an overlay on top of the already-rendered content.
  return (
    <>
      {mounted && loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
          <div className="text-center px-6">
            <div className="text-lg tracking-[0.35em] uppercase text-white/60 mb-8">
              Fair Trade Safaris
            </div>

            <div className="text-3xl sm:text-4xl font-light transition-opacity duration-700">
              {messages[index]}
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
