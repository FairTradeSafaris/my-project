"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = { title: string; href: string };
type NavSection = { heading?: string; links: MenuItem[] };
type FeatureCard = {
  title: string;
  description: string;
  image: { asset: { url: string } };
  alt: string;
  link: string;
};

type Props = {
  onClose: () => void;
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard;
};

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function BadgeVisual({ size }: { size: number }) {
  return (
    <>
      <Image
        src="/logos/badge-light.webp"
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

// ✅ NEW: Wrapper to delay Clerk usage until after cookieConsent
function ClerkMenuSection({ onClose }: { onClose: () => void }) {
  return (
    <>
      <SignedIn>
        <CustomUserMenu />
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in/"
          onClick={onClose}
          className="px-3 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium"
        >
          Sign in
        </Link>
      </SignedOut>
    </>
  );
}

export default function MobileMenuSheet({
  onClose,
  navSections = [
    {
      links: [
        { title: "Safari Itineraries", href: "/africansafariitineraries/" },
        { title: "Safari Destinations", href: "/destination/" },
        { title: "Book a Discovery Call", href: "/contact/" },
        { title: "Meet the Team", href: "/team/" },
        { title: "Collabs & Ambassadors", href: "/collabs/" },
        { title: "Client Testimonials", href: "/testimonials/" },
      ],
    },
  ],
  featureCards = [],
  promoCard,
}: Props) {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);

  // ✅ Cookie Consent Tracker
  useEffect(() => {
    const stored = localStorage.getItem("cookieConsent");
    if (stored === "accepted") setHasConsent(true);

    const handler = (e: StorageEvent) => {
      if (e.key === "cookieConsent" && e.newValue === "accepted") {
        setHasConsent(true);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <>
      {/* Backdrop: only clicking this closes the sheet */}
      <div
        data-backdrop="true"
        className="fixed inset-0 z-[79] bg-black/50"
        onClick={(e) => {
          if ((e.target as HTMLElement).dataset.backdrop === "true") onClose();
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
          duration: 0.22,
        }}
        className="fixed inset-0 z-[80] bg-white dark:bg-neutral-900 flex flex-col"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#d7ccc8] dark:bg-[#1f1410] grid place-items-center shadow-sm">
              <BadgeVisual size={26} />
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Menu
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X size={20} className="text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>

        {/* Search + Clerk Auth */}
        <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center gap-3">
          <Link
            href="/africansafariitineraries/"
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-4 grid grid-cols-[20px_1fr] items-center gap-3 text-sm"
          >
            <Search
              size={18}
              className="text-neutral-600 dark:text-neutral-300"
            />
            <span className="text-neutral-600 dark:text-neutral-200">
              Search journeys
            </span>
          </Link>

          {/* ✅ Render Clerk stuff only if consent accepted */}
          {hasConsent && <ClerkMenuSection onClose={onClose} />}
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto">
          {/* Main nav links */}
          <div className="px-2 py-3">
            <ul className="space-y-1">
              {navSections
                .flatMap((s) => s.links)
                .map((item, i) => (
                  <li key={`m-${i}`}>
                    <Link href={item.href} onClick={onClose}>
                      <span
                        className={cx(
                          "block px-3 py-3 rounded-2xl text-[15px] transition",
                          "text-neutral-900 dark:text-neutral-100",
                          pathname === item.href
                            ? "bg-neutral-200 dark:bg-neutral-800 font-semibold"
                            : "bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700",
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
              <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-300 mb-2">
                Featured
              </h3>
              <ul className="space-y-2">
                {featureCards.map((card, idx) => (
                  <li key={`feat-${idx}`}>
                    <Link
                      href={card.link}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    >
                      <Image
                        src={card.image.asset.url}
                        alt={card.alt}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {card.title}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
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
              <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-300 mb-2">
                Special Offer
              </h3>
              <Link
                href={promoCard.link}
                onClick={onClose}
                className="block rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800"
              >
                <Image
                  src={promoCard?.image?.asset?.url || "/fallback.jpg"}
                  alt={promoCard?.alt || "Special Offer"}
                  width={1200}
                  height={600}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
                    {promoCard.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                    {promoCard.description}
                  </p>
                </div>
              </Link>
            </div>
          )}

          <div className="h-6" />
        </div>
      </motion.div>
    </>
  );
}
