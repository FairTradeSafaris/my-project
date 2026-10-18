// lib/server/ambassadorAccount.ts (batch 24)
// Server-only helpers for the ambassador dashboard. An "Ambassador Account"
// (Sanity, new type) links a referral code to a Clerk user ID. Nothing else
// about the person is stored in Sanity.
import { serverClient } from "@/lib/sanity.server";
import { cleanRefCode } from "@/lib/referral";
import { getAmbassadorSettings, makeFill } from "@/lib/ambassadorSettings";
import type { AmbassadorMe, AmbassadorProgramme, AmbassadorState } from "@/lib/ambassadorTypes";

export const SITE_URL = "https://www.fairtradesafaris.com";

export type AccountDoc = {
  _id: string;
  _rev: string;
  code?: string;
  status?: string;
  linkApproved?: boolean;
  clerkUserId?: string;
};

const FIELDS = `_id, _rev, code, status, linkApproved, clerkUserId`;
const PUBLISHED = `!(_id in path("drafts.**"))`;

/** The published account linked (or claimed) by this Clerk user, if any. */
export async function accountForUser(userId: string): Promise<AccountDoc | null> {
  return serverClient.fetch(
    `*[_type == "ambassadorAccount" && ${PUBLISHED} && clerkUserId == $userId] | order(_createdAt asc)[0]{${FIELDS}}`,
    { userId },
  );
}

/** The published account with this code, if any. */
export async function accountForCode(code: string): Promise<AccountDoc | null> {
  const clean = cleanRefCode(code);
  if (!clean) return null;
  return serverClient.fetch(
    `*[_type == "ambassadorAccount" && ${PUBLISHED} && upper(code) == $code][0]{${FIELDS}}`,
    { code: clean },
  );
}

export function stateOf(acc: AccountDoc | null): AmbassadorState {
  if (!acc) return "none";
  if (!acc.linkApproved) return "pending";
  return acc.status === "paused" ? "paused" : "active";
}

export async function programme(): Promise<AmbassadorProgramme> {
  const s = await getAmbassadorSettings();
  const fill = makeFill(s);
  return {
    commissionPercent: s.commissionPercent,
    friendDiscount: s.friendDiscount,
    minTripValue: s.minTripValue,
    cookieDays: s.cookieDays,
    minPayout: s.minPayout,
    payoutTerms: fill(s.payoutTerms),
    excludedText: s.excludedText,
  };
}

export async function meFor(userId: string): Promise<AmbassadorMe> {
  const [acc, prog] = await Promise.all([accountForUser(userId), programme()]);
  const state = stateOf(acc);
  const code = cleanRefCode(acc?.code);
  const out: AmbassadorMe = { state, programme: prog };
  if (acc && code) out.code = code;
  // The share link is only handed out once the link is approved.
  if ((state === "active" || state === "paused") && code) out.link = `${SITE_URL}/?ref=${encodeURIComponent(code)}`;
  return out;
}

/**
 * Record a claim on the published account and on its draft, if Devon has
 * one open, so publishing the draft later doesn't wipe the claim.
 * ifRevisionId makes two people claiming at the same moment impossible.
 */
export async function recordClaim(acc: AccountDoc, userId: string) {
  const now = new Date().toISOString();
  await serverClient
    .patch(acc._id)
    .ifRevisionId(acc._rev)
    .set({ clerkUserId: userId, claimedAt: now, linkApproved: false })
    .commit();
  try {
    const draftId = `drafts.${acc._id}`;
    const draft = await serverClient.fetch(`*[_id == $id][0]{_id, clerkUserId}`, { id: draftId });
    if (draft && !draft.clerkUserId) {
      await serverClient.patch(draftId).set({ clerkUserId: userId, claimedAt: now }).commit();
    }
  } catch {
    /* the published claim is what counts */
  }
}
