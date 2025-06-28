"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  // Delayed navbar scroll effect
  useEffect(() => {
    const timer = setTimeout(() => setScrolled(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center justify-between gap-6 w-[92vw] max-w-4xl transition-all duration-500 ${
          scrolled
            ? "bg-[#f2e7db]/90 shadow-md backdrop-blur"
            : "bg-transparent shadow-none"
        }`}
      >
        {/* Logo */}
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

        {/* Icons */}
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

      {/* Responsive Mega Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-xl animate-fadeIn
            bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200 rounded-2xl
            p-4 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4"
        >
          {/* --- IMAGE BLOCKS FIRST on Mobile --- */}

          {/* Plan Your Trip */}
          <div
            className="w-full md:w-48 h-48 bg-cover bg-center flex flex-col justify-end p-4 text-white shadow-inner relative overflow-hidden rounded-2xl animate-fadeIn delay-100"
            style={{ backgroundImage: "url('/plantrip.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <div className="relative z-10">
              <h4 className="text-sm font-bold">Plan Your Trip</h4>
              <p className="text-xs leading-tight">
                Use our planner to build your safari.
              </p>
            </div>
          </div>

          {/* Why Fair Trade */}
          <div
            className="w-full md:w-48 h-48 bg-cover bg-center flex flex-col justify-end p-4 text-white shadow-inner relative overflow-hidden rounded-2xl animate-fadeIn delay-200"
            style={{ backgroundImage: "url('/impact.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <div className="relative z-10">
              <h4 className="text-sm font-bold">Why Fair Trade?</h4>
              <p className="text-xs leading-tight">
                Ethical. Sustainable. Local impact.
              </p>
            </div>
          </div>

          {/* --- NAV LINKS LAST on Mobile --- */}
          <div className="flex flex-col gap-2">
            {[
              { title: "Journeys", href: "/journey" },
              { title: "Destinations", href: "/destinations" },
              { title: "Our Mission", href: "/mission" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-base text-gray-800 hover:text-black"
              >
                {item.title}
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
