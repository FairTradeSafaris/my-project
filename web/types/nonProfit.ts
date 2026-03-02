import type { PortableTextBlock } from "@portabletext/types";

export interface NonProfit {
  _id: string;
  name: string;
  mission?: string;
  slug?: {
    current: string;
  };
  logo?: string;
  description?: PortableTextBlock[]; // ✅ Properly typed now
  ctaLabel?: string;
  ctaLink?: string;
  website?: string;
  socials?: {
    platform: string;
    url: string;
    icon?: {
      asset: {
        url: string;
      };
    };
  }[];
}
