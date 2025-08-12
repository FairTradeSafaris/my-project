import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";
import Link from "next/link";
import BookingCTA from "./BookingCTA";

type FAQItem = { _id: string; question: string; keywords?: string[] };
type FAQCat = { _id: string; title: string; slug: string; items: FAQItem[] };

export default async function FAQServer() {
  const categories: FAQCat[] = await client.fetch(faqCategoriesQuery);

  const cardBorder = "#eee4d8";
  const tileBg = "#ffffff";
  const commonSearches = categories.map((c) => c.title).slice(0, 6);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div
        className="rounded-2xl shadow-lg border overflow-hidden"
        style={{ background: tileBg, borderColor: cardBorder }}
      >
        {/* Header bar */}
        <div
          className="px-6 md:px-8 py-5 border-b"
          style={{ borderColor: cardBorder }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Search + chips */}
        <div className="px-6 md:px-8 pt-5">
          <div className="relative">
            <input
              className="w-full rounded-xl border px-4 py-3 pr-12 text-base focus:outline-none"
              style={{ borderColor: cardBorder }}
              placeholder="Ask a question..."
              aria-label="Search FAQs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⌘K
            </span>
          </div>

          {commonSearches.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Common searches:</span>
              {commonSearches.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-3 py-1 text-gray-700 hover:bg-gray-50 cursor-default"
                  style={{ borderColor: cardBorder }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Categories grid */}
        <div className="px-6 md:px-8 pb-8">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition"
                style={{ borderColor: cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                  <span className="text-gray-300">•</span>
                </div>

                <ul
                  className="mt-2 divide-y"
                  style={{ borderColor: cardBorder }}
                >
                  {cat.items?.map((q) => (
                    <li key={q._id} className="py-2">
                      <Link
                        href={`/faq/${cat.slug}#${q._id}`}
                        className="group flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-800 group-hover:underline">
                          {q.question}
                        </span>
                        <span
                          aria-hidden
                          className="text-gray-400 group-hover:translate-x-0.5 transition"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-3">
                  <Link
                    href={`/faq/${cat.slug}`}
                    className="text-sm text-gray-700 underline underline-offset-2"
                  >
                    See all
                  </Link>
                </div>
              </div>
            ))}

            {/* CTA card with booking modal trigger */}
            <BookingCTA cardBorder={cardBorder} />
          </div>
        </div>
      </div>
    </section>
  );
}
