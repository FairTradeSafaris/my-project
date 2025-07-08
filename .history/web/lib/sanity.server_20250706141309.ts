// ✅ 2. sanity.server.ts (client config)
import { createClient } from "@sanity/client";

export const serverClient = createClient({
  projectId: "jw971r14", // your actual project ID
  dataset: "production",
  apiVersion: "2023-01-01",
  token:
    "skUMyl4PrWjEndjuroqdtwGzsgx4fnO2800aLscVHkXFTl8hJoJBoYmXRPRdHkqmpOPi8p1ex0CXpOI1jMXZ8TtkgBISoH6NWLQcGuraFO17S6tMWYGBz7DqNs4k3kppNgfDIxInvWoMXrvxdw3Yq4mnFx64DXukTANfoYBy2qTzUCcOY9Dc",
  useCdn: false,
});
