// app/api/ambassador/payout-request/route.ts (batch 28)
// "Request payout": checks the signed-in, approved ambassador, works out
// their earned total again from Zoho Deals (never trusts the browser), and
// emails the team. One request per ambassador per 24 hours (the time is kept
// on their Ambassador Account). Private, never cached.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { serverClient } from "@/lib/sanity.server";
import { getPortalUser, getVerifiedEmails, unauthorized } from "@/lib/server/portalAuth";
import { accountForUser, stateOf } from "@/lib/server/ambassadorAccount";
import { isLinkApproved } from "@/lib/server/ambassadorApproval";
import { dealsFor, earningRules, earningsOn, payoutRequestedRecently, totalsOf } from "@/lib/server/ambassadorEarnings";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "private, no-store" };
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const usd = (n: number) => `US$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });

export async function POST(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();
  try {
    const acc = await accountForUser(me.userId);
    const approved = acc ? await isLinkApproved(acc, me.userId) : false;
    if (!acc?.code || stateOf(acc ? { ...acc, linkApproved: approved } : null) !== "active") {
      return fail("Only active ambassadors can request a payout.", 403);
    }
    if (!earningsOn()) return fail("Payout requests aren't open yet.", 409);
    if (payoutRequestedRecently(acc.lastPayoutRequestAt)) {
      return NextResponse.json({ ok: true, already: true }, { headers: NO_STORE });
    }
    if (!process.env.RESEND_API_KEY) return fail("Sorry, we can't send your request right now. Please contact us.", 503);

    const rules = await earningRules();
    const deals = await dealsFor(acc.code, rules);
    if (!deals) return fail("Sorry, we can't check your earnings right now. Please try again later.", 503);
    const earned = totalsOf(deals).earned;
    if (earned < rules.minPayout) {
      return fail(`You can request a payout once at least ${usd(rules.minPayout)} is ready.`, 409);
    }

    // Claim the slot first (revision-checked), so two clicks can't send two emails.
    const now = new Date().toISOString();
    await serverClient.patch(acc._id).ifRevisionId(acc._rev).set({ lastPayoutRequestAt: now }).commit();

    const emails = await getVerifiedEmails(me.userId).catch(() => [] as string[]);
    const rows = deals
      .filter((d) => d.status === "earned")
      .map(
        (d) =>
          `<tr><td style="padding:4px 8px;border-bottom:1px solid #eadfd3">${esc(d.dealName || d.firstName)}</td><td style="padding:4px 8px;border-bottom:1px solid #eadfd3">${esc(d.date)}</td><td style="padding:4px 8px;border-bottom:1px solid #eadfd3;text-align:right">${usd(d.amount)}</td><td style="padding:4px 8px;border-bottom:1px solid #eadfd3;color:#888">${esc(d.dealId)}</td></tr>`,
      )
      .join("");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || "fromwebsite@fairtradesafaris.com",
      to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
      subject: `💸 Payout request: ambassador ${acc.code} – ${usd(earned)}`,
      html: `<div style="font-family:Arial,sans-serif;color:#3c2a1e;max-width:640px;margin:auto;padding:20px;border:1px solid #eadfd3">
        <h2 style="color:#5d4037;margin:0 0 12px">Ambassador payout request</h2>
        <p><strong>Code:</strong> ${esc(acc.code)}<br><strong>Verified login email:</strong> ${esc(emails.join(", ") || "(none verified)")}</p>
        <p><strong>Earned and ready to pay:</strong> ${usd(earned)} (minimum payout ${usd(rules.minPayout)})</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px"><tr><th align="left">Deal</th><th align="left">Date</th><th align="right">Commission</th><th align="left">Zoho Deal ID</th></tr>${rows}</table>
        <p>Worked out by the website from Zoho Deals and the Earnings rules in Ambassador Settings. After paying, tick <strong>Commission paid</strong> on each of these Deals in Zoho so they move to "Paid" on the dashboard.</p>
      </div>`,
    });
    if (error) {
      console.error("[ambassador/payout-request] Resend error", error);
      // Free the slot again so they can retry.
      await serverClient
        .patch(acc._id)
        .unset(acc.lastPayoutRequestAt ? [] : ["lastPayoutRequestAt"])
        .set(acc.lastPayoutRequestAt ? { lastPayoutRequestAt: acc.lastPayoutRequestAt } : {})
        .commit()
        .catch(() => {});
      return fail("Sorry, we couldn't send your request. Please try again tomorrow or contact us.", 502);
    }
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.error("[ambassador/payout-request] failed:", msg);
    if (/revision/i.test(msg)) return fail("Please try again in a moment.", 409);
    return fail("Sorry, something went wrong. Please try again, or contact us.", 500);
  }
}
