// components/GlobalBookingPortal.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { OPEN_BOOK_SHEET } from "./BottomTabBar";

export default function GlobalBookingPortal() {
  const [open, setOpen] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // open on custom event
  useEffect(() => {
    const handler = () => {
      setIframeReady(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_BOOK_SHEET, handler as EventListener);
    return () =>
      window.removeEventListener(OPEN_BOOK_SHEET, handler as EventListener);
  }, []);

  // ESC to close + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f2e7db] border-b border-gray-200 shadow-md relative px-4 pt-4 pb-6">
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-gray-800 hover:text-black"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:pr-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src="/logos/logo-top.png"
                alt="Fair Trade Safaris"
                className="h-10 w-auto"
              />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Discovery Call
                </h2>
                <p className="text-sm text-gray-600">
                  Pick a time that works for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loader */}
        {!iframeReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/70 rounded-md px-4 py-2 text-sm text-gray-700 shadow">
              Loading scheduler…
            </div>
          </div>
        )}

        {/* Zoho Bookings */}
        <iframe
          src="https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris"
          className="w-full h-[calc(100%-80px)]"
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
          onLoad={() => setIframeReady(true)}
        />
      </div>
    </div>
  );
}
