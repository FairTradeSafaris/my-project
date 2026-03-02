import type { PortableTextBlock } from "@portabletext/types";

export type Platform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "linkedin"
  | "twitter"
  | "tiktok"
  | "website";

export interface Ambassador {
  _id: string;
  name: string;
  role: string;

  // ✅ NEW — required for /ambassadors/[slug]
  slug: {
    current: string;
  };

  description: PortableTextBlock[];
  ctaLabel: string;
  ctaLink: string;

  image: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };

  socials?: {
    platform: Platform;
    url: string;
    icon?: {
      asset: {
        _ref: string;
        _type: "reference";
      };
    };
  }[];
}
