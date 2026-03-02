"use client";

import { useEffect, useState, type ReactNode, type ComponentType } from "react";

type ClerkProviderType = ComponentType<{
  children: ReactNode;
  publishableKey: string;
}>;

export default function ClerkOnDemand({ children }: { children: ReactNode }) {
  const [ClerkProvider, setClerkProvider] = useState<ClerkProviderType | null>(
    null,
  );

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent") === "true";
    if (!consent) return;

    import("@clerk/nextjs").then((mod) => {
      setClerkProvider(() => mod.ClerkProvider);
    });
  }, []);

  if (!ClerkProvider) return <>{children}</>;

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  );
}
