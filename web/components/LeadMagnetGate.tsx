// components/LeadMagnetGate.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LeadMagnetWrapper from "@/components/LeadMagnetWrapper";

const MOBILE_MAX = 768; // px

export default function LeadMagnetGate() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_MAX);
    onResize(); // check once on mount
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isJourneyPage =
    pathname?.startsWith("/journey") || pathname?.startsWith("/journeys");

  if (isJourneyPage && isMobile) return null;
  return <LeadMagnetWrapper />;
}
