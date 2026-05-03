"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";
import { useBreakpoint } from "@/lib/useBreakpoint";
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import BottomTabBar from "@/components/BottomTabBar";

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
  { ssr: false },
);
const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel"),
  { ssr: false },
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const screenWidth = useBreakpoint();

  const hideUI = pathname?.toLowerCase() === "/project-portal";
  const [, setPillarSlugs] = useState<string[]>([]);

  const [hasMounted, setHasMounted] = useState(false);
  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<PromoCard | null>(null);
  const [ready, setReady] = useState(false);

  const pageKey = useMemo(() => {
    if (!pathname) return "home";
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg || "home";
  }, [pathname]);

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
          Array.isArray(data?.navSections) ? data.navSections : [],
        );
        setFeatureCards(
          Array.isArray(data?.featureCards) ? data.featureCards : [],
        );
        setPromoCard(data?.promoCard || null);
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    const fetchPillarSlugs = async () => {
      const slugs = await client.fetch(`*[_type == "pillarPage"].slug.current`);
      setPillarSlugs(slugs || []);
    };
    fetchMenuData();

    fetchPillarSlugs();

    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  // 🔍 DEBUG LOGS

  return (
    <>
      {!hideUI && ready && hasMounted && screenWidth !== null && (
        <>
          {screenWidth < 1024 ? (
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

      <div>{children}</div>

      {!hideUI && screenWidth !== null && screenWidth < 1024 && (
        <BottomTabBar />
      )}
      {!hideUI && ready && <TestimonialCarousel />}
      {!hideUI && ready && <SafariFactFooter />}
    </>
  );
}
