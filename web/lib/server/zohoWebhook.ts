// lib/server/zohoWebhook.ts
// Helpers for the Zoho -> website webhooks.
import { createHash, timingSafeEqual } from "crypto";

/**
 * Optional shared-secret check.
 * - ZOHO_WEBHOOK_SECRET not set: allow (same as before) and log a warning.
 * - Set: the request must send the same value in the "x-zoho-secret" header
 *   or the "?secret=" query parameter.
 */
export function zohoSecretOk(req: Request, route: string): boolean {
  const expected = process.env.ZOHO_WEBHOOK_SECRET;
  if (!expected) {
    console.warn(
      `[${route}] ZOHO_WEBHOOK_SECRET is not set; accepting the request without a secret. Set it in Vercel and in the Zoho webhook.`,
    );
    return true;
  }
  const provided =
    req.headers.get("x-zoho-secret") ??
    new URL(req.url).searchParams.get("secret") ??
    "";
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// Zoho hosts we are willing to send the Zoho OAuth token to.
// The current flow downloads CRM attachments from the Zoho API
// (www.zohoapis.com) with "Authorization: Zoho-oauthtoken ...".
const ALLOWED_ZOHO_HOST_SUFFIXES = [
  "zoho.com",
  "zohoapis.com",
  "zohopublic.com",
  "zohostatic.com",
  "zoho.eu",
  "zohoapis.eu",
  "zohopublic.eu",
];

export function isAllowedZohoFileUrl(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  if (u.username || u.password) return false;
  const host = u.hostname.toLowerCase();
  return ALLOWED_ZOHO_HOST_SUFFIXES.some(
    (s) => host === s || host.endsWith(`.${s}`),
  );
}

/**
 * Zoho CRM attachment id from a URL like
 * https://crm.zoho.com/crm/v2/Deals/<dealId>/Attachments/<attachmentId>
 */
export function zohoAttachmentIdFrom(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const m = raw.match(/\/Attachments\/(\d+)(?:[/?#]|$)/i);
  return m ? m[1] : null;
}

export type ExistingDoc = {
  originalFilename?: string | null;
  zohoAttachmentId?: string | null;
};

/**
 * Is this Zoho attachment already on the trip?
 * - Same zohoAttachmentId -> yes.
 * - Same file name on an older item that has no zohoAttachmentId (uploaded
 *   before batch 9) -> yes.
 * - Same file name but a DIFFERENT attachment id -> no (a genuinely new file).
 * - No attachment id in the URL -> fall back to the file name.
 */
export function isDuplicateZohoDoc(
  docs: ExistingDoc[] | null | undefined,
  attachmentId: string | null,
  fileName: unknown,
): boolean {
  const list = Array.isArray(docs) ? docs : [];
  const name = typeof fileName === "string" && fileName ? fileName : null;
  if (attachmentId) {
    if (list.some((d) => d?.zohoAttachmentId === attachmentId)) return true;
    return Boolean(
      name &&
        list.some((d) => !d?.zohoAttachmentId && d?.originalFilename === name),
    );
  }
  return Boolean(name && list.some((d) => d?.originalFilename === name));
}

/** Hostname only (never the full URL), for safe logging. */
export function hostOf(raw: unknown): string {
  try {
    return new URL(String(raw)).hostname;
  } catch {
    return "invalid-url";
  }
}
