import { UserProfile } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <UserProfile />
    </div>
  );
}
