// utils/generateSitePageSchema.ts

// ----------------------------------------------
// INPUT TYPE (strict, no implicit any)
// ----------------------------------------------
export interface SitePageSchemaInput {
  slug?: { current?: string };
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: {
    asset?: { url?: string };
    alt?: string;
  };
  pageType: string;
  aiSummary?: string;
  seoKeywords?: string[];
  faqItems?: { question: string; answer: string }[];
  articleAuthor?: string;
  datePublished?: string;
  videoUrl?: string;
  videoDuration?: string;
  reviewRating?: number;
  tourLocation?: string;
  tourDuration?: string;
  structuredData?: string;
}

// ----------------------------------------------
// MAIN FUNCTION
// ----------------------------------------------
export function generateSitePageSchema({
  slug,
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogImage,
  pageType,
  aiSummary,
  seoKeywords,
  faqItems,
  articleAuthor,
  datePublished,
  videoUrl,
  videoDuration,
  reviewRating,
  tourLocation,
  tourDuration,
  structuredData,
}: SitePageSchemaInput) {
  // ----------------------------------------------
  // Allow override of entire JSON-LD
  // ----------------------------------------------
  if (structuredData) {
    try {
      return JSON.parse(structuredData);
    } catch {
      console.warn("Invalid JSON-LD override in Sanity");
    }
  }

  // ----------------------------------------------
  // BASE URL + Canonical Logic
  // ----------------------------------------------
  const url = `https://www.fairtradesafaris.com/${slug?.current || ""}`;
  const canonical = canonicalUrl || url;

  // ----------------------------------------------
  // Image Object
  // ----------------------------------------------
  const imageObject = ogImage?.asset?.url
    ? {
        "@type": "ImageObject",
        url: ogImage.asset.url,
        height: 630,
        width: 1200,
        alternateName: ogImage.alt || metaTitle,
      }
    : undefined;

  // ----------------------------------------------
  // Breadcrumbs
  // ----------------------------------------------
  const breadcrumbs = {
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
        name: metaTitle,
        item: canonical,
      },
    ],
  };

  // ----------------------------------------------
  // BASE SCHEMA (Shared across all page types)
  // ----------------------------------------------
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    name: metaTitle,
    description: aiSummary || metaDescription,
    url: canonical,
    breadcrumb: breadcrumbs,
    isPartOf: {
      "@type": "WebSite",
      name: "Fair Trade Safaris",
      url: "https://www.fairtradesafaris.com",
    },
    image: imageObject,
    keywords: seoKeywords?.join(", "),
  };

  // ----------------------------------------------
  // PAGE TYPE ROUTING
  // ----------------------------------------------
  switch (pageType) {
    // Standard Web Page
    case "webPage":
      return {
        ...base,
        "@type": "WebPage",
      };

    // About Page
    case "about":
      return {
        ...base,
        "@type": "AboutPage",
      };

    // Contact Page
    case "contact":
      return {
        ...base,
        "@type": "ContactPage",
      };

    // FAQ Page
    case "faq":
      return {
        ...base,
        "@type": "FAQPage",
        mainEntity: faqItems?.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };

    // Article / Blog Post
    case "article":
      return {
        ...base,
        "@type": "Article",
        datePublished: datePublished || undefined,
        author: articleAuthor
          ? { "@type": "Person", name: articleAuthor }
          : undefined,
      };

    // Video Page
    case "video":
      return {
        ...base,
        "@type": "VideoObject",
        contentUrl: videoUrl,
        uploadDate: datePublished || undefined,
        duration: videoDuration || undefined,
      };

    // Review Page
    case "review":
      return {
        ...base,
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: reviewRating || 5,
          bestRating: 5,
        },
      };

    // Tour / Safari Page
    case "tour":
      return {
        ...base,
        "@type": "TouristTrip",
        touristType: "Safari Traveler",
        itinerary: tourDuration,
        arrivalLocation: tourLocation
          ? { "@type": "Place", name: tourLocation }
          : undefined,
      };

    // Location Page (Placeholder — destinations use their own generator)
    case "location":
      return {
        ...base,
        "@type": "WebPage",
        additionalType: "TouristDestination",
      };

    // Collection Page
    case "collection":
      return {
        ...base,
        "@type": "CollectionPage",
      };

    // Fallback
    default:
      return {
        ...base,
        "@type": "WebPage",
      };
  }
}
