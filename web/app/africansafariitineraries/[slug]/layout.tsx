// africansafariitineraries/[slug]/layout.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  // Unknown itinerary -> real 404 (e.g. /africansafariitineraries/null/)
  if (!data) notFound();

  const title = data.metaTitle || `${data.title} | Fair Trade Safaris`;
  const description =
    data.metaDescription ||
    data.aiSummary ||
    `Safari itinerary for ${data.title}`;
  const imageUrl = data.heroImage?.asset?.url;
  const canonicalUrl =
    data.canonicalUrl ||
    `https://www.fairtradesafaris.com/africansafariitineraries/${data.slug}/`;

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
    // JSON-LD (WebPage, TouristTrip, Product, BreadcrumbList) is rendered as a
    // real <script> in page.tsx; metadata.other only produced an ignored <meta>.
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/africansafariitineraries layout used ✅");
  return <>{children}</>;
}
