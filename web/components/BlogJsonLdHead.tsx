type Props = {
  slug: string;
  title: string;
  summary: string;
  coverImageUrl?: string;
  authorName?: string;
  publishedAt: string;
  updatedAt?: string;
  canonicalUrl?: string;
  structuredData?: string;
  nextPageUrl?: string; // 👈 NEW
  prevPageUrl?: string; // 👈 NEW
};

export default function BlogJsonLdHead({
  slug,
  title,
  summary,
  coverImageUrl,
  authorName,
  publishedAt,
  updatedAt,
  canonicalUrl,
  structuredData,
  nextPageUrl,
  prevPageUrl,
}: Props) {
  const fullUrl =
    canonicalUrl || `https://www.fairtradesafaris.com/blog/${slug}/`;
  const imageUrl =
    coverImageUrl || "https://www.fairtradesafaris.com/images/default-og.jpg";
  const author = authorName || "Fair Trade Safaris";
  const modifiedDate = updatedAt || publishedAt;

  const isCustom = structuredData?.trim()?.startsWith("{");

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    headline: title,
    description: summary,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Fair Trade Safaris",
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.sanity.io/images/jw971r14/production/409768aa62372bf184e9fdec62b4820f23958cfe-128x128.webp",
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedDate,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        item: "https://www.fairtradesafaris.com/blog/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: fullUrl,
      },
    ],
  };

  return (
    <>
      {/* SEO Pagination Links */}
      {prevPageUrl && <link rel="prev" href={prevPageUrl} />}
      {nextPageUrl && <link rel="next" href={nextPageUrl} />}

      {/* Structured Data Scripts */}
      {isCustom ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: structuredData?.trim() || "",
          }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(defaultSchema),
          }}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
