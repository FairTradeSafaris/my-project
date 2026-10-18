// Batch 20: calm restyle (display only). Same Sanity title, text, custom card,
// featured journeys (batch 14 cards) and link; wider container.
import Link from "next/link";
import JourneyCard from "@/components/JourneyCard";
import LineArt from "@/components/LineArt";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {
  homeBody,
  homeContainer,
  homeH2,
  homeSection,
  homeTextLink,
} from "@/components/home/homeStyles";

/* ---------------- TYPES ---------------- */

type Journey = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  heroImage?: { asset?: { url?: string } };
  alt?: string;
  price?: number;
  duration?: string;
  region?: { title?: string };
  star?: string;
  starIcon?: { asset?: { url?: string } };
};

type CustomCard = {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: { asset?: { url?: string } };
};

type FeaturedJourneysSection = {
  title?: string;
  description?: PortableTextBlock[] | string;
  ctaText?: string;
  ctaLink?: string;
  showCustomCard?: boolean;
  customCard?: CustomCard;
};

type Props = {
  section: FeaturedJourneysSection;
  journeys: Journey[];
};

/* ---------------- COMPONENT ---------------- */

export default function FeaturedJourneysCMS({ section, journeys }: Props) {
  return (
    <section className={`bg-white ${homeSection}`}>
      {/* HEADER */}
      <div className={`${homeContainer} text-center`}>
        <LineArt
          name="giraffes"
          className="mx-auto mb-4 w-[150px] text-[#a35c2d] opacity-40 md:w-[170px]"
        />
        {section.title && <h2 className={homeH2}>{section.title}</h2>}

        {section.description && Array.isArray(section.description) && (
          <div className={`mx-auto mt-4 max-w-2xl ${homeBody} md:text-[17px] md:leading-8`}>
            <PortableText
              value={section.description}
              components={{
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value?.href}
                      className="font-semibold text-[#24170f] underline decoration-[#c9974f] underline-offset-4 hover:text-[#a35c2d]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        )}
      </div>

      {/* GRID */}
      <div
        className={`${homeContainer} mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8`}
      >
        {/* CUSTOM CARD FIRST */}
        {section.showCustomCard && section.customCard && (
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[#24170f]">
            {section.customCard.image?.asset?.url && (
              <img
                // resized via Sanity's image CDN (card is max ~400px wide)
                src={
                  section.customCard.image.asset.url.endsWith(".svg")
                    ? section.customCard.image.asset.url
                    : `${section.customCard.image.asset.url}?w=800&q=70&auto=format&fit=max`
                }
                alt={section.customCard.title || "Custom safari"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#24170f]/85 via-[#24170f]/35 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
              {section.customCard.eyebrow && (
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  {section.customCard.eyebrow}
                </p>
              )}
              {section.customCard.title && (
                <h3 className="mb-2 text-[22px] font-semibold leading-snug">
                  {section.customCard.title}
                </h3>
              )}
              {section.customCard.description && (
                <p className="mb-5 text-[15px] leading-6 text-white/90">
                  {section.customCard.description}
                </p>
              )}
              {section.customCard.buttonText && section.customCard.buttonLink && (
                <Link
                  href={section.customCard.buttonLink}
                  className="inline-flex h-11 w-fit items-center rounded-xl bg-white px-5 text-[15px] font-semibold text-[#24170f] transition-colors hover:bg-[#f2e7db]"
                >
                  {section.customCard.buttonText}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* JOURNEY CARDS (batch 14 cards, unchanged) */}
        {journeys.map((j) => (
          <JourneyCard
            key={j._id}
            journeyId={j._id}
            title={j.title}
            slug={j.slug.current}
            summary={j.summary}
            imageUrl={j.heroImage?.asset?.url}
            alt={j.alt}
            price={j.price}
            duration={j.duration}
            region={j.region?.title}
            star={j.star ? parseInt(j.star) : undefined}
            starIcon={j.starIcon?.asset?.url}
          />
        ))}
      </div>

      {/* CTA */}
      {section.ctaText && section.ctaLink && (
        <div className="mt-10 flex justify-center">
          <Link href={section.ctaLink} className={homeTextLink}>
            {section.ctaText}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
