// components/NavbarMobile.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Search, X } from "lucide-react"; // ⬅️ removed User
// ⬇️ removed Clerk + CustomUserMenu imports
// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import CustomUserMenu from "@/components/CustomUserMenu";
import MobileMenuSheet from "./MobileMenuSheet";

type MenuItem = { title: string; href: string };
type NavSection = { heading?: string; links: MenuItem[] };
type FeatureCard = {
  title: string;
  description: string;
  image: { asset: { url: string } };
  alt: string;
  link: string;
};

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function BadgeVisual({ size }: { size: number }) {
  return (
    <>
      <Image
        src="/logos/badge-light.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="block dark:hidden object-contain"
        priority
      />
      <Image
        src="/logos/badge-dark.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="hidden dark:block object-contain"
        priority
      />
    </>
  );
}

export default function NavbarMobile({
  navSections = [],
  featureCards = [],
  promoCard,
}: {
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard | null;
}) {
  const scrolled = useScrolled(40);
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll when menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [menuOpen]);

  const sheetVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    []
  );

  return (
    <>
      {/* Sticky mobile header */}
      <header
        className={cx(
          "md:hidden sticky top-0 z-50 w-full",
          "backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-neutral-900/60",
          "bg-white/90 dark:bg-neutral-900/85",
          "border-b border-black/5 dark:border-white/10"
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className={cx(
            "flex items-center justify-between gap-3 px-4",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Fair Trade Safaris" className="shrink-0">
              <div className="w-11 h-11 rounded-xl shadow-sm bg-[#d7ccc8] dark:bg-[#1f1410] grid place-items-center">
                <BadgeVisual size={34} />
              </div>
            </Link>
            <Link href="/" className="block">
              <Image
                src="/logos/logo-light.png"
                alt="Fair Trade Safaris"
                width={150}
                height={36}
                className="block dark:hidden object-contain"
                priority
              />
              <Image
                src="/logos/logo-dark.png"
                alt="Fair Trade Safaris"
                width={150}
                height={36}
                className="hidden dark:block object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right cluster: search + menu only (portal removed) */}
          <div className="flex items-center gap-3">
            <Link
              href="/journey"
              title="Search"
              className="p-2 rounded-xl active:scale-95 transition"
            >
              <Search size={20} />
            </Link>

            <motion.button
              whileTap={{ scale: 0.92 }}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-xl active:scale-95"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-sheet-wrapper"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sheetVariants}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="md:hidden"
          >
            <MobileMenuSheet
              onClose={() => setMenuOpen(false)}
              navSections={navSections}
              featureCards={featureCards}
              promoCard={promoCard || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
