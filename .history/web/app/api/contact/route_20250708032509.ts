import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(
  req: NextRequest,
  _context: any // ✅ This works and avoids type conflicts
) {
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

  let response = await fetch("https://www.zohoapis.com/crm/v2/Leads", {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: [lead] }),
  });

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

  await resend.emails.send({
    from: process.env.NOTIFY_EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
    subject: "New Contact Form Submission",
    html: `
      <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>Appointment:</strong> ${body.appointment ? "Yes" : "No"}</p>
      <p><strong>Marketing Consent:</strong> ${body.marketingConsent ? "Yes" : "No"}</p>
    `,
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}
