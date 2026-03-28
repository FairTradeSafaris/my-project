"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/* ================= TYPES ================= */

type Country = { title: string };

type Destination = {
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

type RelatedBlog = {
  _id: string;
  title: string;
  slug: { current: string } | string;
  summary?: string;
  coverImage?: { asset?: { url?: string }; alt?: string };
};

type Props = {
  journey: Journey;
  destinations: Destination[];
  relatedBlogs: RelatedBlog[];
};

/* ================= PORTABLE TEXT ================= */

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
  },
};

/* ================= COMPONENT ================= */

export default function JourneyClient({
  journey,
  destinations,
  relatedBlogs,
}: Props) {
  const [showWetu, setShowWetu] = useState(false);

  return (
    <>
      {/* DESTINATIONS */}
      {destinations.length > 0 && (
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-3 lg:gap-16">
            {/* LEFT: DESTINATIONS */}
            <div className="lg:col-span-2 space-y-14">
              {destinations.map((dest) => (
                <article
                  key={dest.slug.current}
                  className="bg-[#E8DCC8] rounded-2xl p-10 md:p-12 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{dest.title}</h3>

                      {dest.didYouKnowText && (
                        <p className="text-gray-700 mb-4">
                          {dest.didYouKnowText}
                        </p>
                      )}

                      {dest.travelInfo && (
                        <div className="prose prose-lg max-w-none">
                          <PortableText
                            value={dest.travelInfo}
                            components={components}
                          />
                        </div>
                      )}

                      <Link
                        href={`/destination/${dest.slug.current}/`}
                        className="inline-block mt-4 font-semibold text-[#8A6F3D] hover:underline"
                      >
                        Explore {dest.title} safaris →
                      </Link>
                    </div>

                    {dest.flagImage?.asset?.url && (
                      <div className="w-full md:w-[200px] flex-shrink-0">
                        <Image
                          src={dest.flagImage.asset.url}
                          alt={dest.title}
                          width={200}
                          height={150}
                          className="rounded-xl object-cover w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* RIGHT: STICKY BLOG COLUMN */}
            {relatedBlogs.length > 0 && (
              <aside className="lg:col-span-1 mt-16 lg:mt-0">
                <div className="lg:sticky lg:top-28 space-y-8">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {journey.countries?.length === 1
                      ? `${journey.countries[0].title} Travel Journal`
                      : journey.countries?.length === 2
                        ? `${journey.countries[0].title} & ${journey.countries[1].title} Travel Journal`
                        : "Safari Travel Journal"}
                  </h3>

                  <div className="space-y-6">
                    {relatedBlogs.slice(0, 10).map((blog) => {
                      const slug =
                        typeof blog.slug === "string"
                          ? blog.slug
                          : blog.slug?.current;

                      return (
                        <Link
                          key={blog._id}
                          href={`/blog/${slug}`}
                          className="flex gap-4 group"
                        >
                          {blog.coverImage?.asset?.url && (
                            <Image
                              src={blog.coverImage.asset.url}
                              alt={blog.coverImage.alt || blog.title}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover shrink-0 group-hover:opacity-90 transition"
                            />
                          )}

                          <div className="flex flex-col">
                            <span className="text-sm font-semibold group-hover:text-[#8A6F3D] transition">
                              {blog.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Read guide →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {/* WETU MODAL */}
      {showWetu && journey.wetuLink && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70"
          onClick={() => setShowWetu(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-[100vw] md:w-[80vw] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f2e7db]">
              <span className="text-sm font-semibold">
                {journey.title} – Full Itinerary
              </span>
              <button
                onClick={() => setShowWetu(false)}
                className="text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <iframe
              src={journey.wetuLink}
              className="w-full h-[calc(100%-56px)]"
              style={{ border: "none" }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* CUSTOM SAFARI CTA */}
      <section className="bg-[#E5D5B8] border-t border-black/10 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Didn’t find exactly what you’re looking for?
          </h2>
          <p className="text-base md:text-lg text-black/80">
            We specialize in tailor-made safari experiences. Whether you want
            something more private, luxurious, adventurous, or family-friendly —
            we’re here to craft your perfect journey.
          </p>
          <a
            href="mailto:books@fairtradesafaris.com"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-[#333]"
          >
            Request a Custom Safari
          </a>
        </div>
      </section>
    </>
  );
}
