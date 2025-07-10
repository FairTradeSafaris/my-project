// types.ts

import type { PortableTextBlock } from "@portabletext/types";

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
