import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import ClientLayout from "@/components/ClientLayout";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import GlobalScriptWrapper from "@/components/GlobalScriptWrapper";
import { ClerkWrapper } from "@/components/ClerkWrapper";
import LeadMagnetGate from "@/components/LeadMagnetGate";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import GlobalBookingPortal from "@/components/GlobalBookingPortal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Fair Trade Safaris",
  description: "Explore ethical luxury safaris in Africa",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-20250810.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = { themeColor: "#2F3E46" };

// app/layout.tsx
// (leave your imports as-is)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="...">
        <ClerkWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScriptWrapper />

            <Suspense fallback={null}>
              <ClientLayout>{children}</ClientLayout>
              {/* Mount booking portal once */}
              <GlobalBookingPortal />
              <LeadMagnetGate />
              <CookieConsent />
            </Suspense>
          </ThemeProvider>
        </ClerkWrapper>
      </body>
    </html>
  );
}
