import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse incoming data from Zoho webhook
    const data = await request.json();
    const { file_url } = data;

    // Validate required fields
    if (!file_url) {
      return new Response(
        JSON.stringify({ error: "Missing file_url in request body." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check required environment variables
    const zohoAccessToken = process.env.ZOHO_ACCESS_TOKEN;
    const sanityToken = process.env.SANITY_API_TOKEN;
    const sanityProjectId = process.env.SANITY_PROJECT_ID;
    const sanityDataset = process.env.SANITY_DATASET;

    if (
      !zohoAccessToken ||
      !sanityToken ||
      !sanityProjectId ||
      !sanityDataset
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing one or more required environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 1. Download the file from Zoho (with your Zoho API token)
    const fileResp = await fetch(file_url, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken}` },
    });

    if (!fileResp.ok) {
      const zohoText = await fileResp.text().catch(() => "No body");
      const zohoErr = `Failed to fetch file from Zoho (status ${fileResp.status}): ${zohoText}`;
      console.error(zohoErr);
      return new Response(JSON.stringify({ error: zohoErr }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileBuffer = await fileResp.arrayBuffer();

    // 2. Upload the file to Sanity
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

    if (!sanityUploadResp.ok) {
      const sanityText = await sanityUploadResp.text().catch(() => "No body");
      const sanityErr = `Failed to upload file to Sanity (status ${sanityUploadResp.status}): ${sanityText}`;
      console.error(sanityErr);
      return new Response(JSON.stringify({ error: sanityErr }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sanityUploadResult = await sanityUploadResp.json();

    // Return a success response
    return new Response(
      JSON.stringify({ status: "ok", sanityFile: sanityUploadResult }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("API error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
