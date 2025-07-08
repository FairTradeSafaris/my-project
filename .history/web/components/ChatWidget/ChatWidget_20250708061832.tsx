"use client";
import { useEffect, useState } from "react";

const avatars = [
  "/avatars/giraffe.svg",
  "/avatars/elephant.svg",
  "/avatars/lion.svg",
];

const messages = [
  "How can I assist you?",
  "Need help planning your dream safari?",
  "Let’s build your perfect trip 🌍",
  "Ask me anything about Africa 🦁",
  "Where to next, explorer?",
  "Lost in the savanna? I'm here 🐘",
];

export default function ChatWidget() {
  const [avatar, setAvatar] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const index = Math.floor(Math.random() * avatars.length);
    const messageIndex = Math.floor(Math.random() * messages.length);
    setAvatar(avatars[index]);
    setGreeting(messages[messageIndex]);
  }, []);

  return (
    <button
      onClick={() => {
        if (window.$zoho?.salesiq?.floatwindow?.visible) {
          window.$zoho.salesiq.floatwindow.visible("show");
        }
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 hover:scale-105 transition"
    >
      <div className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-md">
        {greeting}
      </div>
      <div className="relative w-16 h-16 rounded-full bg-[#d8c3a5] shadow-lg">
        {avatar && (
          <img
            src={avatar}
            alt="Chat Avatar"
            className="absolute inset-0 p-1.5 rounded-full object-contain"
          />
        )}
      </div>
    </button>
  );
}
