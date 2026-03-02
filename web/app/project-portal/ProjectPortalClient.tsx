"use client";

import { useState, useEffect } from "react";

import { client } from "@/lib/sanity";
import type { PortableTextBlock } from "@portabletext/types";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Image from "next/image";

// 📄 Section type
type Section = {
  title: string;
  body: PortableTextBlock[];
};

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-300 bg-[#f3f4f6] mb-5 shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 font-medium text-lg"
      >
        {open ? "▾" : "▸"} {title}
      </button>
      {open && <div className="px-6 py-4 bg-white">{children}</div>}
    </div>
  );
}

export default function ProjectPortalClient() {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const PASSWORD = "fts-access";

  useEffect(() => {
    if (!entered) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await client.fetch(
        `*[_type == "projectPortal"][0]{ sections }`
      );
      setSections(data?.sections || []);
      setLoading(false);
    };

    fetchData();
  }, [entered]);

  return (
    <>
      {!entered ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
            <Image
              src="/alexive-logo.jpeg"
              alt="Alexive Logo"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter password..."
              className="w-full border px-4 py-2 rounded mb-4"
            />
            <button
              onClick={() => setEntered(input === PASSWORD)}
              className="w-full bg-black text-white py-2 rounded"
            >
              Enter
            </button>
          </div>
        </div>
      ) : (
        <main className="max-w-4xl mx-auto p-6">
          {loading ? (
            <p>Loading…</p>
          ) : (
            sections.map((section, i) => (
              <CollapsibleSection key={i} title={section.title}>
                <PortableTextRenderer value={section.body} />
              </CollapsibleSection>
            ))
          )}
        </main>
      )}
    </>
  );
}
