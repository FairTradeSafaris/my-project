import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity";
import { resolveImage } from "@components/journey-finder/utils";
type MetadataDestination = {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
  canonicalUrl?: string;
  region?: string;
  mapLocation?: string;
  heroImage?: {
    image?: {
      asset?: {
        url?: string;
      };
    };
    alt?: string;
    galleryImage?: {
      image?: { asset?: { url?: string } };
      alt?: string;
    };
  };
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const data = (await client.fetch(
    `*[_type == "destination" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    metaTitle,
    metaDescription,
    aiSummary,
    canonicalUrl,
    region,
    mapLocation,
    // + galleryImage so OG images also resolve when the hero is a gallery reference
    heroImage{ image{asset->{url}}, alt, galleryImage->{ image{asset->{url}}, alt } },
  }`,
    { slug },
  )) as MetadataDestination | null;

  // Unknown destination -> real 404 instead of 200 + "not found" text
  if (!data) notFound();

  const image = resolveImage(data.heroImage);
  const title = data.metaTitle || `${data.title} | Fair Trade Safaris`;
  const description =
    data.metaDescription || data.aiSummary || `Travel to ${data.title}`;
  const canonicalUrl =
    data.canonicalUrl ||
    `https://www.fairtradesafaris.com/destination/${data.slug}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image?.url
        ? [{ url: image.url, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image?.url ? [image.url] : undefined,
    },
    // JSON-LD (TouristDestination, BreadcrumbList, FAQPage) is now rendered as
    // a real <script> in page.tsx; metadata.other only produced ignored <meta> tags.
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/layout.tsx is used ✅");
  return <>{children}</>;
}
