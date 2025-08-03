"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";

type MenuItem = {
  title: string;
  href: string;
};

type NavSection = {
  heading?: string;
  links: MenuItem[];
};

type FeatureCard = {
  title: string;
  description: string;
  image: {
    asset: {
      url: string;
    };
  };
  alt: string;
  link: string;
};
type PromoCard = FeatureCard;

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SafariFactFooter = dynamic(
  () => import("@/components/SafariFactFooter"),
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
  const hideUI = pathname === "/project-portal";

  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [promoCard, setPromoCard] = useState<PromoCard | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(
        `*[_type == "megaMenu"][0]{
    navSections[] {
      heading,
      links[] {
        title,
        href
      }
    },
    featureCards[] {
      title,
      description,
      alt,
      link,
      image {
        asset->{
          _ref,
          _type,
          url
        },
        _type
      }
    },
    promoCard {
      title,
      description,
      alt,
      link,
      image {
        asset->{
          _ref,
          _type,
          url
        },
        _type
      }
    }
  }`
      );

      setNavSections(data?.navSections || []);
      setFeatureCards(data?.featureCards || []);
      setPromoCard(data?.promoCard || null); // ✅ Use `null` not `undefined`
      console.log("PROMO CARD CHECK", {
        title: data?.promoCard?.title,
        link: data?.promoCard?.link,
        imageUrl: data?.promoCard?.image?.asset?.url,
      });
    };

    fetchData();
  }, []);

  if (!navSections.length && !featureCards.length && promoCard === undefined) {
    return null; // or a loader/spinner if you prefer
  }

  return (
    <>
      {!hideUI && (
        <Navbar
          navSections={navSections}
          featureCards={featureCards}
          promoCard={promoCard}
        />
      )}
      <main>{children}</main>
      {!hideUI && <SafariFactFooter />}
    </>
  );
}
