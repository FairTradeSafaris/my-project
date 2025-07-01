import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// 🔧 Create client
export const client = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-01-01", // or today's date
  useCdn: false,
});

// 🔧 URL builder
const builder = imageUrlBuilder(client);

// 🔧 Helper for images
export const urlFor = (source: SanityImageSource) => builder.image(source);
