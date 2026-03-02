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
        className={`rounded-full px-4 py-1 border transition ${
          activeCategory === title
            ? "bg-black text-white border-black"
            : "border-[#e5ddd2] text-gray-700 hover:bg-white"
        }`}
      >
        {title}
      </button>
    ));

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="rounded-3xl shadow-sm border bg-[#f9f6f2] border-[#e5ddd2] overflow-hidden">
        <div className="px-6 md:px-10 py-8 border-b border-[#e5ddd2]">
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveCategory(null);
            }}
            className="w-full rounded-xl border border-[#e5ddd2] px-4 py-3 text-base focus:outline-none"
            placeholder="Search safari questions..."
          />

          {/* Destinations */}
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              🌍 Destinations
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {renderChips(destinationCategories)}
            </div>
          </div>

          {/* Planning Topics */}
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              🧭 Planning & Travel Topics
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {renderChips(topicCategories)}
            </div>
          </div>

          {activeCategory && (
            <button
              onClick={clearCategory}
              className="mt-4 text-gray-500 underline"
            >
              Show All
            </button>
          )}
        </div>

        <div className="px-6 md:px-10 py-10">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  ref={(el) => {
                    categoryRefs.current[cat.title] = el;
                  }}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
                    {cat.title}
                  </h3>

                  <ul className="space-y-4">
                    {cat.items.map((q) => {
                      const isOpen = openQuestionId === q._id;

                      return (
                        <li key={q._id}>
                          <button
                            onClick={() => toggleQuestion(q._id)}
                            className="w-full flex justify-between items-start text-left text-sm text-gray-800 hover:text-black transition"
                          >
                            <span className="leading-snug">{q.question}</span>
                            <span
                              className={`text-lg transition-transform duration-300 ${
                                isOpen ? "rotate-45" : ""
                              }`}
                            >
                              +
                            </span>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen
                                ? "max-h-96 mt-4 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="faq-content text-gray-600 text-sm leading-relaxed space-y-3 [&_a]:underline [&_a]:hover:text-black">
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
            <p className="text-center text-gray-500">
              No FAQs matched your search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
