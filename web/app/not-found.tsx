// app/not-found.tsx
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm opacity-80">
          The page you’re looking for doesn’t exist.
        </p>
      </main>
    </Suspense>
  );
}
