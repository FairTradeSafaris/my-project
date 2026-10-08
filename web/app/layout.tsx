import "./globals.css";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import SafariBuilderProvider from "@/components/SafariBuilderProvider";
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
import { DEFAULT_OG_IMAGE } from "@/lib/seoDefaults";
import { preconnect } from "react-dom";
import { FOOTER_QUERY } from "@/lib/footerQuery";
import type { FooterData } from "@/components/SafariFactFooter";

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
  // Site-wide default social image for pages that set no openGraph/twitter
  // metadata of their own (a page's own openGraph replaces this entirely).
  openGraph: {
    siteName: "Fair Trade Safaris",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Fair Trade Safaris" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = { themeColor: "#2F3E46" };

// Batch 4: footer fetched on the server (cached 5 min) so its links are in
// the HTML; the browser no longer queries Sanity for it on every page view.
async function getFooterData(): Promise<FooterData> {
  try {
    return await sanity.fetch(FOOTER_QUERY, {}, { next: { revalidate: 300 } });
  } catch {
    return null; // footer falls back to its own client-side fetch
  }
}

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
    // No hardcoded fallback: omit telephone when Sanity has none.
    telephone: org.telephone?.trim() || undefined,
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
  const [organizationSchema, footerData] = await Promise.all([
    getOrganizationSchema(),
    getFooterData(),
  ]);
  // Batch 4: Sanity images are now loaded from cdn.sanity.io directly (hero
  // included), so open that connection early.
  preconnect("https://cdn.sanity.io");
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
            forcedTheme="light"
          >
            <GlobalScriptWrapper />
            {/* SEO: page content is no longer inside a <Suspense> boundary.
                With it, notFound() was caught inside the boundary after the
                shell was sent, so missing pages returned HTTP 200 (soft 404).
                Only the client-side widgets keep their Suspense boundary. */}
            <ClerkConsentGate>
              {isSlugPage ? (
                children
              ) : (
                <ClientLayout footerData={footerData}>{children}</ClientLayout>
              )}
              <Suspense fallback={null}>
                <SafariBuilderProvider />
                {/* were rendered twice each (duplicate modal markup) */}
                <GlobalBookingPortal />
                <LeadMagnetGate />
              </Suspense>
            </ClerkConsentGate>
            <Suspense fallback={null}>
              <CookieConsent />
            </Suspense>
          </ThemeProvider>
        </ClerkOnDemand>
      </body>
    </html>
  );
}
