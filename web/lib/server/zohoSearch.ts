// lib/server/zohoSearch.ts (batch 26; batch 28: any module, e.g. Deals)
// Read-only Zoho CRM Lead searches for the ambassador dashboard, using the
// existing refresh-token env vars. Never throws: returns [] on any problem.
import { getToken } from "@/lib/server/zohoLeads";

export type ZohoLeadRow = Record<string, unknown>;

/** GET /crm/v2/Leads/search with one of criteria / email. */
export async function searchLeads(params: Record<string, string>, fields: string[]): Promise<ZohoLeadRow[]> {
  return (await searchModule("Leads", params, fields)) ?? [];
}

/**
 * GET /crm/v2/{module}/search. Returns null on any error (so callers can tell
 * "no matches" ([]) from "couldn't ask Zoho" (null)).
 */
export async function searchModule(
  module: "Leads" | "Deals",
  params: Record<string, string>,
  fields: string[],
): Promise<ZohoLeadRow[] | null> {
  try {
    let token = await getToken();
    if (!token) return null;
    const qs = new URLSearchParams({ ...params, fields: fields.join(","), per_page: "200" });
    const url = `https://www.zohoapis.com/crm/v2/${module}/search?${qs.toString()}`;
    const send = (t: string) =>
      fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${t}` }, cache: "no-store" });
    let res = await send(token);
    if (res.status === 401) {
      token = await getToken(true);
      if (!token) return null;
      res = await send(token);
    }
    if (res.status === 204) return []; // no matches
    if (!res.ok) {
      console.error("[zohoSearch] search failed", module, res.status);
      return null;
    }
    const json = (await res.json().catch(() => ({}))) as { data?: ZohoLeadRow[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("[zohoSearch] threw", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

/** Zoho criteria values need ( ) , \ escaped. */
export const zohoEscape = (v: string) => v.replace(/([(),\\])/g, "\\$1");
