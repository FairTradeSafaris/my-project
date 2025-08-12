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
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [exploreLinks, setExploreLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [connectLinks, setConnectLinks] = useState<ConnectLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const result = await client.fetch(
          `*[_type == "footer"][0]{facts,lineArt{asset},logo{asset},exploreLinks,socialLinks[]{platform,icon{asset},url},connectLinks}`
        );
        if (result) {
          if (result.facts?.length) {
            setFact(
              result.facts[Math.floor(Math.random() * result.facts.length)]
            );
          }
          setImageUrl(
            result.lineArt?.asset ? urlFor(result.lineArt.asset).url() : ""
          );
          setLogoUrl(result.logo?.asset ? urlFor(result.logo.asset).url() : "");
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
    <footer className="relative text-[#3f2e1f] dark:text-neutral-300 text-sm bg-[#f7f3ec] dark:bg-[#0c0c0c]">
      {/* Main grid — three columns: logo | links | illustration */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-4 pt-8 md:pt-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-start">
        {/* Left: Brand */}
        <motion.div
          initial={fadeInitial}
          whileInView={fadeAnimate}
          transition={fadeTransition}
        >
          {loading ? (
            <div className="h-[56px] w-[220px] rounded-xl bg-black/5 dark:bg-white/10 animate-pulse" />
          ) : (
            logoUrl && (
              <Image
                src={logoUrl}
                alt="Fair Trade Safaris"
                width={220}
                height={56}
                className="dark:invert"
                priority
              />
            )
          )}

          <p className="mt-3 max-w-xs text-[#5a4836] dark:text-neutral-400">
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
                          className="h-3 rounded bg-black/5 dark:bg-white/10 animate-pulse"
                        />
                      ))
                    : col1.map((l, i) => (
                        <li key={`col1-${i}`}>
                          <Link
                            href={l.href}
                            className="hover:underline hover:text-black/80 dark:hover:text-white"
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
                          className="h-3 rounded bg-black/5 dark:bg-white/10 animate-pulse"
                        />
                      ))
                    : col2.map((l, i) => (
                        <li key={`col2-${i}`}>
                          <Link
                            href={l.href}
                            className="hover:underline hover:text-black/80 dark:hover:text-white"
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
            <div className="h-20 w-64 rounded-xl bg-black/5 dark:bg-white/10 animate-pulse" />
          ) : (
            imageUrl && (
              <Image
                src={imageUrl}
                alt="Rhino illustration"
                width={360}
                height={110}
                className="opacity-75 dark:invert"
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
          <div className="bg-[#e8dcc9] dark:bg-[#171717] text-[#6b4a27] dark:text-neutral-200 px-3.5 py-1.5 rounded-full italic max-w-2xl text-center text-[13px] border border-black/5 dark:border-white/10">
            <span className="opacity-80">Did you know?</span>{" "}
            <span className="font-medium not-italic">{fact}</span>
          </div>
        </motion.div>
      )}

      {/* Socials — icon fills the circle, no white rim */}
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
                  alt=""
                  width={44}
                  height={44}
                  className="dark:invert"
                  aria-hidden
                />
              )}
            </a>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative z-10 text-xs py-2.5 mt-2 border-t border-[#d2c2a3] dark:border-white/10 bg-[#eadfca]/60 dark:bg-black/30 backdrop-blur-sm px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <Link
            href="/privacy"
            className="underline hover:text-black dark:hover:text-white"
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
