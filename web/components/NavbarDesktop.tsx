"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserMenu from "@/components/CustomUserMenu";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function BadgeVisual({ size }: { size: number }) {
  return (
    <>
      <Image
        src="/logos/badge-light.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="block dark:hidden object-contain"
        priority
      />
      <Image
        src="/logos/badge-dark.png"
        alt="Fair Trade Safaris badge"
        width={size}
        height={size}
        className="hidden dark:block object-contain"
        priority
      />
    </>
  );
}

function DesktopRoundBadge({ scrolled }: { scrolled: boolean }) {
  const size = scrolled ? { box: 96, img: 76 } : { box: 150, img: 125 };
  return (
    <div
      className={cx(
        "fixed z-[60] top-0 left-4 px-2 pt-2 pb-1 shadow-md backdrop-blur-md transition-all duration-300 ease-in-out",
        "rounded-b-2xl rounded-t-none hidden md:flex items-center justify-center",
        "bg-[#d7ccc8e6] dark:bg-[#1f1410e6]"
      )}
      style={{ width: size.box, height: size.box }}
    >
      <Link href="/" aria-label="Fair Trade Safaris">
        <BadgeVisual size={size.img} />
      </Link>
    </div>
  );
}

export default function NavbarDesktop() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false); // if you later add a desktop mega menu

  return (
    <>
      <DesktopRoundBadge scrolled={scrolled} />

      <nav
        className={cx(
          "hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-4xl px-3",
          "items-center justify-between gap-6",
          "rounded-2xl shadow-md backdrop-blur transition-all duration-300",
          scrolled ? "py-1" : "py-3",
          "bg-[#d7ccc8e6] dark:bg-[#1f1410e6] text-foreground dark:text-white"
        )}
      >
        <div className="flex items-center gap-3 pl-4 pt-2 md:pt-0">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Fair Trade Safaris"
          >
            <Image
              src="/logos/logo-light.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "block dark:hidden object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105"
              )}
              priority
            />
            <Image
              src="/logos/logo-dark.png"
              alt="Fair Trade Safaris"
              width={scrolled ? 180 : 260}
              height={scrolled ? 40 : 60}
              className={cx(
                "hidden dark:block object-contain transition-all duration-300 ease-in-out",
                scrolled ? "scale-100" : "scale-105"
              )}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 pr-3">
          <Link href="/journey" title="Search" className="p-2 rounded-xl">
            <Search size={20} />
          </Link>
          <SignedIn>
            <CustomUserMenu />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" title="My Journey" className="p-2 rounded-xl">
              <User size={20} />
            </Link>
          </SignedOut>
          <motion.button
            whileTap={{ scale: 0.9 }}
            title={open ? "Close Menu" : "Open Menu"}
            onClick={() => setOpen((v) => !v)}
            className="transition-transform duration-200 p-2 rounded-xl"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>
    </>
  );
}
