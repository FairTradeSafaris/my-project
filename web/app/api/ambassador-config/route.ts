// app/api/ambassador-config/route.ts (batch 12)
// Tiny public read of the referral settings, used by ReferralTracker.
import { NextResponse } from "next/server";
import { getAmbassadorSettings } from "@/lib/ambassadorSettings";

export const revalidate = 300;

export async function GET() {
  const s = await getAmbassadorSettings();
  return NextResponse.json({ enabled: s.enabled, cookieDays: s.cookieDays });
}
