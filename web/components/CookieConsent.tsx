"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setIsVisible(true);
  }, []);

  const handleConsent = (value: string) => {
    localStorage.setItem("cookieConsent", value);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:bottom-10 z-50 max-w-sm w-full">
      <div className="bg-[#f2e7db] text-gray-800 rounded-2xl shadow-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Can we store cookies?</h2>
        <p className="text-sm mb-4">
          This website uses cookies to analyze traffic and remember your website
          choices. You can change your preferences at any time. Read more in our{" "}
          <a href="/privacy" className="font-semibold underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleConsent("accepted")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Accept All
          </button>
          <button
            onClick={() => handleConsent("denied")}
            className="bg-white border border-black text-black px-4 py-2 rounded-lg text-sm"
          >
            Decline All
          </button>
        </div>
      </div>
    </div>
  );
}
