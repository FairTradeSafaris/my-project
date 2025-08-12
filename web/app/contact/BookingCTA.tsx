"use client";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";

export default function BookingCTA({
  cardBorder = "#eee4d8",
}: {
  cardBorder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-2xl border p-5 flex flex-col justify-between bg-black text-white"
        style={{ borderColor: cardBorder }}
      >
        <div>
          <h4 className="font-semibold">Haven’t found what you need?</h4>
          <p className="mt-1 text-sm opacity-90">
            Get in touch — we’re happy to help!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 font-medium"
        >
          Contact us
        </button>
      </div>

      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
