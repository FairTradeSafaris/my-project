import { NextRequest } from "next/server";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0; // UNIX timestamp in ms

async function refreshAccessToken() {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh Zoho token: ${text}`);
  }

  const json = await res.json();
  cachedAccessToken = json.access_token;
  // Set expiry 5 minutes earlier than actual expiry as a buffer
  tokenExpiresAt = Date.now() + (json.expires_in - 300) * 1000;

  return cachedAccessToken;
}

async function getAccessToken() {
  if (!cachedAccessToken || Date.now() > tokenExpiresAt) {
    return await refreshAccessToken();
  }
  return cachedAccessToken;
}

export async function POST(request: NextRequest) {
  try {
    const requiredEnvVars = [
      "ZOHO_REFRESH_TOKEN",
      "ZOHO_CLIENT_ID",
      "ZOHO_CLIENT_SECRET",
      "SANITY_API_TOKEN",
      "SANITY_PROJECT_ID",
      "SANITY_DATASET",
    ];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
    if (missingVars.length > 0) {
      const msg = `Missing required environment variables: ${missingVars.join(", ")}`;
      console.error(msg);
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { file_url } = data;
    if (!file_url) {
      return new Response(
        JSON.stringify({ error: "Missing file_url in request body." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get fresh Zoho access token (auto-refresh if needed)
    const zohoAccessToken = await getAccessToken();

    // Download the file from Zoho
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

    // Upload file to Sanity
    const sanityToken = process.env.SANITY_API_TOKEN!;
    const sanityProjectId = process.env.SANITY_PROJECT_ID!;
    const sanityDataset = process.env.SANITY_DATASET!;

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
//xxxx
