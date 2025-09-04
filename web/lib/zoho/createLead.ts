// lib/zoho/createLead.ts

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

export async function createZohoLead(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  appointment?: boolean;
  marketingConsent?: boolean;
  sourceChannel?: string; // ✅ new optional field
}) {
  const data = {
    First_Name: lead.firstName,
    Last_Name: lead.lastName,
    Email: lead.email,
    Phone: lead.phone,
    Description: `Appointment: ${lead.appointment ? "Yes" : "No"}, Marketing: ${
      lead.marketingConsent ? "Yes" : "No"
    }`,
    Source_Channel: lead.sourceChannel || "WebClient", // ✅ default to WebClient if not provided
  };

  let response = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [data] }),
  });

  // 🔁 Retry once on token expiration
  if (response.status === 401) {
    await refreshAccessToken();
    response = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [data] }),
    });
  }

  return response.json();
}
