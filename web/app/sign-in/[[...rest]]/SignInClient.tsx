"use client";

import { SignIn, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SignInClient() {
  const { loaded } = useClerk();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) setIsReady(true);
  }, [loaded]);

  if (!isReady) return null;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center text-foreground"
      style={{ backgroundImage: "url('/destinations/botswana.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/client-home"
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#2F3E46] hover:bg-[#1f2a2f] text-white",
            },
          }}
        />
      </div>
    </div>
  );
}
