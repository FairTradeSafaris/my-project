// ✅ 2. sanity.server.ts (client config)
import { createClient } from "@sanity/client";

export const serverClient = createClient({
  projectId: "jw971r14", // your actual project ID
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
