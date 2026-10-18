// app/client-home/ambassador/page.tsx (batch 24)
// Ambassador dashboard inside Safari Hub. Same login as Safari Hub (no Clerk
// or middleware change). The page itself holds no private data; the
// ambassador's details load from /api/ambassador/me/ in the browser.
import type { Metadata } from "next";
import HeroController from "@/components/HeroController";
import { client as sanity } from "@/lib/sanity";
import { homeContainer } from "@/components/home/homeStyles";
import AmbassadorAreaWrapper from "./AmbassadorAreaWrapper";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Your Ambassador Area | Fair Trade Safaris",
  description: "Your Fair Trade Safaris ambassador code, personal link and QR code.",
  robots: { index: false, follow: false },
};

export default async function AmbassadorPage() {
  let bg: unknown[] = [];
  try {
    const hero = await sanity.fetch(
      `*[_type == "hero" && customScope == "client-home"][0]{
        backgroundImages[]{ alt, desktopImage { asset-> }, mobileImage { asset-> } }
      }`,
      {},
      { next: { revalidate: 300 } },
    );
    if (Array.isArray(hero?.backgroundImages)) bg = hero.backgroundImages;
  } catch {
    bg = [];
  }

  const heroData = {
    headline: "Your Ambassador Area",
    subheadline: "Your personal code, link and QR code, all in one place.",
    action: "none" as const,
    backgroundImages: bg as never,
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Safari Hub", href: "/client-home/" },
    { label: "Ambassador Area", href: "/client-home/ambassador/" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} look="calm" />
      <main className="bg-[#f7f3ec] py-10 md:py-14">
        <div className={homeContainer}>
          <AmbassadorAreaWrapper />
        </div>
      </main>
    </>
  );
}
