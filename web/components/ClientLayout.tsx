"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";

// Split navs (client components)
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

  useEffect(() => {
    let cancelled = false;
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
        setNavSections(data?.navSections || []);
        setFeatureCards(data?.featureCards || []);
        setPromoCard(data?.promoCard || null);
      } catch (e) {
        console.error("megaMenu fetch failed", e);
      } finally {
        if (!cancelled) setReady(true);
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
          <NavbarMobile
            navSections={navSections}
            featureCards={featureCards}
            promoCard={promoCard || undefined}
          />
          {/* ⬇️ no props here */}
          <NavbarDesktop />
        </>
      )}

      <main>{children}</main>

      {/* Bottom tabs + extras */}
      {/* keep navs/testimonials/facts gated by ready, but NOT the bottom bar */}
      {pathname !== "/project-portal" && <BottomTabBar />}
      {!hideUI && ready && <TestimonialCarousel />}
      {!hideUI && ready && <SafariFactFooter />}
    </>
  );
}
