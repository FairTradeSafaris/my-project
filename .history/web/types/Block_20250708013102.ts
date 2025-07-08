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

export type Block =
  | {
      _type: "heroImage";
      image: SanityImage;
      text?: string;
      alignment?: string;
    }
  | {
      _type: "textImage";
      image: SanityImage;
      text: PortableTextBlock;
      align?: "left" | "right";
    }
  | {
      _type: "quoteBlock";
      quote: string;
      attribution?: string;
    }
  | {
      _type: "textBlock";
      body: PortableTextBlock;
    }
  | {
      _type: "videoEmbed";
      url: string;
      caption?: string;
    }
  | {
      _type: "ctaBlock";
      headline: string;
      subtext: string;
      buttonText?: string;
      link?: string;
    }
  | {
      _type: "mapBlock";
      mapUrl: string;
    }
  | {
      _type: "zohoForm";
      iframeUrl: string;
      height?: number;
    }
  | {
      _type: "galleryBlock";
      images: SanityImage[];
    }
  | {
      _type: "smartCarousel";
      slides: {
        image: SanityImage;
        caption?: string;
        buttonText?: string;
        buttonLink?: string;
      }[];
    };
