"use client";
import dynamic from "next/dynamic";

const BookPageContent = dynamic(() => import("./BookPageContent"), {
  ssr: false,
});

export default function BookPageWrapper() {
  return <BookPageContent />;
}
