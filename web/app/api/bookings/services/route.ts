import { NextResponse } from "next/server";

let accessToken = process.env.ZOHO_ACCESS_TOKEN!;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;
const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

const MAX_ATTEMPTS = 2; // first try + at most one retry after a token refresh
const TIMEOUT_MS = 8000; // per Zoho request

// Function to refresh Zoho access token
async function refreshAccessToken(): Promise<string | null> {
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
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) {
    console.error("[bookings/services] Zoho token refresh failed", res.status);
    return null;
  }

  accessToken = data.access_token;
  return accessToken;
}

// Function to fetch services from Zoho Bookings API (bounded retries)
async function fetchZohoServices() {
  const url = "https://www.zohoapis.com/bookings/v1/json/getservices";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.status === 401 && attempt < MAX_ATTEMPTS) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) break;
      continue; // retry once with the new token
    }

    if (!res.ok) {
      console.error("[bookings/services] Zoho API error", res.status);
      throw new Error(`Failed with status ${res.status}`);
    }

    return res.json();
  }

  throw new Error("Zoho authorisation failed");
}

// GET handler
export async function GET() {
  try {
    const data = await fetchZohoServices();
    return NextResponse.json(data);
  } catch (err) {
    console.error(
      "[bookings/services] error:",
      err instanceof Error ? err.message : "unknown error",
    );
    return NextResponse.json(
      {
        error: "Failed to load bookings",
        message: (err as Error).message,
      },
      { status: 500 },
    );
  }
}
