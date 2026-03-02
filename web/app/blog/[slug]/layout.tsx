// blog/[slug]/layout.tsx

import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const data = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      metaTitle,
      metaDescription,
      publishedAt,
      canonicalUrl,
      heroImage { asset->{url}, alt },
      author->{ name }
    }`,
    { slug },
  );

  if (!data) {
    return {
      title: "Blog | Fair Trade Safaris",
      description: "Ethical travel insights and safari stories.",
    };
  }

  const title = data.metaTitle || `${data.title} | Fair Trade Safaris Blog`;
  const description =
    data.metaDescription || `Read: ${data.title} on ethical travel.`;
  const imageUrl = data.heroImage?.asset?.url;
  const canonicalUrl =
    data.canonicalUrl || `https://www.fairtradesafaris.com/blog/${data.slug}/`;
  const published = data.publishedAt || new Date().toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: published,
    author: {
      "@type": "Person",
      name: data.author?.name || "Fair Trade Safaris",
    },
    image: imageUrl,
    url: canonicalUrl,
    description,
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
      type: "article",
      publishedTime: published,
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
      "script:ld+json": JSON.stringify(articleSchema),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/blog layout used ✅");
  return <>{children}</>;
}
