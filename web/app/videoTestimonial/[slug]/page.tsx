import { groq } from "next-sanity";
import { freshClient as client } from "@/lib/sanityFresh";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

// ---------- GROQ QUERIES ----------

const ALL_SLUGS_QUERY = groq`
  *[_type == "videoTestimonial" && defined(slug.current)][].slug.current
`;

const SINGLE_TESTIMONIAL_QUERY = groq`
  *[_type == "videoTestimonial" && slug.current == $slug][0]{
    _id,
    name,
    location,
    videoUrl,
    quote,
    "thumbnailUrl": thumbnail.asset->url,
    uploadDate,
    videoDuration,
    "slug": slug.current,
    destination->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;

// ---------- Types ----------

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  videoUrl?: string;
  quote?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  videoDuration?: string;
  slug?: string;
  destination?: {
    _id: string;
    title?: string;
    slug?: string;
  };
};
// ---------- Static Params ----------

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(ALL_SLUGS_QUERY);

  return slugs.map((slug) => ({
    slug,
  }));
}

// ---------- Metadata ----------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const testimonial = await client.fetch<Testimonial>(
    SINGLE_TESTIMONIAL_QUERY,
    { slug },
  );

  if (!testimonial) return {};

  return {
    title: `${testimonial.name} – ${testimonial.location} Safari Review`,
    description: testimonial.quote,
    openGraph: {
      title: `${testimonial.name} – Fair Trade Safaris`,
      description: testimonial.quote,
      images: testimonial.thumbnailUrl
        ? [
            {
              url: testimonial.thumbnailUrl,
            },
          ]
        : [],
    },
  };
}

// ---------- Page ----------

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const testimonial = await client.fetch<Testimonial>(
    SINGLE_TESTIMONIAL_QUERY,
    { slug },
  );

  if (!testimonial) {
    notFound();
  }

  // Fetch 3 other testimonials
  // Try to fetch 3 from same destination first
  let relatedTestimonials: Testimonial[] = [];

  if (testimonial.destination?._id) {
    relatedTestimonials = await client.fetch<Testimonial[]>(
      groq`
      *[
        _type == "videoTestimonial" &&
        slug.current != $slug &&
        destination->_id == $destinationId
      ]
      | order(_createdAt desc)[0...3] {
        _id,
        name,
        "slug": slug.current,
        location,
        "thumbnailUrl": thumbnail.asset->url
      }
    `,
      {
        slug,
        destinationId: testimonial.destination._id,
      },
    );
  }

  // Fallback to newest if none found
  if (!relatedTestimonials.length) {
    relatedTestimonials = await client.fetch<Testimonial[]>(
      groq`
      *[_type == "videoTestimonial" && slug.current != $slug]
      | order(_createdAt desc)[0...3] {
        _id,
        name,
        "slug": slug.current,
        location,
        "thumbnailUrl": thumbnail.asset->url
      }
    `,
      { slug },
    );
  }

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${testimonial.name} – ${testimonial.location} Safari Review`,
    description: testimonial.quote,
    thumbnailUrl: testimonial.thumbnailUrl,
    uploadDate: testimonial.uploadDate,
    duration: testimonial.videoDuration,
    contentUrl: testimonial.videoUrl,
    embedUrl: testimonial.videoUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Video Testimonials",
        item: "https://www.fairtradesafaris.com/videoTestimonial/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: testimonial.name,
        item: `https://www.fairtradesafaris.com/videoTestimonial/${slug}/`,
      },
    ],
  };

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([videoSchema, breadcrumbSchema]),
        }}
      />

      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/videoTestimonial/">Video Testimonials</Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{testimonial.name}</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-semibold mb-6">
        {testimonial.name} – {testimonial.location}
      </h1>

      <div className="aspect-video mb-8">
        <iframe
          src={testimonial.videoUrl}
          className="w-full h-full rounded-xl"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={`Testimonial video from ${testimonial.name}`}
        />
      </div>

      <blockquote className="italic text-lg text-gray-700 mb-12">
        “{testimonial.quote}”
      </blockquote>

      {/* More Testimonials */}
      {relatedTestimonials.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">More Traveler Stories</h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {relatedTestimonials.map((item) => (
              <Link
                key={item._id}
                href={`/videoTestimonial/${item.slug}`}
                className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnailUrl || "/fallback.jpg"}
                    alt={item.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
