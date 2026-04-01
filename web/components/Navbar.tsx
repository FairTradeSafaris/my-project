"use client";

/**
 * Fair Trade Safaris — Mobile‑App Navbar (one‑shot)
 * - Mobile: sticky, safe‑area aware header; badge/logo inside bar
 * - Mobile Menu: full‑screen sheet, scrollable content, sticky header, backdrop tap to close
 * - Desktop: original framed navbar + round floating badge on the left
 * - Dark mode: high contrast text/inputs
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, Search, User, X } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";

/* =========================
   Types
   ========================= */

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
  image: { asset: { url: string } };
  alt: string;
  link: string;
}

type Props = {
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard;
};

/* =========================
   Config & helpers
   ========================= */

const DESKTOP_BADGE = {
  large: { box: 150, img: 125 },
  small: { box: 96, img: 76 },
};

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

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* =========================
   Visuals
   ========================= */

function BadgeVisual({ size }: { size: number }) {
  return (
    <>
      <Image
        src="/logos/badge-light.webp"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="block  object-contain"
        priority
      />
      <Image
        src="/logos/badge-dark.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="hidden  object-contain"
        priority
      />
    </>
  );
}

function DesktopRoundBadge({ scrolled }: { scrolled: boolean }) {
  const size = scrolled ? DESKTOP_BADGE.small : DESKTOP_BADGE.large;
  return (
    <div
      className={cx(
        "hidden md:grid fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl",
        "bg-white/90  backdrop-blur-md shadow-xl",
        "border-4 border-red-500 rounded-3xl px-8 py-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        "items-start content-stretch",
      )}
      style={{ width: size.box, height: size.box }}
    >
      <Link href="/" aria-label="Fair Trade Safaris">
        <BadgeVisual size={size.img} />
      </Link>
    </div>
  );
}

/* =========================
   Component
   ========================= */

export default function Navbar({
  navSections = [],
  featureCards = [],
  promoCard,
}: Props) {
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  const reduceMotion = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  // lock body scroll when sheet is open
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    document.documentElement.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = prevBody || "auto";
      document.documentElement.style.overflow = prevHtml || "auto";
    };
  }, [menuOpen]);

  // desktop outside click close
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (desktopMenuRef.current?.contains(t)) return;
      // only applies to desktop mega menu
      if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const sheetVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    [],
  );
  const panelVariants = useMemo(
    () => ({
      hidden: { y: -12, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: -12, opacity: 0 },
    }),
    [],
  );

  return (
    <>
      {/* DESKTOP ROUND BADGE */}
      <DesktopRoundBadge scrolled={scrolled} />

      {/* MOBILE STICKY HEADER */}
      <header
        className={cx(
          "md:hidden sticky top-0 z-50 w-full",
          "backdrop-blur supports-[backdrop-filter]:bg-white/65 ",
          "bg-white/90 ",
          "border-b border-black/5 ",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className={cx(
            "flex items-center justify-between gap-3 px-4",
            scrolled ? "h-14" : "h-16",
          )}
        >
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Fair Trade Safaris" className="shrink-0">
              <div className="w-11 h-11 rounded-xl shadow-sm bg-[#d7ccc8]  grid place-items-center">
                <BadgeVisual size={34} />
              </div>
            </Link>
            <Link href="/" className="block">
              <Image
                src="/logos/logo-light.png"
                alt="Fair Trade Safaris"
                width={150}
                height={36}
                className="block  object-contain"
                priority
              />
              <Image
                src="/logos/logo-dark.png"
                alt="Fair Trade Safaris"
                width={150}
                height={36}
                className="hidden  object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/africansafariitineraries/"
              title="Search"
              className="p-2 rounded-xl active:scale-95 transition"
            >
              <Search size={20} />
            </Link>
            <SignedIn>
              <CustomUserMenu />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in/"
                title="My Journey"
                className="p-2 rounded-xl active:scale-95"
              >
                <User size={20} />
              </Link>
            </SignedOut>
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

      {/* DESKTOP NAVBAR (framed look) */}
      <nav
        className={cx(
          "hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-4xl px-3",
          "items-center justify-between gap-6",
          "rounded-2xl shadow-md backdrop-blur transition-all duration-300",
          scrolled ? "py-1" : "py-3",
          "bg-[#d7ccc8e6]  text-foreground ",
        )}
      >
        <div className="flex items-center gap-3 pl-4 pt-2 md:pt-0">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Fair Trade Safaris"
          >
            <Image
              src="/logos/logo-light.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "block  object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105",
              )}
              priority
            />
            <Image
              src="/logos/logo-dark.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "hidden  object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105",
              )}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 pr-3">
          <Link
            href="/africansafariitineraries/"
            title="Search"
            className="p-2 rounded-xl"
          >
            <Search size={20} />
          </Link>
          <SignedIn>
            <CustomUserMenu />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" title="My Journey" className="p-2 rounded-xl">
              <User size={20} />
            </Link>
          </SignedOut>
          <motion.button
            whileTap={{ scale: 0.9 }}
            title={menuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="transition-transform duration-200 p-2 rounded-xl"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

      {/* MOBILE FULL‑SCREEN SHEET (sticky header inside; no accidental close on scroll) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop; ONLY clicking this closes the menu */}
            <motion.div
              key="backdrop"
              data-backdrop="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed inset-0 z-[9998] bg-black/50"
              onClick={(e) => {
                if ((e.target as HTMLElement).dataset.backdrop === "true")
                  setMenuOpen(false);
              }}
              aria-hidden="true"
            />

            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sheetVariants}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="md:hidden fixed inset-0 z-[9999] pointer-events-none"
            >
              <motion.div
                key="panel"
                variants={panelVariants}
                transition={{
                  duration: reduceMotion ? 0 : 0.22,
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                }}
                className="absolute inset-0 pointer-events-auto bg-white  flex flex-col"
                style={{
                  paddingTop: "env(safe-area-inset-top)",
                  paddingBottom: "env(safe-area-inset-bottom)",
                }}
              >
                {/* Sticky top inside sheet (NO 'Explore' label here) */}
                <div className="sticky top-0 z-10 h-14 px-4 flex items-center justify-between border-b border-black/5  bg-white/95  backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#d7ccc8]  grid place-items-center shadow-sm">
                      <BadgeVisual size={26} />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 ">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-neutral-100 "
                    aria-label="Close"
                  >
                    <X size={20} className="text-neutral-800 " />
                  </button>
                </div>

                {/* Search / Sign in row */}
                <div className="px-4 py-3 border-b border-black/5  flex items-center gap-3">
                  <Link
                    href="/africansafariitineraries/"
                    className="flex-1 h-11 rounded-2xl bg-neutral-100  px-4 grid grid-cols-[20px_1fr] items-center gap-3 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Search size={18} className="text-neutral-600 " />
                    <span className="text-neutral-600 ">Search journeys</span>
                  </Link>
                  <SignedIn>
                    <CustomUserMenu />
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/sign-in/"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded-xl bg-neutral-900 text-white   text-sm font-medium"
                    >
                      Sign in
                    </Link>
                  </SignedOut>
                </div>

                {/* Scroll area */}
                <div className="flex-1 overflow-y-auto">
                  {/* Links (no 'Explore' heading here) */}
                  <div className="px-2 py-3">
                    <ul className="space-y-1">
                      {navSections
                        .flatMap((s) => s.links)
                        .map((item, i) => (
                          <li key={`m-${i}`}>
                            <Link
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                            >
                              <span
                                className={cx(
                                  "block px-3 py-3 rounded-2xl text-[15px] transition",
                                  "text-neutral-900 ",
                                  pathname === item.href
                                    ? "bg-neutral-200  font-semibold"
                                    : "bg-neutral-100  hover:bg-neutral-200 ",
                                )}
                              >
                                {item.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Featured */}
                  {featureCards.length > 0 && (
                    <div className="px-2 py-3">
                      <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500  mb-2">
                        Featured
                      </h3>
                      <ul className="space-y-2">
                        {featureCards.slice(0, 3).map((card, idx) => (
                          <li key={`feat-${idx}`}>
                            <Link
                              href={card.link}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-2xl bg-neutral-100  hover:bg-neutral-200  transition"
                            >
                              <Image
                                src={card.image.asset.url}
                                alt={card.alt}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-xl"
                              />
                              <div className="min-w-0">
                                <h4 className="text-[15px] font-semibold text-neutral-900  truncate">
                                  {card.title}
                                </h4>
                                <p className="text-xs text-neutral-600  line-clamp-2">
                                  {card.description}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Promo */}
                  {promoCard?.title && (
                    <div className="px-2 py-3">
                      <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500  mb-2">
                        Special Offer
                      </h3>
                      <Link
                        href={promoCard.link}
                        onClick={() => setMenuOpen(false)}
                        className="group flex flex-col h-full rounded-xl overflow-hidden hover:shadow-md transition border-4 border-red-500"
                      >
                        <Image
                          src={promoCard?.image?.asset?.url || "/fallback.jpg"}
                          alt={promoCard?.alt || "Special Offer"}
                          width={1200}
                          height={600}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-[15px] font-semibold text-neutral-900 ">
                            {promoCard.title}
                          </h4>
                          <p className="text-xs text-neutral-600  mt-1 line-clamp-2">
                            {promoCard.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}

                  <div className="h-6" />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP MEGA MENU */}
      {/* DESKTOP MEGA MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="desktop-menu"
            ref={desktopMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={cx(
              "hidden md:flex flex-wrap justify-between items-stretch gap-5",
              "fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl",
              "bg-white/90  backdrop-blur-md shadow-xl",
              "border-4 border-red-500 rounded-3xl px-6 py-4",
            )}
          >
            {/* Navigation Sections */}
            <div className="flex flex-col gap-4 min-w-[180px] flex-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Explore
              </h3>
              {navSections.map((section, sectionIdx) => (
                <div key={`section-${sectionIdx}`}>
                  {section.heading && (
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {section.heading}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 mb-4">
                    {section.links.map((item, linkIdx) => (
                      <Link
                        key={`desk-link-${sectionIdx}-${linkIdx}`}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span
                          className={cx(
                            "text-sm px-3 py-2 rounded-md transition block",
                            pathname === item.href
                              ? "bg-gray-200  font-semibold"
                              : "text-gray-800  hover:bg-gray-100 ",
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Cards */}
            {featureCards.length > 0 && (
              <div className="flex flex-col gap-4 min-w-[200px] flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Featured
                </h3>
                {featureCards.slice(0, 3).map((card, idx) => (
                  <Link
                    key={`desk-feature-${card.title}-${idx}`}
                    href={card.link}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/70  transition"
                  >
                    <Image
                      src={card.image.asset.url}
                      alt={card.alt}
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-sm font-semibold text-gray-800  group-hover:text-[#5a3e2b]">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-600  mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Promo Card */}
            {promoCard?.link && (
              <div className="flex flex-col gap-4 min-w-[220px] flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Special Offer
                </h3>
                <Link
                  href={promoCard.link}
                  onClick={() => setMenuOpen(false)}
                  className="group block rounded-xl overflow-hidden hover:shadow-md transition border-4 border-red-500"
                >
                  <Image
                    src={promoCard?.image?.asset?.url || "/fallback.jpg"}
                    alt={promoCard?.alt || "Special Offer"}
                    width={400}
                    height={200}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 bg-white  h-full">
                    <h4 className="text-sm font-semibold text-gray-800  group-hover:text-[#5a3e2b]">
                      {promoCard.title}
                    </h4>
                    <p className="text-xs text-gray-600  mt-1 line-clamp-2">
                      {promoCard.description}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
