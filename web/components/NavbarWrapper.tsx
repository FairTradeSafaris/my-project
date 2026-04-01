// components/NavbarDesktop.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type MenuItem = { title: string; href: string };
type NavSection = { heading?: string; links: MenuItem[] };
type FeatureCard = {
  title: string;
  description: string;
  image: { asset: { url: string } };
  alt: string;
  link: string;
};

export default function NavbarDesktop({
  navSections = [],
  featureCards = [],
  promoCard,
}: {
  navSections?: NavSection[];
  featureCards?: FeatureCard[];
  promoCard?: FeatureCard | null;
}) {
  return (
    <nav className="hidden md:block w-full bg-white/90  shadow-sm border-b border-black/5 ">
      <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-12 gap-8">
        {/* Left column – all nav sections */}
        <div className="col-span-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {section.heading && (
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                  {section.heading}
                </h3>
              )}
              <ul className="space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-base text-neutral-800  hover:text-primary-600 transition"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle column – feature cards */}
        <div className="col-span-4 grid grid-cols-1 gap-6">
          {featureCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.link}
              className="group block rounded-xl overflow-hidden border border-neutral-200  hover:shadow-lg transition"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={card.image.asset.url}
                  alt={card.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-neutral-900 ">
                  {card.title}
                </h4>
                <p className="text-sm text-neutral-600 ">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right column – promo card */}
        {promoCard && (
          <div className="col-span-4">
            <Link
              href={promoCard.link}
              className="group block rounded-xl overflow-hidden border border-neutral-200  hover:shadow-lg transition"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={promoCard.image.asset.url}
                  alt={promoCard.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-neutral-900 ">
                  {promoCard.title}
                </h4>
                <p className="text-sm text-neutral-600 ">
                  {promoCard.description}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
