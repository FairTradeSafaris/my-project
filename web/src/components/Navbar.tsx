"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

        {/* Icon Row */}
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

      {/* Mega Menu Panel */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 inline-grid grid-cols-[140px_auto_auto] gap-3 bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200 rounded-2xl px-6 py-5 animate-fadeIn"
        >
          {/* Column 1 - Explore links */}
          <div className="flex flex-col gap-2">
            {[
              { title: "Journeys", href: "/journeys" },
              { title: "Destinations", href: "/destinations" },
              { title: "Our Mission", href: "/mission" },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition text-sm text-gray-800 hover:text-black"
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

          {/* Plan Your Trip */}
          <div
            className="rounded-2xl w-48 h-48 bg-cover bg-center flex flex-col justify-end p-4 text-white shadow-inner relative overflow-hidden animate-fadeIn delay-100"
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
            className="rounded-2xl w-48 h-48 bg-cover bg-center flex flex-col justify-end p-4 text-white shadow-inner relative overflow-hidden animate-fadeIn delay-200"
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
        </div>
      )}
    </>
  );
}
