// lib/server/ambassadorEarnings.ts (batch 28)
// Earnings for one ambassador code, read live from Zoho CRM Deals whose
// referral-code field equals the code, with commission worked out from the
// Earnings rules in Ambassador Settings (Sanity). Every rule has a default
// matching today's programme. Only first name, date, status and the
// commission amount are sent to the browser: never the trip price, profit,
// surnames or contact details.
//
// Vercel switches (all optional except ZOHO_EARNINGS):
//   ZOHO_EARNINGS=1                    turn the card on (otherwise "coming soon")
//   ZOHO_DEAL_REFERRAL_FIELD           Deal field with the code (default Referral_Code)
//   ZOHO_DEAL_WON_STAGES               Stages that mean earned, | separated (default Closed Won)
//   ZOHO_DEAL_PAID_FIELD               Checkbox: commission paid (default Commission_Paid)
//   ZOHO_DEAL_PROFIT_FIELD             Number field, only for "% of profit" (default Profit)
import { serverClient } from "@/lib/sanity.server";
import { cleanRefCode } from "@/lib/referral";
import { searchModule, zohoEscape } from "@/lib/server/zohoSearch";
import type { AmbassadorEarnings, EarningStatus } from "@/lib/ambassadorTypes";

type Basis = "percentTrip" | "percentProfit" | "fixed";
type When = "deposit" | "fullPayment" | "afterTravel";

export type EarningRules = {
  basis: Basis;
  value: number;
  when: When;
  minPayout: number;
  payoutMethods: string;
  repeatEarns: boolean;
  reward: { enabled: boolean; type: "bookings" | "value"; target: number; label: string };
};

const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : d);
const str = (v: unknown, d: string) => (typeof v === "string" && v.trim() ? v.trim() : d);
const pick = <T extends string>(v: unknown, ok: readonly T[], d: T): T => (ok.includes(v as T) ? (v as T) : d);
const usd = (n: number) => `US$${(Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export async function earningRules(): Promise<EarningRules> {
  const r =
    ((await serverClient.fetch(
      `*[_id == "ambassadorSettings"][0]{commissionPercent, minPayout, earnBasis, earnValue, earnWhen, payoutMethodsText, repeatBookingsEarn, rewardEnabled, rewardType, rewardTarget, rewardLabel}`,
    )) as Record<string, unknown> | null) ?? {};
  const basis = pick(r.earnBasis, ["percentTrip", "percentProfit", "fixed"] as const, "percentTrip");
  const pct = num(r.commissionPercent, 3);
  return {
    basis,
    value: num(r.earnValue, basis === "fixed" ? 0 : pct),
    when: pick(r.earnWhen, ["deposit", "fullPayment", "afterTravel"] as const, "fullPayment"),
    minPayout: num(r.minPayout, 50),
    payoutMethods: str(r.payoutMethodsText, "By PayPal, Wise or bank transfer, once a month."),
    repeatEarns: r.repeatBookingsEarn === true,
    reward: {
      enabled: r.rewardEnabled === true && num(r.rewardTarget, 0) > 0,
      type: pick(r.rewardType, ["bookings", "value"] as const, "bookings"),
      target: num(r.rewardTarget, 0),
      label: str(r.rewardLabel, "A reward from Fair Trade Safaris"),
    },
  };
}

const apiName = (v: string | undefined, d: string) => {
  const s = (v || "").trim();
  return /^[A-Za-z0-9_]{1,100}$/.test(s) ? s : d;
};
export const earningsOn = () => process.env.ZOHO_EARNINGS === "1";
const F = () => ({
  ref: apiName(process.env.ZOHO_DEAL_REFERRAL_FIELD, "Referral_Code"),
  paid: apiName(process.env.ZOHO_DEAL_PAID_FIELD, "Commission_Paid"),
  profit: apiName(process.env.ZOHO_DEAL_PROFIT_FIELD, "Profit"),
  won: (process.env.ZOHO_DEAL_WON_STAGES || "Closed Won")
    .split("|")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean),
});

/** A Deal turned into what the dashboard needs, plus Devon-only details for the payout email. */
export type EarningDeal = {
  firstName: string;
  date: string;
  status: EarningStatus;
  amount: number;
  tripValue: number;
  dealName: string;
  dealId: string;
};

const lostStage = (stage: string) => /lost|dead|cancel/i.test(stage);

function firstNameOf(row: Record<string, unknown>): string {
  const contact = row.Contact_Name as { name?: unknown } | null | undefined;
  const raw = (contact && typeof contact.name === "string" && contact.name) || String(row.Deal_Name ?? "");
  const w = raw.trim().split(/\s+/)[0] || "";
  return w.replace(/[^\p{L}'-]/gu, "").slice(0, 30) || "A friend";
}

/** null = Zoho couldn't be asked (show "can't load right now"). */
export async function dealsFor(rawCode: string, rules: EarningRules): Promise<EarningDeal[] | null> {
  const code = cleanRefCode(rawCode);
  if (!code) return [];
  const f = F();
  const rows = await searchModule("Deals", { criteria: `(${f.ref}:equals:${zohoEscape(code)})` }, [
    "Deal_Name",
    "Contact_Name",
    "Stage",
    "Amount",
    "Closing_Date",
    "Created_Time",
    f.ref,
    f.paid,
    f.profit,
  ]);
  if (rows === null) return null;
  const sorted = rows
    .filter((r) => String(r[f.ref] ?? "").trim().toUpperCase() === code) // belt and braces
    .filter((r) => !lostStage(String(r.Stage ?? "")))
    .map((r) => ({ r, created: String(r.Created_Time ?? "") }))
    .sort((a, b) => a.created.localeCompare(b.created));
  const seenContacts = new Set<string>();
  const out: EarningDeal[] = [];
  for (const { r, created } of sorted) {
    const stage = String(r.Stage ?? "").trim().toLowerCase();
    const status: EarningStatus = r[f.paid] === true ? "paid" : f.won.includes(stage) ? "earned" : "pending";
    const contactId = String((r.Contact_Name as { id?: unknown } | null)?.id ?? "");
    const repeat = !!contactId && seenContacts.has(contactId);
    if (contactId) seenContacts.add(contactId);
    const tripValue = num(r.Amount, 0);
    let amount = 0;
    if (!repeat || rules.repeatEarns) {
      if (rules.basis === "fixed") amount = rules.value;
      else amount = ((rules.basis === "percentProfit" ? num(r[f.profit], 0) : tripValue) * rules.value) / 100;
    }
    out.push({
      firstName: firstNameOf(r),
      date: (String(r.Closing_Date ?? "") || created).slice(0, 10),
      status,
      amount: Math.round(amount * 100) / 100,
      tripValue,
      dealName: String(r.Deal_Name ?? "").slice(0, 120),
      dealId: String(r.id ?? ""),
    });
  }
  return out.reverse(); // newest first
}

function ruleSentences(r: EarningRules): string[] {
  const how =
    r.basis === "fixed"
      ? `You earn ${usd(r.value)} for each booking a friend makes.`
      : r.basis === "percentProfit"
        ? `You earn ${r.value}% of our profit on each safari a friend books.`
        : `You earn ${r.value}% of the price of each safari a friend books.`;
  const when =
    r.when === "deposit"
      ? "It counts as earned once your friend has paid their deposit."
      : r.when === "afterTravel"
        ? "It counts as earned once your friend has been on their safari."
        : "It counts as earned once your friend has paid for their safari in full.";
  const repeat = r.repeatEarns
    ? "If the same friend books again, you earn again."
    : "Commission is paid on a friend's first booking only.";
  return [how, when, `We pay once at least ${usd(r.minPayout)} is ready. ${r.payoutMethods}`, repeat];
}

const round = (n: number) => Math.round(n * 100) / 100;

export function totalsOf(deals: EarningDeal[]) {
  const t = { pending: 0, earned: 0, paid: 0 };
  for (const d of deals) t[d.status] += d.amount;
  return { pending: round(t.pending), earned: round(t.earned), paid: round(t.paid) };
}

export const PAYOUT_GAP_MS = 24 * 3600 * 1000;
export const payoutRequestedRecently = (iso?: string | null) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) && Date.now() - t < PAYOUT_GAP_MS;
};

/** null = Zoho couldn't be asked. */
export async function earningsFor(rawCode: string, lastPayoutRequestAt?: string | null): Promise<AmbassadorEarnings | null> {
  const rules = await earningRules();
  const base = {
    minPayout: rules.minPayout,
    rules: ruleSentences(rules),
    payoutRequested: payoutRequestedRecently(lastPayoutRequestAt),
  };
  if (!earningsOn()) {
    return { ...base, enabled: false, totals: { pending: 0, earned: 0, paid: 0 }, reward: null, bookings: [] };
  }
  const deals = await dealsFor(rawCode, rules);
  if (deals === null) return null;
  const paid = deals.filter((d) => d.status === "paid");
  return {
    ...base,
    enabled: true,
    totals: totalsOf(deals),
    reward: rules.reward.enabled
      ? {
          label: rules.reward.label,
          type: rules.reward.type,
          target: rules.reward.target,
          progress: rules.reward.type === "value" ? round(paid.reduce((t, d) => t + d.tripValue, 0)) : paid.length,
        }
      : null,
    bookings: deals.map(({ firstName, date, status, amount }) => ({ firstName, date, status, amount })),
  };
}
