import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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
        />
      </div>
    </div>
  );
}
