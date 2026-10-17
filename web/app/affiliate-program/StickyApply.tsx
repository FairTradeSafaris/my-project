"use client";
// Mobile-only floating "Apply" button (batch 12). Appears after the hero,
// hides while the application form is on screen. Sits above the bottom tab bar.
import { useEffect, useState } from "react";

export default function StickyApply({ label }: { label: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const form = document.getElementById("apply");
    let io: IntersectionObserver | null = null;
    if (form && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((e) => setFormVisible(e.some((x) => x.isIntersecting)), { threshold: 0.05 });
      io.observe(form);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !formVisible;
  return (
    <div
      className={`fixed inset-x-4 z-[55] transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ bottom: "calc(56px + env(safe-area-inset-bottom) + 12px)" }}
      aria-hidden={!show}
    >
      <a
        href="#apply"
        tabIndex={show ? 0 : -1}
        className="flex items-center justify-between gap-3 rounded-full bg-[#24170f]/95 py-2 pl-5 pr-2 text-sm text-[#fbf6ef] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur"
      >
        <span className="font-medium">{label}</span>
        <span className="rounded-full bg-[#d9b48a] px-4 py-2 font-semibold text-[#24170f]">Apply</span>
      </a>
    </div>
  );
}
