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
    <div className="fixed inset-x-4 bottom-24 sm:bottom-10 z-[9999] w-auto max-w-full sm:max-w-sm mx-auto">
      <div className="bg-[#f2e7db] text-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 text-sm sm:text-base">
        <h2 className="text-base sm:text-lg font-semibold mb-2">
          Can we store cookies?
        </h2>
        <p className="mb-4 leading-relaxed">
          This website uses cookies to analyze traffic and remember your website
          choices. Read more in our{" "}
          <a
            href="/privacy"
            className="underline font-semibold hover:text-black"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleConsent("accepted")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
          >
            Accept All
          </button>
          <button
            onClick={() => handleConsent("denied")}
            className="bg-white border border-black text-black px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
          >
            Decline All
          </button>
        </div>
      </div>
    </div>
  );
}
