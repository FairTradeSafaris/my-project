import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center text-foreground"
      style={{ backgroundImage: "url('/destinations/botswana.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
