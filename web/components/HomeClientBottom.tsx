"use client";

import dynamic from "next/dynamic";

const NonProfitCarousel = dynamic(
  () => import("@/components/NonProfitCarousel"),
  {
    loading: () => <div>Loading...</div>,
  },
);

const FeaturedAmbassador = dynamic(
  () => import("@/components/FeaturedAmbassador"),
  {
    loading: () => <div>Loading...</div>,
  },
);

export default function HomeClientBottom() {
  return (
    <>
      <NonProfitCarousel />
      <FeaturedAmbassador />
    </>
  );
}
