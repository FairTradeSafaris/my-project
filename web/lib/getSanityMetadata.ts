// lib/getSanityMetadata.ts
import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";

export async function getSanityMetadata(
  slug: string
): Promise<{ metadata: Metadata; structuredData?: object }> {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == $slug][0]{
      metaTitle,
      metaDescription,
      ogImage {
        asset->{url},
        alt
      },
      noIndex,
      structuredData
    }`,
    { slug }
  );

  const title =
    data?.metaTitle || "Fair Trade Safaris – Ethical Luxury Safari Travel";

  const description =
    data?.metaDescription ||
    "Explore ethical African safaris with heart, luxury, and purpose.";

  const ogImageUrl =
    data?.ogImage?.asset?.url ||
    "https://www.fairtradesafaris.com/images/default-og.jpg";

  const slugPath = slug === "home" ? "" : slug;

  // ✅ Parse structuredData safely
  let parsedStructuredData: object | undefined = undefined;
  if (data?.structuredData) {
    try {
      parsedStructuredData = JSON.parse(data.structuredData);
    } catch (e) {
      console.warn("Invalid JSON-LD in Sanity:", e);
    }
  }

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL("https://www.fairtradesafaris.com"),
    alternates: {
      canonical: `/${slugPath}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.fairtradesafaris.com/${slugPath}`,
      siteName: "Fair Trade Safaris",
      type: "website",
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
      index: !data?.noIndex,
      follow: true,
    },
  };

  return {
    metadata,
    structuredData: parsedStructuredData,
  };
}
