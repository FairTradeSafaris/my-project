"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import SafariFactFooter from "./SafariFactFooter";
import { useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hideNavbar = pathname === "/project-portal"; // ✅ Change to your actual route

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      {!hideNavbar && <SafariFactFooter />}

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#d8c3a5] text-black shadow-lg p-6 transform transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="mb-6" onClick={() => setMenuOpen(false)}>
          ✕ Close
        </button>
        {/* Add your nav links here if needed */}
      </aside>
    </>
  );
}
