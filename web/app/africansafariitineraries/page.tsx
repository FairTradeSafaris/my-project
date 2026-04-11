import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import JourneyPageWrapper from "../../components/JourneyPageWrapper";
import Script from "next/script";
import Link from "next/link";

type JourneyItem = {
  title: string;
  slug?: {
    current: string;
  };
  summary?: string;
  price?: number;
  heroImage?: {
    asset?: {
      url: string;
    };
  };
};

// 🔹 Rich SEO Metadata with AI-friendly Schema
export async function generateMetadata(): Promise<Metadata> {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == "africansafariitineraries"][0]{
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage { asset->{url} },
      socials[]{ platform, url }
    }`,
  );

  const journeys: JourneyItem[] = await sanity.fetch(
    `*[_type == "journey" && top10List == true][0...10]{
      title,
      slug { current },
      summary,
      price,
      heroImage { asset->{url} }
    }`,
  );

  const title =
    data?.metaTitle || "African Safari Itineraries | Fair Trade Safaris";
  const description =
    data?.metaDescription ||
    "Explore handcrafted safari journeys across Africa. Designed for purpose, guided by heart.";
  const canonical =
    data?.canonicalUrl ||
    "https://www.fairtradesafaris.com/africansafariitineraries";
  const ogImage =
    data?.ogImage?.asset?.url ||
    "https://www.fairtradesafaris.com/default-og-image.jpg";
  const sameAs = data?.socials
    ?.map((s: { url?: string }) => s.url)
    .filter(Boolean);

  const productSchemaList = journeys.map((journey) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: journey.title,
    description: journey.summary || "An unforgettable African safari journey.",
    image:
      journey.heroImage?.asset?.url ||
      "https://www.fairtradesafaris.com/default-journey.jpg",
    offers: {
      "@type": "Offer",
      url: `${canonical}?q=${encodeURIComponent(journey.title)}`,
      priceCurrency: "USD",
      price: journey.price?.toString() || "4000",
      availability: "https://schema.org/InStock",
    },
    brand: {
      "@type": "Organization",
      name: "Fair Trade Safaris",
    },
  }));

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: "en",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImage,
    },
    publisher: {
      "@type": "Organization",
      name: "Fair Trade Safaris",
      url: "https://www.fairtradesafaris.com",
    },
    isPartOf: {
      "@id": "https://www.fairtradesafaris.com#website",
    },
  };

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://www.fairtradesafaris.com#organization",
    name: "Fair Trade Safaris",
    url: "https://www.fairtradesafaris.com",
    logo: ogImage,
    image: ogImage,
    description,
    sameAs,
  };

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogImage }],
      siteName: "Fair Trade Safaris",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "ld+json": JSON.stringify([
        webPageSchema,
        ...productSchemaList,
        travelAgencySchema,
      ]),
    },
  };
}

// 🔹 Main Component
export default function JourneyPage() {
  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "African Safari Itineraries",
        item: "https://www.fairtradesafaris.com/africansafariitineraries",
      },
    ],
  };

  return (
    <>
      {/* Inject Breadcrumb structured data for SEO */}
      <Script
        id="journey-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-[#f9f7f4] py-10 sm:py-16 px-5 sm:px-10 lg:px-24 text-gray-800 font-poppins">
        <div className="max-w-3xl lg:max-w-5xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-5 sm:mb-6 leading-tight">
            Safari. Reimagined.
          </h1>

          {/* Content */}
          <div className="space-y-5 sm:space-y-6 text-gray-700">
            {/* Lead */}
            <p className="text-base sm:text-xl leading-relaxed">
              Let’s turn your dream safari into a reality — with{" "}
              <Link
                href="/luxury-african-safaris/"
                className="text-[#00473e] font-medium underline hover:text-[#00755e] transition-colors duration-200"
              >
                tailor-made African safari packages
              </Link>{" "}
              designed around your travel style, values, and sense of adventure.
              Our ethical safaris blend once-in-a-lifetime wildlife encounters,
              immersive local culture, and sustainable luxury across East and
              Southern Africa.{" "}
              <a
                href="https://bookings.fairtradesafaris.com/"
                className="inline-block mt-2 text-[#00473e] font-medium underline hover:text-[#00755e] transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start planning now.
              </a>
            </p>

            {/* Supporting */}
            <p className="text-[15px] sm:text-lg leading-relaxed text-gray-600">
              These aren’t just trips — they’re{" "}
              <span className="text-gray-900 font-medium">
                handcrafted journeys
              </span>{" "}
              rooted in purpose, powered by people, and alive with the spirit of
              Africa.
            </p>

            {/* Tertiary */}
            <p className="text-[15px] sm:text-lg leading-relaxed text-gray-600">
              Whether you crave{" "}
              <span className="italic">untamed wilderness</span>,{" "}
              <span className="italic">cultural depth</span>, or{" "}
              <span className="italic">barefoot luxury</span>, we’ll design a
              tailor-made experience that gives back at every step.
            </p>
          </div>
        </div>
      </div>

      <JourneyPageWrapper />
    </>
  );
}
