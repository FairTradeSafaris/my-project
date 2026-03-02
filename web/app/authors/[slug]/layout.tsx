// authors/[slug]/layout.tsx

import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const data = await client.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      name,
      "slug": slug.current,
      metaTitle,
      metaDescription,
      bio,
      image { asset->{url}, alt }
    }`,
    { slug },
  );

  if (!data) {
    return {
      title: "Author | Fair Trade Safaris",
      description: "Meet our expert travel writers and storytellers.",
    };
  }

  const title = data.metaTitle || `${data.name} | Fair Trade Safaris`;
  const description = data.metaDescription || data.bio || `About ${data.name}`;
  const imageUrl = data.image?.asset?.url;
  const canonicalUrl = `https://www.fairtradesafaris.com/authors/${data.slug}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${canonicalUrl}#profile`,
    url: canonicalUrl,
    name: title,
    description,
    primaryImageOfPage: imageUrl
      ? {
          "@type": "ImageObject",
          url: imageUrl,
        }
      : undefined,
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
      "script:ld+json": JSON.stringify(webPageSchema),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/authors layout is used ✅");
  return <>{children}</>;
}
