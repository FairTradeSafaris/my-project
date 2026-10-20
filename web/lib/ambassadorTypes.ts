// lib/ambassadorTypes.ts (batch 24): shapes shared by the ambassador API and
// the dashboard (safe to import in the browser).
export type AmbassadorState = "none" | "pending" | "active" | "paused";

export type AmbassadorProgramme = {
  commissionPercent: number;
  friendDiscount: number;
  minTripValue: number;
  cookieDays: number;
  minPayout: number;
  payoutTerms: string;
  excludedText: string;
};

export type AmbassadorMe = {
  state: AmbassadorState;
  code?: string;
  link?: string;
  programme: AmbassadorProgramme;
};

// batch 26: the "Your referrals" card.
export type AmbassadorReferral = { firstName: string; date: string; status: string };
export type AmbassadorReferrals = {
  clicksThisMonth: number;
  clicksTotal: number;
  months: { month: string; count: number }[];
  /** null when the Zoho referral list is not switched on. */
  referrals: AmbassadorReferral[] | null;
};
