// lib/server/ambassadorApproval.ts (batch 26; batch 27: checkbox field instead of Lead Status)
// Where "is this ambassador's login approved?" comes from.
//  - Default: the Sanity "Link approved" tick on the Ambassador Account.
//  - When Vercel has ZOHO_AMBASSADOR_APPROVAL=1: ALSO approved when a Zoho
//    CRM Lead with the person's verified login email has the checkbox field
//    "Approved Ambassador" ticked (API name in ZOHO_AMBASSADOR_APPROVED_FIELD,
//    default Approved_Ambassador). Lead Status is not used.
//    The account must still be claimed by this login in Sanity, and Zoho is
//    only asked when the Sanity tick is missing. Any Zoho error = not approved.
import type { AccountDoc } from "@/lib/server/ambassadorAccount";
import { getVerifiedEmails } from "@/lib/server/portalAuth";
import { searchLeads } from "@/lib/server/zohoSearch";

export function zohoApprovalOn(): boolean {
  return process.env.ZOHO_AMBASSADOR_APPROVAL === "1";
}

function approvedField(): string {
  const f = (process.env.ZOHO_AMBASSADOR_APPROVED_FIELD || "Approved_Ambassador").trim();
  return /^[A-Za-z0-9_]{1,100}$/.test(f) ? f : "Approved_Ambassador";
}

async function zohoApproved(userId: string): Promise<boolean> {
  const emails = await getVerifiedEmails(userId).catch(() => [] as string[]);
  const field = approvedField();
  for (const email of emails.slice(0, 3)) {
    const rows = await searchLeads({ email }, [field, "Email"]);
    if (rows.some((r) => r[field] === true)) return true;
  }
  return false;
}

/** True when this claimed account's link to this login is approved. */
export async function isLinkApproved(acc: AccountDoc, userId: string): Promise<boolean> {
  if (acc.clerkUserId !== userId) return false;
  if (acc.linkApproved) return true;
  if (!zohoApprovalOn()) return false;
  return zohoApproved(userId);
}
