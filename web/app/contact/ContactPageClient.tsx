"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bookingOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBookingOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [bookingOpen]);

  // No hardcoded placeholder number: if Sanity has no phone, the "Call Us"
  // row is simply not rendered.
  const phone = contactInfo?.phone?.trim() || "";
  const email = contactInfo?.email || "info@fairtradesafaris.com";

  // Brand / palette
  const accent = "#a35c2d";
  const leftCardBg = "#5c4033"; // solid brand brown
  const iconBg = "#f2e7db";

  // High-contrast text on sand
  const textPrimary = "#f2e7db"; // cream on brown
  const textSecondary = "#e3d3c1"; // softer cream for subtitles

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
      className="font-sans relative bg-[#f2e7db] bg-cover bg-center bg-no-repeat text-[#3c2f2f]"
      style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')` } : undefined}
    >
      {/* Tint only when a background photo is set in Sanity */}
      {backgroundImageUrl && <div className="absolute inset-0 bg-black/20 z-0" />}

      {/* Content container (optimized spacing) */}
      <div className="relative z-10 px-4 py-10 md:py-14">
        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: Contact Info Card */}
          <div
            className="rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-md h-full"
            style={{ backgroundColor: leftCardBg }}
          >
            <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: textPrimary }}
            >
              Talk to a real person
            </h2>
            <p className="text-sm mb-6 border-b border-[#f2e7db]/25 pb-5" style={{ color: textSecondary }}>
              Our safari specialists reply within one business day, Monday to Friday (SAST).
            </p>

            {[
              {
                title: "Book a Discovery Call",
                subtitle: "Let’s plan something",
                icon: <RiCalendarLine size={24} color={accent} />,
                onClick: () => setBookingOpen(true),
                isButton: true,
              },
              ...(phone
                ? [
                    {
                      title: "Call Us",
                      subtitle: phone,
                      icon: <RiPhoneLine size={24} color={accent} />,
                      href: `tel:${phone.replace(/\s/g, "")}`,
                    },
                  ]
                : []),
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
                  {...(item.href?.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
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
                      className="text-sm mt-0.5 font-medium group-hover:underline break-all"
                      style={{ color: textSecondary }}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                </a>
              )
            )}
            </div>
          </div>

          {/* RIGHT: Transparent Contact Form */}
          <div className="rounded-xl p-6 md:p-8 bg-white shadow-md border border-[#e3d3c1] h-full">
            <h2 className="text-2xl font-bold mb-1 text-[#3c2f2f]">
              Start Your Journey
            </h2>
            <p className="text-sm text-[#6b4f3f] mb-5 md:mb-6">
              Tell us a little about your plans and we&apos;ll be in touch.
            </p>
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
            role="dialog"
            aria-modal="true"
            aria-label="Book a Discovery Call"
            className="absolute top-0 right-0 h-full w-full sm:w-[90vw] md:w-[85vw] lg:w-[75vw] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-semibold text-gray-800">
                Book a Discovery Call
              </span>
              <button
                ref={closeRef}
                onClick={() => setBookingOpen(false)}
                className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <iframe
              src={bookingLink}
              title="Book a Discovery Call"
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
