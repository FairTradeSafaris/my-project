import { NextRequest, NextResponse } from "next/server";

let accessToken = process.env.ZOHO_ACCESS_TOKEN!;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN!;
const clientId = process.env.ZOHO_CLIENT_ID!;
const clientSecret = process.env.ZOHO_CLIENT_SECRET!;

async function refreshAccessToken() {
  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  accessToken = data.access_token;
  return accessToken;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const lead = {
    First_Name: body.firstName,
    Last_Name: body.lastName,
    Email: body.email,
    Phone: body.phone,
    Description: `Appointment: ${body.appointment ? "Yes" : "No"}, Marketing: ${
      body.marketingConsent ? "Yes" : "No"
    }`,
  };

  // Send to Zoho CRM
  let response = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [lead] }),
  });

  // Refresh if token expired
  if (response.status === 401) {
    await refreshAccessToken();
    response = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [lead] }),
    });
  }

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}
