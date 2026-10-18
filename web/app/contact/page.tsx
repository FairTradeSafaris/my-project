// /app/contact/page.tsx

import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
// import FAQServer from "./FAQServer"; // ❌ Removed
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import Script from "next/script";
import Link from "next/link";
import HeroController from "@/components/HeroController";
import LineArt from "@/components/LineArt";
import { coreBody, coreButtonOutline, coreCard, coreContainer, coreH2 } from "@/components/core/coreStyles";

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
      <HeroController
        look="calm" heroData={heroData} breadcrumbs={breadcrumbs} />

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
      {/* Batch 23: homepage-style card (display only) */}
      <section className="bg-white py-10 md:py-14">
        <div className={coreContainer}>
        <div className={`${coreCard} mx-auto max-w-4xl px-6 py-8 text-center md:px-10 md:py-10`}>
          <LineArt name="wildebeest" className="mx-auto mb-4 w-32 text-[#c9974f]/70" />
          <h2 className={`${coreH2} mb-4`}>
            Frequently Asked Questions
          </h2>

          <p className={`${coreBody} mx-auto mb-6 max-w-2xl md:text-[17px] md:leading-8`}>
            Planning a safari comes with important questions. Explore our
            answers about ethical travel, sustainability, pricing, and what to
            expect on your journey.
          </p>

          <Link
            href="/faq/"
            className={coreButtonOutline}
          >
            View All FAQs →
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
