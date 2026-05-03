import Link from "next/link";
import JourneyCard from "@/components/JourneyCard";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

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
    <section className="py-16 md:py-20 bg-[#e6d8c7]">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 text-center">
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title}
          </h2>
        )}

        {section.description && Array.isArray(section.description) && (
          <div className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            <PortableText
              value={section.description}
              components={{
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value?.href}
                      className="underline font-semibold hover:text-black"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {/* ✅ CUSTOM CARD FIRST */}
        {section.showCustomCard && section.customCard && (
          <div className="relative rounded-2xl overflow-hidden group min-h-[420px]">
            {section.customCard.image?.asset?.url && (
              <img
                src={section.customCard.image.asset.url}
                alt={section.customCard.title || "Custom safari"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
              {section.customCard.eyebrow && (
                <p className="text-xs uppercase tracking-widest opacity-80 mb-2">
                  {section.customCard.eyebrow}
                </p>
              )}

              {section.customCard.title && (
                <h3 className="text-2xl font-semibold mb-3">
                  {section.customCard.title}
                </h3>
              )}

              {section.customCard.description && (
                <p className="text-sm opacity-90 mb-4">
                  {section.customCard.description}
                </p>
              )}

              {section.customCard.buttonText &&
                section.customCard.buttonLink && (
                  <Link
                    href={section.customCard.buttonLink}
                    className="bg-white text-black py-3 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition w-fit"
                  >
                    {section.customCard.buttonText}
                  </Link>
                )}
            </div>
          </div>
        )}

        {/* ✅ JOURNEY CARDS */}
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
        <div className="mt-12 flex justify-center">
          <Link
            href={section.ctaLink}
            className="group relative text-lg font-semibold tracking-wide text-black"
          >
            {section.ctaText}
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>
      )}
    </section>
  );
}
