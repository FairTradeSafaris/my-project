"use client";

import { useEffect, useState } from "react";

type ShareButtonsProps = {
  title: string;
};

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!currentUrl) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Share this story
      </h3>
      <div className="flex space-x-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Twitter
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
