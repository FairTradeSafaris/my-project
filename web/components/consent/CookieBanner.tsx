"use client";
// Same banner text and look as before (components/CookieConsent.tsx), now
// driven by useConsent(): no reload, and it can be reopened from the
// footer "Cookie settings" link.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConsent } from "./ConsentProvider";

export default function CookieBanner() {
  const { ready, decided, analytics, accept, decline, settingsOpen, closeSettings } = useConsent();
  // render nothing until mounted, so server HTML and first client render match
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !ready || (decided && !settingsOpen)) return null;

  return (
    <div role="dialog" aria-label="Cookie choices" className="fixed inset-x-4 bottom-24 sm:bottom-10 z-[9999] w-auto max-w-full sm:max-w-sm mx-auto">
      <div className="relative bg-[#f2e7db] text-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 text-sm sm:text-base">
        {settingsOpen && decided && (
          <button type="button" onClick={closeSettings} aria-label="Close" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-lg hover:bg-black/5">
            ×
          </button>
        )}
        <h2 className="text-base sm:text-lg font-semibold mb-2">Can we store cookies?</h2>
        <p className="mb-4 leading-relaxed">
          This website uses cookies to analyze traffic and remember your website choices. Read more in our{" "}
          <Link href="/privacy/" className="underline font-semibold hover:text-black">
            Privacy Policy
          </Link>
          .
        </p>
        {settingsOpen && decided && (
          <p className="mb-4 text-xs text-gray-600">
            Your current choice: <strong>{analytics ? "Accepted" : "Declined"}</strong>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={accept} className="bg-black text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto">
            Accept All
          </button>
          <button onClick={decline} className="bg-white border border-black text-black px-4 py-2 rounded-lg text-sm w-full sm:w-auto">
            Decline All
          </button>
        </div>
      </div>
    </div>
  );
}
