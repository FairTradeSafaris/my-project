"use client";

// Batch 13: one card for everyone (the wishlist heart sends signed-out
// visitors to sign in, as before). The no-consent copy was removed.
import JourneyCardWithAuth from "./JourneyCardWithAuth";
import type { JourneyCardProps } from "@/types/journey";

export default function JourneyCardInner(props: JourneyCardProps) {
  return <JourneyCardWithAuth {...props} />;
}
