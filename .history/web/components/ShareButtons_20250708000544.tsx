"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaEnvelope,
  FaSms,
  FaTelegramPlane,
  FaRedditAlien,
  FaPinterestP,
  FaLink,
} from "react-icons/fa";
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

  const iconStyle =
    "w-8 h-8 p-1.5 rounded-full text-white flex items-center justify-center hover:opacity-80 transition";
  const platforms = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
      icon: <FaFacebookF />,
      color: "bg-blue-600",
      label: "Facebook",
    },
    {
      href: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`,
      icon: <FaTwitter />,
      color: "bg-blue-400",
      label: "Twitter",
    },
    {
      href: `https://api.whatsapp.com/send?text=${title} - ${currentUrl}`,
      icon: <FaWhatsapp />,
      color: "bg-green-500",
      label: "WhatsApp",
    },
    {
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${title}`,
      icon: <FaLinkedinIn />,
      color: "bg-blue-700",
      label: "LinkedIn",
    },
    {
      href: `mailto:?subject=${title}&body=${currentUrl}`,
      icon: <FaEnvelope />,
      color: "bg-gray-600",
      label: "Email",
    },
    {
      href: `sms:&body=${title} - ${currentUrl}`,
      icon: <FaSms />,
      color: "bg-pink-500",
      label: "iMessage/SMS",
    },
    {
      href: `https://t.me/share/url?url=${currentUrl}&text=${title}`,
      icon: <FaTelegramPlane />,
      color: "bg-blue-500",
      label: "Telegram",
    },
    {
      href: `https://reddit.com/submit?url=${currentUrl}&title=${title}`,
      icon: <FaRedditAlien />,
      color: "bg-orange-600",
      label: "Reddit",
    },
    {
      href: `https://pinterest.com/pin/create/button/?url=${currentUrl}&description=${title}`,
      icon: <FaPinterestP />,
      color: "bg-red-600",
      label: "Pinterest",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Link copied!");
  };

  if (!currentUrl) return null;

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-700 mb-2 font-medium">
        Pass it on — share this story:
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {platforms.map((platform, index) => (
          <a
            key={index}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconStyle} ${platform.color}`}
            title={platform.label}
          >
            {platform.icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`${iconStyle} bg-neutral-500`}
          title="Copy Link"
        >
          <FaLink />
        </button>
      </div>
    </div>
  );
}
