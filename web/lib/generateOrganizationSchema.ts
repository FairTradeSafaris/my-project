// utils/generateOrganizationSchema.ts

export interface OrganizationSchemaInput {
  name: string;
  mission?: string | null;
  description?: string | null;

  logo?: {
    asset?: { url?: string };
    alt?: string;
  };

  website?: string | null;

  socials?: {
    platform?: string;
    url?: string;
  }[];

  slug?: { current?: string };

  featured?: boolean;

  canonicalUrl?: string;
  location?: string | null;

  structuredData?: string;
}

export function generateOrganizationSchema({
  name,
  mission,
  description,
  logo,
  website,
  socials,
  slug,
  featured,
  canonicalUrl,
  location,
  structuredData,
}: OrganizationSchemaInput) {
  // ---------------------------------------------------------
  // OVERRIDE SUPPORT — power editor mode
  // ---------------------------------------------------------
  if (structuredData) {
    try {
      return JSON.parse(structuredData);
    } catch {
      console.warn("Invalid JSON-LD override in Organization document");
    }
  }

  // ---------------------------------------------------------
  // URL / Canonical
  // ---------------------------------------------------------
  const url = `https://www.fairtradesafaris.com/nonprofits/${slug?.current || ""}`;
  const canonical = canonicalUrl || website || url;

  // ---------------------------------------------------------
  // Logo Object
  // ---------------------------------------------------------
  const fallbackLogoUrl =
    "https://cdn.sanity.io/images/jw971r14/production/99ea4cdf517ef9e17832aeb98220b47ed5e97a44-1200x630.png";

  const logoUrl = logo?.asset?.url || fallbackLogoUrl;

  const logoObject = {
    "@type": "ImageObject",
    url: logoUrl,
    width: 1200,
    height: 630,
    alternateName: logo?.alt || name,
  };

  // ---------------------------------------------------------
  // Social Profiles → sameAs
  // ---------------------------------------------------------
  const sameAs = socials?.map((s) => s.url).filter(Boolean);

  // ---------------------------------------------------------
  // Breadcrumbs
  // ---------------------------------------------------------
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
        name: "Non-Profit Partners",
        item: "https://www.fairtradesafaris.com/nonprofits",
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: canonical,
      },
    ],
  };

  // ---------------------------------------------------------
  // Main Organization Schema
  // ---------------------------------------------------------
  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: canonical,
    description: mission || description || undefined,
    logo: logoObject,
    image: logoUrl, // ✅ Added to fix missing "image" warning
    sameAs: sameAs?.length ? sameAs : undefined,
    breadcrumb: breadcrumbs,
  };

  // Optional location (city, region, or country)
  if (location) {
    organization.location = {
      "@type": "Place",
      name: location,
    };
  }

  // Optional “featured” — can map to award/notable status
  if (featured) {
    organization.award = "Featured Partner at Fair Trade Safaris";
  }

  return organization;
}
