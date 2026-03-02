import { NextResponse } from "next/server";

let accessToken = process.env.ZOHO_ACCESS_TOKEN!;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;
const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

// Function to refresh Zoho access token
async function refreshAccessToken() {
  console.log("🔄 Refreshing Zoho access token...");

  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  console.log("🔐 Refreshed Access Token:", data.access_token);

  accessToken = data.access_token;
  return accessToken;
}

// Function to fetch services from Zoho Bookings API
async function fetchZohoServices() {
  const url = "https://www.zohoapis.com/bookings/v1/json/getservices";

  const res = await fetch(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    console.warn("⚠️ Access token expired. Refreshing...");
    await refreshAccessToken();
    return fetchZohoServices(); // Retry
  }

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    const errorBody = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    console.error("❌ Zoho API error:", {
      status: res.status,
      body: errorBody,
    });

    throw new Error(`Failed with status ${res.status}`);
  }

  const json = await res.json();
  console.log("📦 Services fetched:", JSON.stringify(json, null, 2));
  return json;
}

// GET handler
export async function GET() {
  try {
    const data = await fetchZohoServices();
    return NextResponse.json(data);
  } catch (err) {
    console.error("🔥 Error in /api/bookings/services:", err);
    return NextResponse.json(
      {
        error: "Failed to load bookings",
        message: (err as Error).message,
      },
      { status: 500 },
    );
  }
}
