// types/block.ts

export type SanityImage = {
  asset: {
    _ref?: string;
    _type?: string;
    url?: string; // ⬅ Add this line
  };
  alt?: string;
};

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
      text: string;
      align?: "left" | "right";
    }
  | {
      _type: "quoteBlock";
      quote: string;
      attribution?: string;
    }
  | {
      _type: "textBlock";
      body: { children: { text: string }[] }[];
    }
  | {
      _type: "videoEmbed";
      url: string;
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
        image: SanityImage; // required image object
        caption?: string; // optional caption text
        buttonText?: string; // optional button text
        buttonLink?: string; // optional button link URL
      }[];
    };
