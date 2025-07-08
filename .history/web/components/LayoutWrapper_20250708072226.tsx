"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import to reduce initial bundle size
const Navbar = dynamic(() => import("./Navbar"));
const SafariFactFooter = dynamic(() => import("./SafariFactFooter"));

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/project-portal"; // adjust as needed

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      {!hideNavbar && <SafariFactFooter />}
    </>
  );
}
