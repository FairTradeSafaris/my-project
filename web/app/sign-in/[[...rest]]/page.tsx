import SignInClient from "./SignInClient";

export const metadata = {
  title: "Sign In | Fair Trade Safaris",
  description: "Access your personalized safari plans and bookings.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Sign In to Fair Trade Safaris",
    description: "Access your personalized safari plans and bookings.",
    url: "https://www.fairtradesafaris.com/sign-in",
    siteName: "Fair Trade Safaris",
    type: "website",
    images: [
      {
        url: "/og-images/safari-signin.jpg",
        width: 1200,
        height: 630,
        alt: "Sign in to view your ethical safari experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In to Fair Trade Safaris",
    description: "Access your personalized safari plans and bookings.",
    images: ["/og-images/safari-signin.jpg"],
  },
};

export default function SignInPage() {
  return <SignInClient />;
}
