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
};

export default function ContactPageClient({
  contactInfo,
}: {
  contactInfo?: ContactInfo;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);

  // Palette
  const accent = "#a35c2d";
  const bg = "#faf7f2";
  const cardBorder = "#eee4d8";
  const tileBg = "#ffffff";
  const iconBg = "#f3eadf";

  // Fallbacks
  const phone = contactInfo?.phone || "+1 234-9876-5400";
  const email = contactInfo?.email || "info@fairtradesafaris.com";

  const whatsappHref = useMemo(() => {
    const raw = contactInfo?.whatsappNumber;
    if (!raw) return "https://wa.me/27817517844";
    const digits = ("" + raw).replace(/\D/g, "");
    const withCountry = digits.startsWith("00") ? digits.slice(2) : digits;
    return `https://wa.me/${withCountry}`;
  }, [contactInfo?.whatsappNumber]);

  const lineArtImageUrl = contactInfo?.lineArtImage
    ? urlFor(contactInfo.lineArtImage).url()
    : "/buffalo.png";

  const bookingLink =
    contactInfo?.bookingLink ||
    "https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris";

  const IconWrap = ({ children }: { children: React.ReactNode }) => (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
      style={{ backgroundColor: iconBg }}
    >
      {children}
    </div>
  );

  const iconSize = 20;

  const tileClass =
    "min-h-44 md:min-h-56 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center p-4 hover:shadow-md transition";

  return (
    <main className="text-black" style={{ backgroundColor: bg }}>
      {/* Heading */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-end justify-start gap-3 md:gap-4">
          <img
            src={lineArtImageUrl}
            alt="Decorative Line Art"
            className="h-16 md:h-20 lg:h-24 pointer-events-none select-none"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-none">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] md:items-stretch gap-6 md:gap-8">
          {/* LEFT */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 md:p-6 shadow-lg border"
            style={{ background: tileBg, borderColor: cardBorder }}
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Booking */}
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className={tileClass}
                style={{ borderColor: cardBorder, background: tileBg }}
                aria-label="Book a Discovery Call"
              >
                <IconWrap>
                  <RiCalendarLine size={iconSize} color={accent} />
                </IconWrap>
                <div className="text-sm font-semibold text-gray-900">
                  Book a Discovery Call
                </div>
                <div
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: accent }}
                >
                  Open scheduler <RiArrowRightLine size={14} />
                </div>
              </button>

              {/* Phone */}
              <div
                className={tileClass}
                style={{ borderColor: cardBorder, background: tileBg }}
              >
                <IconWrap>
                  <RiPhoneLine size={iconSize} color={accent} />
                </IconWrap>
                <div className="text-sm font-semibold text-gray-900">
                  Call Us
                </div>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-1 text-sm underline underline-offset-2 text-gray-700 truncate max-w-[12rem]"
                  title={phone}
                >
                  {phone}
                </a>
              </div>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={tileClass}
                style={{ borderColor: cardBorder, background: tileBg }}
                aria-label="Chat with us on WhatsApp"
              >
                <IconWrap>
                  <RiWhatsappLine size={iconSize} color="#1f5133" />
                </IconWrap>
                <div className="text-sm font-semibold text-gray-900">
                  WhatsApp
                </div>
                <div
                  className="mt-1 text-sm underline underline-offset-2"
                  style={{ color: "#1f5133" }}
                >
                  Chat with us
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className={`${tileClass} break-words`}
                style={{ borderColor: cardBorder, background: tileBg }}
                aria-label="Email us"
              >
                <IconWrap>
                  <RiMailLine size={iconSize} color={accent} />
                </IconWrap>
                <div className="text-sm font-semibold text-gray-900">Email</div>
                <div
                  className="mt-1 text-sm underline underline-offset-2 text-gray-700 truncate max-w-[12rem]"
                  title={email}
                >
                  {email}
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="rounded-2xl p-6 md:p-8 shadow-lg border"
            style={{ background: tileBg, borderColor: cardBorder }}
          >
            <h2 className="sr-only">Inquiry Form</h2>
            <ContactForm />
          </div>
        </div>
      </section>

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
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ backgroundColor: iconBg, borderColor: cardBorder }}
            >
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
