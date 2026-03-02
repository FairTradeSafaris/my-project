import type { ImageOrGallery } from "@/types/types"; // or relative import like ../../types/types

export const parseDurationDays = (d?: string) => {
  const m = d?.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

export const parsePriceNumber = (p: unknown): number => {
  if (typeof p === "number") return p;

  if (typeof p === "string") {
    const n = p.replace(/[^\d.]/g, "");
    const num = parseFloat(n);
    return isNaN(num) ? 0 : num;
  }

  return 0;
};

export const formatMoney = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

// Safe range clamp: keeps sliders valid across country changes
export const clampRange = (
  value: [number, number],
  bounds: [number, number],
): [number, number] => {
  const [minB, maxB] = bounds;
  let [minV, maxV] = value;
  minV = Math.max(minV, minB);
  maxV = Math.min(maxV, maxB);
  return minV > maxV ? [minB, maxB] : [minV, maxV];
};

// Resolve image from either upload or gallery ref
export function resolveImage(imageOrGallery?: ImageOrGallery): {
  url?: string;
  alt?: string;
  caption?: string;
  credit?: string;
} {
  if (!imageOrGallery) return {};

  // Case: direct image upload
  if (imageOrGallery.image?.asset?.url) {
    return {
      url: imageOrGallery.image.asset.url,
      alt: imageOrGallery.image.alt || "",
    };
  }

  // Case: image from referenced gallery
  if (imageOrGallery.galleryImage?.image?.asset?.url) {
    return {
      url: imageOrGallery.galleryImage.image.asset.url,
      alt: imageOrGallery.galleryImage.alt || "",
      caption: imageOrGallery.galleryImage.caption,
      credit: imageOrGallery.galleryImage.credit,
    };
  }

  return {};
}
