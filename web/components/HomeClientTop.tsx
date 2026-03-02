"use client";

import dynamic from "next/dynamic";
import type { FoundersPromiseBlock } from "@/types/types";
import type { PortableTextBlock } from "@portabletext/types";

const WhyChoose = dynamic(() => import("@/components/WhyChoose"), {
  loading: () => <p>Loading section...</p>,
});

const FoundersPromise = dynamic(() => import("@/components/FoundersPromise"), {
  loading: () => <div>Loading...</div>,
});

type WhyChooseBlock = {
  sectionTitle: PortableTextBlock[];
  sideImage?: { asset: { url: string }; alt?: string };
  reasons: {
    icon?: { asset: { url: string }; alt?: string };
    title: string;
    description: string;
  }[];
};

type Props = {
  whyChoose: WhyChooseBlock | null;
  foundersPromise: FoundersPromiseBlock | null;
};

export default function HomeClientTop({ whyChoose, foundersPromise }: Props) {
  return (
    <>
      {whyChoose && <WhyChoose data={whyChoose} />}
      {foundersPromise && <FoundersPromise data={foundersPromise} />}
    </>
  );
}
