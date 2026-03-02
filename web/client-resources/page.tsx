import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Client Resources | Fair Trade Safaris",
  description:
    "Access helpful resources to prepare for your safari, including a guide to your secure client portal.",
  openGraph: {
    title: "Client Resources | Fair Trade Safaris",
    description:
      "Helpful resources and guides for your upcoming safari journey.",
    url: "https://www.fairtradesafaris.com/client-resources",
    siteName: "Fair Trade Safaris",
    type: "website",
  },
};

export default function ClientResourcesPage() {
  return (
    <main className="min-h-screen bg-[#f9f6f2] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium">Client Resources</span>
        </nav>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
          Client Resources
        </h1>

        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
          Everything you need to prepare for your safari journey — all in one
          place. Below you’ll find a short guide on accessing your secure client
          portal.
        </p>

        {/* Video Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Access Your Client Portal
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
            <video controls preload="metadata" className="w-full h-auto">
              <source src="/videos/client-portal-guide.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="mt-4 text-gray-600">
            This brief guide walks you through securely accessing your
            itinerary, travel documents, and important updates.
          </p>
        </section>

        {/* Future Expansion Placeholder */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Preparing for Your Safari
          </h2>

          <p className="text-gray-700 max-w-3xl">
            Additional preparation resources, travel guidance, and helpful
            documents will be added here to support you before departure.
          </p>
        </section>
      </div>
    </main>
  );
}
