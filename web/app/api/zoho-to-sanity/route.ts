// /app/api/zoho-to-sanity/route.js
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse incoming data from Zoho webhook
    const data = await request.json();

    // Extract fields (adjust if your Zoho payload differs)
    const { email, file_url, file_name } = data;

    // 1. Download the file from Zoho (with your Zoho API token)
    const zohoAccessToken = process.env.ZOHO_ACCESS_TOKEN; // Store in Vercel env vars!
    const fileResp = await fetch(file_url, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken}` },
    });
    if (!fileResp.ok) throw new Error("Failed to fetch file from Zoho");
    const fileBuffer = await fileResp.arrayBuffer();

    // 2. Upload the file to Sanity
    const sanityToken = process.env.SANITY_API_TOKEN;
    const sanityProjectId = process.env.SANITY_PROJECT_ID;
    const sanityDataset = process.env.SANITY_DATASET;
    const sanityUploadResp = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2021-06-07/assets/files/${sanityDataset}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sanityToken}`,
        },
        body: fileBuffer,
      }
    );
    const sanityUploadResult = await sanityUploadResp.json();

    // 3. (Optional) Create/Update your Trip document here with Sanity API

    // Return a success response
    return new Response(
      JSON.stringify({ status: "ok", sanityFile: sanityUploadResult }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("API error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500 });
  }
}
