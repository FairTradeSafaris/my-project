import { client as sanity } from "@/../lib/sanity";
import { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanity.fetch(
    `*[_type == "sitePages" && slug.current == "contact"][0]{
      metaTitle,
      metaDescription
    }`
  );

  return {
    title: data?.metaTitle || "Contact Us | Fair Trade Safaris",
    description:
      data?.metaDescription ||
      "Get in touch with our team to start planning your unforgettable, ethical safari adventure.",
  };
}

export default async function ContactPage() {
  const contactInfo = await sanity.fetch(`*[_type == "contactSettings"][0]`);

  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black font-sans">
      {/* Hero Banner */}
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
          <h1 className="text-5xl font-bold text-[#fdf8f3] mb-4">
            Let&apos;s Connect
          </h1>
          <p className="text-lg max-w-2xl text-[#e8e8e8]">
            Fill out the form and one of our safari experts will be in touch
            shortly. Whether you&apos;re curious about destinations, costs, or
            customizations — we&apos;re here to help!
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-6xl mx-auto px-4 py-20" id="form">
        <h2 className="text-3xl font-extrabold text-center text-[#5c4033] mb-12">
          Contact Us
        </h2>
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden gap-8">
          {/* Left Info Panel */}
          <div className="w-full md:w-1/2 bg-[#f5f1ee] p-8 space-y-6">
            {/* CTA */}
            <div>
              <a
                href="#form"
                className="inline-block bg-[#5c4033] hover:bg-[#3f2d24] text-white font-semibold px-6 py-3 rounded-full shadow transition"
              >
                📅 Book a Discovery Call
              </a>
            </div>

            {/* Call */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Phone className="w-5 h-5 text-[#5c4033]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
                <p className="text-sm text-gray-700">
                  {contactInfo?.phone || "+1 234-9876-5400"}
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <img
                  src="/whatsapp-icon.svg"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <a
                  href="https://wa.me/27795509203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 underline"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Mail className="w-5 h-5 text-[#5c4033]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-700">
                  <a
                    href="mailto:info@fairtradesafaris.com"
                    className="underline"
                  >
                    info@fairtradesafaris.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="w-full md:w-1/2 p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
