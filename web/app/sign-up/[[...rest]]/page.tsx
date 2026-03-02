import SignUpClient from "./SignUpClient";

export const metadata = {
  title: "Sign Up | Fair Trade Safaris",
  description:
    "Create your account to start planning your ethical safari experience.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Sign Up for Fair Trade Safaris",
    description:
      "Create your account to start planning your ethical safari experience.",
    url: "https://www.fairtradesafaris.com/sign-up",
    siteName: "Fair Trade Safaris",
    type: "website",
    images: [
      {
        url: "/og-images/safari-signup.jpg", // Make sure this image exists
        width: 1200,
        height: 630,
        alt: "Create your ethical safari account",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up for Fair Trade Safaris",
    description:
      "Create your account to start planning your ethical safari experience.",
    images: ["/og-images/safari-signup.jpg"],
  },
};

export default function SignUpPage() {
  return <SignUpClient />;
}
