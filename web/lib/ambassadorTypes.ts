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

// batch 28: the "Your earnings" card (figures come from Zoho CRM Deals).
export type EarningStatus = "pending" | "earned" | "paid";
export type AmbassadorEarningRow = { firstName: string; date: string; status: EarningStatus; amount: number };
export type AmbassadorEarnings = {
  /** false = ZOHO_EARNINGS is not switched on yet ("coming soon"). */
  enabled: boolean;
  totals: { pending: number; earned: number; paid: number };
  minPayout: number;
  rules: string[];
  reward: { label: string; type: "bookings" | "value"; target: number; progress: number } | null;
  bookings: AmbassadorEarningRow[];
  /** Payout already requested in the last 24 hours. */
  payoutRequested: boolean;
};
