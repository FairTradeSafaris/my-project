"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { client } from "@/lib/sanity";

// Import types if you have them
type MenuItem = {
  title: string;
  href: string;
};

type FeatureCard = {
  title: string;
  description: string;
  image: any;
  alt: string;
  link: string;
};

// Dynamic imports (keep SSR false)
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SafariFactFooter = dynamic(
  () => import("@/components/SafariFactFooter"),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideUI = pathname === "/project-portal";

  const [navLinks, setNavLinks] = useState<MenuItem[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(
        `*[_type == "megaMenu"][0]{navLinks, featureCards}`
      );
      setNavLinks(data?.navLinks || []);
      setFeatureCards(data?.featureCards || []);
    };
    fetchData();
  }, []);

  return (
    <>
      {!hideUI && <Navbar navLinks={navLinks} featureCards={featureCards} />}
      <main>{children}</main>
      {!hideUI && <SafariFactFooter />}
    </>
  );
}
