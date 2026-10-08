// blog/tags/[tag]/layout.tsx

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

function tagSchema(slug: string) {
  const tag = decodeURIComponent(slug);
  const canonicalUrl = `https://www.fairtradesafaris.com/blog/tags/${encodeURIComponent(tag)}/`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: `${tag} Articles | Fair Trade Safaris Blog`,
    inLanguage: "en",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // folder is [slug] — `params.tag` was always undefined ("undefined Articles")
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  const title = `${tag} Articles | Fair Trade Safaris Blog`;
  const description = `Explore blog posts tagged with "${tag}" — expert insights, stories, and tips for ethical travel.`;
  const canonicalUrl = `https://www.fairtradesafaris.com/blog/tags/${encodeURIComponent(tag)}/`;

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
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    // JSON-LD is rendered by the Layout below (metadata.other => ignored <meta>)
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <JsonLd data={tagSchema(slug)} />
      {children}
    </>
  );
}
