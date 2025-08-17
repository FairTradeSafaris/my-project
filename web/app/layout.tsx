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
import Head from "next/head";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link
          rel="preconnect"
          href="https://clerk.demo.fairtradesafaris.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://jw917r14.api.sanity.io"
          crossOrigin="anonymous"
        />
      </Head>
      <body className={`${poppins.variable} font-sans`}>
        <ClerkWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScriptWrapper />
            <Suspense fallback={null}>
              <ClientLayout>{children}</ClientLayout>
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
