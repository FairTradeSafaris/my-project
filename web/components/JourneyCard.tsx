"use client";

import JourneyCardInner from "@/components/JourneyCardInner";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCard(props: JourneyCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#fdf8f3] dark:bg-neutral-900 flex flex-col">
      <JourneyCardInner {...props} />
    </div>
  );
}
