"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { client } from "@/lib/sanity";
import { Loader2 } from "lucide-react"; // Spinner icon from Lucide

type MegaMenuData = {
  navSections: {
    heading?: string;
    links: {
      title: string;
      href: string;
    }[];
  }[];
  featureCards: {
    title: string;
    description: string;
    alt: string;
    link: string;
    image: {
      asset: {
        url: string;
      };
    };
  }[];
  promoCard: {
    title: string;
    description: string;
    alt: string;
    link: string;
    image: {
      asset: {
        url: string;
      };
    };
  };
};

export default function NavbarWrapper() {
  const [data, setData] = useState<MegaMenuData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
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
              asset -> {
                url
              }
            }
          },
          promoCard {
            title,
            description,
            alt,
            link,
            image {
              asset -> {
                url
              }
            }
          }
        }`
      )
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch megaMenu from Sanity:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-neutral-900/80 text-sm text-gray-700 dark:text-gray-300 rounded-xl shadow backdrop-blur animate-fade-in">
        <Loader2 className="animate-spin" size={16} />
        <span>Loading navigation...</span>
      </div>
    );
  }

  return (
    <Navbar
      navSections={data.navSections}
      featureCards={data.featureCards}
      promoCard={data.promoCard}
    />
  );
}
