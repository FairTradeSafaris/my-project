"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import navbar + footer to reduce JS sent on first load
const Navbar = dynamic(
  () => import("@/components/Navbar").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null, // Or a skeleton/loading if needed
  }
);

const SafariFactFooter = dynamic(
  () => import("@/components/SafariFactFooter").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideUI = pathname === "/project-portal"; // Adjust route logic as needed

  return (
    <>
      {!hideUI && <Navbar />}
      <main>{children}</main>
      {!hideUI && <SafariFactFooter />}
    </>
  );
}
