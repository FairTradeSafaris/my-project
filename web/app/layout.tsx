import "./globals.css";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "next-themes";
import { client as sanity } from "@/lib/sanity";

// ✅ Use on-demand Clerk loader instead
import ClerkOnDemand from "@/components/ClerkOnDemand";

import ClerkConsentGate from "@/components/ClerkConsentGate";
import ClientLayout from "@/components/ClientLayout";
import GlobalScriptWrapper from "@/components/GlobalScriptWrapper";
import GlobalBookingPortal from "@/components/GlobalBookingPortal";
import LeadMagnetGate from "@/components/LeadMagnetGate";
import CookieConsent from "@/components/CookieConsent";

import { headers } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon1.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = { themeColor: "#2F3E46" };

async function getOrganizationSchema() {
  const org = await sanity.fetch(
    `*[_type == "organization"][0]{
      name,
      description,
      website,
      telephone,
      priceRange,
      logo { asset->{url} },
      image { asset->{url} },
      address {
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry
      },
      socials[] { url }
    }`,
  );

  if (!org) return null;

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${org.website}#organization`,
    name: org.name,
    url: org.website,
    logo: org.logo?.asset?.url,
    image: org.image?.asset?.url,
    description: org.description,
    telephone: org.telephone,
    priceRange:
      typeof org.priceRange === "string"
        ? org.priceRange
        : org.priceRange?.min && org.priceRange?.max
          ? `$${org.priceRange.min.toLocaleString()} – $${org.priceRange.max.toLocaleString()}`
          : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address?.streetAddress,
      addressLocality: org.address?.addressLocality,
      addressRegion: org.address?.addressRegion,
      postalCode: org.address?.postalCode,
      addressCountry: org.address?.addressCountry,
    },
    sameAs: org.socials?.map((s: { url: string }) => s.url).filter(Boolean),
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Place", name: "Africa" },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const organizationSchema = await getOrganizationSchema();
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const isSlugPage =
    pathname.startsWith("/meta-test/") ||
    pathname.startsWith("/destination/") ||
    pathname === "/luxury-african-safaris";

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${poppins.variable} font-sans`}>
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        )}

        <ClerkOnDemand>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <GlobalScriptWrapper />
            <Suspense fallback={null}>
              <ClerkConsentGate>
                {isSlugPage ? (
                  children
                ) : (
                  <ClientLayout>{children}</ClientLayout>
                )}
                <GlobalBookingPortal />
                <LeadMagnetGate />
              </ClerkConsentGate>
              <CookieConsent />
            </Suspense>
          </ThemeProvider>
        </ClerkOnDemand>
      </body>
    </html>
  );
}
