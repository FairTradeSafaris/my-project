"use client";

import { useMemo, useState } from "react";
import ContactForm from "@/components/ContactForm";
import {
  RiCalendarLine,
  RiPhoneLine,
  RiMailLine,
  RiWhatsappLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { urlFor } from "@/lib/sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

type ContactInfo = {
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  lineArtImage?: SanityImageSource;
  bookingLink?: string;
  backgroundImage?: SanityImageSource;
};

export default function ContactPageClient({
  contactInfo,
}: {
  contactInfo?: ContactInfo;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const phone = contactInfo?.phone || "+1 234-9876-5400";
  const email = contactInfo?.email || "info@fairtradesafaris.com";

  // Brand / palette
  const accent = "#a35c2d";
  const leftCardBg = "#d7ccc8e6"; // your updated sand tone
  const iconBg = "#f3eadf";

  // High-contrast text on sand
  const textPrimary = "#3c2f2f"; // headings & row titles
  const textSecondary = "#6b4f3f"; // subtitles (phone/email etc.)

  const whatsappHref = useMemo(() => {
    const raw = contactInfo?.whatsappNumber;
    if (!raw) return "https://wa.me/27817517844";
    const digits = ("" + raw).replace(/\D/g, "");
    const withCountry = digits.startsWith("00") ? digits.slice(2) : digits;
    return `https://wa.me/${withCountry}`;
  }, [contactInfo?.whatsappNumber]);

  const backgroundImageUrl = contactInfo?.backgroundImage
    ? urlFor(contactInfo.backgroundImage).url()
    : "";

  const bookingLink =
    contactInfo?.bookingLink ||
    "https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris";

  return (
    <main
      className="text-white font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      {/* Overlay tint for readability */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Content container (optimized spacing) */}
      <div className="relative z-10 px-4 pt-6 md:pt-8 pb-6 md:pb-8">
        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Contact Info Card */}
          <div
            className="rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-xl h-full"
            style={{ backgroundColor: leftCardBg }}
          >
            <h3
              className="text-2xl font-bold mb-5 md:mb-6"
              style={{ color: textPrimary }}
            >
              Contact Information
            </h3>

            {[
              {
                title: "Book a Discovery Call",
                subtitle: "Let’s plan something",
                icon: <RiCalendarLine size={24} color={accent} />,
                onClick: () => setBookingOpen(true),
                isButton: true,
              },
              {
                title: "Call Us",
                subtitle: phone,
                icon: <RiPhoneLine size={24} color={accent} />,
                href: `tel:${phone.replace(/\s/g, "")}`,
              },
              {
                title: "Let’s Chat",
                subtitle: "WhatsApp us",
                icon: <RiWhatsappLine size={24} color={accent} />,
                href: whatsappHref,
              },
              {
                title: "Email Us",
                subtitle: email,
                icon: <RiMailLine size={24} color={accent} />,
                href: `mailto:${email}`,
              },
            ].map((item, i) =>
              item.isButton ? (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="flex items-start gap-4 group text-left w-full mb-5 md:mb-6"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-base font-semibold"
                      style={{ color: textPrimary }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-sm mt-0.5 font-medium group-hover:underline"
                      style={{ color: textSecondary }}
                    >
                      {item.subtitle}{" "}
                      <RiArrowRightLine className="inline ml-1" size={14} />
                    </span>
                  </div>
                </button>
              ) : (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group text-left w-full mb-5 md:mb-6"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-base font-semibold"
                      style={{ color: textPrimary }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-sm mt-0.5 font-medium group-hover:underline truncate max-w-[16rem]"
                      style={{
                        color:
                          item.title === "Let’s Chat"
                            ? textPrimary
                            : textSecondary,
                      }}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                </a>
              )
            )}
          </div>

          {/* RIGHT: Transparent Contact Form */}
          <div className="rounded-xl p-6 md:p-8 backdrop-blur-md bg-white/20 shadow-xl border border-white/30 h-full">
            <h2 className="text-2xl font-bold mb-5 md:mb-6 text-white">
              Start Your Journey
            </h2>
            <ContactForm />
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setBookingOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-semibold text-gray-800">
                Book a Discovery Call
              </span>
              <button
                onClick={() => setBookingOpen(false)}
                className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <iframe
              src={bookingLink}
              className="w-full h-[calc(100%-56px)]"
              style={{ border: "none" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}
    </main>
  );
}
