// components/PageHero.tsx
import React from "react";

type PageHeroProps = {
  title: string;
  imageUrl: string;
  showSearch?: boolean;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
};

export default function PageHero({
  title,
  imageUrl,
  showSearch = false,
  searchTerm = "",
  setSearchTerm,
}: PageHeroProps) {
  return (
    <section
      className="relative h-[400px] bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-xl">
          {title}
        </h1>
        {showSearch && setSearchTerm && (
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl w-full max-w-2xl shadow-md">
            <input
              type="text"
              placeholder="Search journeys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded border text-white placeholder-white bg-transparent"
            />
          </div>
        )}
      </div>
    </section>
  );
}
