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

type FooterLink = {
  label: string;
  href: string;
};

type ConnectLink = FooterLink;

const easeOutBezier: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInitial = { opacity: 0, y: 8 };
const fadeAnimate = { opacity: 1, y: 0 };
const fadeTransition = {
  duration: 0.35,
  ease: easeOutBezier,
} as const;

const awardBadge = "/badges/Fair Trade Safaris - Winner Badge tp.png";

export default function SafariFactFooter() {
  const [fact, setFact] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [exploreLinks, setExploreLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [connectLinks, setConnectLinks] = useState<ConnectLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [logoUrlMobile, setLogoUrlMobile] = useState<string>("");
  const [logoUrlDesktop, setLogoUrlDesktop] = useState<string>("");

  const featuredLogos = [
    { src: "/logos/nbc.svg", alt: "NBC" },
    { src: "/logos/usa-today.svg", alt: "USA Today" },
    { src: "/logos/fox.svg", alt: "FOX" },
    { src: "/logos/CBS_logo.svg", alt: "CBS" },
  ];

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
            socialLinks[]{
              platform,
              icon{asset},
              alt,
              url
            },
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
              : result.logo?.asset
                ? urlFor(result.logo.asset).url()
                : "",
          );

          setLogoUrlDesktop(
            result.logo?.asset ? urlFor(result.logo.asset).url() : "",
          );

          setExploreLinks(result.exploreLinks || []);
          setConnectLinks(result.connectLinks || []);
          setSocialLinks(result.socialLinks || []);
        }
      } catch (error) {
        console.error("Footer fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  const allLinks: FooterLink[] = [...exploreLinks, ...connectLinks];

  const mid = Math.ceil(allLinks.length / 2);
  const col1 = allLinks.slice(0, mid);
  const col2 = allLinks.slice(mid);

  return (
    <footer className="relative isolate overflow-hidden bg-[#f7f3ec] text-sm text-[#3f2e1f]">
      {/* As Seen On */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pt-10 sm:px-8 lg:px-12 xl:px-16">
        <div className="border-b border-black/10 pb-7">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] opacity-70">
            As Seen On
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-80 sm:gap-x-16 lg:gap-x-24 xl:gap-x-28">
            {featuredLogos.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={32}
                className="h-6 w-auto grayscale opacity-80 sm:h-7 md:h-8"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-10 px-6 pb-8 pt-10 sm:px-8 md:grid-cols-2 lg:grid-cols-[0.9fr_1.45fr_1fr] lg:gap-16 lg:px-12 xl:gap-24 xl:px-16">
        {/* Brand + Award */}
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          viewport={{ once: true }}
          className="flex flex-col items-start"
        >
          {loading ? (
            <div className="h-[56px] w-[220px] animate-pulse rounded-xl bg-black/5" />
          ) : (
            <>
              {logoUrlMobile && (
                <Image
                  src={logoUrlMobile}
                  alt="Fair Trade Safaris"
                  width={220}
                  height={56}
                  priority
                  className="block h-auto w-[180px] sm:w-[200px] md:hidden"
                />
              )}

              {logoUrlDesktop && (
                <Image
                  src={logoUrlDesktop}
                  alt="Fair Trade Safaris"
                  width={360}
                  height={92}
                  priority
                  className="hidden h-auto w-[220px] md:block"
                />
              )}
            </>
          )}

          <p className="mt-5 max-w-[340px] leading-6 text-[#5a4836]">
            Travel with purpose. Curated safaris that support conservation and
            communities across Africa.
          </p>

          {/* Award — intentionally not linked until public announcement */}
          <div className="mt-5 w-full max-w-[270px] border-t border-[#d8cbb8] pt-5">
            <Image
              src={awardBadge}
              alt="Fair Trade Safaris — 2026 International Travel Awards winner for Best Sustainable Travel Company in South Africa"
              width={210}
              height={145}
              className="h-auto w-[155px] sm:w-[165px] lg:w-[175px]"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.nav
          aria-label="Footer quick links"
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          viewport={{ once: true }}
          className="self-start"
        >
          {allLinks.length > 0 && (
            <>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em]">
                Quick Links
              </h3>

              <div className="grid grid-cols-2 gap-x-10 sm:gap-x-14 lg:gap-x-16 xl:gap-x-20">
                <ul className="space-y-2">
                  {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <li
                          key={`s-col1-${index}`}
                          className="h-3 animate-pulse rounded bg-black/5"
                        />
                      ))
                    : col1.map((link, index) => (
                        <li key={`col1-${index}`}>
                          <Link
                            href={`${link.href.replace(/\/?$/, "/")}`}
                            className="transition-colors hover:text-black hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                </ul>

                <ul className="space-y-2 border-l border-[#d8cbb8] pl-10 sm:pl-12 lg:pl-14">
                  {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <li
                          key={`s-col2-${index}`}
                          className="h-3 animate-pulse rounded bg-black/5"
                        />
                      ))
                    : col2.map((link, index) => (
                        <li key={`col2-${index}`}>
                          <Link
                            href={`${link.href.replace(/\/?$/, "/")}`}
                            className="transition-colors hover:text-black hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            </>
          )}
        </motion.nav>

        {/* Rhino + Johannesburg Guide */}
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          viewport={{ once: true }}
          className="flex flex-col items-center md:col-span-2 lg:col-span-1"
        >
          {loading ? (
            <div className="h-20 w-64 animate-pulse rounded-xl bg-black/5" />
          ) : (
            <>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Rhino illustration"
                  width={420}
                  height={130}
                  className="h-auto w-full max-w-[390px] opacity-75"
                />
              )}

              <div className="mt-4 flex flex-col items-center text-center">
                <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#8a735a]">
                  Johannesburg Travel Guide
                </p>

                <a
                  href="https://www.kayak.co.uk/Johannesburg.26961.guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kayak Johannesburg Travel Guide"
                  className="transition-opacity hover:opacity-90"
                >
                  <img
                    src="https://content.r9cdn.net/res/images/horizon/ui/seo/marketing/poibadges/POI_BADGES_GUIDES_DARK.png?v=3141cb0739e493843a37b32eccb35318b9d646ff&cluster=5"
                    alt="Kayak Johannesburg Travel Guide"
                    className="h-auto w-[120px] rounded-md"
                  />
                </a>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Fact */}
      {fact && (
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
          viewport={{ once: true }}
          className="relative z-10 flex justify-center px-6"
        >
          <div className="max-w-2xl rounded-full border border-black/5 bg-[#e8dcc9] px-4 py-1.5 text-center text-[13px] italic text-[#6b4a27]">
            <span className="opacity-80">Did you know?</span>{" "}
            <span className="font-medium not-italic">{fact}</span>
          </div>
        </motion.div>
      )}

      {/* Socials */}
      {socialLinks.length > 0 && (
        <div className="relative z-10 mb-6 mt-4 flex flex-wrap justify-center gap-3 px-6">
          {socialLinks.map((social, index) => (
            <a
              key={`${social.platform}-${index}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              {social.icon?.asset && (
                <Image
                  src={urlFor(social.icon.asset).width(44).height(44).url()}
                  alt={social.alt || social.platform}
                  width={44}
                  height={44}
                />
              )}
            </a>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-[#d2c2a3] bg-[#eadfca]/60 px-6 py-3 text-xs backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-2 sm:px-2 md:flex-row lg:px-6">
          <Link
            href="/privacy/"
            className="underline transition-colors hover:text-black"
          >
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
