"use client";

/**
 * Navbar with Mobile Badge Morph:
 * - Mobile badge begins halfway down the left edge (your original visual).
 * - On scroll past MOBILE_BADGE_PIN_Y, it morphs (Framer Motion shared layout) into the top navbar next to the logo.
 * - Desktop badge remains exactly as you had it.
 * - Menu logic (Clerk, feature cards, promo, etc.) preserved.
 * - Tailwind classes mirror your original design intentions.
 *
 * Notes
 * - layoutId="mobileBadge" enables shared layout animation between the floating and the navbar slot.
 * - If prefers-reduced-motion is true, we disable layout transitions.
 * - All mobile-only bits are md:hidden to keep behavior isolated to phones.
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

/* =========================
   Config
   ========================= */

// Where the mobile badge should "pin" (morph into the navbar).
// Tune this to your taste. Your original badge sat around top: 280px.
const MOBILE_BADGE_PIN_Y = 220;

// Dimensions for the mobile badge in both states.
// These mirror your original sizes, with small tweaks for the morph.
const MOBILE_BADGE_SIZE = {
  floating: { box: 90, img: 75 },
  pinned: { box: 60, img: 50 },
};

// Desktop dimensions (unchanged from your code).
const DESKTOP_BADGE_SIZE = {
  large: { box: 150, img: 125 },
  small: { box: 96, img: 76 },
};

/* =========================
   Helpers
   ========================= */

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

function usePinnedMobileBadge(pinY = MOBILE_BADGE_PIN_Y) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY >= pinY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinY]);
  return pinned;
}

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* =========================
   Components
   ========================= */

function DesktopRoundBadge({ scrolled }: { scrolled: boolean }) {
  const size = scrolled ? DESKTOP_BADGE_SIZE.small : DESKTOP_BADGE_SIZE.large;

  return (
    <div
      className={cx(
        "fixed z-[60] top-0 left-4 px-2 pt-2 pb-1 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out",
        "rounded-b-2xl rounded-t-none hidden md:flex items-center justify-center",
        "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white"
      )}
      style={{ width: size.box, height: size.box }}
    >
      <Link href="/">
        {/* Light */}
        <Image
          src="/logos/badge-light.png"
          alt="Fair Trade Safaris badge"
          width={size.img}
          height={size.img}
          className="object-contain transition-all duration-300 ease-in-out block dark:hidden"
          priority
        />
        {/* Dark */}
        <Image
          src="/logos/badge-dark.png"
          alt="Fair Trade Safaris badge"
          width={size.img}
          height={size.img}
          className="object-contain transition-all duration-300 ease-in-out hidden dark:block"
          priority
        />
      </Link>
    </div>
  );
}

/**
 * The *visual* of the badge (light/dark images).
 * We reuse this in both the floating and pinned slots.
 */
function BadgeVisual({ size }: { size: number }) {
  return (
    <>
      <Image
        src="/logos/badge-light.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="object-contain transition-all duration-300 ease-in-out block dark:hidden"
        priority
      />
      <Image
        src="/logos/badge-dark.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="object-contain transition-all duration-300 ease-in-out hidden dark:block"
        priority
      />
    </>
  );
}

/**
 * Mobile floating badge (left side). Hidden when:
 * - the menu is open, or
 * - it's pinned (so the navbar one is visible).
 */
function MobileFloatingBadge({
  pinned,
  menuOpen,
  reduceMotion,
}: {
  pinned: boolean;
  menuOpen: boolean;
  reduceMotion: boolean;
}) {
  const size = pinned ? MOBILE_BADGE_SIZE.pinned : MOBILE_BADGE_SIZE.floating;

  return (
    <AnimatePresence initial={false}>
      {!menuOpen && !pinned && (
        <motion.div
          key="mobile-floating-badge"
          layoutId={reduceMotion ? undefined : "mobileBadge"}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cx(
            "md:hidden fixed left-0",
            // your original visual anchor
            "top-[280px]",
            "z-[60] px-2 py-1 shadow-md backdrop-blur-md",
            "rounded-r-2xl rounded-l-none flex items-center justify-center",
            "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white"
          )}
          style={{ width: size.box, height: size.box }}
        >
          <Link href="/" className="block" aria-label="Fair Trade Safaris">
            <BadgeVisual size={size.img} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Slot inside the navbar where the mobile badge appears *after* pin.
 * The element shares layoutId with the floating one to produce the morph.
 */
function MobileNavbarBadgeSlot({
  show,
  reduceMotion,
}: {
  show: boolean;
  reduceMotion: boolean;
}) {
  const size = MOBILE_BADGE_SIZE.pinned;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="mobile-navbar-badge"
          layoutId={reduceMotion ? undefined : "mobileBadge"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cx(
            "md:hidden shrink-0 rounded-full",
            "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] shadow-md backdrop-blur",
            "flex items-center justify-center"
          )}
          style={{ width: size.box, height: size.box }}
        >
          <Link href="/" className="block" aria-label="Fair Trade Safaris">
            <BadgeVisual size={size.img} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================
   Main Export
   ========================= */

export default function Navbar({
  navSections = [],
  featureCards = [],
  promoCard,
}: Props) {
  const pathname = usePathname();

  // global UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  // sticky style for your top bar
  const scrolled = useScrolled(50);

  // mobile pin state for badge morph
  const pinned = usePinnedMobileBadge(MOBILE_BADGE_PIN_Y);

  // a11y: respect reduced motion
  const reduceMotion = useReducedMotion();

  // menus: outside click close
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const inMobile = mobileMenuRef.current?.contains(target);
      const inDesktop = desktopMenuRef.current?.contains(target);
      const onToggle = toggleButtonRef.current?.contains(target);
      if (inMobile || inDesktop || onToggle) return;
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // prevent body scroll when menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [menuOpen]);

  // menu animation variants (unchanged spirit)
  const mobileMenuVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    }),
    []
  );

  const desktopMenuVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    }),
    []
  );

  return (
    <>
      {/* === DESKTOP ROUND BADGE (unchanged behavior) === */}
      <DesktopRoundBadge scrolled={scrolled} />

      {/* === MOBILE FLOATING BADGE (left edge, original spot) === */}
      <MobileFloatingBadge
        pinned={pinned}
        menuOpen={menuOpen}
        reduceMotion={!!reduceMotion}
      />

      {/* === TOP NAV === */}
      <nav
        className={cx(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-4xl px-3",
          "flex items-center justify-between gap-6",
          "rounded-2xl shadow-md backdrop-blur transition-all duration-300",
          scrolled ? "py-1" : "py-3",
          "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white"
        )}
      >
        <div className="flex items-center gap-2 pl-4 pt-2 md:pt-0">
          <Link href="/" className="flex items-center">
            {/* wordmark imgs ... */}
            <Image
              src="/logos/logo-light.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "block dark:hidden object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105"
              )}
              priority
            />
            <Image
              src="/logos/logo-dark.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "hidden dark:block object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105"
              )}
              priority
            />
          </Link>

          {/* GOOD: badge is a sibling in the same flex row, not nested */}
          <MobileNavbarBadgeSlot
            show={pinned && !menuOpen}
            reduceMotion={!!reduceMotion}
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/journey" title="Search">
            <Search size={20} />
          </Link>

          <SignedIn>
            <CustomUserMenu />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" title="My Journey">
              <User size={20} />
            </Link>
          </SignedOut>

          <motion.button
            ref={toggleButtonRef}
            whileTap={{ scale: 0.9 }}
            title={menuOpen ? "Close Menu" : "Open Menu"}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="transition-transform duration-200"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className={cx(
              "md:hidden fixed top-20 inset-x-4 mx-auto z-[70] max-w-sm",
              "rounded-3xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg",
              "shadow-xl ring-1 ring-gray-200 dark:ring-neutral-700 p-4 space-y-5"
            )}
          >
            <div>
              <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-2">
                Explore
              </h3>
              <ul className="space-y-2">
                {navSections.map((section, sectionIdx) =>
                  section.links.map((item, linkIdx) => (
                    <li key={`nav-${sectionIdx}-${linkIdx}`}>
                      <Link href={item.href}>
                        <span
                          onClick={() => setMenuOpen(false)}
                          className={cx(
                            "block px-4 py-2 rounded-xl text-sm transition",
                            pathname === item.href
                              ? "bg-gray-200 dark:bg-neutral-700 font-semibold"
                              : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {featureCards.length > 0 && (
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Featured
                </h3>
                <ul className="space-y-2">
                  {featureCards.slice(0, 2).map((card, idx) => (
                    <li key={`feat-${card.title}-${idx}`}>
                      <Link href={card.link}>
                        <span
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                        >
                          {card.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {promoCard?.title && (
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Special Offer
                </h3>
                <Link href={promoCard.link}>
                  <span
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-xl text-sm font-semibold text-[#5a3e2b] dark:text-orange-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                  >
                    {promoCard.title}
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DESKTOP MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="desktop-menu"
            ref={desktopMenuRef}
            variants={desktopMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className={cx(
              "hidden md:flex fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl",
              "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xl",
              "border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 gap-8",
              "max-h-[80vh] overflow-y-auto"
            )}
          >
            <div className="w-1/3 flex flex-col gap-4">
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
                  <div className="flex flex-col gap-2">
                    {section.links.map((item, linkIdx) => (
                      <Link
                        key={`desk-link-${sectionIdx}-${linkIdx}`}
                        href={item.href}
                      >
                        <span
                          onClick={() => setMenuOpen(false)}
                          className={cx(
                            "text-sm px-3 py-2 rounded-md transition block",
                            pathname === item.href
                              ? "bg-gray-200 dark:bg-neutral-700 font-semibold"
                              : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
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

            {featureCards.length > 0 && (
              <div className="w-1/3 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Featured
                </h3>
                {featureCards.slice(0, 2).map((card, idx) => (
                  <Link
                    key={`desk-feature-${card.title}-${idx}`}
                    href={card.link}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 dark:hover:bg-neutral-800 transition"
                  >
                    <Image
                      src={card.image.asset.url}
                      alt={card.alt}
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] object-cover rounded-lg shadow-sm"
                    />
                    <div
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-col cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-[#5a3e2b]">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {promoCard?.link && (
              <div className="w-1/3 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Special Offer
                </h3>
                <Link
                  href={promoCard.link}
                  className="group block rounded-xl overflow-hidden hover:shadow-md transition border border-gray-200 dark:border-neutral-700"
                >
                  <div onClick={() => setMenuOpen(false)}>
                    <Image
                      src={promoCard?.image?.asset?.url || "/fallback.jpg"}
                      alt={promoCard?.alt || "Special Offer"}
                      width={400}
                      height={200}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4 bg-white dark:bg-neutral-900">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-[#5a3e2b]">
                        {promoCard.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {promoCard.description}
                      </p>
                    </div>
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
