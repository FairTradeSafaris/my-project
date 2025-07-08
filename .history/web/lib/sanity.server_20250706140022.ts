// ✅ 2. sanity.server.ts (client config)
import { createClient } from "@sanity/client";

export const serverClient = createClient({
  projectId: "jw971r14", // your actual project ID
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// ✅ 3. Sanity Schema - comment.js
export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
    },
    {
      name: "comment",
      type: "text",
      title: "Comment",
    },
    {
      name: "approved",
      type: "boolean",
      title: "Approved",
      description: "Only approved comments are shown on the site",
    },
    {
      name: "post",
      type: "reference",
      to: [{ type: "blog" }],
    },
  ],
};
