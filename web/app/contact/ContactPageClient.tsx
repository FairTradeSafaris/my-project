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
      className="font-sans relative bg-[#f7f3ec] bg-cover bg-center bg-no-repeat text-[#24170f]"
      style={backgroundImageUrl ? { backgroundImage: `url('${backgroundImageUrl}')` } : undefined}
    >
      {/* Tint only when a background photo is set in Sanity */}
      {backgroundImageUrl && <div className="absolute inset-0 bg-black/20 z-0" />}

      {/* Content container (optimized spacing) */}
      {/* Batch 23: 1440 container, homepage-style cards (display only; the
          form, its spam protection and submit logic are untouched) */}
      <div className="relative z-10 py-10 md:py-14">
        <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-stretch gap-6 px-6 sm:px-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8 lg:px-12 xl:px-16">
          {/* LEFT: Contact Info Card */}
          <div
            className="flex h-full flex-col justify-between rounded-2xl p-6 shadow-[0_14px_32px_-22px_rgba(36,23,15,0.45)] md:p-9"
            style={{ backgroundColor: leftCardBg }}
          >
            <div>
            <h2
              className="mb-2 text-[26px] font-semibold leading-tight md:text-[30px]"
              style={{ color: textPrimary }}
            >
              Talk to a real person
            </h2>
            <p className="mb-6 border-b border-[#f2e7db]/25 pb-6 text-[16px] leading-7" style={{ color: textSecondary }}>
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
                  className="group mb-3 flex w-full items-start gap-4 rounded-xl p-2 text-left transition-colors hover:bg-white/5 md:mb-4"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[17px] font-semibold"
                      style={{ color: textPrimary }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="mt-0.5 text-[15px] font-medium group-hover:underline"
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
                  className="group mb-3 flex w-full items-start gap-4 rounded-xl p-2 text-left transition-colors hover:bg-white/5 md:mb-4"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[17px] font-semibold"
                      style={{ color: textPrimary }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="mt-0.5 break-all text-[15px] font-medium group-hover:underline"
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
          <div className="h-full rounded-2xl border border-[#ebe1d3] bg-white p-6 shadow-[0_1px_2px_rgba(36,23,15,0.04),0_14px_32px_-22px_rgba(36,23,15,0.30)] md:p-9">
            <h2 className="mb-2 text-[26px] font-semibold leading-tight text-[#24170f] md:text-[30px]">
              Start Your Journey
            </h2>
            <p className="mb-6 border-b border-[#efe5d6] pb-6 text-[16px] leading-7 text-[#5c4a3d]">
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
