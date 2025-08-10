// app/layout.tsx
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-poppins min-h-screen flex flex-col bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300`}
      >
        <ClerkWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScriptWrapper />
            {/* ⬇️ Everything that might call useSearchParams is now inside Suspense */}
            <Suspense fallback={null}>
              <ClientLayout>{children}</ClientLayout>
              <LeadMagnetGate />
              <CookieConsent />
            </Suspense>
          </ThemeProvider>
        </ClerkWrapper>
      </body>
    </html>
  );
}
