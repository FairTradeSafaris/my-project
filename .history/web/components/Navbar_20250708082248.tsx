"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, X } from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
}

interface FeatureCard {
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
      url: string; // ✅ Required for Image component
    };
    _type: string;
  };
  alt: string;
  link: string;
}

type Props = {
  navLinks: MenuItem[];
  featureCards: FeatureCard[];
};

export default function Navbar({ navLinks, featureCards }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click
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
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center justify-between gap-6 w-[92vw] max-w-4xl bg-[#f2e7db]/90 shadow-md backdrop-blur transition-all duration-300">
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

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl animate-fadeIn bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature Cards */}
          {featureCards.slice(0, 4).map((card, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
            >
              <Image
                src={card.image.asset.url}
                alt={card.alt}
                width={800}
                height={200}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-sm text-gray-800 transition-colors duration-200 group-hover:text-[#5a3e2b]">
                  {card.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{card.description}</p>
              </div>
            </div>
          ))}

          {/* Nav Links */}
          <div className="flex flex-col gap-3 justify-center">
            {navLinks.map((item, idx) => (
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
      )}
    </>
  );
}
