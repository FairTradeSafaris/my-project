// types.ts

import type { PortableTextBlock } from "@portabletext/types";

// --- Founder's Promise Block ---
export type FoundersPromiseBlock = {
  headline: string;
  intro: PortableTextBlock[];
  safelist: string[];
  buttonText: string;
  buttonLink: string;
  backgroundImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  lineArtImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  textOnLeft?: boolean;
  impactContent?: {
    title: string;
    body: PortableTextBlock[];
    ctaText: string;
    ctaLink: string;
  };
};

// --- FAQ Types ---
export type FAQItem = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  keywords?: string[];
};

export type FAQCategory = {
  _id: string;
  title: string;
  items: FAQItem[];
};
// --- Journey Card Props ---
export type JourneyCardProps = {
  journeyId: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  alt?: string;
  price?: number | string;
  duration?: string;
  region?: string;
  destinations?: string[]; // ✅ NEW: Replace single country
  starIcon?: string;
  star?: number;
  isFeatured?: boolean;
  isWishlisted?: boolean;
  className?: string;
  slug: string;
};
export type ImageOrGallery = {
  image?: {
    asset?: {
      url?: string;
    };
    alt?: string;
  };
  galleryImage?: {
    image?: {
      asset?: {
        url?: string;
      };
    };
    alt?: string;
    caption?: string;
    credit?: string;
    license?: string;
    sourceUrl?: string;
  };
};
