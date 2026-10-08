// africansafariitineraries/[slug]/layout.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity";
import { ogImageUrl } from "@/lib/seoDefaults";

// Batch 4: when a journey has no metaDescription/aiSummary, build a specific
// ~155-character description from fields it already has (summary, duration,
// destinations/countries, price) instead of "Safari itinerary for <title>".
function buildJourneyDescription(d: {
  title?: string;
  summary?: string;
  duration?: string;
  price?: number;
  countries?: (string | null)[];
  destinations?: (string | null)[];
}): string {
  const MAX = 155;
  const clip = (s: string) => {
    if (s.length <= MAX) return s;
    const cut = s.slice(0, MAX - 1);
    return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.\-–—]+$/, "")}…`;
  };
  const places = [
    ...new Set([...(d.destinations ?? []), ...(d.countries ?? [])]),
  ].filter((p): p is string => Boolean(p));
  const facts = [
    d.duration,
    places.length ? places.slice(0, 3).join(", ") : undefined,
    typeof d.price === "number"
      ? `from $${d.price.toLocaleString("en-US")} pp sharing`
      : undefined,
  ].filter(Boolean);
  const summary = (d.summary || "").replace(/\s+/g, " ").trim();

  if (summary) {
    // summary first; add the key facts if they fit
    const withFacts = facts.length
      ? `${summary.replace(/[.\s]+$/, "")}. ${facts.join(" · ")}.`
      : summary;
    return clip(withFacts.length <= MAX ? withFacts : summary);
  }
  return clip(
    `${d.title}: a private, locally guided safari${
      facts.length ? ` (${facts.join(", ")})` : ""
    }, planned by Fair Trade Safaris.`,
  );
}

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
      heroImage { asset->{url}, alt },
      summary,
      duration,
      price,
      "countries": countries[]->title,
      "destinations": destinations[]->title
    }`,
    { slug },
  );

  // Unknown itinerary -> real 404 (e.g. /africansafariitineraries/null/)
  if (!data) notFound();

  const title = data.metaTitle || `${data.title} | Fair Trade Safaris`;
  const description =
    data.metaDescription || data.aiSummary || buildJourneyDescription(data);
  // 1200x630 crop from Sanity's CDN, matching the declared og:image size
  const imageUrl = data.heroImage?.asset?.url
    ? ogImageUrl(data.heroImage.asset.url)
    : undefined;
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
  return <>{children}</>;
}
