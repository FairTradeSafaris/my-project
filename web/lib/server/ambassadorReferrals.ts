// lib/server/ambassadorReferrals.ts (batch 26)
// Click counts and the "Your referrals" list for the ambassador dashboard.
//  - Clicks: one Sanity document per code per month (type
//    "ambassadorClickCount") holding ONLY the code, the month and a number.
//    No IP addresses, cookies or anything about the visitor.
//  - Referrals: read live from Zoho CRM Leads whose Referral_Code field is
//    the ambassador's code. Only when ZOHO_REFERRAL_FIELD=1 (the same switch
//    that makes the contact form fill that field). The ambassador sees the
//    friend's first name, the date and a plain-words stage: no emails,
//    surnames, phone numbers or trip details.
import { serverClient } from "@/lib/sanity.server";
import { cleanRefCode } from "@/lib/referral";
import { accountForCode } from "@/lib/server/ambassadorAccount";
import { searchLeads, zohoEscape } from "@/lib/server/zohoSearch";
import type { AmbassadorReferral, AmbassadorReferrals } from "@/lib/ambassadorTypes";

const monthOf = (d = new Date()) => d.toISOString().slice(0, 7); // YYYY-MM (UTC)
const clickId = (code: string, month: string) => `ambassadorClicks-${code}-${month}`;

// Small in-memory guards so a script can't hammer Sanity (per server instance).
const knownCodes = new Map<string, { ok: boolean; at: number }>();
const hits = new Map<string, { n: number; at: number }>();

function tooMany(key: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.at > windowMs) {
    hits.set(key, { n: 1, at: now });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  h.n += 1;
  return h.n > max;
}

async function codeExists(code: string): Promise<boolean> {
  const c = knownCodes.get(code);
  if (c && Date.now() - c.at < 10 * 60_000) return c.ok;
  const ok = !!(await accountForCode(code));
  knownCodes.set(code, { ok, at: Date.now() });
  if (knownCodes.size > 2000) knownCodes.clear();
  return ok;
}

/** Add one click for this code this month. Unknown codes are ignored. */
export async function recordClick(rawCode: unknown, clientKey: string): Promise<boolean> {
  const code = cleanRefCode(rawCode);
  if (!code || tooMany(clientKey) || tooMany(`code:${code}`, 120)) return false;
  if (!(await codeExists(code))) return false;
  const month = monthOf();
  const id = clickId(code, month);
  await serverClient.createIfNotExists({ _id: id, _type: "ambassadorClickCount", code, month, count: 0 });
  await serverClient.patch(id).setIfMissing({ count: 0 }).inc({ count: 1 }).commit();
  return true;
}

const STAGES: [RegExp, string][] = [
  [/junk|not qualified|lost|unqualified|closed/i, "Not going ahead"],
  [/contact in future|future/i, "Planning for later"],
  [/contacted|attempted|qualified|pre-qualified|in progress/i, "In conversation with our team"],
];
function stageOf(row: Record<string, unknown>): string {
  if (row.$converted === true) return "Planning their safari";
  const s = String(row.Lead_Status ?? "");
  for (const [re, label] of STAGES) if (re.test(s)) return label;
  return "Enquiry received";
}

async function referralList(code: string): Promise<AmbassadorReferral[] | null> {
  if (process.env.ZOHO_REFERRAL_FIELD !== "1") return null;
  const rows = await searchLeads({ criteria: `(Referral_Code:equals:${zohoEscape(code)})` }, [
    "First_Name",
    "Created_Time",
    "Lead_Status",
    "Lead_Source",
  ]);
  return rows
    .filter((r) => String(r.Lead_Source ?? "") !== "Ambassador Application")
    .map((r) => ({
      firstName: String(r.First_Name ?? "").trim().split(/\s+/)[0].slice(0, 30) || "A friend",
      date: String(r.Created_Time ?? "").slice(0, 10),
      status: stageOf(r),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);
}

export async function referralsFor(rawCode: string): Promise<AmbassadorReferrals> {
  const code = cleanRefCode(rawCode);
  const [docs, referrals] = await Promise.all([
    serverClient.fetch<{ month?: string; count?: number }[]>(
      `*[_type == "ambassadorClickCount" && code == $code && !(_id in path("drafts.**"))] | order(month desc)[0...24]{month, count}`,
      { code },
    ),
    referralList(code),
  ]);
  const months = (docs || [])
    .filter((d) => typeof d.month === "string")
    .map((d) => ({ month: d.month as string, count: Math.max(0, Number(d.count) || 0) }));
  const now = monthOf();
  return {
    clicksThisMonth: months.find((m) => m.month === now)?.count ?? 0,
    clicksTotal: months.reduce((t, m) => t + m.count, 0),
    months: months.slice(0, 6),
    referrals,
  };
}
