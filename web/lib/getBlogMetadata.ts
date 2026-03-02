// lib/getBlogMetadata.ts

import { client } from "@/lib/sanity";
import type { Metadata } from "next";

export async function getBlogMetadata(slug: string): Promise<{
  metadata: Metadata;
  canonicalUrl?: string;
}> {
  const data = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      metaTitle,
      metaDescription,
      ogImage {
        asset->{url},
        alt
      },
      noIndex,
      canonicalUrl
    }`,
    { slug }
  );

  // Fallbacks
  const defaultTitle = "Fair Trade Safaris – Ethical Luxury Safari Travel";
  const defaultDescription =
    "Explore ethical African safaris with heart, luxury, and purpose.";
  const defaultOgImage =
    "https://www.fairtradesafaris.com/images/default-og.jpg";

  const title = data?.metaTitle || defaultTitle;
  const description = data?.metaDescription || defaultDescription;
  const ogImageUrl = data?.ogImage?.asset?.url || defaultOgImage;
  const canonical =
    data?.canonicalUrl || `https://www.fairtradesafaris.com/blog/${slug}`;

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL("https://www.fairtradesafaris.com"),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Fair Trade Safaris",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: data?.ogImage?.alt || "Safari adventure in Africa",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: data?.noIndex !== true,
      follow: true,
    },
  };

  return {
    metadata,
    canonicalUrl: canonical,
  };
}
