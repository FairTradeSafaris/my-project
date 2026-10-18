// app/api/ambassador/claim/route.ts (batch 24)
// A signed-in person enters their referral code once. If the code exists and
// nobody has claimed it, their Clerk user ID is recorded on the Ambassador
// Account (still "needs approval") and the team gets an email with the
// person's verified email address, so Devon can check it is the right person
// and tick "Link approved" in Studio. No email is stored in Sanity.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPortalUser, getVerifiedEmails, unauthorized } from "@/lib/server/portalAuth";
import { accountForCode, accountForUser, meFor, recordClaim } from "@/lib/server/ambassadorAccount";
import { cleanRefCode } from "@/lib/referral";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "private, no-store" };
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });

export async function POST(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();

  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const code = cleanRefCode(raw.code);
  if (!code) return fail("Please enter your code exactly as it appears in our email, for example JANE25.");

  try {
    // One account per login: if they already claimed one, just show it.
    const mine = await accountForUser(me.userId);
    if (mine) return NextResponse.json({ ok: true, me: await meFor(me.userId) }, { headers: NO_STORE });

    const acc = await accountForCode(code);
    if (!acc) {
      return fail("We couldn't find that code. Please check the email from our team, or contact us and we'll help.", 404);
    }
    if (acc.clerkUserId && acc.clerkUserId !== me.userId) {
      return fail("This code is already linked to another login. Please contact us and we'll sort it out.", 409);
    }

    const emails = await getVerifiedEmails(me.userId).catch(() => [] as string[]);
    await recordClaim(acc, me.userId);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: process.env.NOTIFY_EMAIL_FROM || "fromwebsite@fairtradesafaris.com",
          to: process.env.NOTIFY_EMAIL_TO || "devon@fairtradesafaris.com",
          subject: `🤝 Ambassador code ${code} claimed – please approve`,
          html: `<div style="font-family:Arial,sans-serif;color:#3c2a1e;max-width:600px;margin:auto;padding:20px;border:1px solid #eadfd3">
            <h2 style="color:#5d4037;margin:0 0 12px">Ambassador code claimed</h2>
            <p>Someone signed in on the website and entered the ambassador code <strong>${esc(code)}</strong>.</p>
            <p><strong>Their verified email:</strong> ${esc(emails.join(", ") || "(none verified)")}</p>
            <p>If this is the right ambassador: in Sanity Studio open <strong>🤝 Ambassador Accounts → ${esc(code)}</strong>, tick <strong>Link approved</strong> and press <strong>Publish</strong>. Their dashboard opens straight away.</p>
            <p>If it is <em>not</em> the right person: clear <strong>Website login ID</strong>, leave Link approved unticked, and publish.</p>
          </div>`,
        });
        if (error) console.error("[ambassador/claim] Resend error", error);
      } catch (err) {
        console.error("[ambassador/claim] Resend threw", err instanceof Error ? err.message : "unknown");
      }
    }

    return NextResponse.json({ ok: true, me: await meFor(me.userId) }, { headers: NO_STORE });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.error("[ambassador/claim] failed:", msg);
    if (/revision/i.test(msg)) return fail("Please try again in a moment.", 409);
    return fail("Sorry, something went wrong. Please try again, or contact us.", 500);
  }
}
