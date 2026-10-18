"use client";
// Batch 24: the ambassador area only runs in the browser (private data is
// loaded from /api after the page opens; nothing private is in the page).
import dynamic from "next/dynamic";

const AmbassadorArea = dynamic(() => import("@/components/ambassador/AmbassadorArea"), {
  ssr: false,
  loading: () => (
    <p className="mx-auto max-w-2xl rounded-2xl border border-[#ebe1d3] bg-white p-8 text-[16px] leading-7 text-[#5c4a3d]">
      Loading your ambassador area…
    </p>
  ),
});

export default function AmbassadorAreaWrapper() {
  return <AmbassadorArea />;
}
