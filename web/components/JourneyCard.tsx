"use client";

import JourneyCardInner from "@/components/JourneyCardInner";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCard(props: JourneyCardProps) {
  // A journey without a slug has no page: its card linked to
  // /africansafariitineraries// or /africansafariitineraries/null/.
  // Only those cards are skipped.
  if (!props.slug || props.slug === "null") return null;
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col">
      <JourneyCardInner {...props} />
    </div>
  );
}
