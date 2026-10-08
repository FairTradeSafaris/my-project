// blog/tags/[tag]/layout.tsx

import type { Metadata } from "next";

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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: "en",
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
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: {
      "script:ld+json": JSON.stringify(webPageSchema),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[tag]/layout.tsx is used ✅");
  return <>{children}</>;
}
