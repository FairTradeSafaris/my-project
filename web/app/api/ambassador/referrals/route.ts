// app/api/ambassador/referrals/route.ts (batch 26)
// The signed-in ambassador's link clicks and referrals. Private, never cached.
import { NextResponse } from "next/server";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";
import { accountForUser, stateOf } from "@/lib/server/ambassadorAccount";
import { isLinkApproved } from "@/lib/server/ambassadorApproval";
import { referralsFor } from "@/lib/server/ambassadorReferrals";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();
  try {
    const acc = await accountForUser(me.userId);
    const approved = acc ? await isLinkApproved(acc, me.userId) : false;
    const state = stateOf(acc ? { ...acc, linkApproved: approved } : null);
    if (!acc?.code || (state !== "active" && state !== "paused")) {
      return NextResponse.json({ error: "Not an approved ambassador" }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(await referralsFor(acc.code), { headers: NO_STORE });
  } catch (err) {
    console.error("[ambassador/referrals] failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Could not load your referrals" }, { status: 500, headers: NO_STORE });
  }
}
