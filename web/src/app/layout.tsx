import "./globals.css";
import "@fontsource/poppins";
import LayoutWrapper from "../components/LayoutWrapper";
import CookieConsent from "@/components/CookieConsent";
import { client as sanity } from "../../lib/sanity";
import ScriptInjector from "@/components/ScriptInjector";

const globalSettings = await sanity.fetch(
  `*[_type == "globalSettings"][0]{
    customHeaderScripts
  }`
);

export const metadata = {
  title: "Fair Trade Safaris",
  description: "Explore ethical luxury safaris in Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ScriptInjector scripts={globalSettings?.customHeaderScripts || []} />
        <LayoutWrapper>{children}</LayoutWrapper>
        <CookieConsent />
      </body>
    </html>
  );
}
