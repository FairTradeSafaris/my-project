import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import Image from "@/components/SanityImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JourneyCard from "@/components/JourneyCard";
import { DEFAULT_OG_IMAGE, ogImageUrl } from "@/lib/seoDefaults";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// SEO: this page used to inherit the parent destination's title, description
// and canonical (13 duplicate title/description pairs, sitemap listing
// non-canonical URLs). It lists itineraries, so give it its own metadata and a
// self-referencing canonical.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // heroUrl (metadata-only field) = destination hero image or its gallery
  // image, used for og:image; falls back to the site default.
  const d: { title?: string; heroUrl?: string } | null = await client.fetch(
    groq`*[_type == "destination" && slug.current == $slug][0]{
      title,
      "heroUrl": coalesce(heroImage.image.asset->url, heroImage.galleryImage->image.asset->url)
    }`,
    { slug },
  );
  if (!d?.title) notFound();

  const url = `https://www.fairtradesafaris.com/destination/${slug}/safaris/`;
  const title = `${d.title} Safari Itineraries & Packages | Fair Trade Safaris`;
  const description = `Browse handcrafted ${d.title} safari itineraries from Fair Trade Safaris: private, conservation-focused journeys with local guides and hand-picked lodges.`;
  const image = d.heroUrl ? ogImageUrl(d.heroUrl) : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
type Journey = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  duration?: string;
  price?: number;
  imageUrl?: string;
  alt?: string;
  region?: {
    title?: string;
  };
};
const destinationQuery = groq`
*[_type == "destination" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  heroImage{
    image{asset->{url}, alt},
    galleryImage->{
      image{asset->{url}},
      alt
    }
  }
}
`;

const journeysQuery = groq`
*[
  _type == "journey" &&
  references($destinationId)
]{
  _id,
  title,
  "slug": slug.current,
  summary,
  duration,
  price,
  "imageUrl": heroImage.asset->url,
  alt,
  region->{ title }
}
`;

export default async function SafarisPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Get destination
  const destination = await client.fetch(destinationQuery, { slug });

  if (!destination) notFound();

  // 2. Get journeys for this destination
  const journeys = await client.fetch(journeysQuery, {
    destinationId: destination._id,
  });

  const heroUrl =
    destination?.heroImage?.image?.asset?.url ||
    destination?.heroImage?.galleryImage?.image?.asset?.url;

  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative w-full h-[50vh] min-h-[400px]">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={destination.title}
            fill
            className="object-cover"
            priority
          />
        )}

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
          <h1 className="text-4xl text-white font-bold">
            {destination.title} Safaris & Itineraries
          </h1>
          <p className="text-white/80 mt-2 max-w-xl">
            Explore handcrafted safari journeys designed to immerse you in{" "}
            {destination.title}’s landscapes, wildlife, and culture.
          </p>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 mt-6 text-sm text-gray-500">
        <Link href="/">Home</Link> /{" "}
        <Link href="/destination/">Destinations</Link> /{" "}
        <Link href={`/destination/${slug}/`}>{destination.title}</Link> / Safaris
      </div>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Discover {destination.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          From iconic wildlife encounters to immersive cultural experiences,
          browse our curated {destination.title} safari itineraries and find the
          journey that fits your travel style.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {journeys.length === 0 ? (
          <p className="text-center text-gray-500">
            No itineraries available yet.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j: Journey) => (
              <JourneyCard
                key={j._id}
                journeyId={j._id}
                slug={j.slug}
                title={j.title}
                summary={j.summary}
                imageUrl={j.imageUrl}
                alt={j.alt}
                price={j.price}
                duration={j.duration}
                region={j.region?.title}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
