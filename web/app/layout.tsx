import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import ClientLayout from "@/components/ClientLayout";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import GlobalScriptWrapper from "@/components/GlobalScriptWrapper";
import { ClerkProvider } from "@clerk/nextjs"; // ✅ NEW LINE

console.log(
  "Clerk PUBLISHABLE:",
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);
console.log("Clerk SECRET:", process.env.CLERK_SECRET_KEY);
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon1.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>
      <body
        className={`${poppins.variable} font-poppins min-h-screen flex flex-col bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300`}
      >
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <GlobalScriptWrapper />
            <ClientLayout>{children}</ClientLayout>
            <CookieConsent />
          </ThemeProvider>
        </ClerkProvider>
        {/* Testimonials */}
      </body>
    </html>
  );
}
