"use client";

// Batch 13: the lead magnet is a form, not a tracker, so it no longer
// waits for cookie consent (its own timing rules stay in LeadMagnetWrapper).
import LeadMagnetWrapper from "@/components/LeadMagnetWrapper";

export default function LeadMagnetGate() {
  return <LeadMagnetWrapper />;
}
