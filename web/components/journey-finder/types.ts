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
  interests?: string[]; // ✅ add this new field
}

export type Filters = {
  region: string;
  country: string[];
  star: string;
  types: string[];
  duration: [number, number];
  price: [number, number];
};

export type FilterOptions = {
  regions: string[];
  countries: string[];
  styles: string[];
  stars: string[];
  durations: number[];
  prices: number[];
};

export type FilterKey = keyof Filters;
