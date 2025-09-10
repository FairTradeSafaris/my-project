// NavbarDesktop.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { usePathname } from "next/navigation";
import { useBreakpoint } from "@/lib/useBreakpoint";

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

function DesktopRoundBadge({ scrolled }: { scrolled: boolean }) {
  const screenWidth = useBreakpoint();

  const size = (() => {
    if (screenWidth === null) return { box: 96, img: 76 };
    if (screenWidth >= 1280)
      return scrolled ? { box: 84, img: 68 } : { box: 120, img: 100 };
    if (screenWidth >= 1024)
      return scrolled ? { box: 70, img: 56 } : { box: 100, img: 84 };
    return scrolled ? { box: 56, img: 44 } : { box: 84, img: 68 };
  })();

  return (
    <div
      className={cx(
        "flex items-center justify-center",
        "bg-[#d7ccc8e6] dark:bg-[#1f1410e6]",
        "rounded-b-2xl rounded-t-none transition-all duration-300 ease-in-out"
      )}
      style={{ width: `${size.box}px`, height: `${size.box}px` }}
    >
      <Link href="/" aria-label="Fair Trade Safaris">
        <BadgeVisual size={size.img} />
      </Link>
    </div>
  );
}

export default function NavbarDesktop({
  navSections = [],
  featureCards = [],
  promoCard,
}: {
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard | null;
}) {
  const scrolled = useScrolled(40);
  const screenWidth = useBreakpoint();
  const pathname = usePathname();
  const hideBadge = pathname?.startsWith("/journey") ?? false;

  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const layoutSizes = (() => {
    if (screenWidth === null)
      return {
        logo: { width: 180, height: 40, padding: "py-3" },
        topOffset: 18,
      };
    if (screenWidth >= 1400)
      return scrolled
        ? { logo: { width: 200, height: 48, padding: "py-2.5" }, topOffset: 20 }
        : {
            logo: { width: 240, height: 60, padding: "py-3.5" },
            topOffset: 30,
          };
    if (screenWidth >= 1200)
      return scrolled
        ? { logo: { width: 180, height: 40, padding: "py-2" }, topOffset: 18 }
        : { logo: { width: 220, height: 54, padding: "py-3" }, topOffset: 26 };
    if (screenWidth >= 1024)
      return scrolled
        ? { logo: { width: 150, height: 36, padding: "py-2" }, topOffset: 16 }
        : {
            logo: { width: 180, height: 44, padding: "py-2.5" },
            topOffset: 22,
          };
    return scrolled
      ? { logo: { width: 140, height: 32, padding: "py-2" }, topOffset: 12 }
      : { logo: { width: 160, height: 40, padding: "py-2.5" }, topOffset: 18 };
  })();

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    if (open) document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev || "";
    };
  }, [open]);

  return (
    <>
      {!hideBadge && (
        <div className="fixed top-0 left-4 z-[60]">
          <DesktopRoundBadge scrolled={scrolled} />
        </div>
      )}

      <div
        className="hidden md:flex fixed left-0 right-0 z-40 px-4"
        style={{ top: `${layoutSizes.topOffset}px` }}
      >
        <div className="w-full max-w-[94vw] sm:max-w-[92vw] md:max-w-[88vw] lg:max-w-[80vw] xl:max-w-[72vw] mx-auto transition-all duration-300">
          <div
            className={cx(
              "flex w-full flex-wrap items-center justify-between gap-4 min-w-0",
              "rounded-2xl shadow-md backdrop-blur transition-all duration-300",
              layoutSizes.logo.padding,
              "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white",
              "px-6"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 max-w-[60%] flex-shrink">
              <Link
                href="/"
                className="flex items-center max-w-full"
                aria-label="Fair Trade Safaris"
              >
                <Image
                  src="/logos/logo-light.png"
                  alt="Fair Trade Safaris"
                  width={layoutSizes.logo.width}
                  height={layoutSizes.logo.height}
                  className={cx(
                    "block dark:hidden object-contain transition-all duration-300 ease-in-out",
                    scrolled ? "scale-100" : "scale-105"
                  )}
                  priority
                />
                <Image
                  src="/logos/logo-dark.png"
                  alt="Fair Trade Safaris"
                  width={layoutSizes.logo.width}
                  height={layoutSizes.logo.height}
                  className={cx(
                    "hidden dark:block object-contain transition-all duration-300 ease-in-out",
                    scrolled ? "scale-100" : "scale-105"
                  )}
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end min-w-0">
              <Link href="/journey" title="Search" className="p-2 rounded-xl">
                <Search size={20} />
              </Link>
              <SignedIn>
                <CustomUserMenu />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  title="My Journey"
                  className="p-2 rounded-xl"
                >
                  <User size={20} />
                </Link>
              </SignedOut>
              <motion.button
                whileTap={{ scale: 0.9 }}
                title={open ? "Close Menu" : "Open Menu"}
                onClick={() => setOpen((v) => !v)}
                className="transition-transform duration-200 p-2 rounded-xl"
                aria-expanded={open}
                aria-controls="desktop-menu-sheet"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="desk-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.12 }}
              className="hidden sm:block fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="desk-panel"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="hidden sm:block fixed left-1/2 -translate-x-1/2 z-50 mt-28 w-[94vw] max-w-6xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="rounded-3xl shadow-2xl ring-1 ring-black/10 backdrop-blur bg-white/85 dark:bg-neutral-900/80 border border-white/40 dark:border-white/10">
                <div
                  className={[
                    "p-4 md:p-6 gap-4 grid",
                    featureCards?.length && promoCard?.title
                      ? "grid-cols-[auto_1fr_1fr]"
                      : featureCards?.length || promoCard?.title
                        ? "grid-cols-2"
                        : "grid-cols-1",
                  ].join(" ")}
                >
                  <div className="w-max min-w-fit">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-3">
                      Navigation
                    </h4>
                    <div className="max-h-[62vh] overflow-y-auto pr-2">
                      <div className="space-y-1.5">
                        {navSections.map((section, sIdx) => (
                          <div key={`sec-${sIdx}`} className="min-w-0">
                            {section.heading && (
                              <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-0.5">
                                {section.heading}
                              </div>
                            )}
                            <ul className="space-y-1.5">
                              {section.links.map((item, i) => (
                                <li key={`link-${sIdx}-${i}`}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="block text-sm px-1.5 py-0.5 rounded-lg transition text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70">
                                      {item.title}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!!featureCards?.length && (
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-3">
                        Featured
                      </h4>
                      <ul className="space-y-2">
                        {featureCards.slice(0, 4).map((card, idx) => (
                          <li key={`feat-${idx}`}>
                            <Link
                              href={card.link}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition"
                            >
                              <Image
                                src={`${card.image.asset.url}?w=112&h=112&fit=crop`}
                                alt={card.alt}
                                width={56}
                                height={56}
                                className="w-14 h-14 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate group-hover:text-[#5a3e2b]">
                                  {card.title}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                                  {card.description}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {promoCard?.title && (
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-3">
                        Special Offer
                      </h4>
                      <Link
                        href={promoCard.link}
                        onClick={() => setOpen(false)}
                        className="group block rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white/70 dark:bg-neutral-800/70"
                      >
                        <Image
                          src={promoCard.image?.asset?.url || "/fallback.jpg"}
                          alt={promoCard.alt || "Special offer"}
                          width={640}
                          height={360}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <div className="text-sm font-semibold group-hover:text-[#5a3e2b]">
                            {promoCard.title}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                            {promoCard.description}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex justify-end px-6 pb-3 -mt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-sm px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
