import { client } from "@/lib/sanity";
import { faqCategoriesQuery } from "@/lib/queries";

type FAQItem = {
  _id: string;
  question: string;
  answer: string; // Ensure this is included in your Sanity query
  keywords?: string[];
};
type FAQCat = { _id: string; title: string; items: FAQItem[] };

export default async function FAQServer() {
  const categories: FAQCat[] = await client.fetch(faqCategoriesQuery);

  const cardBorder = "#e7ded0"; // softer earth-tone
  const tileBg = "#fdfaf6"; // warm off-white
  const commonSearches = categories.map((c) => c.title).slice(0, 6);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div
        className="rounded-2xl shadow-lg border overflow-hidden"
        style={{ background: tileBg, borderColor: cardBorder }}
      >
        {/* Header bar */}
        <div
          className="px-6 md:px-8 py-5 border-b"
          style={{ borderColor: cardBorder }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-gray-900">
            Your Safari Questions, Answered
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Planning an ethical safari? Here’s what fellow travelers have asked
            before embarking on their journey.
          </p>
        </div>

        {/* Search + chips */}
        <div className="px-6 md:px-8 pt-5">
          <div className="relative">
            <input
              className="w-full rounded-xl border px-4 py-3 pr-12 text-base focus:outline-none"
              style={{ borderColor: cardBorder }}
              placeholder="Ask about wildlife, lodges, travel tips..."
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
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>

                <ul
                  className="mt-2 divide-y"
                  style={{ borderColor: cardBorder }}
                >
                  {cat.items?.map((q) => (
                    <li key={q._id} className="py-2">
                      <details className="group">
                        <summary className="cursor-pointer group-hover:underline text-sm text-gray-900 list-none">
                          {q.question}
                        </summary>
                        <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {q.answer}
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
