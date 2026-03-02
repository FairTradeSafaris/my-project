import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function refreshAccessToken() {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`,
    { method: "POST" },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const json = await res.json();
  cachedAccessToken = json.access_token;
  tokenExpiresAt = Date.now() + (json.expires_in - 300) * 1000;
  return cachedAccessToken;
}

async function getZohoToken() {
  if (!cachedAccessToken || Date.now() > tokenExpiresAt) {
    return refreshAccessToken();
  }
  return cachedAccessToken;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("📥 Zoho payload:", data);

    const {
      email,
      file_url,
      file_name,
      title,
      startDate,
      endDate,
      firstName,
      lastName,
      dealId,
    } = data;

    if (!email || !file_url || !title) {
      return NextResponse.json(
        { error: "Missing email, file_url or title" },
        { status: 400 },
      );
    }

    const sanityToken = process.env.SANITY_API_TOKEN!;
    const projectId = process.env.SANITY_PROJECT_ID!;
    const dataset = process.env.SANITY_DATASET!;

    // 🔍 1. FIND TRIP
    const query = `*[_type=="trip" && clientEmail==$email][0]{_id}`;
    const queryUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=${encodeURIComponent(
      query,
    )}&$email="${email}"`;

    const queryRes = await fetch(queryUrl, {
      headers: { Authorization: `Bearer ${sanityToken}` },
    });

    const queryJson = await queryRes.json();
    let tripId = queryJson.result?._id;

    console.log("🔍 Found trip:", tripId ?? "NONE");

    // 🆕 2. CREATE TRIP IF MISSING
    if (!tripId) {
      const createRes = await fetch(
        `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sanityToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mutations: [
              {
                create: {
                  _type: "trip",
                  clientEmail: email,
                  title,
                  startDate,
                  endDate,
                  documents: [],
                },
              },
            ],
            returnIds: true,
          }),
        },
      );

      const createJson = await createRes.json();
      tripId = createJson.results?.[0]?.id;

      console.log("🆕 Created trip:", tripId);
    }

    // 🔐 3. CLERK USER SYNC
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const existingUsers = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (existingUsers.data.length > 0) {
      const user = existingUsers.data[0];

      await clerk.users.updateUser(user.id, {
        publicMetadata: {
          tripId,
          zohoDealId: dealId || null,
        },
      });

      console.log("🔁 Updated existing Clerk user");
    } else {
      await clerk.users.createUser({
        emailAddress: [email],
        firstName: firstName || "",
        lastName: lastName || "",
        publicMetadata: {
          tripId,
          zohoDealId: dealId || null,
        },
        skipPasswordRequirement: true,
      });

      console.log("🆕 Created new Clerk user");
    }

    // ⬇️ 4. DOWNLOAD FILE FROM ZOHO
    const zohoToken = await getZohoToken();

    const fileRes = await fetch(file_url, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` },
    });

    const fileBuffer = await fileRes.arrayBuffer();

    // ⬆️ 5. UPLOAD FILE TO SANITY
    const uploadRes = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/assets/files/${dataset}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${sanityToken}` },
        body: fileBuffer,
      },
    );

    const uploadJson = await uploadRes.json();
    const assetId = uploadJson.document._id;

    // 🧩 6. PATCH TRIP
    await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
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
                      label: "other",
                      originalFilename: file_name,
                      file: {
                        _type: "file",
                        asset: { _type: "reference", _ref: assetId },
                      },
                    },
                  ],
                },
              },
            },
          ],
        }),
      },
    );

    return NextResponse.json({ success: true, tripId, assetId });
  } catch (err) {
    console.error("❌ Zoho webhook failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
