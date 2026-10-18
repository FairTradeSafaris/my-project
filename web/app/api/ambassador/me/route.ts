// app/api/ambassador/me/route.ts (batch 24)
// The signed-in user's ambassador status, code and share link, plus the
// programme numbers from Ambassador Settings. Private, never cached.
import { NextResponse } from "next/server";
import { getPortalUser, unauthorized } from "@/lib/server/portalAuth";
import { meFor } from "@/lib/server/ambassadorAccount";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(req: Request) {
  const me = await getPortalUser(req);
  if (!me) return unauthorized();
  try {
    return NextResponse.json(await meFor(me.userId), { headers: NO_STORE });
  } catch (err) {
    console.error("[ambassador/me] failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Could not load your ambassador details" }, { status: 500, headers: NO_STORE });
  }
}
