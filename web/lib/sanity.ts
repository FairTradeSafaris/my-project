import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "jw971r14", // ✅ Your real project ID
  dataset: "production", // ✅ Your actual dataset
  apiVersion: "2023-01-01", // Or the date your schema was last updated
  useCdn: false, // Optional: Use CDN for faster reads
});

export default sanityClient;
