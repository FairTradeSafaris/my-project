"use client";

export default function BookingModal({
  open,
  onClose,
  iconBg = "#f3eadf",
  cardBorder = "#eee4d8",
  src = "https://bookings.fairtradesafaris.com/portal-embed#/fairtradesafaris",
}: {
  open: boolean;
  onClose: () => void;
  iconBg?: string;
  cardBorder?: string;
  src?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
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
            onClick={onClose}
            className="text-2xl leading-none font-bold text-gray-800 hover:text-black"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <iframe
          src={src}
          className="w-full h-[calc(100%-56px)]"
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
