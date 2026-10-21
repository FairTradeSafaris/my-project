// Batch 29: put Saurabh Khetrapal's new rules into the Ambassador Settings
// document (3% of the total package value, friend offers case by case) as
// plain fixed text. Changes text values only, plus commissionPercent = 3 and
// friendDiscount = 0. Safe to run again (skips when already done).
// Run from the studio folder:  npx sanity exec scripts/batch29-ambassador-settings.mjs --with-user-token
const OFFER = "Friends may get special offers on selected trips, decided case by case.";
const EXACT = {
  "Applies to their first safari of US${minTrip} or more": OFFER,
  "Share the Africa you love. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.":
    "Share the Africa you love. Earn 3% of the total package value on every safari you refer.",
  "You get a personal code and link. Anyone who enquires within {days} days of clicking is linked to you, and your friends get US${discount} off.":
    "You get a personal code and link. Anyone who enquires within 90 days of clicking is linked to you.",
  "US${discount} off their first safari of US${minTrip} or more when they book through your link or code.":
    "We sometimes have special offers on selected trips, for example in Kenya, South Africa or on Kilimanjaro, decided case by case. We'll let you know when there's one you can share.",
  "Your friend's US${discount} discount applies once per new client, on a first booking of US${minTrip} or more, and cannot be combined with other offers.":
    "Special offers for friends are decided case by case on selected trips, and cannot be combined with other offers.",
  "Join our Ambassador Programme. Earn {commission}% on every safari you refer, and your friends get US${discount} off their first trip.":
    "Join our Ambassador Programme. Earn 3% of the total package value on every safari you refer.",
  "Join our safari affiliate and ambassador programme. Earn {commission}% on every safari you refer, and your friends get ${discount} off.":
    "Join our safari affiliate and ambassador programme. Earn 3% of the total package value on every safari you refer.",
};
const PART = [
  ["You earn {commission}% of the safari package, your friend gets US${discount} off,", "You earn 3% of the total package value,"],
  ["of the safari package", "of the total package value"],
];
function fixString(s, doc) {
  if (EXACT[s]) return EXACT[s];
  for (const [a, b] of PART) s = s.split(a).join(b);
  const money = (n) => Math.round(n).toLocaleString("en-US");
  const tok = {
    commission: "3",
    excluded: doc.excludedText || "international flights, park fees and visas",
    exampleTrip: "10,000",
    exampleEarn: "300",
    days: String(doc.cookieDays ?? 90),
    minPayout: money(doc.minPayout ?? 50),
    groupMin: String(doc.groupMinGuests ?? 8),
  };
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in tok ? tok[k] : m));
}
function walk(v, doc) {
  if (typeof v === "string") return fixString(v, doc);
  if (Array.isArray(v)) return v.map((x) => walk(x, doc));
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = k.startsWith("_") || k === "asset" ? x : walk(x, doc);
    return o;
  }
  return v;
}
export function plan(doc) {
  const set = {};
  for (const [k, v] of Object.entries(doc)) {
    if (k.startsWith("_") || ["heroImage", "stripImage", "impactQuote"].includes(k)) continue;
    const n = walk(v, doc);
    if (JSON.stringify(n) !== JSON.stringify(v)) set[k] = n;
  }
  if (doc.commissionPercent !== 3) set.commissionPercent = 3;
  if (doc.friendDiscount !== 0) set.friendDiscount = 0;
  return set;
}
const show = (v) => (typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v).slice(0, 600));

async function main() {
  const { getCliClient } = await import("sanity/cli");
  const client = getCliClient({ apiVersion: "2023-10-01" }).withConfig({ perspective: "raw", useCdn: false });
  const docs = await client.fetch(`*[_id in ["ambassadorSettings", "drafts.ambassadorSettings"]]`);
  if (!docs.length) { console.log("No Ambassador Settings document found. Nothing changed."); return; }
  for (const doc of docs) {
    const set = plan(doc);
    const keys = Object.keys(set);
    console.log(`\n=== ${doc._id} ===`);
    if (!keys.length) { console.log("Already up to date. Nothing changed."); continue; }
    for (const k of keys) console.log(`- ${k}\n  BEFORE: ${show(doc[k])}\n  AFTER:  ${show(set[k])}`);
    await client.patch(doc._id).set(set).commit();
    console.log(`Saved ${keys.length} field(s) on ${doc._id}.`);
  }
  const left = JSON.stringify(await client.fetch(`*[_id == "ambassadorSettings"][0]`));
  if (/US\$250|\{discount\}|\{commission\}/.test(left)) console.log("WARNING: some old wording is still there - send me this screen.");
  else console.log("\nAmbassador Settings is now live with the new wording (the website updates within about 5 minutes).");
}
if (!process.env.B29_TEST) main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
