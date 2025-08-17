"use client";

import dynamic from "next/dynamic";

const ClerkWrapper = dynamic(() => import("./ClerkWrapper"), {
  ssr: false,
  loading: () => <></>,
});

export default function ClerkClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkWrapper>{children}</ClerkWrapper>;
}
