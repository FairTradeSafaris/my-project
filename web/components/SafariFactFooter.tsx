"use client";

import Image from "@/components/SanityImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import CookieSettingsLink from "@/components/consent/CookieSettingsLink"; // batch 13
import { usePathname } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";
import type { SanityImageAssetDocument } from "@sanity/client";
import { FOOTER_QUERY } from "@/lib/footerQuery";

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

// Raw result of FOOTER_QUERY (passed in from the server since Batch 4)
export type FooterData = {
  facts?: string[];
  lineArt?: { asset?: SanityImageAssetDocument };
  logo?: { asset?: SanityImageAssetDocument };
  logoSmall?: { asset?: SanityImageAssetDocument };
  exploreLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  connectLinks?: ConnectLink[];
} | null;

const logoMobileUrl = (r: NonNullable<FooterData>) =>
  r.logoSmall?.asset
    ? urlFor(r.logoSmall.asset).url()
    : r.logo?.asset
      ? urlFor(r.logo.asset).url()
      : "";

// Batch 19: calm restyle (display only). Same Sanity content, links, fact,
// line art, socials, award, Kayak guide and legal links; no fade-in effects.
// Extra bottom space on phones so the bottom tab bar, chat button and (on the
// itinerary list) the consultant bar never cover the last footer lines.

const awardBadge = "/badges/Fair Trade Safaris - Winner Badge tp.png";

export default function SafariFactFooter({
  initialData,
}: {
  /** Footer document fetched on the server (Batch 4): links are in the HTML
   *  and no client-side Sanity request is needed. */
  initialData?: FooterData;
} = {}) {
  const init = initialData ?? null;
  const [fact, setFact] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(() =>
    init?.lineArt?.asset ? urlFor(init.lineArt.asset).url() : "",
  );

  const [exploreLinks, setExploreLinks] = useState<FooterLink[]>(
    () => init?.exploreLinks || [],
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    () => init?.socialLinks || [],
  );
  const [connectLinks, setConnectLinks] = useState<ConnectLink[]>(
    () => init?.connectLinks || [],
  );
  const [loading, setLoading] = useState<boolean>(!init);

  const [logoUrlMobile, setLogoUrlMobile] = useState<string>(() =>
    init ? logoMobileUrl(init) : "",
  );
  const [logoUrlDesktop, setLogoUrlDesktop] = useState<string>(() =>
    init?.logo?.asset ? urlFor(init.logo.asset).url() : "",
  );

  const featuredLogos = [
    { src: "/logos/nbc.svg", alt: "NBC" },
    { src: "/logos/usa-today.svg", alt: "USA Today" },
    { src: "/logos/fox.svg", alt: "FOX" },
    { src: "/logos/CBS_logo.svg", alt: "CBS" },
  ];

  useEffect(() => {
    // The random "Did you know?" fact is still picked in the browser (picking
    // it on the server would cause a hydration mismatch).
    if (init) {
      if (init.facts?.length) {
        setFact(init.facts[Math.floor(Math.random() * init.facts.length)]);
      }
      return;
    }

    const fetchFooter = async () => {
      try {
        const result = await client.fetch(FOOTER_QUERY);

        if (result) {
          if (result.facts?.length) {
            setFact(
              result.facts[Math.floor(Math.random() * result.facts.length)],
            );
          }

          setImageUrl(
            result.lineArt?.asset ? urlFor(result.lineArt.asset).url() : "",
          );

          setLogoUrlMobile(logoMobileUrl(result));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const allLinks: FooterLink[] = [...exploreLinks, ...connectLinks];

  // Batch 19 (display only)
  const [exploreOpen, setExploreOpen] = useState(false);
  const pathname = usePathname() ?? "";
  // The itinerary list shows the fixed "Not seeing your perfect safari?" bar.
  const hasConsultantBar = /^\/africansafariitineraries\/?$/.test(pathname);
  const footerHref = (href: string) => `${href.replace(/\/?$/, "/")}`;
  const linkClass =
    "inline-block py-1 text-[15px] leading-7 text-[#3f2e1f] underline-offset-4 transition-colors hover:text-[#a35c2d] hover:underline";
  const headingClass =
    "text-[13px] font-semibold uppercase tracking-[0.14em] text-[#7a5a3a]";

  return (
    <footer className="relative isolate bg-[#f7f3ec] text-[15px] text-[#3f2e1f]">
      {/* Top edge: line art + "Did you know?" */}
      <div className="border-t border-[#e3d7c4]">
        <div className="mx-auto flex max-w-[1240px] flex-col-reverse items-center gap-6 px-6 pb-10 pt-10 sm:px-8 md:flex-row md:items-end md:justify-between md:gap-12 lg:px-12">
          <div className="w-full max-w-[640px] text-center md:text-left">
            {fact ? (
              <div className="border-l-0 md:border-l-2 md:border-[#c9974f] md:pl-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a35c2d]">
                  Did you know?
                </p>
                <p className="mt-2 text-[18px] leading-relaxed text-[#24170f] sm:text-[20px]">
                  {fact}
                </p>
              </div>
            ) : (
              <div className="h-[72px]" aria-hidden="true" />
            )}
          </div>
          {loading ? (
            <div className="h-24 w-64 animate-pulse rounded-xl bg-black/5" />
          ) : (
            imageUrl && (
              <Image
                src={imageUrl}
                alt="Rhino illustration"
                width={420}
                height={167}
                className="h-auto w-[230px] shrink-0 opacity-60 sm:w-[280px] lg:w-[320px]"
              />
            )
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-[#e3d7c4]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 lg:px-12">
          {/* Brand + award */}
          <div className="flex flex-col items-start lg:col-span-4">
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
                    className="block h-auto w-[180px] md:hidden"
                  />
                )}
                {logoUrlDesktop && (
                  <Image
                    src={logoUrlDesktop}
                    alt="Fair Trade Safaris"
                    width={360}
                    height={92}
                    className="hidden h-auto w-[210px] md:block"
                  />
                )}
              </>
            )}

            <p className="mt-5 max-w-[340px] text-[15px] leading-7 text-[#5a4836]">
              Travel with purpose. Curated safaris that support conservation and
              communities across Africa.
            </p>

            {/* Award: intentionally not linked until public announcement */}
            <Image
              src={awardBadge}
              alt="Fair Trade Safaris — 2026 International Travel Awards winner for Best Sustainable Travel Company in South Africa"
              width={210}
              height={145}
              className="mt-6 h-auto w-[150px]"
            />
          </div>

          {/* Explore (Sanity explore links); a simple accordion on phones */}
          <nav aria-label="Footer quick links" className="lg:col-span-5">
            {allLinks.length > 0 && exploreLinks.length > 0 && (
              <>
                <h3 className="hidden md:block">
                  <span className={headingClass}>Explore</span>
                </h3>
                <h3 className="border-y border-[#e3d7c4] md:hidden">
                  <button
                    type="button"
                    onClick={() => setExploreOpen((v) => !v)}
                    aria-expanded={exploreOpen}
                    aria-controls="footer-explore"
                    className="flex min-h-[52px] w-full items-center justify-between text-left"
                  >
                    <span className={headingClass}>Explore</span>
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-5 w-5 text-[#7a5a3a] transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </h3>
                <ul
                  id="footer-explore"
                  className={`${exploreOpen ? "grid" : "hidden"} grid-cols-1 gap-x-10 pt-3 sm:grid-cols-2 md:mt-4 md:grid md:pt-0`}
                >
                  {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <li key={`s-ex-${index}`} className="my-2 h-3 animate-pulse rounded bg-black/5" />
                      ))
                    : exploreLinks.map((link, index) => (
                        <li key={`ex-${index}`}>
                          <Link href={footerHref(link.href)} className={linkClass}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </>
            )}
          </nav>

          {/* Get in touch + follow us + travel guide */}
          <div className="flex flex-col gap-9 md:col-span-2 md:grid md:grid-cols-3 md:gap-10 lg:col-span-3 lg:flex lg:flex-col lg:gap-9">
            {connectLinks.length > 0 && (
              <div>
                <h3 className={headingClass}>Get in touch</h3>
                <ul className="mt-4">
                  {connectLinks.map((link, index) => (
                    <li key={`cn-${index}`}>
                      <Link href={footerHref(link.href)} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div>
                <h3 className={headingClass}>Follow us</h3>
                <div className="mt-4 flex max-w-[260px] flex-wrap gap-2.5">
                  {socialLinks.map((social, index) => (
                    <a
                      key={`${social.platform}-${index}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full opacity-90 transition-opacity hover:opacity-100"
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
              </div>
            )}

            {!loading && (
              <div>
                <h3 className={headingClass}>Johannesburg Travel Guide</h3>
                <a
                  href="https://www.kayak.co.uk/Johannesburg.26961.guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kayak Johannesburg Travel Guide"
                  className="mt-4 inline-block transition-opacity hover:opacity-90"
                >
                  <img
                    src="https://content.r9cdn.net/res/images/horizon/ui/seo/marketing/poibadges/POI_BADGES_GUIDES_DARK.png?v=3141cb0739e493843a37b32eccb35318b9d646ff&cluster=5"
                    alt="Kayak Johannesburg Travel Guide"
                    width={916}
                    height={728}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-[104px] rounded-md"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* As seen on */}
      <div className="border-t border-[#e3d7c4]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-6 py-8 sm:px-8 md:flex-row md:justify-center md:gap-10 lg:px-12">
          <p className="text-[13px] uppercase tracking-[0.16em] text-[#7a5a3a]">
            As seen on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-12">
            {featuredLogos.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={32}
                className="h-6 w-auto opacity-60 grayscale md:h-7"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar (extra space underneath on phones for the fixed bars) */}
      <div
        className={`border-t border-[#e3d7c4] bg-[#efe6d6] px-6 pt-5 sm:px-8 lg:px-12 ${
          hasConsultantBar
            ? "pb-[calc(225px+env(safe-area-inset-bottom))] md:pb-32"
            : "pb-[calc(145px+env(safe-area-inset-bottom))] md:pb-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-3 text-[14px] text-[#5a4836] md:flex-row md:justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/privacy/"
              className="underline underline-offset-4 transition-colors hover:text-[#a35c2d]"
            >
              Privacy Policy
            </Link>
            <CookieSettingsLink className="underline underline-offset-4 transition-colors hover:text-[#a35c2d]" />
          </div>
          <p>
            © {new Date().getFullYear()} Fair Trade Safaris. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
