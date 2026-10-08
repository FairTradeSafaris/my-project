"use client";

import { useEffect, useState } from "react";

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

    const shown = sessionStorage.getItem("safariLoaderShown");

    if (shown) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("safariLoaderShown", "true");

    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      setIndex(step);

      if (step === messages.length - 1) {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
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
