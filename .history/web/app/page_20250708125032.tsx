import { client as sanity } from "@/lib/sanity";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/types";
import JourneyCard from "@/components/JourneyCard";
import HeroWrapper from "@/components/HeroWrapper";

import dynamic from "next/dynamic";

const WhyChoose = dynamic(() => import("@/components/WhyChoose"), {
  loading: () => <p>Loading section...</p>,
});

const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel"),
  {
    loading: () => <p>Loading testimonials...</p>,
  }
);

export const revalidate = 60;

export async function generateMetadata() {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == "home"][0]{
      metaTitle,
      metaDescription
    }`
  );

  return {
    title: data?.metaTitle ?? "Fair Trade Safaris",
    description:
      data?.metaDescription ??
      "Explore ethical luxury safaris in Africa with Fair Trade Safaris. Travel with heart and purpose.",
    openGraph: {
      title: data?.metaTitle ?? "Fair Trade Safaris",
      description:
        data?.metaDescription ??
        "Explore ethical luxury safaris in Africa with Fair Trade Safaris. Travel with heart and purpose.",
    },
  };
}

type HeroContent = {
  headline: string;
  subheadline: string;
  backgroundImages: {
    asset: {
      url: string;
    };
    alt?: string;
  }[];
  primaryCTA: string;
  secondaryCTA: string;
  metaTitle?: string;
  metaDescription?: string;
};

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[];
  sideImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  reasons: {
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
    title: string;
    description: string;
  }[];
};

type Journey = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  duration: string;
  price?: string;
  heroImage: {
    asset: {
      url: string;
    };
  };
  alt: string;
  ctaText: string;
  region?: {
    title: string;
  };
  star?: number;
  starIcon?: string;
  featuredOnHome?: boolean;
};

export default async function Home() {
  const hero: HeroContent | null = await sanity.fetch(
    `*[_type == "hero"][0]{
      headline,
      subheadline,
      backgroundImages[] {
        asset->{url},
        alt
      },
      primaryCTA,
      secondaryCTA
    }`
  );

  const whyChoose: WhyChooseBlock | null = await sanity.fetch(
    `*[_type == "whyChoose"][0]{
      sectionTitle,
      sideImage {
        asset->{url},
        alt
      },
      reasons[] {
        icon {
          asset->{url},
          alt
        },
        title,
        description
      }
    }`
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
    }`
  );

  const ctaBanner = await sanity.fetch(
    `*[_type == "ctaBanner"][0]{
      headline,
      subheadline,
      buttonText,
      buttonLink,
      "backgroundImageUrl": backgroundImage.asset->url,
      "sideImageUrl": sideImage.asset->url,
      textOnLeft
    }`
  );

  if (!hero) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center text-red-600">
        <p>
          ⚠️ Hero content not found. Please add and publish it in Sanity Studio.
        </p>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen font-poppins bg-white text-black">
        {/* Hero Section */}
        <HeroWrapper />

        {/* Why Travel With Us Section */}
        {whyChoose && <WhyChoose data={whyChoose} />}

        {/* Journeys Section */}
        <section className="py-20 bg-[#f9f9f9] text-black">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Your Journey Starts Here
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Handpicked safari experiences to inspire your next adventure.
            </p>

            {journeys.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
                {journeys.map((j) => (
                  <Link
                    key={j._id}
                    href={{
                      pathname: "/journey",
                      query: {
                        q: j.title,
                        open: "true",
                      },
                    }}
                    className="block"
                  >
                    <JourneyCard
                      title={j.title}
                      summary={j.summary}
                      imageUrl={j.heroImage.asset.url}
                      alt={j.alt}
                      price={j.price}
                      duration={j.duration}
                      region={j.region?.title}
                      star={Number(j.star || 0)}
                      starIcon={j.starIcon}
                      isFeatured={j.featuredOnHome === true}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-10">
                No featured journeys available.
              </p>
            )}

            <Link
              href="/journeys"
              className="mt-12 inline-block text-black border border-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              Explore All Journeys →
            </Link>
          </div>
        </section>
        {ctaBanner && (
          <section
            className="relative w-full py-20 flex items-center justify-center overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${ctaBanner.backgroundImageUrl})` }}
          >
            {/* Top & Bottom Fades */}
            <div
              className="absolute top-0 left-0 w-full h-32 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, #f9f9f9, rgba(255, 255, 255, 0))",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-full h-32 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, #ffffff, rgba(255, 255, 255, 0))",
              }}
            />

            {/* Content Row */}
            <div
              className={`relative z-20 flex flex-col ${
                ctaBanner.textOnLeft ? "md:flex-row" : "md:flex-row-reverse"
              } items-center justify-between max-w-6xl w-full px-6`}
            >
              {/* Side Image */}
              {ctaBanner.sideImageUrl && (
                <div className="w-full md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0">
                  <img
                    src={ctaBanner.sideImageUrl}
                    alt="CTA illustration"
                    className="max-h-72 object-contain"
                    width={600}
                    height={400}
                  />
                </div>
              )}

              {/* Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {ctaBanner.headline}
                </h2>
                <p className="text-md md:text-lg mb-6">
                  {ctaBanner.subheadline}
                </p>
                <Link
                  href={ctaBanner.buttonLink}
                  className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                >
                  {ctaBanner.buttonText}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <TestimonialCarousel />
      </main>
    </>
  );
}
