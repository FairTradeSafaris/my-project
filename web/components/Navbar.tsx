"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, X } from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
}

interface NavSection {
  heading?: string;
  links: MenuItem[];
}

interface FeatureCard {
  title: string;
  description: string;
  image: {
    asset: {
      url: string;
    };
  };
  alt: string;
  link: string;
}

type Props = {
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard;
};

export default function Navbar({
  navSections = [],
  featureCards = [],
  promoCard,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center justify-between gap-6 w-[92vw] max-w-4xl bg-[#f2e7db]/90 shadow-md backdrop-blur transition-all duration-300">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo-top.png"
            alt="Fair Trade Safaris"
            width={240}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-6 text-black">
          <button title="Search">
            <Search size={20} />
          </button>
          <button title="My Journey">
            <User size={20} />
          </button>
          <button
            title={menuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black transition-transform duration-200"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mega Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-3xl p-8 flex flex-col md:flex-row md:items-start gap-8"
        >
          {/* Left Column: Nav Sections */}
          <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col gap-6">
            {navSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {section.heading && (
                  <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    {section.heading}
                  </h3>
                )}
                <div className="flex flex-col gap-3">
                  {section.links.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-5 py-4 rounded-xl bg-white border hover:shadow-md transition group"
                    >
                      <span className="text-gray-800 group-hover:text-black text-sm font-medium">
                        {item.title}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 group-hover:text-black transition"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Middle Column: Feature Cards */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              FEATURED
            </h3>
            {featureCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.link}
                onClick={() => setMenuOpen(false)}
                className="group flex gap-4 border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <Image
                  src={card.image.asset.url}
                  alt={card.alt}
                  width={120}
                  height={80}
                  className="w-[120px] h-[80px] object-cover rounded-l-xl"
                />
                <div className="py-2 pr-3">
                  <h4 className="font-semibold text-sm text-gray-800 group-hover:text-[#5a3e2b]">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column: Promo Card */}
          {promoCard?.link && (
            <div className="w-full md:w-1/4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                PROMOTIONS
              </h3>
              <Link
                href={promoCard.link}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl overflow-hidden hover:shadow-xl transition block"
              >
                <Image
                  src={promoCard.image.asset.url}
                  alt={promoCard.alt}
                  width={400}
                  height={200}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-sm text-gray-800 group-hover:text-[#5a3e2b]">
                    {promoCard.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {promoCard.description}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
