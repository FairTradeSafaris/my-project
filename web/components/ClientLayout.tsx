"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";

// Split navs (client components)
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import BottomTabBar from "@/components/BottomTabBar";
import HeroController, { type HeroData } from "@/components/HeroController";

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
  const searchParams = useSearchParams();
  const isJourneyOpen = searchParams.get("open") === "true";
  const hideUI = isJourneyOpen || pathname === "/project-portal";

  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<PromoCard | null>(null);
  const [ready, setReady] = useState(false);

  // hero data for HeroController (BG from Sanity)
  const [heroData, setHeroData] = useState<HeroData | null>(null);

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
      } catch (e) {
        console.error("megaMenu fetch failed", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    // Hero content fetch (Sanity)
    (async () => {
      try {
        const h = await client.fetch(`
          *[_type == "hero"][0]{
            headline,
            subheadline,
            primaryCTA,
            secondaryCTA,
            backgroundImages[]{ alt, asset->{ _ref, _type, url } }
          }
        `);
        if (cancelled) return;

        const imgs = Array.isArray(h?.backgroundImages)
          ? h.backgroundImages.filter(Boolean)
          : [];
        const chosen = imgs.length
          ? [imgs[Math.floor(Math.random() * imgs.length)]]
          : [];

        const shaped: HeroData = {
          headline: h?.headline ?? undefined,
          subheadline: h?.subheadline ?? undefined,
          primaryCTA: h?.primaryCTA ?? undefined,
          secondaryCTA: h?.secondaryCTA ?? undefined,
          backgroundImages: chosen,
        };
        setHeroData(shaped);
      } catch (e) {
        console.error("hero fetch failed", e);
        setHeroData(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Global nav (mobile + desktop) */}

      {!hideUI && ready && (
        <>
          <NavbarMobile /> {/* ← remove props here */}
          <NavbarDesktop
            navSections={navSections}
            featureCards={featureCards}
            promoCard={promoCard || undefined}
          />
        </>
      )}

      {/* Global hero */}
      <HeroController heroData={heroData} />

      <main>{children}</main>

      {/* Bottom tabs + extras */}
      {pathname !== "/project-portal" && <BottomTabBar />}
      {!hideUI && ready && <TestimonialCarousel />}
      {!hideUI && ready && <SafariFactFooter />}
    </>
  );
}
