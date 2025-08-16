"use client";

import React from "react";
import { PortableText } from "@portabletext/react";
import type { Destination } from "./types"; // ✅ make sure this is defined in types.ts
import { useEffect } from "react";

type Props = {
  destination: Destination;
  onClose: () => void;
};

export default function CountryDrawer({ destination, onClose }: Props) {
  console.log("🧭 Drawer received destination:", destination);

  const country = destination;
  const countryTitle = country?.title || "this destination";
  useEffect(() => {
    // Lock scroll on mount
    document.body.classList.add("overflow-hidden");

    return () => {
      // Unlock scroll on unmount
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 z-[100001]" onClick={onClose}>
      <aside
        className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[640px] md:w-[800px] lg:w-[1024px] bg-white shadow-2xl z-[100002] border-l border-gray-300 flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
          <div className="font-semibold text-gray-800 text-lg">
            About {countryTitle}
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-700 hover:text-black"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 text-gray-700">
          {country?.travelInfo && (
            <section className="px-6 mt-6">
              <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                Travel Information
              </h4>
              <div className="prose prose-neutral max-w-none">
                <PortableText value={country.travelInfo} />
              </div>
            </section>
          )}

          {country?.highlights && (
            <section className="px-6 mt-8">
              <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                Highlights
              </h4>
              <div className="prose prose-neutral max-w-none">
                <PortableText value={country.highlights} />
              </div>
            </section>
          )}

          {Array.isArray(country?.practicalStuff) &&
            country.practicalStuff.length > 0 && (
              <section className="px-6 mt-8">
                <h4 className="text-lg font-semibold mb-4 text-neutral-900">
                  Practical Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {country.practicalStuff.map((sec, idx) => (
                    <div
                      key={`${sec.title ?? "section"}-${idx}`}
                      className="border border-neutral-200 rounded-lg p-4"
                    >
                      {sec.title && (
                        <h5 className="font-semibold text-neutral-900 mb-2">
                          {sec.title}
                        </h5>
                      )}
                      {sec.content && (
                        <div className="prose prose-neutral max-w-none">
                          <PortableText value={sec.content} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          {country?.mapLocation && (
            <section className="px-6 mt-8 mb-10">
              <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                Map
              </h4>
              <div className="rounded-lg border border-neutral-200 overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    country.mapLocation
                  )}&output=embed`}
                  width="100%"
                  height="380"
                  allowFullScreen
                  loading="lazy"
                  title={`${countryTitle} map`}
                />
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
