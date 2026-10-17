// lib/server/zohoPortal.ts
// Attach a client's portal upload to their Zoho CRM Deal (Attachments list).
// Never throws: any Zoho problem is logged and the upload still succeeds.
import { clerkClient } from "@clerk/nextjs/server";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getZohoToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const { ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET } = process.env;
  if (!ZOHO_REFRESH_TOKEN || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
    throw new Error("Zoho env vars missing (ZOHO_REFRESH_TOKEN / CLIENT_ID / CLIENT_SECRET)");
  }
  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  const res = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?${params.toString()}`,
    { method: "POST" },
  );
  const json = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(`Zoho token refresh failed (${res.status}) ${json.error ?? ""}`);
  }
  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + ((json.expires_in ?? 3600) - 300) * 1000;
  return cachedToken;
}

/**
 * Deal id for a trip: the trip doc's zohoDealId if present, otherwise the
 * zohoDealId the Zoho webhook stores on the Clerk user's public metadata.
 */
export async function findDealId(
  tripDealId: string | null | undefined,
  userId: string,
): Promise<string | null> {
  if (tripDealId) return String(tripDealId);
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const v = (user.publicMetadata as { zohoDealId?: unknown })?.zohoDealId;
    return v ? String(v) : null;
  } catch {
    return null;
  }
}

export async function attachToZohoDeal(opts: {
  dealId: string | null;
  label: string; // "Passport" | "Flight ticket"
  originalName: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<string | null> {
  const { dealId, label, originalName, buffer, mimeType } = opts;
  if (!dealId || !/^\d+$/.test(dealId)) {
    console.warn("[portal->zoho] no Zoho deal id for this trip; not attached");
    return null;
  }
  try {
    const token = await getZohoToken();
    const name = `${label} - from client portal - ${originalName}`.slice(0, 250);
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), name);
    const res = await fetch(
      `https://www.zohoapis.com/crm/v2/Deals/${dealId}/Attachments`,
      {
        method: "POST",
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
        body: form,
      },
    );
    const text = await res.text();
    if (!res.ok) {
      const hint = /scope|OAUTH_SCOPE_MISMATCH|INVALID_TOKEN/i.test(text)
        ? " (likely missing Zoho scope ZohoCRM.modules.attachments.ALL or ZohoCRM.modules.deals.ALL)"
        : "";
      console.error(`[portal->zoho] attach failed ${res.status}${hint}: ${text.slice(0, 300)}`);
      return null;
    }
    let id: string | null = null;
    try {
      id = JSON.parse(text)?.data?.[0]?.details?.id ?? null;
    } catch {}
    console.log("[portal->zoho] attached to deal", dealId, id ?? "");
    return id;
  } catch (err) {
    console.error(
      "[portal->zoho] attach error:",
      err instanceof Error ? err.message : "unknown error",
    );
    return null;
  }
}
