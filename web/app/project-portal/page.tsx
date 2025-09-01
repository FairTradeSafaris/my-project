"use client";

import { useState, useEffect } from "react";
import { client } from "../../lib/sanity";
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
    <div className="rounded-2xl border border-gray-300 bg-[#f3f4f6] mb-5 shadow transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center px-6 py-4 font-medium text-lg text-gray-800 hover:bg-gray-200 rounded-t-2xl transition"
      >
        <span>
          {open ? "▾" : "▸"} {title}
        </span>
      </button>
      {open && (
        <div className="px-6 py-4 bg-white text-gray-800 rounded-b-2xl border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProjectPortal() {
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const PASSWORD = "fts-access";

  useEffect(() => {
    if (entered) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await client.fetch(
            `*[_type == "projectPortal"][0]{ title, sections }`
          );
          setSections(data?.sections || []);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [entered]);

  return (
    <>
      {!entered ? (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-2 relative">
              <Image
                src="/alexive-logo.jpeg"
                alt="Alexive Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              FTS Project Console
            </h1>
            <p className="text-sm text-gray-600">
              by Alexive Creative Solutions
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔐 Protected Portal
            </h2>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter password..."
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={() => setEntered(input === PASSWORD)}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Enter
            </button>
            {input && input !== PASSWORD && (
              <p className="text-sm text-red-500 mt-3">Incorrect password</p>
            )}
          </div>
        </div>
      ) : (
        <main className="min-h-screen bg-white px-6 py-10 text-black">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">
              🔐 Project Developer Portal
            </h1>
            {loading ? (
              <p className="text-center text-gray-500 mt-6">
                Loading content...
              </p>
            ) : sections.length > 0 ? (
              sections.map((section, i) => (
                <CollapsibleSection key={i} title={section.title}>
                  <PortableTextRenderer value={section.body} />
                </CollapsibleSection>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No project sections available.
              </p>
            )}
          </div>
        </main>
      )}
    </>
  );
}
