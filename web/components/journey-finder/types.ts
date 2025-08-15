export interface Journey {
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
  countries?: { title: string; flag?: string }[];
  star?: string;
  starIcon?: string;
  featuredOnHome?: boolean;
  interests?: {
    title: string;
    category: string;
    isTopInterest?: boolean;
  }[]; // ✅ fully typed interest object
}

export type Filters = {
  region: string;
  country: string[];
  star: string[];
  signature: string[];
  style: string[];
  feature: string[];
  types: string[]; // ✅ ADD THIS LINE
  duration: [number, number];
  price: [number, number];
};

export type FilterOptions = {
  regions: string[];
  countries: string[];
  signature: string[];
  style: string[];
  feature: string[];
  stars: string[];
  durations: number[];
  prices: number[];
};

export type FilterKey = keyof Filters;
