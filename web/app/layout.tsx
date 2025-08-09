"use client";

import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import ClientLayout from "@/components/ClientLayout";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import GlobalScriptWrapper from "@/components/GlobalScriptWrapper";
import LeadMagnetWrapper from "@/components/LeadMagnetWrapper";
import { ClerkWrapper } from "@/components/ClerkWrapper";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Fair Trade Safaris",
  description: "Explore ethical luxury safaris in Africa",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isJourneyPage = pathname?.startsWith("/journey");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon1.ico" />
        <link rel="shortcut icon" href="/favicon1.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2F3E46" />
      </head>

      <body
        className={`${poppins.variable} font-poppins min-h-screen flex flex-col bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300`}
      >
        <ClerkWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScriptWrapper />
            <ClientLayout>{children}</ClientLayout>
            {!(isJourneyPage && isMobile) && <LeadMagnetWrapper />}
            <CookieConsent />
          </ThemeProvider>
        </ClerkWrapper>
      </body>
    </html>
  );
}
