// Batch 23: shared look for the core pages (ethical, promise, FAQ, guides,
// team, partners, contact, privacy, destinations). Builds on the homepage
// styles (batch 20) and the pillar pages (batch 22b): cream / white sections,
// white rounded cards, 16px warm-brown body text, outlined buttons. Display
// only; import these instead of repeating class strings.
export {
  homeBody as coreBody,
  homeButton as coreButton,
  homeButtonOutline as coreButtonOutline,
  homeCard as coreCard,
  homeContainer as coreContainer,
  homeEyebrow as coreEyebrow,
  homeH2 as coreH2,
  homeH3 as coreH3,
  homeTextLink as coreTextLink,
} from "@/components/home/homeStyles";

export const coreCream = "bg-[#f7f3ec]";
export const coreWhite = "bg-white";
export const coreSection = "py-10 md:py-14";
/** Page H1 when the hero shows the headline as text (h1 lives in the page). */
export const coreH1 =
  "text-[32px] font-semibold leading-tight tracking-[-0.01em] text-[#24170f] md:text-[44px]";
export const coreLead = "text-[18px] leading-8 text-[#5c4a3d] md:text-[19px]";
/** Inline link inside body text (AA on white and cream). */
export const coreLink =
  "font-medium text-[#9a4f22] underline decoration-[#c9974f] underline-offset-4 transition-colors hover:text-[#24170f]";
/** Soft cream card for use on white sections. */
export const coreCardSoft =
  "rounded-2xl border border-[#ebe1d3] bg-[#fbf8f3] shadow-[0_1px_2px_rgba(36,23,15,0.03),0_14px_32px_-24px_rgba(36,23,15,0.25)]";
export const coreDivider = "border-t border-[#efe5d6]";
/** Round cream badge behind a small line icon. */
export const coreIconBadge =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2e7db] text-[#a35c2d]";
/** Square-cornered choice chip (no pills). */
export const coreChip =
  "rounded-lg border px-3.5 py-2 text-[15px] transition-colors";
