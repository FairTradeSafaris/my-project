"use client";
// Batch 13: replaces ClerkConsentGate. Same ClerkProvider and same key the
// gate used (for accepted visitors and on the sign-in pages), now always on
// so login and the client portal work whether or not cookies are accepted.
// Nothing else about Clerk changes (keys, middleware, sign-in pages).
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
