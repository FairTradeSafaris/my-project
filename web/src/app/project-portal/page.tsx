"use client";

import { useState } from "react";
import Link from "next/link";

// 🔽 Modern collapsible card component
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
  const PASSWORD = "fts-access";

  return (
    <>
      {!entered ? (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center px-4">
          {/* 🎨 Alexive Header */}
          <div className="text-center mb-8">
            <img
              src="/alexive-logo.jpeg"
              alt="Alexive Logo"
              className="h-16 mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              FTS Project Console
            </h1>
            <p className="text-sm text-gray-600">
              by Alexive Creative Solutions
            </p>
          </div>

          {/* 🔐 Login Box */}
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
        // ✅ Portal content after successful entry
        <main className="min-h-screen bg-white px-6 py-10 text-black">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">
              🔐 Project Developer Portal
            </h1>

            <CollapsibleSection title="🖼️ Homepage Wireframe">
              <p className="mb-2">
                The homepage features a cinematic hero section, styled with
                Tailwind and powered by Sanity.
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {`.hero-bg {
  background-image: url('/sunset-safari.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`}
              </pre>
              <p className="text-sm mt-2 text-gray-500">
                Source: <code>web/src/app/page.tsx</code>
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="📦 Project Structure">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {`my-project/
├── web/     # Next.js frontend app
└── studio/  # Sanity CMS backend`}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection title="⚙️ Technologies Used">
              <ul className="list-disc list-inside space-y-1">
                <li>Next.js (App Router + TypeScript)</li>
                <li>Tailwind CSS</li>
                <li>Sanity CMS (v3)</li>
                <li>Custom Fonts: Poppins</li>
                <li>Wetu Integration (iframe modal)</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="📌 Features Built So Far">
              <ul className="list-disc list-inside space-y-1">
                <li>🧭 Custom hero section with Sanity</li>
                <li>🌍 Journey Finder grid</li>
                <li>🔍 Real-time keyword filtering</li>
                <li>🌐 Region filter buttons</li>
                <li>🪟 Slide-in Wetu iframe drawer</li>
                <li>🗂️ Filter toggle section</li>
                <li>🔒 Protected internal docs</li>
                <li>🧪 Future dynamic filtering support</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="💻 Code Example: Journey Card">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {`type JourneyCardProps = {
  title: string;
  summary: string;
};

export default function JourneyCard({ title, summary }: JourneyCardProps) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-600">{summary}</p>
    </div>
  );
}`}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection title="🔗 Key Links">
              <ul className="list-disc list-inside text-blue-600 space-y-1">
                <li>
                  <Link href="/">Home Page</Link>
                </li>
                <li>
                  <Link href="/journeys">Journey Finder</Link>
                </li>
                <li>
                  <Link href="/studio">Sanity Studio</Link>
                </li>
                <li>
                  <Link href="/project-portal">Developer Portal</Link>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="💡 Why Next.js + Sanity + Vercel">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Next.js:</strong> Fast routing, SSR support, and SEO
                  benefits.
                </li>
                <li>
                  <strong>Sanity:</strong> Structured content with live preview
                  + portable text.
                </li>
                <li>
                  <strong>Vercel:</strong> Git-integrated deployment &
                  performance optimization.
                </li>
                <li>
                  <strong>React:</strong> Composable architecture + ecosystem
                  tools.
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="🔐 Internal Login Credentials & Notes">
              <p className="text-red-600 text-sm mb-2">⚠️ Internal use only</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Sanity Admin:</strong> [To be filled]
                </li>
                <li>
                  <strong>Vercel Project:</strong> [To be filled]
                </li>
                <li>
                  <strong>Zoho CRM:</strong> [To be filled]
                </li>
                <li>
                  <strong>Wetu Embed Config:</strong> [To be filled]
                </li>
              </ul>
            </CollapsibleSection>
          </div>
        </main>
      )}
    </>
  );
}
