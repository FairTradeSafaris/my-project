"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { usePathname } from "next/navigation";

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

function DesktopRoundBadge({ scrolled }: { scrolled: boolean }) {
  const size = scrolled ? { box: 96, img: 76 } : { box: 150, img: 125 };
  return (
    <div
      className={cx(
        "fixed z-[60] top-0 left-4 px-2 pt-2 pb-1 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out",
        "rounded-b-2xl rounded-t-none hidden xl:flex items-center justify-center",
        "bg-[#d7ccc8e6] dark:bg-[#1f1410e6]"
      )}
      style={{ width: size.box, height: size.box }}
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
  const pathname = usePathname();
  const hideBadge = pathname.startsWith("/journey");
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    if (open) document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev || "";
    };
  }, [open]);

  return (
    <>
      {!hideBadge && <DesktopRoundBadge scrolled={scrolled} />}

      <nav
        className={cx(
          "hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-4xl px-3",
          "items-center justify-between gap-6",
          "rounded-2xl shadow-md backdrop-blur transition-all duration-300",
          scrolled ? "py-1 sm:py-1.5" : "py-3 sm:py-4",
          "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white"
        )}
      >
        <div className="flex items-center gap-3 pl-4 pt-2 sm:pt-0">
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
        </div>

        <div className="flex items-center gap-4 sm:gap-6 pr-3">
          <Link href="/journey" title="Search" className="p-2 rounded-xl">
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
            title={open ? "Close Menu" : "Open Menu"}
            onClick={() => setOpen((v) => !v)}
            className="transition-transform duration-200 p-2 rounded-xl"
            aria-expanded={open}
            aria-controls="desktop-menu-sheet"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

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
              className="hidden sm:block fixed left-1/2 -translate-x-1/2 z-50 mt-28 w-[92vw] max-w-6xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="rounded-3xl shadow-2xl ring-1 ring-black/10 backdrop-blur bg-white/85 dark:bg-neutral-900/80 border border-white/40 dark:border-white/10">
                <div
                  className={[
                    "p-6 lg:p-8 gap-6 grid",
                    featureCards?.length && promoCard?.title
                      ? "grid-cols-3"
                      : featureCards?.length || promoCard?.title
                        ? "grid-cols-2"
                        : "grid-cols-1",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-3">
                      Navigation
                    </h4>

                    <div className="max-h-[62vh] overflow-y-auto pr-2">
                      <div className="space-y-6">
                        {navSections.map((section, sIdx) => (
                          <div key={`sec-${sIdx}`} className="min-w-0">
                            {section.heading && (
                              <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-300 mb-2">
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
                                    <span className="block text-sm px-3 py-2 rounded-xl transition text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70">
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
                      <ul className="space-y-3">
                        {featureCards.slice(0, 4).map((card, idx) => (
                          <li key={`feat-${idx}`}>
                            <Link
                              href={card.link}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-3 rounded-2xl p-2 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition"
                            >
                              <Image
                                src={card.image.asset.url}
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

                <div className="flex justify-end px-6 lg:px-8 pb-5 -mt-2">
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
