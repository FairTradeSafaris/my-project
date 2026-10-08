"use client";

// Batch 4: drop-in replacement for `next/image`.
// - Sanity images (cdn.sanity.io) get a loader that asks Sanity's own image
//   CDN for each srcset width, so they no longer go through /_next/image
//   (Vercel Image Optimization quota).
// - Everything else (local /public files, other hosts) is passed through
//   unchanged and keeps using the default next/image optimizer.
// Same props, same rendered markup apart from the image URLs.
// "use client" only because a loader function cannot be passed from a server
// component; next/image itself is already a client component.

import NextImage, { type ImageProps } from "next/image";
import { isSanityImage, sanityLoader } from "@/lib/sanityImageLoader";

export type { ImageProps };

export default function Image(props: ImageProps) {
  if (!props.loader && isSanityImage(props.src)) {
    // `unoptimized` was used on some Sanity images to avoid Vercel costs; it
    // served multi-MB originals. With the Sanity loader they get sized
    // versions instead.
    return <NextImage {...props} loader={sanityLoader} unoptimized={false} />;
  }
  return <NextImage {...props} />;
}
