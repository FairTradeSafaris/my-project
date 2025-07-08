"use client";

import dynamic from "next/dynamic";

const HeroWithSearch = dynamic(() => import("./HeroWithSearch"), {
  ssr: false,
  loading: () => <p>Loading hero...</p>,
});

export default function HeroWithSearchWrapper() {
  return <HeroWithSearch />;
}
