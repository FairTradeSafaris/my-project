"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import sanity from "@/../lib/sanity";

type SocialLink = {
  platform: string;
  icon?: { asset?: { url: string } };
  url: string;
};

type ConnectLink = {
  label: string;
  href: string;
};

export default function SafariFactFooter() {
  const [fact, setFact] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(""); // Rhino
  const [logoUrl, setLogoUrl] = useState<string>(""); // Main Logo
  const [exploreLinks, setExploreLinks] = useState<
    { label: string; href: string }[]
  >([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [connectLinks, setConnectLinks] = useState<ConnectLink[]>([]);

  useEffect(() => {
    const fetchFooter = async () => {
      const result = await sanity.fetch(
        `*[_type == "footer"][0]{
          facts,
          lineArt { asset->{url} },
          logo { asset->{url} },
          contactEmail,
          exploreLinks,
          socialLinks[] {
            platform,
            icon { asset->{url} },
            url
          },
          connectLinks
        }`
      );

      if (result) {
        const facts = result.facts || [];
        if (facts.length > 0) {
          const random = facts[Math.floor(Math.random() * facts.length)];
          setFact(random);
        }
        setImageUrl(result.lineArt?.asset?.url || "");
        setLogoUrl(result.logo?.asset?.url || "");
        setExploreLinks(result.exploreLinks || []);
        setConnectLinks(result.connectLinks || []);
        setSocialLinks(result.socialLinks || []);
      }
    };

    fetchFooter();
  }, []);

  return (
    <>
      {/* As Seen On Section */}
      <section className="bg-[#e9e0d1] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xs md:text-sm tracking-widest uppercase text-[#5f5241] mb-6">
            As Seen On
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-90">
            <img
              src="/logos/CBS_logo.svg"
              alt="CBS"
              className="h-8 md:h-10 object-contain"
            />
            <img
              src="/logos/usa-today.svg"
              alt="USA Today"
              className="h-8 md:h-10 object-contain"
            />
            <img
              src="/logos/fox.svg"
              alt="FOX"
              className="h-8 md:h-10 object-contain"
            />
            <img
              src="/logos/nbc.svg"
              alt="NBC"
              className="h-8 md:h-10 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Sloped Divider */}
      <div className="relative z-10 -mt-1">
        <svg
          viewBox="0 0 500 50"
          preserveAspectRatio="none"
          className="w-full h-10 fill-[#e9e0d1] rotate-180"
        >
          <path d="M0,0 C150,50 350,0 500,50 L500,0 L0,0 Z" />
        </svg>
      </div>

      {/* Footer */}
      <footer
        className="relative text-[#3f2e1f] text-sm z-0"
        style={{
          backgroundImage: "url('/images/footer-texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Fade-in overlay */}
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-[#e9e0d1] to-transparent z-10 pointer-events-none" />

        {/* Grid Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-10 items-start">
          {/* Logo */}
          <div className="flex justify-center ">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Fair Trade Safaris Logo"
                width={160}
                height={60}
              />
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm text-center md:text-left">
            <div>
              <h3 className="text-md font-semibold mb-3">Explore</h3>
              <ul className="space-y-2">
                {exploreLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-3">Connect</h3>
              <ul className="space-y-2">
                {connectLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rhino */}
          <div className="flex justify-end pr-4">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Rhino Illustration"
                width={380}
                height={80}
                className="opacity-70"
              />
            )}
          </div>
        </div>
        {fact && (
          <div className="relative z-20 mt-2 mb-4 flex justify-center">
            <div className="bg-[#e4d7c3] text-[#7a4e1d] px-4 py-2 rounded-md italic max-w-xl text-center text-sm shadow-sm">
              Did you know? {fact}
            </div>
          </div>
        )}
        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="relative z-20 mt-4 mb-2 flex justify-center space-x-3">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
              >
                {social.icon?.asset?.url && (
                  <Image
                    src={social.icon.asset.url}
                    alt={social.platform}
                    width={24}
                    height={24}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                )}
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="relative z-20 text-center text-xs py-2 mt-4 border-t border-[#d2c2a3] bg-[#e5d7be]/70 backdrop-blur-sm">
          © {new Date().getFullYear()} Fair Trade Safaris. All rights reserved.
        </div>
      </footer>
    </>
  );
}
