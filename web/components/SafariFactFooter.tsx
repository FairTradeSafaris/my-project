"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { client, urlFor } from "@/lib/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";

type SocialLink = {
  platform: string;
  icon?: { asset?: SanityImageAssetDocument };
  alt?: string;
  url: string;
};

type FooterLink = { label: string; href: string };
type ConnectLink = FooterLink;

const easeOutBezier: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeInitial = { opacity: 0, y: 8 };
const fadeAnimate = { opacity: 1, y: 0 };
const fadeTransition = { duration: 0.35, ease: easeOutBezier } as const;

export default function SafariFactFooter() {
  const [fact, setFact] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [exploreLinks, setExploreLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [connectLinks, setConnectLinks] = useState<ConnectLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const featuredLogos = [
    { src: "/logos/nbc.svg", alt: "NBC" },
    { src: "/logos/usa-today.svg", alt: "USA Today" },
    { src: "/logos/fox.svg", alt: "FOX" },
    { src: "/logos/CBS_logo.svg", alt: "CBS" },
  ];
  const [logoUrlMobile, setLogoUrlMobile] = useState<string>("");
  const [logoUrlDesktop, setLogoUrlDesktop] = useState<string>("");
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const result = await client.fetch(
          `*[_type == "footer"][0]{
    facts,
    lineArt{asset},
    logo{asset},
    logoSmall{asset},
    exploreLinks,
    socialLinks[]{platform,icon{asset},alt,url},
    connectLinks
  }`,
        );

        if (result) {
          if (result.facts?.length) {
            setFact(
              result.facts[Math.floor(Math.random() * result.facts.length)],
            );
          }
          setImageUrl(
            result.lineArt?.asset ? urlFor(result.lineArt.asset).url() : "",
          );
          setLogoUrlMobile(
            result.logoSmall?.asset
              ? urlFor(result.logoSmall.asset).url()
              : urlFor(result.logo.asset).url(),
          );
          setLogoUrlDesktop(
            result.logo?.asset ? urlFor(result.logo.asset).url() : "",
          );

          setExploreLinks(result.exploreLinks || []);
          setConnectLinks(result.connectLinks || []);
          setSocialLinks(result.socialLinks || []);
        }
      } catch (e) {
        console.error("Footer fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  // Balance Explore + Connect into two even columns
  const allLinks: FooterLink[] = [...exploreLinks, ...connectLinks];
  const mid = Math.ceil(allLinks.length / 2);
  const col1 = allLinks.slice(0, mid);
  const col2 = allLinks.slice(mid);

  return (
    <footer className="relative isolate text-[#3f2e1f] text-sm bg-[#f7f3ec]">
      {/* "As Seen On" Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-8 pt-10">
        <div className="py-5 sm:py-6 border-b border-black/10">
          <p className="text-center text-xs tracking-[0.3em] uppercase opacity-70 mb-4">
            As Seen On
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 sm:gap-x-16 gap-y-6 opacity-80">
            {featuredLogos.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={24}
                className="h-6 sm:h-7 md:h-8 w-auto grayscale opacity-80"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dark overlay ONLY when site is in dark mode */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block bg-black/22"
      />

      {/* Main grid — three columns: logo | links | illustration */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-4 pt-8 md:pt-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-start">
        {/* Left: Brand */}
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
        >
          {loading ? (
            <div className="h-[56px] w-[220px] rounded-xl bg-black/5 animate-pulse" />
          ) : (
            <>
              {/* Mobile logo */}
              {logoUrlMobile && (
                <Image
                  src={logoUrlMobile}
                  alt="Fair Trade Safaris"
                  width={220}
                  height={56}
                  priority
                  className="block md:hidden w-[180px] sm:w-[200px] h-auto"
                />
              )}

              {/* Desktop logo */}
              {logoUrlDesktop && (
                <Image
                  src={logoUrlDesktop}
                  alt="Fair Trade Safaris"
                  width={360}
                  height={92}
                  priority
                  className="hidden md:block w-[220px] h-auto"
                />
              )}
            </>
          )}

          <p className="mt-3 max-w-xs text-[#5a4836]">
            Travel with purpose. Curated safaris that support conservation and
            communities across Africa.
          </p>
        </motion.div>

        {/* Center: Quick Links (balanced two columns) */}
        <motion.nav
          aria-label="Footer quick links"
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          className="self-start"
        >
          {allLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 tracking-wide">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-x-8">
                <ul className="space-y-1.5">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <li
                          key={`s-col1-${i}`}
                          className="h-3 rounded bg-black/5 animate-pulse"
                        />
                      ))
                    : col1.map((l, i) => (
                        <li key={`col1-${i}`}>
                          <Link
                            href={`${l.href.replace(/\/?$/, "/")}`}
                            className="hover:underline hover:text-black/80"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                </ul>
                <ul className="space-y-1.5">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <li
                          key={`s-col2-${i}`}
                          className="h-3 rounded bg-black/5 animate-pulse"
                        />
                      ))
                    : col2.map((l, i) => (
                        <li key={`col2-${i}`}>
                          <Link
                            href={`${l.href.replace(/\/?$/, "/")}`}
                            className="hover:underline hover:text-black/80"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          )}
        </motion.nav>

        {/* Right: Illustration */}
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          className="flex justify-end pr-2"
        >
          {loading ? (
            <div className="h-20 w-64 rounded-xl bg-black/5 animate-pulse" />
          ) : (
            imageUrl && (
              <Image
                src={imageUrl}
                alt="Rhino illustration"
                width={360}
                height={110}
                className="opacity-75"
              />
            )
          )}
        </motion.div>
      </div>

      {/* Fact pill */}
      {fact && (
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          className="relative z-10 mt-1 mb-4 flex justify-center px-6"
        >
          <div className="bg-[#e8dcc9] text-[#6b4a27] px-3.5 py-1.5 rounded-full italic max-w-2xl text-center text-[13px] border border-black/5">
            <span className="opacity-80">Did you know?</span>{" "}
            <span className="font-medium not-italic">{fact}</span>
          </div>
        </motion.div>
      )}

      {/* Socials */}
      {socialLinks.length > 0 && (
        <div className="relative z-10 mb-3 flex justify-center flex-wrap gap-3 px-6">
          {socialLinks.map((s, i) => (
            <a
              key={`${s.platform}-${i}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="inline-flex items-center justify-center h-11 w-11 rounded-full overflow-hidden transition transform hover:-translate-y-0.5 hover:shadow-sm"
            >
              {s.icon?.asset && (
                <Image
                  src={urlFor(s.icon.asset).width(44).height(44).url()}
                  alt={s.alt || s.platform}
                  width={44}
                  height={44}
                />
              )}
            </a>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative z-10 text-xs py-2.5 mt-2 border-t border-[#d2c2a3] bg-[#eadfca]/60 backdrop-blur-sm px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <Link href="/privacy/" className="underline hover:text-black">
            Privacy Policy
          </Link>
          <p className="opacity-80">
            © {new Date().getFullYear()} Fair Trade Safaris. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
