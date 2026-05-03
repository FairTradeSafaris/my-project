// /app/contact/page.tsx

import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
// import FAQServer from "./FAQServer"; // ❌ Removed
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import Script from "next/script";
import Link from "next/link";
import HeroController from "@/components/HeroController";

export const revalidate = 60;

// --- SEO METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("contact");

  return {
    ...metadata,
    title: metadata?.title || "Contact Us | Fair Trade Safaris",
    description:
      metadata?.description ||
      "Get in touch with our team to start planning your unforgettable, ethical safari adventure.",
  };
}

const CONTACT_SETTINGS_QUERY = `*[_type == "contactSettings"][0]`;

export default async function ContactPage() {
  const contactInfo = await sanity
    .fetch(CONTACT_SETTINGS_QUERY)
    .catch(() => null);

  // BREADCRUMB JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.fairtradesafaris.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: "https://www.fairtradesafaris.com/contact",
      },
    ],
  };
  const heroData = await sanity.fetch(`
*[_type == "hero" && customScope == "contact"][0]{
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  action,
  primaryLink { href, label },
  backgroundImages[]{
    alt,
    desktopImage { asset-> },
    mobileImage { asset-> }
  }
}
`);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />

      {/* Inject Breadcrumb structured data for SEO */}
      <Script
        id="contact-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Contact Info / Form */}
      <ContactPageClient contactInfo={contactInfo} />

      {/* Link to FAQ Page */}
      {/* FAQ Teaser Section */}
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-16">
        <div className="bg-neutral-50 rounded-2xl p-10 text-center shadow-sm border border-neutral-200">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Planning a safari comes with important questions. Explore our
            answers about ethical travel, sustainability, pricing, and what to
            expect on your journey.
          </p>

          <Link
            href="/faq/"
            className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            View All FAQs →
          </Link>
        </div>
      </section>
    </>
  );
}
