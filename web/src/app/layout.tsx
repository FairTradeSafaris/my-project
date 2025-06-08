"use client";
import "./globals.css";
import "@fontsource/poppins"; // Defaults to weight 400
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SafariFactFooter from "@/components/SafariFactFooter"; // ✅ Add this

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className="font-sans">
        <Navbar />

        <main>{children}</main>

        {/* ✅ Safari Fact Footer added here */}
        <SafariFactFooter />

        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
        )}

        {/* Slide-in menu */}
        <aside
          className={`fixed top-0 right-0 h-full w-64 bg-[#d8c3a5] text-black shadow-lg p-6 transform transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button className="mb-6" onClick={() => setMenuOpen(false)}>
            ✕ Close
          </button>
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/feed" onClick={() => setMenuOpen(false)}>
              The Feed
            </Link>
            <Link href="/search" onClick={() => setMenuOpen(false)}>
              Search
            </Link>
            <Link href="/ambassadors" onClick={() => setMenuOpen(false)}>
              Ambassadors
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/about/team" onClick={() => setMenuOpen(false)}>
              Team
            </Link>
          </nav>
        </aside>
      </body>
    </html>
  );
}
