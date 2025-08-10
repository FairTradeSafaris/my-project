// app/destination/[slug]/page.tsx
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

type PracticalSection = {
  title?: string;
  content?: PortableTextBlock[];
};

type DestinationDoc = {
  title: string;
  slug: string;
  heroImage?: string;
  travelInfo?: PortableTextBlock[];
  didYouKnowImage?: string;
  didYouKnowText?: string;
  highlights?: PortableTextBlock[];
  practicalStuff?: PracticalSection[];
  ctaLink?: string;
  flagImage?: string;
  region?: string;
  ranking?: number;
  featured?: boolean;
  mapLocation?: string;
  tags?: string[];
  gallery?: string[];
};

const query = groq`
  *[_type == "destination" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "heroImage": heroImage.asset->url,
    travelInfo,
    "didYouKnowImage": didYouKnowImage.asset->url,
    didYouKnowText,
    highlights,
    practicalStuff,
    ctaLink,
    "flagImage": flagImage.asset->url,
    region,
    ranking,
    featured,
    mapLocation,
    tags,
    "gallery": gallery[].asset->url
  }
`;

// ✅ Next 15: params is a Promise
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = (await client.fetch(query, { slug })) as DestinationDoc | null;

  if (!data) return <div className="p-10">Destination not found</div>;

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative h-[400px]">
        {data.heroImage && (
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
          <h1 className="text-4xl text-white font-bold">{data.title}</h1>
          {data.region && <p className="text-white/80">{data.region}</p>}
        </div>
      </section>

      {/* Travel Info */}
      {data.travelInfo && (
        <section className="max-w-4xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-semibold mb-4">Travel Information</h2>
          <PortableText value={data.travelInfo} />
        </section>
      )}

      {/* Did You Know */}
      {(data.didYouKnowText || data.didYouKnowImage) && (
        <section className="bg-yellow-50 py-10 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center">
            {data.didYouKnowImage && (
              <Image
                src={data.didYouKnowImage}
                alt="Did You Know"
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
              <p>{data.didYouKnowText}</p>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {data.highlights && (
        <section className="max-w-4xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <PortableText value={data.highlights} />
        </section>
      )}

      {/* Practical Info */}
      {Array.isArray(data.practicalStuff) && data.practicalStuff.length > 0 && (
        <section className="bg-gray-50 py-10 px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Practical Info</h2>
            {data.practicalStuff.map((section, i) => (
              <div
                key={`${section.title ?? "section"}-${i}`}
                className="border p-4 rounded-lg bg-white"
              >
                {section.title && (
                  <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                )}
                {section.content && <PortableText value={section.content} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {Array.isArray(data.gallery) && data.gallery.length > 0 && (
        <section className="max-w-5xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.gallery.map((img, i) => (
              <Image
                key={`${img}-${i}`}
                src={img}
                alt={`Gallery ${i + 1}`}
                width={400}
                height={300}
                className="object-cover rounded-lg"
              />
            ))}
          </div>
        </section>
      )}

      {/* Map */}
      {data.mapLocation && (
        <section className="max-w-4xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-semibold mb-4">Map</h2>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              data.mapLocation
            )}&output=embed`}
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            className="rounded-lg border"
            title={`${data.title} map`}
          />
        </section>
      )}

      {/* CTA */}
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
  );
}
