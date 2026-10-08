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
import { notFound } from "next/navigation";
import {
  Users,
  Bird,
  Trees,
  PawPrint,
  Calendar,
  Mountain,
  MapPin,
  Binoculars,
} from "lucide-react";
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
  heroIntro?: string;

  stats?: {
    label?: string;
    value?: string;
    icon?: string;
  }[];

  wildlifeHighlights?: string[];

  featuredParks?: {
    name?: string;
    description?: string;
    image?: {
      asset?: {
        url?: string;
      };
      alt?: string;
    };
    bestFor?: string[];
  }[];

  bestTimeToVisit?: {
    summary?: string;
    peakSeason?: string;
    greenSeason?: string;
    bestWildlifeMonths?: string;
  };

  conservationSection?: {
    title?: string;
    content?: PortableTextBlock[];
    image?: {
      asset?: {
        url?: string;
      };
      alt?: string;
    };
  };

  travelTips?: {
    title?: string;
    content?: string;
  }[];
};

/* =======================
   QUERY
======================= */
const iconMap = {
  users: Users,
  bird: Bird,
  trees: Trees,
  paw: PawPrint,
  calendar: Calendar,
  mountain: Mountain,
  "map-pin": MapPin,
  binoculars: Binoculars,
};

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
  heroIntro,

stats,

wildlifeHighlights,

featuredParks[]{
  name,
  description,
  image{
    asset->{url},
    alt
  },
  bestFor
},

bestTimeToVisit{
  summary,
  peakSeason,
  greenSeason,
  bestWildlifeMonths
},

conservationSection{
  title,
  content,
  image{
    asset->{url},
    alt
  }
},

travelTips,

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next 15: params is a Promise

  const data = (await client.fetch(query, { slug })) as DestinationDoc | null;

  if (!data) notFound();

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
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
          {hero.url && (
            <div className="relative min-h-[900px]">
              {/* Background */}
              <Image
                src={hero.url}
                alt={hero.alt || data.title}
                fill
                priority
                className="object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40">
                <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">
                  {/* LEFT */}
                  <div className="max-w-3xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-3 text-sm text-[#E7C98A] mb-8">
                      <Link href="/">Home</Link>
                      <span>›</span>
                      <Link href="/destination/">Destinations</Link>
                      <span>›</span>
                      <span className="text-white">{data.title}</span>
                    </nav>

                    {/* Title */}
                    <h1 className="text-6xl lg:text-8xl font-serif text-white leading-none mb-5">
                      {data.title}
                    </h1>

                    {/* Subtitle */}
                    <div className="flex items-center gap-3 mb-8">
                      {flag?.url && (
                        <Image
                          src={flag.url}
                          alt=""
                          width={34}
                          height={24}
                          className="rounded-sm"
                        />
                      )}

                      <span className="text-3xl text-white font-light">
                        {data.heroIntro}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="max-w-2xl text-xl leading-relaxed text-white/90">
                      <PortableText
                        value={
                          data.travelInfo ? data.travelInfo.slice(0, 1) : []
                        }
                        components={components}
                      />
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap gap-5 mt-10">
                      <Link
                        href={`/destination/${data.slug}/safaris/`}
                        className="
                  bg-[#D4A64A]
                  hover:bg-[#c39333]
                  text-black
                  font-semibold
                  px-10
                  py-5
                  rounded-lg
                  transition
                "
                      >
                        Explore {data.title} Safaris →
                      </Link>

                      <a
                        href={data.ctaLink}
                        className="
                  border
                  border-white/40
                  text-white
                  px-10
                  py-5
                  rounded-lg
                  hover:bg-white/10
                  transition
                "
                      >
                        Plan Your Safari →
                      </a>
                    </div>
                  </div>

                  {/* RIGHT CARD */}
                  <aside className="hidden lg:block">
                    <div
                      className="
              bg-[#F7F3EA]
              rounded-3xl
              shadow-2xl
              overflow-hidden
            "
                    >
                      <div className="p-8">
                        <h3 className="text-3xl font-serif text-gray-900 mb-8">
                          Tailor Made Safaris
                        </h3>

                        <div className="space-y-8">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Local Safari Expertise
                            </h4>

                            <p className="text-gray-600">
                              Get trusted advice from East Africa safari
                              specialists.
                            </p>
                          </div>

                          <div className="border-t pt-6">
                            <h4 className="font-semibold mb-2">
                              Conservation-Focused Travel
                            </h4>

                            <p className="text-gray-600">
                              Your journey supports wildlife conservation and
                              local communities.
                            </p>
                          </div>
                        </div>

                        <a
                          href={data.ctaLink}
                          className="
                    mt-8
                    w-full
                    inline-flex
                    justify-center
                    items-center
                    bg-[#D4A64A]
                    py-4
                    rounded-lg
                    font-semibold
                  "
                        >
                          Book a Discovery Call →
                        </a>
                      </div>
                    </div>
                  </aside>
                </div>

                {/* Stats */}
                {Array.isArray(data.stats) && data.stats.length > 0 && (
                  <div className="mt-16 relative z-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {data.stats.slice(0, 6).map((stat, idx) => {
                        const Icon =
                          stat.icon &&
                          iconMap[stat.icon as keyof typeof iconMap];

                        return (
                          <div
                            key={idx}
                            className="
              bg-[#F7F3EA]
              rounded-3xl
              p-6
              min-h-[220px]
              shadow-xl
              border border-black/5
              flex flex-col
            "
                          >
                            {Icon && (
                              <Icon className="h-6 w-6 text-[#D4A64A] mb-5" />
                            )}

                            <div className="text-4xl font-serif text-gray-900 leading-tight mb-4">
                              {stat.value}
                            </div>

                            <div className="text-gray-700 leading-relaxed">
                              {stat.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                        href={`/destination/${dest.slug}/`}
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
