// lib/server/zohoSearch.ts (batch 26)
// Read-only Zoho CRM Lead searches for the ambassador dashboard, using the
// existing refresh-token env vars. Never throws: returns [] on any problem.
import { getToken } from "@/lib/server/zohoLeads";

export type ZohoLeadRow = Record<string, unknown>;

/** GET /crm/v2/Leads/search with one of criteria / email. */
export async function searchLeads(params: Record<string, string>, fields: string[]): Promise<ZohoLeadRow[]> {
  try {
    let token = await getToken();
    if (!token) return [];
    const qs = new URLSearchParams({ ...params, fields: fields.join(","), per_page: "200" });
    const url = `https://www.zohoapis.com/crm/v2/Leads/search?${qs.toString()}`;
    const send = (t: string) =>
      fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${t}` }, cache: "no-store" });
    let res = await send(token);
    if (res.status === 401) {
      token = await getToken(true);
      if (!token) return [];
      res = await send(token);
    }
    if (res.status === 204) return []; // no matches
    if (!res.ok) {
      console.error("[zohoSearch] search failed", res.status);
      return [];
    }
    const json = (await res.json().catch(() => ({}))) as { data?: ZohoLeadRow[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("[zohoSearch] threw", err instanceof Error ? err.message : "unknown");
    return [];
  }
}

/** Zoho criteria values need ( ) , \ escaped. */
export const zohoEscape = (v: string) => v.replace(/([(),\\])/g, "\\$1");
