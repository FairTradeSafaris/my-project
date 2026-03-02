// utils/generatePersonSchema.ts

export interface PersonSchemaInput {
  name: string;
  bio?: string | null;
  jobTitle?: string | null;
  image?: {
    asset?: { url?: string };
    alt?: string;
  };
  expertiseAreas?: string[];
  sameAs?: string[]; // LinkedIn, IG, website, etc.
  location?: string | null;
  canonicalUrl?: string; // optional profile page URL
  structuredData?: string; // override
}

export function generatePersonSchema({
  name,
  bio,
  jobTitle,
  image,
  expertiseAreas,
  sameAs,
  location,
  canonicalUrl,
  structuredData,
}: PersonSchemaInput) {
  // ---------------------------------------------------------
  // RAW JSON-LD OVERRIDE SUPPORT
  // ---------------------------------------------------------
  if (structuredData) {
    try {
      return JSON.parse(structuredData);
    } catch {
      console.warn("Invalid JSON-LD override in Person document");
    }
  }

  // ---------------------------------------------------------
  // IMAGE OBJECT
  // ---------------------------------------------------------
  const imageObject = image?.asset?.url
    ? {
        "@type": "ImageObject",
        url: image.asset.url,
        height: 600,
        width: 600,
        alternateName: image?.alt || name,
      }
    : undefined;

  // ---------------------------------------------------------
  // MAIN PERSON SCHEMA
  // ---------------------------------------------------------
  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: bio || undefined,
    jobTitle: jobTitle || undefined,
    image: imageObject,
    url: canonicalUrl || undefined,
    knowsAbout: expertiseAreas?.length ? expertiseAreas : undefined,
    sameAs: sameAs?.length ? sameAs : undefined,
  };

  // Add location only if provided
  if (location) {
    person.homeLocation = {
      "@type": "Place",
      name: location,
    };
  }

  return person;
}
