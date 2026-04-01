﻿export const revalidate = 60;

import { client as sanity } from "@/lib/sanity";
import Link from "next/link";
import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import JourneyCard from "@/components/JourneyCard";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import type { FoundersPromiseBlock } from "@/types/types";
import Head from "next/head";
import React from "react";
// ✅ Client components
import HomeClientTop from "@/components/HomeClientTop";
import HomeClientBottom from "@/components/HomeClientBottom";
import BlogPreview from "@/components/BlogPreview";

/* ============================
   METADATA
============================ */

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("home");

  if (metadata.other && "ld-json" in metadata.other) {
    delete metadata.other["ld-json"];
  }

  return metadata;
}

/* ============================
   TYPES
============================ */

type HeroContent = {
  headline: string;
  subheadline: string;
  backgroundImages: { asset: { url: string }; alt?: string }[];
  primaryCTA: string;
  secondaryCTA: string;
};

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[];
  sideImage?: { asset: { url: string }; alt?: string };
  reasons: {
    icon?: { asset: { url: string }; alt?: string };
    title: string;
    description: string;
  }[];
};

type Journey = {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  duration: string;
  price?: string;
  heroImage: { asset: { url: string } };
  alt: string;
  ctaText: string;
  region?: { title: string };
  star?: number;
  starIcon?: string;
};

/* ============================
   PAGE
============================ */

export default async function Home() {
  const hero: HeroContent | null = await sanity.fetch(
    `*[_type == "hero"][0]{
      headline,
      subheadline,
      backgroundImages[] { asset->{url}, alt },
      primaryCTA,
      secondaryCTA
    }`,
  );

  const whyChoose: WhyChooseBlock | null = await sanity.fetch(
    `*[_type == "whyChoose"][0]{
      sectionTitle,
      sideImage { asset->{url}, alt },
      reasons[] {
        icon { asset->{url}, alt },
        title,
        description
      }
    }`,
  );

  const foundersPromise: FoundersPromiseBlock | null = await sanity.fetch(
    `*[_type == "foundersPromise"][0]{
      headline,
      intro,
      safelist,
      buttonText,
      buttonLink,
      textOnLeft,
      backgroundImage { asset->{url}, alt },
      lineArtImage { asset->{url}, alt },
      impactContent { title, body, ctaText, ctaLink }
    }`,
  );

  const journeys: Journey[] = await sanity.fetch(
    `*[_type == "journey" && featuredOnHome == true]{
      _id,
      title,
      slug,
      summary,
      duration,
      price,
      heroImage { asset->{url} },
      alt,
      ctaText,
      region->{ title },
      star,
      "starIcon": starIcon.asset->url
    }`,
  );

  if (!hero) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        ⚠️ Hero content not found.
      </main>
    );
  }

  return (
    <>
      <Head>
        {hero?.backgroundImages?.[0]?.asset?.url && (
          <link
            rel="preload"
            as="image"
            href={hero.backgroundImages[0].asset.url}
            fetchPriority="high"
          />
        )}
      </Head>

      <main className="min-h-screen bg-white text-black font-poppins">
        {/* 1️⃣ WhyChoose + FoundersPromise */}
        <HomeClientTop
          whyChoose={whyChoose}
          foundersPromise={foundersPromise}
        />

        {/* 2️⃣ Featured Journeys (MIDDLE) */}
        {/* 2️⃣ Featured Journeys (MIDDLE) */}
        <section className="py-16 md:py-20 bg-[#e6d8c7]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Journey Starts Here
            </h2>

            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-6">
              Handpicked safari experiences designed for travelers who value
              purpose, privacy, and unforgettable wildlife encounters.
            </p>

            {/* 👉 ADD THIS */}
            <Link
              href="/luxury-african-safaris/"
              className="font-semibold underline hover:text-black"
            >
              luxury African safaris
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
            {journeys.map((j, index) => (
              <React.Fragment key={j._id}>
                {/* 👉 Custom Featured Card */}
                {index === 0 && (
                  <div className="relative rounded-2xl overflow-hidden group min-h-[420px]">
                    <img
                      src="/images/Custom-Tours.jpg"
                      alt="Tailor made safari"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                    <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                      <p className="text-xs uppercase tracking-widest opacity-80 mb-2">
                        Tailor-Made Experience
                      </p>

                      <h3 className="text-2xl font-semibold mb-3 leading-tight">
                        Your Safari. Your Story.
                      </h3>

                      <p className="text-sm opacity-90 mb-4">
                        Designed around you — no templates, no limits. Just
                        unforgettable journeys crafted with purpose.
                      </p>

                      <a
                        href="https://bookings.fairtradesafaris.com/#/fairtradesafaris"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black py-3 px-4 rounded-full text-sm font-medium hover:bg-gray-200 transition w-fit"
                      >
                        Start Planning
                      </a>
                    </div>
                  </div>
                )}

                {/* Normal Journey Card */}
                <JourneyCard
                  journeyId={j._id}
                  title={j.title}
                  slug={j.slug.current}
                  summary={j.summary}
                  imageUrl={j.heroImage?.asset?.url}
                  alt={j.alt}
                  price={j.price}
                  duration={j.duration}
                  region={j.region?.title}
                  star={j.star}
                  starIcon={j.starIcon}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Elegant CTA */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/africansafariitineraries/"
              className="group relative text-lg font-semibold tracking-wide text-black"
            >
              Explore All Itineraries
              <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </div>
        </section>

        {(hero.primaryCTA || hero.secondaryCTA) && (
          <section className="py-16 text-center bg-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h3>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {hero.primaryCTA && (
                <Link
                  href={hero.primaryCTA}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                >
                  Book Your Safari
                </Link>
              )}

              {hero.secondaryCTA && (
                <Link
                  href={hero.secondaryCTA}
                  className="text-black border border-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition"
                >
                  Learn More
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 3️⃣ NonProfitCarousel + FeaturedAmbassador */}

        <HomeClientBottom />
        <BlogPreview />
      </main>
    </>
  );
}
