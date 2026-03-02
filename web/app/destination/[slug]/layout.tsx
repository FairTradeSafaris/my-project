import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import { resolveImage } from "@components/journey-finder/utils";
type MetadataDestination = {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
  canonicalUrl?: string;
  region?: string;
  mapLocation?: string;
  heroImage?: {
    image?: {
      asset?: {
        url?: string;
      };
    };
    alt?: string;
  };
  faqs?: {
    question: string;
    answer: {
      children?: { text?: string }[];
    }[];
  }[];
};
function portableTextToPlainText(
  blocks?: {
    children?: { text?: string }[];
  }[],
): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children
            .map((child) => child.text?.trim() || "")
            .filter(Boolean)
            .join(" ")
        : "",
    )
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const data = (await client.fetch(
    `*[_type == "destination" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    metaTitle,
    metaDescription,
    aiSummary,
    canonicalUrl,
    region,
    mapLocation,
    heroImage{ image{asset->{url}}, alt },

    "faqs": *[_type == "faqQuestion" && references(^._id)]
      | order(order asc){
        question,
        answer
      }
  }`,
    { slug },
  )) as MetadataDestination | null;

  if (!data) {
    return {
      title: "Not Found | Fair Trade Safaris",
      description: "Destination not found.",
    };
  }

  const image = resolveImage(data.heroImage);
  const title = data.metaTitle || `${data.title} | Fair Trade Safaris`;
  const description =
    data.metaDescription || data.aiSummary || `Travel to ${data.title}`;
  const canonicalUrl =
    data.canonicalUrl ||
    `https://www.fairtradesafaris.com/destination/${data.slug}/`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: "en",
    publisher: {
      "@id": "https://www.fairtradesafaris.com#organization",
    },
    primaryImageOfPage: image?.url
      ? {
          "@type": "ImageObject",
          url: image.url,
        }
      : undefined,
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${canonicalUrl}#destination`,
    name: data.title,
    description,
    url: canonicalUrl,
    image: image?.url,
    touristType: "Luxury Ethical Safari Travelers",
    publicAccess: true,
    containedInPlace: data.region
      ? {
          "@type": "AdministrativeArea",
          name: data.region,
        }
      : undefined,
    geo: data.mapLocation
      ? {
          "@type": "GeoCoordinates",
          name: data.title,
        }
      : undefined,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: "https://www.fairtradesafaris.com/destination/",
      },
      ...(data.region
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: data.region,
              item: `https://www.fairtradesafaris.com/destination/region/${data.region
                .toLowerCase()
                .replace(/\s+/g, "-")}/`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: data.region ? 4 : 3,
        name: data.title,
        item: canonicalUrl,
      },
    ],
  };
  const faqSchema =
    data.faqs && data.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: portableTextToPlainText(faq.answer),
            },
          })),
        }
      : null;
  const schemas = [webPageSchema, placeSchema];
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
      images: image?.url
        ? [{ url: image.url, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image?.url ? [image.url] : undefined,
    },
    other: {
      "script:ld+json": JSON.stringify(schemas),
      ...(breadcrumbSchema && {
        "script:ld+json:breadcrumb": JSON.stringify(breadcrumbSchema),
      }),
      ...(faqSchema && {
        "script:ld+json:faq": JSON.stringify(faqSchema),
      }),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("[slug]/layout.tsx is used ✅");
  return <>{children}</>;
}
