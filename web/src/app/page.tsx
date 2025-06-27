import sanity from "../../lib/sanity";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import HeroWithSearch from "@/components/HeroWithSearch";
import WhyChoose from "@/components/WhyChoose";
import type { PortableTextBlock } from "@portabletext/types"; // ✅ import for rich text
import TestimonialCarousel from "@/components/TestimonialCarousel";

type HeroContent = {
  headline: string;
  subheadline: string;
  backgroundImage: {
    asset: {
      url: string;
    };
  };
  primaryCTA: string;
  secondaryCTA: string;
};

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[]; // ✅ updated from string
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
  heroImage: {
    asset: {
      url: string;
    };
  };
  alt: string;
  ctaText: string;
};

export default async function Home() {
  const hero: HeroContent | null = await sanity.fetch(
    `*[_type == "hero"][0]{
      headline,
      subheadline,
      backgroundImage {
        asset->{url}
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
    `*[_type == "featuredJourney"]{
      _id,
      title,
      slug,
      summary,
      duration,
      heroImage {
        asset->{url}
      },
      alt,
      ctaText
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
  console.log("CTA Layout Debug", ctaBanner);
  return (
    <main className="min-h-screen font-poppins bg-white text-black">
      {/* Hero Section */}
      <HeroWithSearch />

      {/* Why Travel With Us Section */}
      {whyChoose && <WhyChoose data={whyChoose} />}

      {/* Featured Journeys */}
      {journeys.length > 0 && (
        <section className="py-20 bg-[#f9f9f9] text-black">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12">Featured Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
              {journeys.map((j) => (
                <div
                  key={j._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {j.heroImage?.asset?.url && (
                    <img
                      src={j.heroImage.asset.url}
                      alt={j.alt || "Journey image"}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{j.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{j.duration}</p>
                    <p className="text-gray-700 mb-4">{j.summary}</p>
                    {j.slug?.current && (
                      <Link href={`/journeys/${j.slug.current}`}>
                        <span className="inline-block bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                          {j.ctaText}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/journeys"
              className="mt-10 inline-block text-black border border-black px-5 py-2 rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              See All Itineraries →
            </Link>
          </div>
        </section>
      )}

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
            {/* Image */}
            {ctaBanner.sideImageUrl && (
              <div className="w-full md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0">
                <img
                  src={ctaBanner.sideImageUrl}
                  alt="CTA illustration"
                  className="max-h-72 object-contain"
                />
              </div>
            )}

            {/* Text */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {ctaBanner.headline}
              </h2>
              <p className="text-md md:text-lg mb-6">{ctaBanner.subheadline}</p>
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

      <ChatWidget />
    </main>
  );
}
