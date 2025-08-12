import { client as sanity } from "@/lib/sanity";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import FAQServer from "./FAQServer";

export const revalidate = 60;

const CONTACT_META_QUERY = `*[_type == "sitePages" && slug.current == "contact"][0]{
  metaTitle,
  metaDescription
}`;

const CONTACT_SETTINGS_QUERY = `*[_type == "contactSettings"][0]`;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanity.fetch(CONTACT_META_QUERY).catch(() => null);
  return {
    title: data?.metaTitle || "Contact Us | Fair Trade Safaris",
    description:
      data?.metaDescription ||
      "Get in touch with our team to start planning your unforgettable, ethical safari adventure.",
  };
}

export default async function ContactPage() {
  const contactInfo = await sanity
    .fetch(CONTACT_SETTINGS_QUERY)
    .catch(() => null);
  return (
    <>
      <ContactPageClient contactInfo={contactInfo} />

      <FAQServer />
    </>
  );
}
