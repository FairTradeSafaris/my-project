// app/api/ambassador-signup/route.ts (batch 12)
// Ambassador applications -> Zoho CRM Lead (+ email to the team).
// Same spam protection as the contact form: honeypot + minimum fill time.
// Needs no new Zoho fields: everything is also written into Description.
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createLead } from "@/lib/server/zohoLeads";

const clip = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function looksLikeSpam(b: Record<string, unknown>) {
  if (typeof b.website === "string" && b.website.trim() !== "") return true; // honeypot
  if (typeof b.elapsedMs !== "number" || b.elapsedMs < 4000) return true; // too fast
  const email = String(b.email ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;
  if ((email.split("@")[0].match(/\./g) || []).length >= 3) return true;
  const name = `${b.firstName ?? ""}${b.lastName ?? ""}`;
  if (!name.trim() || /https?:|www\./i.test(name)) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (looksLikeSpam(raw)) return NextResponse.json({ ok: true }); // pretend success

  const a = {
    firstName: clip(raw.firstName, 100),
    lastName: clip(raw.lastName, 100),
    email: clip(raw.email, 200),
    phone: clip(raw.phone, 40),
    country: clip(raw.country, 80),
    social: clip(raw.social, 300),
    audience: clip(raw.audience, 60),
    why: clip(raw.why, 2000),
    referredBy: clip(raw.referralCode, 32).toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
    agreed: raw.agreed === true,
  };
  if (!a.firstName || !a.lastName || !a.agreed) {
    return NextResponse.json({ ok: false, error: "Please fill in your name and accept the programme terms." }, { status: 400 });
  }

  const description = [
    "AMBASSADOR APPLICATION - Status: Pending ambassador",
    `Country: ${a.country || "-"}`,
    `Social / website: ${a.social || "-"}`,
    `Audience size: ${a.audience || "-"}`,
    a.referredBy ? `Referred by ambassador code: ${a.referredBy}` : "",
    `Why they want to join: ${a.why || "-"}`,
    `Agreed to programme terms: Yes (${new Date().toISOString().slice(0, 10)})`,
  ]
    .filter(Boolean)
    .join("\n");

  const core: Record<string, unknown> = {
    First_Name: a.firstName,
    Last_Name: a.lastName,
    Email: a.email,
    Phone: a.phone,
    Description: description,
  };
  // Optional extras: dropped automatically if Zoho rejects any of them.
  const extra: Record<string, unknown> = { Lead_Source: "Ambassador Application" };
  if (a.country) extra.Country = a.country; // standard Leads field
  if (a.social && /^https?:\/\/\S+\.\S+/i.test(a.social)) extra.Website = a.social; // standard Leads field
  if (process.env.ZOHO_REFERRAL_FIELD === "1" && a.referredBy) extra.Referral_Code = a.referredBy;

  const [crm, emailOk] = await Promise.all([
    createLead(core, extra),
    (async () => {
      if (!process.env.RESEND_API_KEY) return false;
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const rows: [string, string][] = [
          ["Name", `${a.firstName} ${a.lastName}`],
          ["Email", a.email],
          ["Phone / WhatsApp", a.phone || "-"],
          ["Country", a.country || "-"],
          ["Social / website", a.social || "-"],
          ["Audience size", a.audience || "-"],
          ["Referred by code", a.referredBy || "-"],
        ];
        const { error } = await resend.emails.send({
          from: process.env.NOTIFY_EMAIL_FROM || "fromwebsite@fairtradesafaris.com",
          to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
          subject: `🤝 New ambassador application: ${a.firstName} ${a.lastName}`,
          html: `<div style="font-family:Arial,sans-serif;color:#3c2a1e;max-width:600px;margin:auto;padding:20px;border:1px solid #eadfd3">
            <h2 style="color:#5d4037;margin:0 0 12px">New ambassador application</h2>
            <p>It is in Zoho CRM as a Lead (Lead Source: Ambassador Application). Approve it there.</p>
            <table style="width:100%;margin-top:12px">${rows
              .map(([k, v]) => `<tr><td style="padding:6px 0;width:40%"><strong>${k}</strong></td><td>${esc(v)}</td></tr>`)
              .join("")}</table>
            <p style="margin-top:16px"><strong>Why they want to join</strong></p>
            <p style="white-space:pre-wrap">${esc(a.why || "-")}</p>
          </div>`,
        });
        if (error) console.error("[ambassador-signup] Resend error", error);
        return !error;
      } catch (err) {
        console.error("[ambassador-signup] Resend threw", err);
        return false;
      }
    })(),
  ]);

  if (crm.ok || emailOk) return NextResponse.json({ ok: true });
  return NextResponse.json(
    { ok: false, error: "Sorry, we couldn't send your application right now." },
    { status: 502 },
  );
}
