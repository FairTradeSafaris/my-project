// components/ClientLayout.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";

// Split navs (client components)
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import BottomTabBar from "@/components/BottomTabBar";
import HeroController from "@/components/HeroController";

// Local copy of the hero shape we pass to HeroController
type HeroData = {
  headline?: string;
  subheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  backgroundImages?: Array<{
    alt?: string;
    asset?: { _ref?: string; _type?: string; url?: string };
  }>;
  action?: "none" | "homeFilters" | "typeSearch";
};

type MenuItem = { title: string; href: string };
type NavSection = { heading?: string; links: MenuItem[] };
type FeatureCard = {
  title: string;
  description: string;
  image: { asset: { url: string } };
  alt: string;
  link: string;
};
type PromoCard = FeatureCard;

const SafariFactFooter = dynamic(
  () => import("@/components/SafariFactFooter"),
  { ssr: false }
);
const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel"),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideUI = pathname === "/project-portal";

  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<PromoCard | null>(null);
  const [ready, setReady] = useState(false);

  // ---- derive page key for hero selection (top path segment or "home") ----
  const pageKey = useMemo(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg || "home";
  }, [pathname]);

  // SHOW HERO? (hide on destinations)
  const showHero = pageKey !== "destinations";

  // hero data for HeroController (BG from Sanity)
  const [heroData, setHeroData] = useState<HeroData | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    // Mega menu fetch (Sanity)

    (async () => {
      try {
        const data = await client.fetch(
          `*[_type == "megaMenu"][0]{
          navSections[] { heading, links[] { title, href } },
          featureCards[] {
            title, description, alt, link,
            image { asset->{ _ref,_type,url }, _type }
          },
          promoCard {
            title, description, alt, link,
            image { asset->{ _ref,_type,url }, _type }
          }
        }`
        );
        if (cancelled) return;
        setNavSections(
          Array.isArray(data?.navSections) ? data.navSections : []
        );
        setFeatureCards(
          Array.isArray(data?.featureCards) ? data.featureCards : []
        );
        setPromoCard(data?.promoCard || null);
      } catch {
        // swallow
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    // Hero content fetch (page-specific with fallback to "default")
    (async () => {
      try {
        if (!showHero) {
          setHeroData(undefined);
          return;
        }
        const data = await client.fetch(
          `{
    "items": [
      ...*[_type == "hero" && (scope == $k || (scope == "custom" && customScope == $k))]{
        headline,
        subheadline,
        primaryCTA,
        secondaryCTA,
        action,
        backgroundImages[] {
          _type,
          alt,
          asset->{ _ref, _type, url },
          desktopImage{ asset->{ _ref, _type, url } },
          mobileImage{ asset->{ _ref, _type, url } }
        }
      }[0...1],
      ...*[_type == "hero" && scope == "default"]{
        headline,
        subheadline,
        primaryCTA,
        secondaryCTA,
        action,
        backgroundImages[] {
          _type,
          alt,
          asset->{ _ref, _type, url },
          desktopImage{ asset->{ _ref, _type, url } },
          mobileImage{ asset->{ _ref, _type, url } }
        }
      }[0...1]
    ]
  }`,
          { k: pageKey }
        );

        if (cancelled) return;

        const h =
          Array.isArray(data?.items) && data.items.length > 0
            ? data.items[0]
            : undefined;

        if (!h) {
          setHeroData(undefined);
          return;
        }

        const imgs = Array.isArray(h.backgroundImages)
          ? h.backgroundImages.filter(Boolean)
          : [];
        const chosen = imgs.length
          ? [imgs[Math.floor(Math.random() * imgs.length)]]
          : [];

        const shaped: HeroData = {
          headline: h.headline ?? undefined,
          subheadline: h.subheadline ?? undefined,
          primaryCTA: h.primaryCTA ?? undefined,
          secondaryCTA: h.secondaryCTA ?? undefined,
          backgroundImages: chosen,
          action: h.action ?? undefined,
        };

        setHeroData(shaped);
      } catch (err) {
        console.log("❌ Hero fetch error:", err);
        setHeroData(undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageKey, showHero]);

  return (
    <>
      {/* Global nav (mobile + desktop) */}
      {!hideUI && ready && (
        <>
          <NavbarMobile />
          <NavbarDesktop
            navSections={navSections}
            featureCards={featureCards}
            promoCard={promoCard || undefined}
          />
        </>
      )}

      {/* Global hero — hidden on /destinations */}
      {showHero && <HeroController heroData={heroData} />}

      <main>{children}</main>

      {/* Bottom tabs + extras */}
      {pathname !== "/project-portal" && <BottomTabBar />}
      {!hideUI && ready && <TestimonialCarousel />}
      {!hideUI && ready && <SafariFactFooter />}
    </>
  );
}
