"use client";

import { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function ClerkConsentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [consent, setConsent] = useState<string | null>(null);

  // Clerk auth routes that ALWAYS need ClerkProvider
  const clerkRoutes = [
    "/sign-in",
    "/sign-up",
    "/sso-callback",
    "/user-profile",
  ];

  const isClerkRoute = pathname
    ? clerkRoutes.some((r) => pathname.startsWith(r))
    : false;

  useEffect(() => {
    const getConsent = () => {
      const stored = localStorage.getItem("cookieConsent");
      setConsent(stored); // "accepted", "denied", or null
    };

    getConsent();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cookieConsent") getConsent();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", getConsent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", getConsent);
    };
  }, []);

  // 🔥 1️⃣ ALWAYS enable Clerk on sign-in/sign-up pages
  if (isClerkRoute) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        {children}
      </ClerkProvider>
    );
  }

  // 🟡 2️⃣ Consent undecided → no Clerk for main app
  if (consent === null) {
    return <>{children}</>;
  }

  // 🟢 3️⃣ Consent accepted → enable Clerk
  if (consent === "accepted") {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        {children}
      </ClerkProvider>
    );
  }

  // ❌ 4️⃣ Consent denied → no Clerk
  return <>{children}</>;
}
