import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { Button } from "@/components/ui/button";
import Gallery from "@/components/Gallery";
import type { ImageOrGallery } from "../../../types/types";
import { resolveImage } from "@components/journey-finder/utils";
import Link from "next/link";
export const dynamic = "force-static";
export const revalidate = 0;
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "destination" && defined(slug.current)].slug.current`,
  );

  return slugs.map((slug) => ({ slug }));
}

/* =======================
   TYPES
======================= */

type PracticalSection = {
  title?: string;
  content?: PortableTextBlock[];
};

type DestinationDoc = {
  title: string;
  slug: string;

  heroImage?: ImageOrGallery;
  didYouKnowImage?: ImageOrGallery;
  flagImage?: ImageOrGallery;

  travelInfo?: PortableTextBlock[];
  didYouKnowText?: string;
  highlights?: PortableTextBlock[];

  practicalStuff?: PracticalSection[];

  ctaLink?: string;
  region?: string;
  ranking?: number;
  featured?: boolean;
  mapLocation?: string;

  tags?: string[];

  gallery?: {
    image?: {
      asset?: {
        url?: string;
      };
    };
    alt?: string;
    caption?: string;
    credit?: string;
    license?: string;
    sourceUrl?: string;
  }[];

  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
  canonicalUrl?: string;
  relatedJourneys?: {
    _id: string;
    title: string;
    slug: string;
    heroImage?: {
      url?: string;
      alt?: string;
    };
    region?: {
      title?: string;
    };
    duration?: string;
    price?: number;
    ctaText?: string;
  }[];
  relatedBlogs?: {
    _id: string;
    title: string;
    slug: string;
    publishedAt: string;
    summary?: string;
    coverImage?: {
      asset?: { url?: string };
      alt?: string;
    };
  }[];
  faqs?: {
    _id: string;
    question: string;
    answer: PortableTextBlock[];
  }[];
  otherDestinations?: {
    _id: string;
    title: string;
    slug: string;
    region?: string;
    image?: string;
  }[];
};

/* =======================
   QUERY
======================= */

const query = groq`
*[_type == "destination" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  travelInfo,
  didYouKnowText,
  highlights,
  practicalStuff,
  ctaLink,

  heroImage{
    image{asset->{url}, alt},
    galleryImage->{
      image{asset->{url}},
      alt
    }
  },

  didYouKnowImage{
    image{asset->{url}, alt},
    galleryImage->{
      image{asset->{url}},
      alt,
      caption,
      credit
    }
  },

  flagImage{
    image{asset->{url}, alt},
    galleryImage->{
      image{asset->{url}},
      alt
    }
  },

  region,
  ranking,
  featured,
  mapLocation,
  tags,

  gallery[]->{
    image{asset->{url}},
    alt,
    caption,
    credit,
    license,
    sourceUrl
  },

  metaTitle,
  metaDescription,
  aiSummary,
  canonicalUrl,

  // Related journeys
  "relatedJourneys": *[
    _type == "journey" && references(^._id)
  ]{
    _id,
    title,
    "slug": slug.current,
    "heroImage": {
      "url": heroImage.asset->url,
      "alt": alt
    },
    region->{ title }
  },

  // Related blog posts
  "relatedBlogs": *[
    _type == "blog" &&
    references(^._id)
  ] | order(publishedAt desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    coverImage{
      asset->{url},
      alt
    }
  },

  // FAQs
  "faqs": *[
    _type == "faqQuestion" &&
    references(^._id)
  ] | order(order asc){
    _id,
    question,
    answer
  },

  // Other destinations
  "otherDestinations": *[
    _type == "destination" &&
    slug.current != $slug
  ] | order(ranking asc, title asc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    region,
    "image": coalesce(
      heroImage.image.asset->url,
      heroImage.galleryImage->image.asset->url,
      gallery[0]->image.asset->url
    )
  }
}
`;

/* =======================
   PAGE
======================= */

import {
  PortableTextComponents,
  PortableTextBlockComponent,
  PortableTextListComponent,
  PortableTextListItemComponent,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: (({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-800">{children}</p>
    )) as PortableTextBlockComponent,
  },
  list: {
    bullet: (({ children }) => (
      <ul className="list-disc pl-6 mb-4 text-gray-800">{children}</ul>
    )) as PortableTextListComponent,
    number: (({ children }) => (
      <ol className="list-decimal pl-6 mb-4 text-gray-800">{children}</ol>
    )) as PortableTextListComponent,
  },
  listItem: {
    bullet: (({ children }) => (
      <li className="mb-1">{children}</li>
    )) as PortableTextListItemComponent,
    number: (({ children }) => (
      <li className="mb-1">{children}</li>
    )) as PortableTextListItemComponent,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const rel = !value?.href?.startsWith("/")
        ? "noopener noreferrer"
        : undefined;

      return (
        <a
          href={value?.href}
          rel={rel}
          target={rel ? "_blank" : undefined}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {children}
        </a>
      );
    },
  },
};
export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params; // ❌ this now throws

  const data = (await client.fetch(query, { slug })) as DestinationDoc | null;

  if (!data) return <div className="p-10">Destination not found</div>;

  const hero = resolveImage(data.heroImage);
  const flag = resolveImage(data.flagImage);
  const didYouKnow = resolveImage(data.didYouKnowImage);

  return (
    <>
      {/* Mobile floating "Explore Packages" button */}
      <div className="fixed bottom-20 right-4 z-50 lg:hidden">
        <a
          href="#related-journeys"
          className="bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg"
        >
          🌍 Explore Packages
        </a>
      </div>

      <main className="bg-white text-gray-900">
        {/* HERO SECTION */}
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {hero.url && (
            <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
              <Image
                src={hero.url}
                alt={hero.alt || data.title}
                fill
                className="object-cover object-[center_30%]"
                sizes="100vw"
                priority
              />

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                <div className="flex items-center gap-4">
                  {flag?.url && (
                    <Image
                      src={flag.url}
                      alt={`${data.title} flag`}
                      width={42}
                      height={28}
                      className="rounded-sm object-contain"
                    />
                  )}

                  <h1 className="text-4xl text-white font-bold">
                    {data.title}
                  </h1>
                </div>

                {data.region && (
                  <p className="text-white/80 mt-2">{data.region}</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ================= HEADER BLOCK ================= */}

        <div className="max-w-7xl mx-auto px-6 mt-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-1">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gray-700 transition">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/destination/"
                  className="hover:text-gray-700 transition"
                >
                  Destinations
                </Link>
              </li>
              {data.region && (
                <>
                  <li>/</li>
                  <li>{data.region}</li>
                </>
              )}
              <li>/</li>
              <li className="text-gray-700 font-medium">{data.title}</li>
            </ol>
          </nav>

          {/* Section Navigation */}
          <nav className="flex flex-wrap gap-8 text-sm border-b border-gray-200 pb-4">
            <a
              href="#travel-info"
              className="font-medium hover:text-black transition"
            >
              Travel Information
            </a>
            <a href="#highlights" className="hover:text-black transition">
              Highlights
            </a>
            <a href="#practical-info" className="hover:text-black transition">
              Practical Info
            </a>
            <a href="#faq" className="hover:text-black transition">
              FAQs
            </a>
            {data.mapLocation && (
              <a href="#map" className="hover:text-black transition">
                Map
              </a>
            )}
          </nav>
        </div>

        {/* ================= END HEADER BLOCK ================= */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 px-6 mt-10">
          <div className="lg:col-span-3">
            {/* TRAVEL INFO */}
            {data.travelInfo && (
              <section id="travel-info" className="py-5px-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Travel Information
                </h2>
                <PortableText value={data.travelInfo} components={components} />
              </section>
            )}

            {/* DID YOU KNOW */}
            {(data.didYouKnowText || didYouKnow.url) && (
              <section className="bg-yellow-50 py-10 px-6 rounded-lg mx-6 mb-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  {didYouKnow.url && (
                    <div className="flex flex-col max-w-[300px] w-full">
                      <Image
                        src={didYouKnow.url}
                        alt={didYouKnow.alt || "Did You Know"}
                        width={300}
                        height={200}
                        className="rounded-lg object-cover"
                        style={{ width: "300px", height: "auto" }}
                      />
                      {(didYouKnow.caption || didYouKnow.credit) && (
                        <div className="text-xs text-gray-500 mt-2 leading-snug text-center md:text-left">
                          {didYouKnow.caption && <p>{didYouKnow.caption}</p>}
                          {didYouKnow.credit && (
                            <p className="italic mt-1">
                              Photo credit: {didYouKnow.credit}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
                    <p>{data.didYouKnowText}</p>
                  </div>
                </div>
              </section>
            )}

            {/* HIGHLIGHTS */}
            {data.highlights && (
              <section id="highlights" className="py-10 px-6">
                <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                <PortableText value={data.highlights} components={components} />
              </section>
            )}

            {/* GALLERY */}
            {data.gallery && (
              <Gallery
                images={data.gallery
                  .filter((img): img is NonNullable<typeof img> =>
                    Boolean(img?.image?.asset?.url),
                  )
                  .map((img) => ({
                    url: img.image!.asset!.url!,
                    alt: img.alt,
                    caption: img.caption,
                    credit: img.credit,
                  }))}
              />
            )}

            {/* PRACTICAL INFO */}
            {data.practicalStuff?.length && (
              <section
                id="practical-info"
                className="py-16 px-6 max-w-4xl mx-auto"
              >
                <h2 className="text-3xl font-semibold mb-12 text-center">
                  Practical Information
                </h2>

                <div className="space-y-16">
                  {data.practicalStuff.map((item, idx) => (
                    <div key={idx}>
                      {item.title && (
                        <h3 className="text-xl font-semibold mb-4">
                          {item.title}
                        </h3>
                      )}

                      <div className="prose prose-gray max-w-none leading-relaxed">
                        {item.content && (
                          <PortableText
                            value={item.content}
                            components={components}
                          />
                        )}
                      </div>

                      {Array.isArray(data.practicalStuff) &&
                        data.practicalStuff.length > 0 && (
                          <hr className="mt-12 border-gray-200" />
                        )}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* EXPLORE OTHER DESTINATIONS */}
            {Array.isArray(data.otherDestinations) &&
              data.otherDestinations.length > 0 && (
                <section className="pt-2 pb-16 px-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    Explore Other Destinations
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.otherDestinations.map((dest) => (
                      <Link
                        key={dest._id}
                        href={`/destination/${dest.slug}`}
                        className="group block border rounded-lg overflow-hidden hover:shadow-lg transition"
                      >
                        {dest.image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={dest.image}
                              alt={dest.title}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-500"
                              sizes="(min-width: 1024px) 33vw, 100vw"
                            />
                          </div>
                        )}

                        <div className="p-4">
                          <h3 className="font-semibold text-lg group-hover:text-black">
                            {dest.title}
                          </h3>

                          {dest.region && (
                            <p className="text-sm text-gray-600 mt-1">
                              {dest.region}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            {/* DESTINATION FAQ */}
            {Array.isArray(data.faqs) && data.faqs.length > 0 && (
              <section id="faq" className="py-10 px-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {data.title} Travel Questions
                </h2>

                <div className="space-y-6">
                  {data.faqs.map((faq) => (
                    <div key={faq._id} className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {faq.question}
                      </h3>
                      <PortableText
                        value={faq.answer}
                        components={components}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* MAP */}
            {data.mapLocation && (
              <section id="map" className="py-10 px-6">
                <h2 className="text-2xl font-semibold mb-4">Map</h2>
                <div className="max-w-xl rounded-lg border overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      data.mapLocation,
                    )}&output=embed`}
                    className="w-full h-[280px]"
                    loading="lazy"
                    allowFullScreen
                    title={`${data.title} map`}
                  />
                </div>
              </section>
            )}
          </div>

          <aside
            className="col-span-1 block lg:block mt-12"
            id="related-journeys"
          >
            {Array.isArray(data.relatedJourneys) &&
              data.relatedJourneys.length > 0 && (
                <div className="bg-white border rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-5 text-gray-900">
                    🌍 Explore These Packages for {data.title}
                  </h3>
                  <ul className="space-y-5">
                    {data.relatedJourneys.map((journey) => (
                      <li key={journey._id}>
                        <Link
                          href={`/africansafariitineraries/${journey.slug}/`}
                          className="flex gap-4 items-start group"
                        >
                          {journey.heroImage?.url && (
                            <Image
                              src={journey.heroImage.url}
                              alt={journey.heroImage.alt || journey.title}
                              width={90}
                              height={90}
                              className="rounded-lg object-cover shrink-0 border group-hover:opacity-90 transition"
                              style={{ width: "90px", height: "90px" }}
                              unoptimized
                            />
                          )}
                          <div className="flex flex-col">
                            <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-black">
                              {journey.title}
                            </h4>
                            {journey.region?.title && (
                              <p className="text-xs text-orange-600 mt-1">
                                {journey.region.title}
                              </p>
                            )}
                            <span className="mt-2 text-xs text-gray-500">
                              View full itinerary →
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {Array.isArray(data.relatedBlogs) &&
              data.relatedBlogs.length > 0 && (
                <div className="bg-white border rounded-lg shadow p-4 mt-8">
                  <h3 className="text-lg font-semibold mb-5 text-gray-900">
                    📝 Safari Planning Guides
                  </h3>

                  <ul className="space-y-5">
                    {data.relatedBlogs.map((blog) => (
                      <li key={blog._id}>
                        <Link
                          href={`/blog/${blog.slug}/`}
                          className="flex gap-4 items-start group"
                        >
                          {blog.coverImage?.asset?.url && (
                            <Image
                              src={blog.coverImage.asset.url}
                              alt={blog.coverImage.alt || blog.title}
                              width={90}
                              height={90}
                              className="rounded-lg object-cover shrink-0 border group-hover:opacity-90 transition"
                              style={{ width: "90px", height: "90px" }}
                              unoptimized
                            />
                          )}

                          <div className="flex flex-col">
                            <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-black">
                              {blog.title}
                            </h4>
                            <span className="mt-2 text-xs text-gray-500">
                              Read article →
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </aside>
        </div>

        {/* closes lg:col-span-3 */}

        {/* CTA BUTTON – FULL WIDTH */}
        {data.ctaLink && (
          <section className="text-center py-12 bg-[#E5D5B8]">
            <Button
              asChild
              className="bg-black text-white px-6 py-3 rounded-lg text-lg"
            >
              <a href={data.ctaLink} target="_blank" rel="noopener noreferrer">
                Book a Discovery Call
              </a>
            </Button>
          </section>
        )}
      </main>
    </>
  );
}
