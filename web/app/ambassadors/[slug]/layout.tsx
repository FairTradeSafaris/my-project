// ambassadors/[slug]/layout.tsx

import type { Metadata } from "next";
import { client } from "@/lib/sanity";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const data = await client.fetch(
    `*[_type == "ambassador" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      metaTitle,
      metaDescription,
      canonicalUrl,
      profileImage { asset->{url}, alt },
    }`,
    { slug },
  );

  if (!data) {
    return {
      title: "Ambassador | Fair Trade Safaris",
      description: "Ambassador not found.",
    };
  }

  const title = data.metaTitle || `${data.title} | FTS Ambassador`;
  const description =
    data.metaDescription ||
    `Meet ${data.title}, a passionate advocate for sustainable travel.`;
  const imageUrl = data.profileImage?.asset?.url;
  const canonicalUrl =
    data.canonicalUrl ||
    `https://www.fairtradesafaris.com/ambassadors/${data.slug}`;

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
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[ambassadors/slug]/layout.tsx ✅");
  return <>{children}</>;
}
