export type SanityImage = {
  asset: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  alt?: string;
};

export type PortableTextBlock = {
  _type: "block";
  children: {
    _type: "span";
    text: string;
    marks?: string[];
  }[];
  markDefs?: {
    _key: string;
    _type: "link";
    href: string;
  }[];
  style?: string;
}[];

// Optional: Enum for stricter typing
export type ImageSize = "sm" | "md" | "lg" | "full";

// ✅ New: Content Block Hero (used in content[])
export type HeroBlock = {
  _type: "heroBlock";
  image?: {
    url?: string;
    alt?: string;
  };
  galleryImage?: {
    image: SanityImage;
    alt?: string;
    imageUrl?: string;
    imageId?: string;
  };
  text?: string;
  alignment?: string;
};

// ✅ Still valid: Optional top-level HeroImage (if still in use elsewhere)
export type HeroImageBlock = {
  _type: "heroImage";
  image?: SanityImage;
  galleryImage?: {
    image: SanityImage;
    alt?: string;
  };
  text?: string;
  alignment?: string;
};

export type TextImageBlock = {
  _type: "textImage";
  image?: SanityImage;
  galleryImage?: {
    image: SanityImage;
    alt?: string;
    imageUrl?: string;
  };
  text: PortableTextBlock;
  align?: "left" | "right";
  imageSize?: ImageSize;
  backgroundStyle?: "default" | "neutral";
};

export type QuoteBlock = {
  _type: "quoteBlock";
  quote: string;
  attribution?: string;
  backgroundStyle?: "default" | "neutral";
};

export type TextBlock = {
  _type: "textBlock";
  body: PortableTextBlock;
  backgroundStyle?: "default" | "neutral";
};

export type VideoEmbedBlock = {
  _type: "videoEmbed";
  url: string;
  caption?: string;
};

export type CtaBlock = {
  _type: "ctaBlock";
  headline: string;
  subtext: string;
  buttonText?: string;
  link?: string;
  backgroundColor?: { hex: string };
  buttonColor?: { hex: string };
  buttonBackground?: { hex: string };
};

export type MapBlock = {
  _type: "mapBlock";
  mapUrl: string;
};

export type ZohoFormBlock = {
  _type: "zohoForm";
  iframeUrl: string;
  height?: number;
};

export type GalleryBlock = {
  _type: "galleryBlock";
  images: SanityImage[];
};

export type SmartCarouselBlock = {
  _type: "smartCarousel";
  slides: {
    image: SanityImage;
    caption?: string;
    buttonText?: string;
    buttonLink?: string;
  }[];
};

export type TableBlock = {
  _type: "table";
  rows: {
    cells: string[];
  }[];
};

// ✅ Unified Block type for rendering
export type Block =
  | HeroBlock
  | HeroImageBlock
  | TextImageBlock
  | QuoteBlock
  | TextBlock
  | VideoEmbedBlock
  | CtaBlock
  | MapBlock
  | ZohoFormBlock
  | GalleryBlock
  | SmartCarouselBlock
  | TableBlock;
