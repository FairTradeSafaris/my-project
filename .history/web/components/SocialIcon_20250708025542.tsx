import Image from "next/image";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { Platform } from "@/types/ambassador";
import * as React from "react"; // Ensures JSX types are available

interface Props {
  platform: Platform;
  size?: number;
  icon?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
}

const iconMap: Partial<Record<Platform, React.ElementType>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Globe, // fallback
  website: Globe,
};

export default function SocialIcon({ platform, size = 16, icon }: Props) {
  if (icon?.asset?._ref) {
    return (
      <Image
        src={urlFor(icon).width(size).height(size).url()}
        alt={platform}
        width={size}
        height={size}
      />
    );
  }

  const IconComponent = iconMap[platform] ?? Globe;
  return <IconComponent size={size} />;
}
