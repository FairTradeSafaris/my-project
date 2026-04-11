"use client";

import { useEffect, useState } from "react";

export default function StickySafariCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2 z-[999]
        w-[92%] max-w-3xl
        transition-all duration-500 ease-out
        md:bottom-6 bottom-[75px]
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}
      `}
    >
      <div
        className="
          bg-gradient-to-r from-[#3b2a1f] to-[#5a3e2b]
          text-white
          shadow-2xl
          rounded-2xl
          px-4 sm:px-8 py-3 sm:py-4
          flex flex-col sm:flex-row
          items-start sm:items-center
          gap-2 sm:gap-4
          border border-[#6b4a32]
        "
      >
        {/* Message */}
        <div className="flex flex-col">
          <p className="text-[13px] sm:text-base font-semibold leading-snug">
            Not seeing your perfect safari?
          </p>
          <p className="text-[11px] sm:text-sm text-white/80">
            We’ll design it around you — destinations, dates, and style.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            window.location.href = "/contact";
          }}
          className="
            w-full sm:w-auto
            text-center
            bg-white text-[#3b2a1f]
            px-5 sm:px-7 py-2.5 sm:py-3
            rounded-lg
            text-sm font-bold
            shadow-md
            transition-all duration-300
            hover:scale-105 hover:shadow-xl
          "
        >
          Talk to a Consultant
        </button>
      </div>
    </div>
  );
}
