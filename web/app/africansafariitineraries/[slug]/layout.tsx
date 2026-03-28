// africansafariitineraries/[slug]/layout.tsx

import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await client.fetch(
    `*[_type == "journey" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      metaTitle,
      metaDescription,
      aiSummary,
      canonicalUrl,
      heroImage { asset->{url}, alt }
    }`,
    { slug },
  );

  if (!data) {
    return {
      title: "Safari Itinerary | Fair Trade Safaris",
      description: "Explore handcrafted African safari itineraries.",
    };
  }

  const title = data.metaTitle || `${data.title} | Fair Trade Safaris`;
  const description =
    data.metaDescription ||
    data.aiSummary ||
    `Safari itinerary for ${data.title}`;
  const imageUrl = data.heroImage?.asset?.url;
  const canonicalUrl =
    data.canonicalUrl ||
    `https://www.fairtradesafaris.com/africansafariitineraries/${data.slug}/`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: "en",
    primaryImageOfPage: imageUrl
      ? {
          "@type": "ImageObject",
          url: imageUrl,
        }
      : undefined,
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: data.title,
    description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: "Fair Trade Safaris",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

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
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    other: {
      "script:ld+json": JSON.stringify([webPageSchema, productSchema]),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/africansafariitineraries layout used ✅");
  return <>{children}</>;
}
