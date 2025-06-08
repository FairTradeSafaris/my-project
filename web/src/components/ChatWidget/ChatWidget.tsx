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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const index = Math.floor(Math.random() * avatars.length);
    const messageIndex = Math.floor(Math.random() * messages.length);
    setAvatar(avatars[index]);
    setGreeting(messages[messageIndex]);
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 hover:scale-105 transition"
        >
          <div className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-md font-poppins">
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
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-xl border border-gray-300 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 bg-[#d8c3a5]">
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Chat Avatar"
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="text-sm font-semibold font-poppins">
                Safari Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-gray-700 text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="p-4 text-sm text-gray-700 font-poppins">
            <p>This is a placeholder. Your safari chat will go here!</p>
          </div>
        </div>
      )}
    </>
  );
}
