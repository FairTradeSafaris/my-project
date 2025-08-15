"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

type FAQItem = {
  _id: string;
  question: string;
  answer: PortableTextBlock[]; // ✅ FIXED
  keywords?: string[];
};

type FAQCat = {
  _id: string;
  title: string;
  items: FAQItem[];
};

export default function FAQClient({ categories }: { categories: FAQCat[] }) {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const closeModal = () => setSelectedFAQ(null);

  const cardBorder = "#d8cfc4";
  const tileBg = "#f9f6f2";
  const commonSearches = categories.map((c) => c.title).slice(0, 6);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div
        className="rounded-2xl shadow-lg border overflow-hidden"
        style={{ background: tileBg, borderColor: cardBorder }}
      >
        {/* Header */}
        <div
          className="px-6 md:px-8 py-5 border-b"
          style={{ borderColor: cardBorder }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Your Safari Questions, Answered
          </h2>
        </div>

        {/* Search + Chips */}
        <div className="px-6 md:px-8 pt-5">
          <div className="relative">
            <input
              className="w-full rounded-xl border px-4 py-3 pr-12 text-base focus:outline-none"
              style={{ borderColor: cardBorder }}
              placeholder="Ask about wildlife, lodges, ethics, or planning your perfect safari..."
              aria-label="Search FAQs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {commonSearches.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Popular questions:</span>
              {commonSearches.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-3 py-1 text-gray-700 hover:bg-[#f0ece6] cursor-pointer transition"
                  style={{ borderColor: cardBorder }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="px-6 md:px-8 pb-8">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition"
                style={{ borderColor: cardBorder }}
              >
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>

                <ul
                  className="mt-2 divide-y"
                  style={{ borderColor: cardBorder }}
                >
                  {cat.items?.map((q) => (
                    <li key={q._id} className="py-2">
                      <button
                        className="text-sm text-left text-gray-900 hover:underline focus:outline-none"
                        onClick={() => setSelectedFAQ(q)}
                      >
                        {q.question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedFAQ && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedFAQ.question}
            </h3>
            <div className="text-gray-700 text-sm leading-relaxed space-y-2">
              <PortableText value={selectedFAQ.answer} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
