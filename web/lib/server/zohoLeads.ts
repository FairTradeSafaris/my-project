// lib/server/zohoLeads.ts (batch 12)
// Create a Zoho CRM Lead with the existing refresh-token env vars.
// Never throws. If Zoho rejects an optional field (e.g. a picklist value or a
// custom field that doesn't exist yet), it retries once with only the safe
// core fields, so the lead is never lost.

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getToken(force = false): Promise<string | null> {
  if (!force && cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const { ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET } = process.env;
  if (!ZOHO_REFRESH_TOKEN || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
    console.error("[zohoLeads] Zoho env vars missing");
    return null;
  }
  try {
    const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
    if (!res.ok || !json.access_token) {
      console.error("[zohoLeads] token refresh failed", res.status, json.error);
      return null;
    }
    cachedToken = json.access_token;
    tokenExpiresAt = Date.now() + ((json.expires_in ?? 3600) - 300) * 1000;
    return cachedToken;
  } catch (err) {
    console.error("[zohoLeads] token refresh error", err);
    return null;
  }
}

type LeadResult = { ok: boolean; id?: string };
type ZohoJson = { data?: { status?: string; details?: { id?: string } }[] } | null;

async function post(lead: Record<string, unknown>): Promise<{ status: number; json: ZohoJson }> {
  let token = await getToken();
  if (!token) return { status: 0, json: null };
  const send = (t: string) =>
    fetch("https://www.zohoapis.com/crm/v2/Leads", {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${t}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: [lead] }),
    });
  let res = await send(token);
  if (res.status === 401) {
    token = await getToken(true);
    if (token) res = await send(token);
  }
  const json = (await res.json().catch(() => ({}))) as ZohoJson;
  return { status: res.status, json };
}

/**
 * core: fields Zoho always has (First_Name, Last_Name, Email, Phone, Description...).
 * extra: optional fields (Lead_Source, custom fields). Dropped on retry if rejected.
 */
export async function createLead(
  core: Record<string, unknown>,
  extra: Record<string, unknown> = {},
): Promise<LeadResult> {
  try {
    const hasExtra = Object.keys(extra).length > 0;
    let { status, json } = await post({ ...core, ...extra });
    let row = json?.data?.[0];
    if (status >= 200 && status < 300 && row?.status !== "error") {
      return { ok: true, id: row?.details?.id };
    }
    console.error("[zohoLeads] lead rejected", status, JSON.stringify(json).slice(0, 500));
    if (!hasExtra || status === 0) return { ok: false };
    ({ status, json } = await post(core));
    row = json?.data?.[0];
    if (status >= 200 && status < 300 && row?.status !== "error") {
      console.warn("[zohoLeads] saved without optional fields", Object.keys(extra).join(","));
      return { ok: true, id: row?.details?.id };
    }
    console.error("[zohoLeads] retry rejected", status, JSON.stringify(json).slice(0, 500));
    return { ok: false };
  } catch (err) {
    console.error("[zohoLeads] threw", err);
    return { ok: false };
  }
}
