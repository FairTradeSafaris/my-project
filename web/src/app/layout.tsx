import "./globals.css";
import "@fontsource/poppins";
import LayoutWrapper from "../components/LayoutWrapper";
import CookieConsent from "@/components/CookieConsent";
import { client as sanity } from "../../lib/sanity";

const globalSettings = await sanity.fetch(
  `*[_type == "globalSettings"][0]{
    customHeaderScripts
  }`
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {globalSettings?.customHeaderScripts && (
          <script
            dangerouslySetInnerHTML={{
              __html: globalSettings.customHeaderScripts,
            }}
          />
        )}
      </head>
      <body className="font-sans">
        <LayoutWrapper>{children}</LayoutWrapper>
        <CookieConsent />
      </body>
    </html>
  );
}
