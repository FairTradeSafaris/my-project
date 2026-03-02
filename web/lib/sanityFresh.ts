import { createClient } from "@sanity/client";

export const freshClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false, // always fresh
});
