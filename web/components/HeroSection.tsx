// components/HeroSection.tsx

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-yellow-50 to-white py-12 mb-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold font-serif mb-2">
          Safari. Reimagined.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Experience Africa through the eyes of locals, guided by purpose,
          powered by heart.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/journeys"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Start Planning
          </a>
          <a
            href="/why-us"
            className="px-6 py-3 bg-white border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50"
          >
            Why Travel With Us
          </a>
        </div>
      </div>
    </section>
  );
}
