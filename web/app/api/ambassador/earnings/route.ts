// app/api/ambassador/earnings/route.ts (batch 28)
// The signed-in ambassador's earnings (own bookings only). Private, never cached.
import { NextResponse } from "next/server";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";
import { accountForUser, stateOf } from "@/lib/server/ambassadorAccount";
import { isLinkApproved } from "@/lib/server/ambassadorApproval";
import { earningsFor } from "@/lib/server/ambassadorEarnings";

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
    const data = await earningsFor(acc.code, acc.lastPayoutRequestAt);
    if (!data) return NextResponse.json({ error: "Could not load your earnings" }, { status: 503, headers: NO_STORE });
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err) {
    console.error("[ambassador/earnings] failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Could not load your earnings" }, { status: 500, headers: NO_STORE });
  }
}
