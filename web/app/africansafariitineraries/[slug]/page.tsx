export const dynamic = "force-dynamic";

import { groq } from "next-sanity";
import { sanityClient as client } from "@/lib/client";
import { notFound } from "next/navigation";
import Script from "next/script";
import JourneyClient from "./JourneyClient";
import Link from "next/link";
import JourneyCard from "@/components/JourneyCard";

import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";

/* ================= TYPES ================= */

type Country = {
  title: string;
};

type Destination = {
  _id: string;
  title: string;
  slug: { current: string };
  region?: string;
  flagImage?: { asset?: { url: string } };
  didYouKnowText?: string;
  travelInfo?: PortableTextBlock[];
};

type Journey = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  summaryRich?: PortableTextBlock[];
  duration?: string;
  price?: number;
  heroImage?: { asset?: { url: string } };
  alt?: string;
  countries?: Country[];
  destinations?: Destination[];
  star?: string;
  starIcon?: { asset?: { url: string } };
  wetuLink?: string;
};

/* ================= GROQ ================= */

const JOURNEY_QUERY = groq`
  *[_type=="journey" && slug.current==$slug][0]{
    _id,
    title,
    slug,
    summary,
summaryRich,
    duration,
    price,
    heroImage{asset->{url}},
    alt,
    star,
    starIcon{asset->{url}},
    countries[]->{title},
destinations[]->{
  _id,
  title,
  slug,
  region,
  flagImage{asset->{url}},
  didYouKnowText,
  travelInfo
},
    wetuLink
  }
`;

const SUGGESTED_QUERY = groq`
  *[
    _type == "journey" &&
    slug.current != $slug &&
    count(destinations[@._ref in $destinationIds]) > 0
  ]| order(featuredOnHome desc, price desc){
    _id,
    title,
    slug,
    summary,
    heroImage{asset->{url}},
    alt,
    price,
    star,
    starIcon{asset->{url}},
    countries[]->{title}
  }
`;
const RELATED_BLOGS_QUERY = groq`
  *[
    _type == "blog" &&
    count(relatedDestinations[@._ref in $destinationIds]) > 0
  ] | order(publishedAt desc)[0...6]{
    _id,
    title,
    slug,
    publishedAt,
    summary,
    coverImage{asset->{url}, alt}
  }
`;

/* ================= STATIC PARAMS ================= */

function getNextJune30(): string {
  const now = new Date();
  const year = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  return `${year}-06-30`;
}

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type=="journey" && defined(slug.current)]{ slug }`,
  );

  return slugs.map((s) => ({ slug: s.slug.current }));
}

/* ================= METADATA ================= */

/* ================= PAGE ================= */

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const journey: Journey = await client.fetch(JOURNEY_QUERY, { slug });
  if (!journey) notFound();

  const destinationIds = journey.destinations?.map((d) => d._id) ?? [];

  const suggested: Journey[] = destinationIds.length
    ? await client.fetch(SUGGESTED_QUERY, {
        slug,
        destinationIds,
      })
    : [];

  const pageUrl = `https://www.fairtradesafaris.com/africansafariitineraries/${journey.slug.current}/`;
  const relatedBlogs = destinationIds.length
    ? await client.fetch(RELATED_BLOGS_QUERY, { destinationIds })
    : [];
  return (
    <>
      {/* ================= SEO SCHEMA ================= */}
      <Script id="journey-schema" type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": pageUrl,
            url: pageUrl,
            name: journey.title,
            description: journey.summary,
          },
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: journey.title,
            description: journey.summary,
            image: journey.heroImage?.asset?.url,
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: journey.price,
              availability: "https://schema.org/InStock",
              url: pageUrl,
              priceValidUntil: getNextJune30(),
            },
          },
        ])}
      </Script>

      {/* ================= HERO ================= */}
      <main className="bg-[#FAF4EC] text-black">
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden md:h-[80vh]">
          {journey.heroImage?.asset?.url && (
            <img
              src={journey.heroImage.asset.url}
              alt={journey.alt || journey.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-white bg-black/30 backdrop-blur-md rounded-2xl shadow-xl space-y-5">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
              {journey.title}
            </h1>

            {journey.summary && (
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
                {journey.summary}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {journey.duration && (
                <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {journey.duration}
                </span>
              )}

              {Array.isArray(journey.countries) &&
                journey.countries.length > 0 && (
                  <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                    {journey.countries.map((c) => c.title).join(", ")}
                  </span>
                )}

              {typeof journey.price === "number" && (
                <span className="bg-[#C8B08A] text-black px-5 py-2 rounded-full text-sm font-bold">
                  From ${journey.price.toLocaleString()} p/p sharing
                </span>
              )}
            </div>

            {journey.star && journey.starIcon?.asset?.url && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm font-medium">Luxury level</span>
                <div className="flex gap-1">
                  {Array.from({
                    length: Number(journey.star.match(/\d+/)?.[0] || 0),
                  }).map((_, i) => (
                    <img
                      key={i}
                      src={journey.starIcon?.asset?.url}
                      alt="Luxury Star"
                      className="w-5 h-5"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contact/"
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition w-full sm:w-auto text-center"
              >
                Start My Safari
              </Link>

              {journey.wetuLink && (
                <a
                  href={journey.wetuLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C8B08A] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#b79e74] transition w-full sm:w-auto text-center"
                >
                  View Full Itinerary
                </a>
              )}
            </div>
          </div>
        </section>
        {journey.summaryRich && (
          <section className="bg-white py-8">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">
                {journey.title} Safari Overview
              </h2>

              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={journey.summaryRich}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="mb-6 text-lg leading-relaxed text-gray-700">
                          {children}
                        </p>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-10 mb-4">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mt-8 mb-3">
                          {children}
                        </h3>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                          {children}
                        </ul>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }) => (
                        <li className="text-gray-700 text-lg">{children}</li>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          </section>
        )}
        {journey.wetuLink && (
          <section className="bg-white py-8">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                Full Safari Itinerary
              </h2>

              <div className="border rounded-2xl overflow-hidden shadow-md">
                <iframe
                  src={journey.wetuLink}
                  className="w-full h-[800px]"
                  style={{ border: "none" }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* === JOURNEY DETAILS === */}
        <JourneyClient
          journey={journey}
          destinations={journey.destinations ?? []}
          relatedBlogs={relatedBlogs}
        />

        {/* === YOU MAY ALSO LIKE === */}
        {suggested.length > 0 && (
          <section className="bg-[#F5EFE3] py-8 border-t border-black/5">
            <div className="max-w-5xl mx-auto px-6">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  You May Also Like
                </h2>
                <p className="text-sm text-gray-600 mt-3">
                  Curated safari experiences related to this journey
                </p>
              </div>

              <div className="flex gap-8 flex-wrap">
                {suggested.map((j) => (
                  <div key={j._id} className="w-[240px] md:w-[280px]">
                    <JourneyCard
                      journeyId={j._id}
                      slug={j.slug?.current || ""}
                      title={j.title}
                      summary={j.summary}
                      imageUrl={j.heroImage?.asset?.url}
                      alt={j.alt}
                      price={j.price}
                      destinations={j.countries?.map((c) => c.title) ?? []}
                      star={Number(j.star?.match(/\d+/)?.[0] || 0)}
                      starIcon={j.starIcon?.asset?.url}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
