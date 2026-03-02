import type { PortableTextBlock } from "@portabletext/types";

// ─────────────────────────────────────────────────────────
// Journey Interface (with destination-level country fields)
// ─────────────────────────────────────────────────────────

export interface Journey {
  _id: string; // ✅ Required for wishlist reference

  title: string;
  summary: string;
  slug?: { current: string };
  duration?: string;
  price?: string;
  heroUrl?: string;
  alt?: string;
  ctaText?: string;
  wetuLink?: string;
  region?: { title: string };
  star?: string;
  starIcon?: string;
  featuredOnHome?: boolean;

  // ✅ NEW: Travel styles like "Honeymoon", "Family", etc.
  types?: string[];

  interests?: {
    title: string;
    category?: {
      title?: string;
    };
    isTopInterest?: boolean;
  }[];

  activities?: {
    title: string;
    isTopActivity?: boolean;
  }[];

  countries?: {
    title: string;
    flag?: string;
    travelInfo?: PortableTextBlock[] | null;
    highlights?: PortableTextBlock[] | null;
    practicalStuff?:
      | {
          title?: string;
          content?: PortableTextBlock[];
        }[]
      | null;
    mapLocation?: string | null;
  }[];

  destinations?: {
    title: string;
    region?: string;
    ranking?: number;
  }[];

  travelInfo?: PortableTextBlock[] | null;
  highlights?: PortableTextBlock[] | null;
  practicalStuff?:
    | {
        title?: string;
        content?: PortableTextBlock[];
      }[]
    | null;
  mapLocation?: string | null;
}

// ─────────────────────────────────────────────────────────
// Filters & Related Types
// ─────────────────────────────────────────────────────────

export type Filters = {
  region: string;
  country: string[]; // ✅ can rename to destination[] later if needed
  star: string[];
  signature: string[];
  style: string[];
  feature: string[];
  types: string[];
  duration: [number, number];
  price: [number, number];
};

export type FilterOptions = {
  regions: string[];
  countries: string[]; // ✅ can rename to destinations[] later if needed
  signature: string[];
  style: string[];
  feature: string[];
  stars: string[];
  durations: number[];
  prices: number[];
};

export type CollapsedMap = {
  region: boolean;
  country: boolean;
  star: boolean;
  duration: boolean;
  price: boolean;
  types: boolean;
  signature: boolean;
  style: boolean;
  feature: boolean;
};

// ─────────────────────────────────────────────────────────
// Destination (single country from a journey)
// ─────────────────────────────────────────────────────────

export type Destination = {
  title: string;
  image?: string | null;
  travelInfo?: PortableTextBlock[] | null;
  highlights?: PortableTextBlock[] | null;
  practicalStuff?:
    | {
        title?: string;
        content?: PortableTextBlock[];
      }[]
    | null;
  mapLocation?: string | null;
};

export type FilterKey = keyof Filters;
