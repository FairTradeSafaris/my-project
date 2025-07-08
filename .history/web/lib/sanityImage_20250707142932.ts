import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "jw97ir14",
  dataset: "production",
  apiVersion: "2023-07-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Use the correct Sanity image type
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
