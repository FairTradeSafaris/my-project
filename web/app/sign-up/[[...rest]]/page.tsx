import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center text-foreground"
      style={{ backgroundImage: "url('/destinations/botswana.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: "bg-white/90 shadow-xl",
              formButtonPrimary: "bg-black hover:bg-gray-800",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "iconButton",
            },
          }}
          afterSignUpUrl="/"
        />
        <div className="text-xs text-gray-500 text-center mt-4">
          By Signing up - We may email you important updates related to your
          trip planning and fair trade safaris.
        </div>
      </div>
    </div>
  );
}
