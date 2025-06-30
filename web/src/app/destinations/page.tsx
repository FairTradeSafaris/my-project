// app/destinations/page.tsx
"use client";

import DestinationMap from "@/components/DestinationMap";

export default function DestinationsPage() {
  return (
    <main className="min-h-screen text-black bg-[#fdf8f3]">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl">
            Explore our featured safari destinations.
          </h1>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <DestinationMap />
      </section>
    </main>
  );
}
