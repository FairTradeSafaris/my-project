// app/api/ambassador/click/route.ts (batch 26)
// Counts a visit through an ambassador's ?ref= link: +1 on that code's
// monthly total. Stores nothing about the visitor. Never cached.
import { NextResponse } from "next/server";
import { recordClick } from "@/lib/server/ambassadorReferrals";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: unknown };
  // Only used in memory for a per-minute limit; never stored.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  try {
    await recordClick(body.code, `ip:${ip}`);
  } catch (err) {
    console.error("[ambassador/click] failed:", err instanceof Error ? err.message : "unknown error");
  }
  // Same answer either way, so the endpoint can't be used to test codes.
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
