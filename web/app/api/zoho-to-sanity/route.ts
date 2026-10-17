import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  hostOf,
  isAllowedZohoFileUrl,
  zohoSecretOk,
} from "@/lib/server/zohoWebhook";

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
    { method: "POST" },
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

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request: NextRequest) {
  // 🔐 Optional shared secret (enforced only when ZOHO_WEBHOOK_SECRET is set)
  if (!zohoSecretOk(request, "zoho-to-sanity")) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    const data = await request.json();
    const { email, file_url, file_name, title, startDate, endDate } = data;

    if (!email || !file_url || !title) {
      return json(
        { error: "Missing required fields: email, file_url, or title" },
        400,
      );
    }

    // 🔐 Only download from Zoho (the Zoho OAuth token is sent with it)
    if (!isAllowedZohoFileUrl(file_url)) {
      console.warn("[zoho-to-sanity] rejected file_url host:", hostOf(file_url));
      return json({ error: "file_url must be a Zoho https URL" }, 400);
    }

    const sanityToken = process.env.SANITY_API_TOKEN!;
    const sanityProjectId = process.env.SANITY_PROJECT_ID!;
    const sanityDataset = process.env.SANITY_DATASET!;
    const mutateUrl = `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/mutate/${sanityDataset}`;

    const zohoAccessToken = await getAccessToken();

    // ⬇️ 1. Download the new file from Zoho FIRST.
    // If this fails, nothing in Sanity is touched (existing documents stay).
    const fileResp = await fetch(file_url, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken}` },
    });

    if (!fileResp.ok) {
      throw new Error(`Failed to fetch file from Zoho (${fileResp.status})`);
    }

    const fileBuffer = await fileResp.arrayBuffer();

    // 🔍 2. Look up trip by clientEmail AND title
    const query = `*[_type == "trip" && clientEmail == $email && title == $title][0]{_id}`;
    const sanityQueryUrl = `https://${sanityProjectId}.api.sanity.io/v2021-06-07/data/query/${sanityDataset}?query=${encodeURIComponent(
      query,
    )}&$email=${encodeURIComponent(JSON.stringify(email))}&$title=${encodeURIComponent(JSON.stringify(title))}`;

    const sanityQueryResp = await fetch(sanityQueryUrl, {
      headers: { Authorization: `Bearer ${sanityToken}` },
    });

    if (!sanityQueryResp.ok) {
      throw new Error(`Sanity query failed (${sanityQueryResp.status})`);
    }

    const sanityQueryResult = await sanityQueryResp.json();
    let tripId = sanityQueryResult.result?._id;

    // 🆕 3. Create trip if not found
    if (!tripId) {
      const createDoc = {
        _type: "trip",
        clientEmail: email,
        title,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        documents: [],
      };

      const createResp = await fetch(mutateUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sanityToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mutations: [{ create: createDoc }],
          returnIds: true,
        }),
      });

      if (!createResp.ok) {
        throw new Error(`Failed to create Trip doc (${createResp.status})`);
      }

      const createResult = await createResp.json();
      tripId = createResult.results[0].id;
    }

    // ⬆️ 4. Upload file to Sanity assets
    const uploadResp = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2021-06-07/assets/files/${sanityDataset}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${sanityToken}` },
        body: fileBuffer,
      },
    );

    if (!uploadResp.ok) {
      throw new Error(`Failed to upload file to Sanity (${uploadResp.status})`);
    }

    const uploadResult = await uploadResp.json();
    const assetId = uploadResult.document._id;

    // 🔁 5. Replace the documents list with the new file in ONE mutation
    // (Zoho is source of truth). Previously the list was cleared before the
    // download, so a failed download left the client with no documents.
    const patchResp = await fetch(mutateUrl, {
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
              set: {
                documents: [
                  {
                    _key: randomUUID().replace(/-/g, "").slice(0, 12),
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
    });

    if (!patchResp.ok) {
      throw new Error(`Failed to patch Trip doc (${patchResp.status})`);
    }

    return json({ status: "ok", tripId, assetId });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[zoho-to-sanity] error:", errorMsg);
    return json({ error: "Zoho to Sanity sync failed" }, 500);
  }
}
