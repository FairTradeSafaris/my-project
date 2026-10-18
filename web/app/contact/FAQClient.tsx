"use client";

import { useState, useMemo, useRef } from "react";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

type FAQItem = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  keywords?: string[];
};

type FAQCat = {
  _id: string;
  title: string;
  items: FAQItem[];
};

export default function FAQClient({ categories }: { categories: FAQCat[] }) {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ✅ Explicit destination control list
  const destinationKeywords = [
    "Namibia",
    "Tanzania",
    "Kenya",
    "Zambia",
    "Botswana",
    "Uganda",
    "Rwanda",
    "Zimbabwe",
    "South Africa",
    "Madagascar",
    "Mozambique",
    "Indian Ocean Islands",
    "Mount Kilimanjaro",
  ];

  const isDestination = (title: string) =>
    destinationKeywords.some((keyword) =>
      title.toLowerCase().includes(keyword.toLowerCase()),
    );

  const destinationCategories = categories
    .map((c) => c.title)
    .filter((title) => isDestination(title));

  const topicCategories = categories
    .map((c) => c.title)
    .filter((title) => !isDestination(title));

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (activeCategory) {
      result = result.filter((c) => c.title === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result
        .map((cat) => {
          const filteredItems = cat.items.filter(
            (item) =>
              item.question.toLowerCase().includes(term) ||
              item.keywords?.some((k) => k.toLowerCase().includes(term)),
          );

          return filteredItems.length > 0
            ? { ...cat, items: filteredItems }
            : null;
        })
        .filter(Boolean) as FAQCat[];
    }

    return result;
  }, [categories, searchTerm, activeCategory]);

  const toggleQuestion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? null : id));
  };

  const handleCategoryClick = (title: string) => {
    setActiveCategory(title);
    setSearchTerm("");

    setTimeout(() => {
      categoryRefs.current[title]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const clearCategory = () => {
    setActiveCategory(null);
  };

  const renderChips = (titles: string[]) =>
    titles.map((title) => (
      <button
        key={title}
        onClick={() => handleCategoryClick(title)}
        className={`rounded-lg border px-3.5 py-2 text-[15px] transition-colors ${
          activeCategory === title
            ? "border-[#24170f] bg-[#24170f] text-white"
            : "border-[#e5ddd2] bg-white text-[#3c2a1e] hover:border-[#c9a57f]"
        }`}
      >
        {title}
      </button>
    ));

  return (
    <section className="mx-auto max-w-[1440px] py-8 font-sans md:py-10">
      <div className="overflow-hidden rounded-2xl border border-[#ebe1d3] bg-white shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)]">
        <div className="border-b border-[#efe5d6] px-5 py-7 md:px-10 md:py-8">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveCategory(null);
            }}
            className="w-full rounded-xl border border-[#e5ddd2] bg-[#fbf8f3] px-4 py-3.5 text-[16px] text-[#24170f] placeholder:text-[#7a6656] focus:border-[#c9974f] focus:outline-none"
            placeholder="Search safari questions..."
          />

          {/* Destinations */}
          <div className="mt-6">
            <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a35c2d]">
              🌍 Destinations
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {renderChips(destinationCategories)}
            </div>
          </div>

          {/* Planning Topics */}
          <div className="mt-6">
            <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a35c2d]">
              🧭 Planning & Travel Topics
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {renderChips(topicCategories)}
            </div>
          </div>

          {activeCategory && (
            <button
              onClick={clearCategory}
              className="mt-5 text-[15px] font-semibold text-[#24170f] underline decoration-[#c9974f] decoration-2 underline-offset-[6px] hover:text-[#a35c2d]"
            >
              Show All
            </button>
          )}
        </div>

        <div className="bg-[#f7f3ec] px-5 py-8 md:px-10 md:py-10">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  ref={(el) => {
                    categoryRefs.current[cat.title] = el;
                  }}
                  className="rounded-2xl border border-[#ebe1d3] bg-white p-6 shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)] md:p-7"
                >
                  {/* Batch 16: category = h2, each question = h3 (same classes,
                      so the look is unchanged) */}
                  <h2 className="mb-4 border-b border-[#efe5d6] pb-4 text-[20px] font-semibold leading-snug text-[#24170f]">
                    {cat.title}
                  </h2>

                  <ul className="space-y-1">
                    {cat.items.map((q) => {
                      const isOpen = openQuestionId === q._id;

                      return (
                        <li key={q._id}>
                          <h3 className="text-[16px] font-normal">
                            <button
                              type="button"
                              onClick={() => toggleQuestion(q._id)}
                              aria-expanded={isOpen}
                              aria-controls={`faq-answer-${q._id}`}
                              className="flex w-full items-start justify-between gap-3 rounded-lg py-2 text-left text-[16px] text-[#3c2a1e] transition hover:text-[#a35c2d]"
                            >
                              <span className="leading-snug">{q.question}</span>
                              <span
                                aria-hidden="true"
                                className={`text-xl leading-none text-[#a35c2d] transition-transform duration-300 ${
                                  isOpen ? "rotate-45" : ""
                                }`}
                              >
                                +
                              </span>
                            </button>
                          </h3>

                          {/* The answer is always in the HTML (only hidden by
                              height), so search engines can read it */}
                          <div
                            id={`faq-answer-${q._id}`}
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen
                                ? "max-h-96 mt-1 mb-3 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="faq-content space-y-3 text-[15px] leading-7 text-[#5c4a3d] [&_a]:text-[#9a4f22] [&_a]:underline [&_a]:hover:text-[#24170f]">
                              <PortableText value={q.answer} />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[16px] text-[#5c4a3d]">
              No FAQs matched your search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
