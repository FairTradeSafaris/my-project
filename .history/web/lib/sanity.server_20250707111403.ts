// ✅ 2. sanity.server.ts (client config)
import { createClient } from "@sanity/client";

export const serverClient = createClient({
  projectId: "jw971r14", // your actual project ID
  dataset: "production",
  apiVersion: "2023-01-01",
  token:
    "skihQA3UuWlkPYlS8Z3fspWXY6hHfsBWgdojSsKDEotus4nMVrdDJqIZWArZmImCuK9AfMkszpjlpl49Xet0RSH6y5JNXsEV2kmZNLj5TuPtNzhL87tWwdLqYLFlV9tgiXm5oIELuHXRfkcc9RlYQiSyXi0wivYPOpGlSk2fiQvYZBw8T0yR",
  useCdn: false,
});
