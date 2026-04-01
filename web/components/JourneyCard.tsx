"use client";

import JourneyCardInner from "@/components/JourneyCardInner";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCard(props: JourneyCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col">
      <JourneyCardInner {...props} />
    </div>
  );
}
