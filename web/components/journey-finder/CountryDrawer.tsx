"use client";

import React, { useEffect } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Destination } from "./types";
import Image from "next/image";

type Props = {
  destination: Destination;
  onClose: () => void;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-5 mb-3">{children}</h2>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default function CountryDrawer({ destination, onClose }: Props) {
  const country = destination;
  const countryTitle = country?.title || "this destination";

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100001]" onClick={onClose}>
      <aside
        className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[640px] md:w-[800px] lg:w-[1024px] bg-white shadow-2xl z-[100002] border-l border-gray-300 flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-30 text-2xl font-bold text-white hover:text-white/80"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Top Hero Banner */}
        {country?.image && (
          <div className="relative h-[220px] sm:h-[280px] md:h-[320px] w-full z-0">
            <Image
              src={country.image}
              alt={`${country.title} banner`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
              <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                {country?.title}
              </h3>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db] z-10 relative">
          <div className="font-semibold text-gray-800 text-lg">
            About {countryTitle}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-grow overflow-y-auto p-6 text-gray-700">
          {country?.travelInfo && (
            <section className="px-6 mt-6">
              <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                Travel Information
              </h4>
              <div className="prose prose-neutral max-w-none">
                <PortableText
                  value={country.travelInfo}
                  components={portableTextComponents}
                />
              </div>
            </section>
          )}

          {country?.highlights && (
            <section className="px-6 mt-8">
              <h4 className="text-lg font-semibold mb-2 text-neutral-900">
                Highlights
              </h4>
              <div className="prose prose-neutral max-w-none">
                <PortableText
                  value={country.highlights}
                  components={portableTextComponents}
                />
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
                          <PortableText
                            value={sec.content}
                            components={portableTextComponents}
                          />
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
