// components/LeadMagnetWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const LeadMagnet = dynamic(() => import("./LeadMagnet"), {
  ssr: false,
});

export default function LeadMagnetWrapper() {
  return <LeadMagnet />;
}
