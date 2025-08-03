"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, User, X } from "lucide-react";
import { useTheme } from "next-themes"; // Make sure this is already imported
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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

export default function Navbar({
  navSections = [],
  featureCards = [],
  promoCard,
}: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const { theme, systemTheme } = useTheme();
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const [scrolled, setScrolled] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedInsideMobile =
        mobileMenuRef.current && mobileMenuRef.current.contains(target);
      const clickedInsideDesktop =
        desktopMenuRef.current && desktopMenuRef.current.contains(target);
      const clickedToggle =
        toggleButtonRef.current && toggleButtonRef.current.contains(target);

      if (clickedInsideMobile || clickedInsideDesktop || clickedToggle) {
        return;
      }

      setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const desktopMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      {/* Top-Left Badge Logo */}

      {/* Desktop Badge */}
      <div
        className={`fixed z-[60] top-0 left-4 px-2 pt-2 pb-1 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out ${
          scrolled ? "w-[96px] h-[96px]" : "w-[150px] h-[150px]"
        } rounded-b-2xl rounded-t-none hidden md:flex items-center justify-center`}
        style={{
          backgroundColor: "rgba(var(--background-rgb), 0.95)",
          color: "var(--foreground)",
        }}
      >
        <Link href="/">
          <Image
            src="/fts-logo.png"
            alt="FTS Badge Logo"
            width={scrolled ? 76 : 125}
            height={scrolled ? 76 : 125}
            className="object-contain transition-all duration-300 ease-in-out"
            priority
          />
        </Link>
      </div>

      {/* Mobile Badge */}
      {/* Mobile Badge */}
      <div
        className={`fixed ${
          menuOpen
            ? "translate-x-[-100%] opacity-0 z-[30]"
            : "translate-x-0 opacity-100 z-[60]"
        } top-[230px] left-0 px-2 py-1 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out ${
          scrolled ? "w-[60px] h-[60px]" : "w-[90px] h-[90px]"
        } rounded-r-2xl rounded-l-none flex md:hidden items-center justify-center`}
        style={{
          backgroundColor: "rgba(var(--background-rgb), 0.95)",
          color: "var(--foreground)",
        }}
      >
        <Link href="/">
          <Image
            src="/fts-logo.png"
            alt="FTS Badge Logo"
            width={scrolled ? 50 : 75}
            height={scrolled ? 50 : 75}
            className="object-contain transition-all duration-300 ease-in-out"
            priority
          />
        </Link>
      </div>

      {/* Top Nav */}
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92vw] max-w-4xl px-3 flex items-center justify-between gap-6 rounded-2xl shadow-md backdrop-blur transition-all duration-300 ${
          scrolled ? "py-1" : "py-3"
        }`}
        style={{
          backgroundColor: "rgba(var(--background-rgb), 0.95)",
          color: "var(--foreground)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 pl-4">
          <>
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/logos/logo-dark.png"
                  : "/logos/logo-light.png"
              }
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={`object-contain transition-all duration-300 ease-in-out ${
                scrolled ? "scale-100" : "scale-105"
              }`}
              priority
            />
          </>
        </Link>

        <div
          className="flex items-center gap-4 md:gap-6"
          style={{ color: "var(--foreground)" }}
        >
          <button title="Search">
            <Search size={20} />
          </button>
          <button title="My Journey">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <User size={20} />
              </Link>
            </SignedOut>
          </button>

          <motion.button
            ref={toggleButtonRef} // ✅ Add this line
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
            className="md:hidden fixed top-20 inset-x-4 mx-auto z-[70] max-w-sm rounded-3xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg shadow-xl ring-1 ring-gray-200 dark:ring-neutral-700 p-4 space-y-5"
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
                          className={`block px-4 py-2 rounded-xl text-sm transition ${
                            pathname === item.href
                              ? "bg-gray-200 dark:bg-neutral-700 font-semibold"
                              : "text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          }`}
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
            className="hidden md:flex fixed top-20 inset-x-4 mx-auto z-40 w-[92vw] max-w-6xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xl border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 gap-8 max-h-[80vh] overflow-y-auto"
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
                          className={`text-sm px-3 py-2 rounded-md transition block ${
                            pathname === item.href
                              ? "bg-gray-200 dark:bg-neutral-700 font-semibold"
                              : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          }`}
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
