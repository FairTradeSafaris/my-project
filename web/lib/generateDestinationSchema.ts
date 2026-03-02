// utils/generateDestinationSchema.ts

export interface DestinationSchemaInput {
  slug?: { current?: string };
  title: string;
  metaDescription?: string;
  aiSummary?: string;
  seoKeywords?: string[];

  region?: string;
  heroImage?: {
    asset?: { url?: string };
    alt?: string;
  };

  gallery?: { asset?: { url: string } }[];

  geoLat?: number;
  geoLng?: number;

  canonicalUrl?: string;
  structuredData?: string;
}

export function generateDestinationSchema({
  slug,
  title,
  metaDescription,
  aiSummary,
  seoKeywords,

  region,
  heroImage,
  gallery,

  geoLat,
  geoLng,

  canonicalUrl,
  structuredData,
}: DestinationSchemaInput) {
  // --------------------------------------------------------------------
  // ALLOW RAW OVERRIDES (power user mode)
  // --------------------------------------------------------------------
  if (structuredData) {
    try {
      return JSON.parse(structuredData);
    } catch {
      console.warn("Invalid JSON-LD override in Destination document");
    }
  }

  // --------------------------------------------------------------------
  // URL + Canonical Logic
  // --------------------------------------------------------------------
  const url = `https://www.fairtradesafaris.com/${slug?.current || ""}`;
  const canonical = canonicalUrl || url;

  // --------------------------------------------------------------------
  // Image Logic (Hero image or gallery fallback)
  // --------------------------------------------------------------------
  const firstGalleryImage = gallery?.[0]?.asset?.url;

  const primaryImage =
    heroImage?.asset?.url || firstGalleryImage
      ? {
          "@type": "ImageObject",
          url: heroImage?.asset?.url || firstGalleryImage,
          width: 1200,
          height: 800,
          alternateName: heroImage?.alt || title,
        }
      : undefined;

  // --------------------------------------------------------------------
  // Breadcrumbs
  // --------------------------------------------------------------------
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
        name: "Destinations",
        item: "https://www.fairtradesafaris.com/destinations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonical,
      },
    ],
  };

  // --------------------------------------------------------------------
  // Place / TouristDestination Schema
  // --------------------------------------------------------------------
  const place: Record<string, unknown> = {
    "@type": ["Place", "TouristDestination"],
    name: title,
    description: aiSummary || metaDescription,
    url: canonical,
    image: primaryImage,
    geographicArea: region,
    breadcrumb: breadcrumbs,
    keywords: seoKeywords?.join(", "),
  };

  // Add geo coords when available
  if (geoLat && geoLng) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: geoLat,
      longitude: geoLng,
    };
  }

  // --------------------------------------------------------------------
  // WRAP IN A WEBPAGE CONTAINER (Best practice)
  // --------------------------------------------------------------------
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: aiSummary || metaDescription,
    url: canonical,
    breadcrumb: breadcrumbs,
    mainEntity: place,
    primaryImageOfPage: primaryImage,
  };
}
