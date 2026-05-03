import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import type { Ambassador } from "@/types/ambassador";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Script from "next/script";
import Link from "next/link"; // ✅ Make sure this is imported at the top

// Sanity image builder
const builder = imageUrlBuilder(client);
const urlFor = (source: { asset: { _ref: string } }) =>
  builder.image(source).width(800).url();

// -----------------------------
// Generate Metadata
// -----------------------------
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data: {
    name: string;
    role: string;
    description: PortableTextBlock[];
    image: { asset: { _ref: string }; url: string };
    socials?: { platform: string; url: string }[];
  } | null = await client.fetch(
    groq`*[_type == "ambassador" && slug.current == $slug][0]{
      name, role, description, 
      "image": image.asset->{
        _ref,
        url
      },
      socials
    }`,
    { slug: params.slug },
  );

  if (!data) return {};

  const descriptionText =
    data.description?.[0]?.children
      .map((c) => ("text" in c ? c.text : ""))
      .join(" ")
      .slice(0, 200) || "";

  const imageUrl = data.image?.url;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.role,
    image: imageUrl,
    description: descriptionText,
    url: `https://www.fairtradesafaris.com/ambassadors/${params.slug}`,
    sameAs: data.socials?.map((s) => s.url).filter(Boolean),
  };

  const breadcrumbSchema = {
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
        name: "Ambassadors",
        item: "https://www.fairtradesafaris.com/ambassadors",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.name,
        item: `https://www.fairtradesafaris.com/ambassadors/${params.slug}`,
      },
    ],
  };

  return {
    title: `${data.name} | Fair Trade Safaris Ambassador`,
    description:
      descriptionText ||
      `Learn more about ${data.name}, one of our inspiring global ambassadors.`,
    openGraph: {
      title: `${data.name} | Fair Trade Safaris Ambassador`,
      description: descriptionText,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${data.name} profile image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} | Fair Trade Safaris`,
      description: descriptionText,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://www.fairtradesafaris.com/ambassadors/${params.slug}`, // ✅ Add this
    },
    // Also keep in metadata for crawlers that support it
    other: {
      "script:ld+json": JSON.stringify([personSchema, breadcrumbSchema]),
    },
  };
}

// -----------------------------
// Main Page
// -----------------------------
export default async function AmbassadorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const data: Ambassador | null = await client.fetch(
    groq`*[_type == "ambassador" && slug.current == $slug][0]{
      _id,
      name,
      role,
      description,
      ctaLabel,
      ctaLink,
      "image": image.asset,
      socials
    }`,
    { slug: params.slug },
  );

  if (!data) return notFound();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.role,
    image: data.image ? urlFor(data.image) : undefined,
    description:
      data.description?.[0]?.children
        .map((c) => ("text" in c ? c.text : ""))
        .join(" ")
        .slice(0, 300) || "",
    url: `https://www.fairtradesafaris.com/ambassadors/${params.slug}`,
    sameAs: data.socials?.map((s) => s.url).filter(Boolean),
  };

  const breadcrumbSchema = {
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
        name: "Ambassadors",
        item: "https://www.fairtradesafaris.com/ambassadors",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.name,
        item: `https://www.fairtradesafaris.com/ambassadors/${params.slug}`,
      },
    ],
  };

  const websiteUrl =
    data.socials?.find((s) => s.platform === "website")?.url || null;

  return (
    <>
      {/* ✅ Add structured data via <Script> to ensure Google sees it */}
      <Script
        id="ambassador-person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="ambassador-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-white text-black min-h-screen">
        {/* ================= HERO SECTION ================= */}
        {/* ================= HERO SECTION (Editorial Split) ================= */}
        <section className="w-full bg-[#f8f6f2]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center px-6 py-14">
            {/* Image */}
            {data.image && (
              <div className="relative w-full h-[440px] md:h-[520px] overflow-hidden rounded-2xl shadow-md">
                <img
                  src={urlFor(data.image)}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div>
              <p className="uppercase tracking-widest text-sm text-[#5a3e2b] mb-4">
                Fair Trade Safaris Ambassador
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-[#3c2a1e] mb-3 leading-snug">
                {data.name}
              </h1>

              {data.role && (
                <p className="text-lg text-gray-600 mb-6">{data.role}</p>
              )}

              <div className="w-16 h-[2px] bg-[#5a3e2b] mb-6" />

              <p className="text-gray-700 text-lg leading-relaxed">
                Discover the story, purpose, and passion behind this global
                advocate for ethical travel.
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTENT SECTION ================= */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/ambassadors/" className="hover:underline">
              Ambassadors
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">{data.name}</span>
          </nav>

          {/* Description */}
          <div className="prose prose-lg max-w-none text-gray-800 mb-12">
            <PortableText value={data.description} />
          </div>

          {/* Social Links */}
          {data.socials && data.socials.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <p className="uppercase tracking-widest text-xs text-gray-500 mb-6">
                Connect
              </p>

              <div className="flex gap-10 flex-wrap text-lg">
                {data.socials.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group text-[#3c2a1e] hover:text-black transition"
                  >
                    {s.platform
                      ? s.platform.charAt(0).toUpperCase() + s.platform.slice(1)
                      : "Link"}

                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#5a3e2b] transition-all group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* CTA */}
          {data.ctaLink && (
            <div className="mt-14">
              <a
                href={data.ctaLink}
                className="inline-flex items-center justify-center px-10 py-3 bg-[#5a3e2b] text-white rounded-full tracking-wide text-sm uppercase hover:bg-[#3a291e] transition"
              >
                {data.ctaLabel || "Learn More"}
              </a>
            </div>
          )}

          {/* Website Embed */}
          {websiteUrl && (
            <div className="mt-16">
              <h3 className="text-lg font-semibold mb-6">Official Website</h3>
              <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  src={websiteUrl}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
