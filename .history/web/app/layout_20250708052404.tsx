import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import CookieConsent from "@/components/CookieConsent";
import { client as sanity } from "@/lib/sanity";
import ScriptInjector from "@/components/ScriptInjector";
import HideZohoWidget from "@/components/HideZohoWidget";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
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
    <html lang="en" className={poppins.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://my-project-pi-five-35.vercel.app"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <ScriptInjector scripts={globalSettings?.customHeaderScripts || []} />
        <LayoutWrapper>{children}</LayoutWrapper>
        <CookieConsent />
        <HideZohoWidget />
      </body>
    </html>
  );
}
