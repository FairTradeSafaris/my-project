// Batch 4: serve Sanity images straight from Sanity's image CDN.
//
// cdn.sanity.io resizes and converts on the fly (w, h, q, auto=format, fit),
// so Sanity images no longer need Vercel's image optimizer (/_next/image),
// which was close to the plan's monthly transformation / cache-read limits.
// Local /public images and other hosts keep using the default next/image
// optimizer (see components/SanityImage.tsx).

const SANITY_CDN = "cdn.sanity.io";

export function isSanityImage(src: unknown): src is string {
  return (
    typeof src === "string" &&
    src.includes(`${SANITY_CDN}/images/`) &&
    // SVGs are vectors: Sanity serves them as-is, nothing to resize
    !src.split("?")[0].toLowerCase().endsWith(".svg")
  );
}

/** Original pixel size encoded in a Sanity asset URL (…-2400x1800.png). */
export function sanityDimensions(
  src?: string | null,
): { width: number; height: number } | undefined {
  if (!src) return undefined;
  const m = src.split("?")[0].match(/-(\d+)x(\d+)\.[a-z0-9]+$/i);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : undefined;
}

/**
 * next/image loader for Sanity URLs. Existing params (crop rect, hotspot,
 * fit, h from @sanity/image-url) are kept; w/q are set per srcset entry and
 * an existing h is scaled so the aspect ratio stays the same.
 */
export function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const [base, query = ""] = src.split("?");
  const params = new URLSearchParams(query);
  const oldW = Number(params.get("w"));
  const oldH = Number(params.get("h"));
  if (oldW > 0 && oldH > 0) {
    params.set("h", String(Math.round((oldH * width) / oldW)));
  }
  params.set("w", String(width));
  params.set("q", String(quality || 75));
  params.set("auto", "format");
  if (!params.has("fit")) params.set("fit", "max");
  return `${base}?${params.toString()}`;
}

/** Sized Sanity URL for a plain <img> or CSS background. */
export function sanitySized(
  src: string | undefined | null,
  width: number,
  quality = 70,
): string | undefined {
  if (!src) return undefined;
  return isSanityImage(src) ? sanityLoader({ src, width, quality }) : src;
}

/** srcSet string for a plain <img> (undefined for non-Sanity URLs). */
export function sanitySrcSet(
  src: string | undefined | null,
  widths: number[] = [480, 768, 1080, 1440, 1920],
  quality = 70,
): string | undefined {
  if (!src || !isSanityImage(src)) return undefined;
  return widths
    .map((w) => `${sanityLoader({ src, width: w, quality })} ${w}w`)
    .join(", ");
}
