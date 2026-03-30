"use client";

import { useEffect, useState } from "react";

export default function SafariBuilderProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("openSafariBuilder", handleOpen);

    return () => {
      window.removeEventListener("openSafariBuilder", handleOpen);
    };
  }, []);

  // lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SLIDE PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[100] shadow-2xl transform transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">Plan Your Safari</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-black"
          >
            Close
          </button>
        </div>

        {/* CONTENT (TEMP PLACEHOLDER) */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Step 1 coming next — this will become your Safari Builder.
          </p>
        </div>
      </div>
    </>
  );
}
