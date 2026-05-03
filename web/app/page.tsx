﻿export const revalidate = 60;

import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import React from "react";

import { getSanityMetadata } from "@/lib/getSanityMetadata";

// Components
import FeaturedJourneysSection from "@/components/FeaturedJourneysCMS";
import HeroController from "@/components/HeroController";
import WhyChoose from "@/components/WhyChoose";
import FoundersPromise from "@/components/FoundersPromise";
import CTABanner from "@/components/CTABanner";
import NonProfitCarousel from "@/components/NonProfitCarousel";
import FeaturedAmbassador from "@/components/FeaturedAmbassador";
import BlogPreview from "@/components/BlogPreview";

/* ============================
   TYPES (SAFE + NO ANY)
============================ */

type BaseSection = {
  _type: string;
};

type Section = BaseSection & Record<string, unknown>;

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
   PAGE
============================ */

export default async function Home() {
  const homePage = await sanity.fetch(`
    *[_type == "homePage"][0]{
      sections[]{
        _type,
        ...,
        _type == "heroSection" => @->{
          headline,
          subheadline,
          primaryCTA,
          secondaryCTA,
          primaryLink,
          action,
          backgroundImages[]{
            alt,
            desktopImage{asset->{url}},
            mobileImage{asset->{url}}
          }
        },
        _type == "whyChooseSection" => @->{
          sectionTitle,
          sideImage { asset->{url}, alt },
          reasons[]{
            icon { asset->{url}, alt },
            title,
            description
          }
        },
        _type == "foundersPromiseSection" => @->{
          headline,
          intro,
          safelist,
          buttonText,
          buttonLink,
          textOnLeft,
          backgroundImage { asset->{url}, alt },
          lineArtImage { asset->{url}, alt },
          impactContent { title, body, ctaText, ctaLink }
        },
        _type == "featuredJourneysSectionRef" => @->{
          title,
          description,
          ctaText,
          ctaLink,
          showCustomCard,
          customCard{
            eyebrow,
            title,
            description,
            buttonText,
            buttonLink,
            image{ asset->{url} }
          }
        },
        _type == "ctaBannerSection" => @->{
          headline,
          subheadline,
          buttonText,
          buttonLink,
          textOnLeft,
          sideImage{ asset->{url} },
          backgroundImage{ asset->{url} }
        }
      }
    }
  `);

  const journeys = await sanity.fetch(`
    *[_type == "journey" && featuredOnHome == true && isActive != false]
    | order(_createdAt desc)[0...3]{
      _id,
      title,
      slug,
      summary,
      heroImage{ asset->{url} },
      alt,
      price,
      duration,
      region->{title},
      star,
      starIcon{ asset->{url} }
    }
  `);

  if (!homePage) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        ⚠️ Home Page content not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black font-poppins">
      {homePage.sections?.map((section: Section, index: number) => {
        switch (section._type) {
          case "heroSection":
            return (
              <HeroController
                key={index}
                heroData={
                  section as unknown as Parameters<
                    typeof HeroController
                  >[0]["heroData"]
                }
              />
            );

          case "whyChooseSection":
            return (
              <WhyChoose
                key={index}
                data={
                  section as unknown as Parameters<typeof WhyChoose>[0]["data"]
                }
              />
            );

          case "foundersPromiseSection":
            return (
              <FoundersPromise
                key={index}
                data={
                  section as unknown as Parameters<
                    typeof FoundersPromise
                  >[0]["data"]
                }
              />
            );

          case "featuredJourneysSectionRef":
            return (
              <FeaturedJourneysSection
                key={index}
                section={
                  section as unknown as Parameters<
                    typeof FeaturedJourneysSection
                  >[0]["section"]
                }
                journeys={journeys}
              />
            );

          case "ctaBannerSection":
            return (
              <CTABanner
                key={index}
                {...(section as unknown as Parameters<typeof CTABanner>[0])}
              />
            );

          default:
            return null;
        }
      })}

      {/* Static sections (temporary) */}
      <NonProfitCarousel />
      <FeaturedAmbassador />
      <BlogPreview />
    </main>
  );
}
