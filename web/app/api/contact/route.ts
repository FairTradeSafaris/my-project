import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  // ✅ Send Resend email first
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.NOTIFY_EMAIL_FROM || "fromwebsite@fairtradesafaris.com",
    to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
    subject: `📬 New Safari Inquiry from ${body.firstName} ${body.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2e7d32;">🦁 New Safari Inquiry</h2>
        <p style="font-size: 16px;">You’ve received a new message from the Fair Trade Safaris website.</p>

        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td>${body.firstName} ${body.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td><a href="mailto:${body.email}">${body.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Phone:</strong></td>
            <td>${body.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Appointment Requested:</strong></td>
            <td>${body.appointment ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Marketing Consent:</strong></td>
            <td>${body.marketingConsent ? "Yes" : "No"}</td>
          </tr>
        </table>

        <p style="font-size: 14px; margin-top: 30px; color: #777;">
          This message was sent from <a href="https://fairtradesafaris.com" target="_blank">fairtradesafaris.com</a>.
        </p>
      </div>
    `,
  });

  // 🧾 Create Zoho lead
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

  return NextResponse.json(await response.json(), { status: response.status });
}
