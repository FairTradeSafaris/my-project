import { createClient } from "@sanity/client";

// This ensures env is loaded even in server files
import dotenv from "dotenv";
dotenv.config();

export const serverClient = createClient({
  projectId: "jw971r14",
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Optional: test the token
export async function testSanityToken() {
  try {
    const url = `https://${serverClient.config().projectId}.api.sanity.io/${serverClient.config().apiVersion}/data/query/${serverClient.config().dataset}?query=*[_type=="comment"]`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
    });

    // Report only whether the token works; never log the token or data.
    console.log("Sanity token test status:", res.status);
  } catch (error) {
    console.error(
      "❌ Sanity token test failed:",
      error instanceof Error ? error.message : "unknown error"
    );
  }
}
