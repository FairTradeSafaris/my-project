"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import MobileMenuSheet from "./MobileMenuSheet";
import { client } from "@/lib/sanity";

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

export default function NavbarMobile() {
  const scrolled = useScrolled(40);
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<FeatureCard | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await client.fetch(`*[_type == "megaMenu"][0]{
          navSections[]{ heading, links[]{ title, href } },
          featureCards[]{ title, description, alt, link, image{asset->{url}} },
          promoCard{ title, description, alt, link, image{asset->{url}} }
        }`);
        if (cancelled) return;
        setNavSections(data?.navSections || []);
        setFeatureCards(data?.featureCards || []);
        setPromoCard(data?.promoCard || null);
      } catch (e) {
        console.error("megaMenu fetch failed", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      {/* Sticky Mobile Header */}
      <header
        className={cx(
          "fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-300 xl:hidden",
          "backdrop-blur bg-white/90 dark:bg-neutral-900/85",
          "border-b border-black/5 dark:border-white/10"
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className={cx(
            "flex items-center justify-between gap-3 px-4 transition-all duration-300",
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

      <AnimatePresence>
        {menuOpen && ready && (
          <motion.div
            key="mobile-sheet-wrapper"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sheetVariants}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-[9998] bg-white dark:bg-neutral-900 xl:hidden"
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
