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
