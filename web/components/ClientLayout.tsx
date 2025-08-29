"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";
import { useBreakpoint } from "@/lib/useBreakpoint";
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import BottomTabBar from "@/components/BottomTabBar";
import HeroController from "@/components/HeroController";

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
  {
    ssr: false,
  }
);
const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel"),
  {
    ssr: false,
  }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const screenWidth = useBreakpoint();
  const hideUI = pathname === "/project-portal";

  const [hasMounted, setHasMounted] = useState(false);
  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<PromoCard | null>(null);
  const [ready, setReady] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | undefined>(undefined);

  const pageKey = useMemo(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg || "home";
  }, [pathname]);

  const showHero = pageKey !== "destinations";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchMenuData = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "megaMenu"][0]{
            navSections[] { heading, links[] { title, href } },
            featureCards[] {
              title, description, alt, link,
              image { asset->{ _ref,_type,url }, _type }
            },
            promoCard {
              title, description, alt, link,
              image { asset->{ _ref,_type,url }, _type }
            }
          }`);
        if (cancelled) return;
        setNavSections(
          Array.isArray(data?.navSections) ? data.navSections : []
        );
        setFeatureCards(
          Array.isArray(data?.featureCards) ? data.featureCards : []
        );
        setPromoCard(data?.promoCard || null);
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    const fetchHeroData = async () => {
      if (!showHero) {
        setHeroData(undefined);
        return;
      }

      try {
        const data = await client.fetch(
          `{
            "items": [
              ...*[_type == "hero" && (scope == $k || (scope == "custom" && customScope == $k))]{
                headline, subheadline, primaryCTA, secondaryCTA, action,
                backgroundImages[] {
                  _type, alt, asset->{ _ref, _type, url },
                  desktopImage{ asset->{ _ref, _type, url } },
                  mobileImage{ asset->{ _ref, _type, url } }
                }
              }[0...1],
              ...*[_type == "hero" && scope == "default"]{
                headline, subheadline, primaryCTA, secondaryCTA, action,
                backgroundImages[] {
                  _type, alt, asset->{ _ref, _type, url },
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

        setHeroData({
          headline: h.headline ?? undefined,
          subheadline: h.subheadline ?? undefined,
          primaryCTA: h.primaryCTA ?? undefined,
          secondaryCTA: h.secondaryCTA ?? undefined,
          backgroundImages: chosen,
          action: h.action ?? undefined,
        });
      } catch (err) {
        console.log("❌ Hero fetch error:", err);
        setHeroData(undefined);
      }
    };

    fetchMenuData();
    fetchHeroData();

    return () => {
      cancelled = true;
    };
  }, [pageKey, showHero]);

  return (
    <>
      {!hideUI && ready && hasMounted && screenWidth !== null && (
        <>
          {screenWidth < 1024 ? ( // ⬅️ UPDATED from 768 to 1024
            <NavbarMobile />
          ) : (
            <NavbarDesktop
              navSections={navSections}
              featureCards={featureCards}
              promoCard={promoCard || undefined}
            />
          )}
        </>
      )}

      {showHero && (
        <div className="pt-16 md:pt-0">
          <HeroController heroData={heroData} />
        </div>
      )}

      <main>{children}</main>

      {!hideUI && screenWidth !== null && screenWidth < 1024 && (
        <BottomTabBar />
      )}
      {!hideUI && ready && <TestimonialCarousel />}
      {!hideUI && ready && <SafariFactFooter />}
    </>
  );
}
