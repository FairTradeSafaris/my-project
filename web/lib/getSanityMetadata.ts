import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";

export async function getSanityMetadata(slug: string): Promise<{
  metadata: Metadata;
  canonicalUrl?: string;
}> {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == $slug][0]{
      slug,
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

  // Fallback values
  const defaultTitle = "Fair Trade Safaris – Ethical Luxury Safari Travel";
  const defaultDescription =
    "Explore ethical African safaris with heart, luxury, and purpose.";
  const defaultOgImage =
    "https://www.fairtradesafaris.com/images/default-og.jpg";
  const slugPath = slug === "home" ? "" : slug;

  // 🧼 Strip any HTML tags that may have been entered in Sanity
  const stripTags = (input: string = "") =>
    input.replace(/<[^>]*>/g, "").trim();

  const title = stripTags(data?.metaTitle) || defaultTitle;
  const description = stripTags(data?.metaDescription) || defaultDescription;
  const ogImageUrl = data?.ogImage?.asset?.url || defaultOgImage;
  const canonical =
    data?.canonicalUrl || `https://www.fairtradesafaris.com/${slugPath}`;

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
      url: canonical,
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
    robots: data?.noIndex === true ? "noindex, nofollow" : "index, follow",
  };

  return {
    metadata,
    canonicalUrl: canonical,
  };
}
