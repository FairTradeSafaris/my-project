import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";

/**
 * @param slug      the `sitePages` document slug in Sanity
 * @param routePath the public URL path of the page (e.g. "/videoTestimonial/").
 *                  Defaults to `/${slug}/`. Used for the canonical URL so the
 *                  canonical always points at a route that actually exists.
 */
export async function getSanityMetadata(
  slug: string,
  routePath?: string,
): Promise<{
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
  // NOTE: /images/default-og.jpg does not exist in /public — use a real image.
  const defaultOgImage =
    "https://www.fairtradesafaris.com/images/Serengeti-2-cheetahs-sitting-on-mound-1-scaled.jpg";
  const slugPath = slug === "home" ? "" : slug;
  // Always absolute + trailing slash (next.config has trailingSlash: true)
  const path =
    routePath ?? (slugPath ? `/${slugPath}/` : "/");

  // 🧼 Strip any HTML tags that may have been entered in Sanity
  const stripTags = (input: string = "") =>
    input.replace(/<[^>]*>/g, "").trim();

  const title = stripTags(data?.metaTitle) || defaultTitle;
  const description = stripTags(data?.metaDescription) || defaultDescription;
  const ogImageUrl = data?.ogImage?.asset?.url || defaultOgImage;
  const canonical =
    data?.canonicalUrl || `https://www.fairtradesafaris.com${path}`;

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL("https://www.fairtradesafaris.com"),
    alternates: {
      canonical,
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
