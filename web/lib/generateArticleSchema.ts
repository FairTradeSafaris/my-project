export interface ArticleSchemaInput {
  slug?: { current?: string };
  title: string;
  summary?: string | null;
  aiSummary?: string | null;
  metaDescription?: string | null;
  seoKeywords?: string[];
  coverImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  authorName?: string;
  authorUrl?: string;
  authorImage?: string;
  datePublished?: string;
  dateModified?: string;
  readingTime?: string | null;
  canonicalUrl?: string;
  structuredData?: string;
}

export function generateArticleSchema({
  slug,
  title,
  summary,
  aiSummary,
  metaDescription,
  seoKeywords,
  coverImage,
  authorName,
  authorUrl,
  authorImage,
  datePublished,
  dateModified,
  readingTime,
  canonicalUrl,
  structuredData,
}: ArticleSchemaInput) {
  if (structuredData) {
    try {
      return JSON.parse(structuredData);
    } catch {
      console.warn("Invalid JSON-LD override in Article document");
    }
  }

  const url = `https://www.fairtradesafaris.com/blog/${slug?.current || ""}`;
  const canonical = canonicalUrl || url;

  const imageObject = coverImage?.asset?.url
    ? {
        "@type": "ImageObject",
        url: coverImage.asset.url,
        width: 1200,
        height: 800,
        alternateName: coverImage.alt || title,
      }
    : undefined;

  const author = authorName
    ? {
        "@type": "Person",
        name: authorName,
        url: authorUrl || undefined,
        image: authorImage || undefined,
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: title,
        name: title,
        description: aiSummary || summary || metaDescription,
        keywords: seoKeywords?.join(", "),
        url: canonical,
        mainEntityOfPage: canonical,
        image: imageObject,
        author,
        datePublished: datePublished || undefined,
        dateModified: dateModified || datePublished || undefined,
        timeRequired: readingTime || undefined,
        publisher: {
          "@type": "Organization",
          name: "Fair Trade Safaris",
          url: "https://www.fairtradesafaris.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.fairtradesafaris.com/images/logo.png",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.fairtradesafaris.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.fairtradesafaris.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: canonical,
          },
        ],
      },
    ],
  };
}
