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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
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
          socialLinks[]{
            platform,
            icon {
              asset->{
                url
              }
            },
            url
          },
          connectLinks
        }`
      );

      console.log("Fetched Footer Data:", result);

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
    <div className="bg-[#f9f1e5] text-black py-12 px-6 font-poppins">
      {/* Align logo + center links + rhino to the same horizontal baseline */}
      <div className="max-w-6xl mx-auto flex flex-col">
        <div className="grid md:grid-cols-3 gap-10 items-end">
          {/* Left: Logo */}
          <div className="flex justify-center md:justify-start">
            {logoUrl && (
              <Image src={logoUrl} alt="Logo" width={180} height={60} />
            )}
          </div>

          {/* Center: Explore + Connect */}
          <div className="grid grid-cols-2 gap-8 text-sm text-center md:text-left">
            <div>
              <h3 className="text-lg font-bold mb-4">Explore</h3>
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
            {connectLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
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
            )}
          </div>

          {/* Right: Rhino */}
          <div className="flex justify-center md:justify-end">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Safari Line Art"
                width={280}
                height={100}
                className="opacity-60"
              />
            )}
          </div>
        </div>

        {/* Safari Fact */}
        {fact && (
          <div className="mt-6 text-center">
            <div className="bg-[#e4d7c3] text-[#7a4e1d] px-4 py-3 rounded-md italic max-w-xl mx-auto text-sm">
              Did you know? {fact}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex justify-center space-x-4">
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
                    width={28}
                    height={28}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
