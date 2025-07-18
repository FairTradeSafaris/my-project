// /app/blog/page.tsx
import { Suspense } from "react";
import BlogIndexPage from "./BlogIndexPage";

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading blog...</div>}>
      <BlogIndexPage />
    </Suspense>
  );
}
