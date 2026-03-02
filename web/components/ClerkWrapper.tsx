"use client";

import dynamic from "next/dynamic";

const ClerkWrapper = dynamic(() => import("./ClerkWrapper"), {
  ssr: false,
  loading: () => <></>,
});

export default function ClerkClientWrapper({
  children,
  publishableKey,
}: {
  children: React.ReactNode;
  publishableKey: string;
}) {
  return (
    <ClerkWrapper publishableKey={publishableKey}>{children}</ClerkWrapper>
  );
}
