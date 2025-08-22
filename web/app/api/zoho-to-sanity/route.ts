import { NextRequest } from "next/server";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

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
    { method: "POST" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh Zoho token: ${text}`);
  }

  const json = await res.json();
  cachedAccessToken = json.access_token;
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
    const data = await request.json();
    const { email, file_url, file_name, title, startDate, endDate } = data;

    if (!email || !file_url || !title) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email, file_url, or title",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sanityToken = process.env.SANITY_API_TOKEN!;
    const sanityProjectId = process.env.SANITY_PROJECT_ID!;
    const sanityDataset = process.env.SANITY_DATASET!;

    const zohoAccessToken = await getAccessToken();

    // Look up trip by clientEmail AND title
    const query = `*[_type == "trip" && clientEmail == $email && title == $title][0]{_id}`;
    const sanityQueryUrl = `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/query/${sanityDataset}?query=${encodeURIComponent(
      query
    )}&$email="${encodeURIComponent(email)}"&$title="${encodeURIComponent(title)}"`;

    const sanityQueryResp = await fetch(sanityQueryUrl, {
      headers: { Authorization: `Bearer ${sanityToken}` },
    });

    if (!sanityQueryResp.ok) {
      const text = await sanityQueryResp.text();
      throw new Error(`Sanity query failed: ${text}`);
    }

    const sanityQueryResult = await sanityQueryResp.json();
    let tripId = sanityQueryResult.result?._id;

    // Create trip if not found
    if (!tripId) {
      const createDoc = {
        _type: "trip",
        clientEmail: email,
        title,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        documents: [],
      };

      const createResp = await fetch(
        `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/mutate/${sanityDataset}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sanityToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mutations: [{ create: createDoc }],
            returnIds: true,
          }),
        }
      );

      if (!createResp.ok) {
        const text = await createResp.text();
        throw new Error(`Failed to create Trip doc: ${text}`);
      }

      const createResult = await createResp.json();
      tripId = createResult.results[0].id;
    }

    // Download file from Zoho
    const fileResp = await fetch(file_url, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken}` },
    });

    if (!fileResp.ok) {
      const text = await fileResp.text().catch(() => "No body");
      throw new Error(`Failed to fetch file from Zoho: ${text}`);
    }

    const fileBuffer = await fileResp.arrayBuffer();

    // Upload file to Sanity assets
    const uploadResp = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2021-06-07/assets/files/${sanityDataset}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${sanityToken}` },
        body: fileBuffer,
      }
    );

    if (!uploadResp.ok) {
      const text = await uploadResp.text().catch(() => "No body");
      throw new Error(`Failed to upload file to Sanity: ${text}`);
    }

    const uploadResult = await uploadResp.json();
    const assetId = uploadResult.document._id;

    // Patch trip to add file to `documents[]`
    const patchResp = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/mutate/${sanityDataset}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sanityToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: tripId,
                setIfMissing: { documents: [] },
                insert: {
                  after: "documents[-1]",
                  items: [
                    {
                      _type: "object",
                      label: "other",
                      file: {
                        _type: "file",
                        asset: {
                          _type: "reference",
                          _ref: assetId,
                        },
                      },
                      originalFilename: file_name || "unknown.pdf",
                    },
                  ],
                },
              },
            },
          ],
        }),
      }
    );

    if (!patchResp.ok) {
      const text = await patchResp.text();
      throw new Error(`Failed to patch Trip doc: ${text}`);
    }

    return new Response(JSON.stringify({ status: "ok", tripId, assetId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("API error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500 });
  }
}
