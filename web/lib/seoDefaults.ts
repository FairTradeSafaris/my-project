// Batch 3a: site-wide default social image, used when a page (or its Sanity
// document) has no og:image of its own. Same image getSanityMetadata already
// falls back to; it exists in /public/images and returns 200.
export const DEFAULT_OG_IMAGE =
  "https://www.fairtradesafaris.com/images/Serengeti-2-cheetahs-sitting-on-mound-1-scaled.jpg";

// Sanity CDN originals can be several MB; ask the CDN for a 1200x630 JPEG
// (the standard social-card size). Non-Sanity URLs are returned unchanged.
export function ogImageUrl(url: string): string {
  return url.includes("cdn.sanity.io") && !url.includes("?")
    ? `${url}?w=1200&h=630&fit=crop&fm=jpg&q=80`
    : url;
}
