"use client";

import { useState, useEffect } from "react";
import Africa from "@react-map/africa";
import { motion, AnimatePresence } from "framer-motion";
import { client as sanityClient } from "../../lib/sanity";

interface DestinationData {
  title: string;
  didYouKnowText: string;
  heroImage?: { asset?: { url: string } };
  ctaLink?: string;
}

const countryNameMap: Record<string, string> = {
  SouthAfrica: "South Africa",
  Botswana: "Botswana",
  Namibia: "Namibia",
  Kenya: "Kenya",
  Tanzania: "Tanzania",
  Zambia: "Zambia",
  Zimbabwe: "Zimbabwe",
  Uganda: "Uganda",
  Rwanda: "Rwanda",
  Malawi: "Malawi",
  Mozambique: "Mozambique",
  Madagascar: "Madagascar",
};

export default function DestinationMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [destination, setDestination] = useState<DestinationData | null>(null);

  useEffect(() => {
    if (selectedCountry) {
      sanityClient
        .fetch(
          `*[_type == "destination" && title == $country][0]{
            title,
            didYouKnowText,
            heroImage { asset->{ url } },
            ctaLink
          }`,
          { country: selectedCountry }
        )
        .then((data: DestinationData | null) => {
          if (!data) {
            console.warn("No destination found for:", selectedCountry);
          } else {
            console.log("Fetched from Sanity:", data);
          }
          setDestination(data);
        })
        .catch((err) => console.error("Sanity fetch error:", err));
    }
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-[#f2e5d5]">
      <div className="flex justify-center items-center px-4 py-10 min-h-[80vh]">
        <div className="w-full max-w-5xl flex justify-center items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: selectedCountry ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full h-auto"
          >
            <div className="w-full h-auto cursor-pointer [&>g>path]:transition-colors duration-200 [&>g>text]:fill-white [&>g>text]:text-[10px] [&>g>text]:font-medium [&>g>text]:pointer-events-none">
              <Africa
                type="select-single"
                mapColor="#5D4037"
                strokeColor="#f2e5d5"
                strokeWidth={0.3}
                hoverColor="#d4a373"
                selectColor="#a0522d"
                hints={true}
                onSelect={(state: string | null) => {
                  if (!state) return;
                  const normalized = countryNameMap[state] || state;
                  console.log("Map state:", state, "→ Normalized:", normalized);
                  setSelectedCountry(normalized);
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCountry && destination && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[60vw] lg:w-[45vw] bg-white shadow-2xl z-50 p-6 overflow-auto"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">{destination.title}</h2>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setDestination(null);
                }}
                className="text-2xl"
              >
                &times;
              </button>
            </div>

            {destination.didYouKnowText && (
              <p className="mt-4 text-sm italic text-yellow-800">
                Did you know? {destination.didYouKnowText}
              </p>
            )}

            {destination.heroImage?.asset?.url && (
              <div className="mt-6 rounded overflow-hidden">
                <img
                  src={destination.heroImage.asset.url}
                  alt="Destination hero"
                  className="w-full h-auto rounded"
                />
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setDestination(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              {destination.ctaLink && (
                <a
                  href={destination.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Book Discovery Call
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
