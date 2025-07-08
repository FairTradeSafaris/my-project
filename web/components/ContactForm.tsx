"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      firstName: form["firstName"].value,
      lastName: form["lastName"].value,
      email: form["email"].value,
      phone: form["phone"].value,
      appointment: form["appointment"].checked,
      marketingConsent: form["promos"].checked,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      form.reset();
      setStatus("Thank you! Your message has been sent.");
    } else {
      setStatus("Oops! Something went wrong.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          className="border border-gray-300 p-3 rounded w-full"
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-3 rounded w-full"
          required
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="border border-gray-300 p-3 rounded w-full"
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        className="border border-gray-300 p-3 rounded w-full"
        required
      />
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="appointment"
          id="appointment"
          className="mt-1"
        />
        <label htmlFor="appointment" className="text-sm">
          I would like to set up an appointment with a representative
        </label>
      </div>
      <div className="flex items-start gap-3">
        <input type="checkbox" name="promos" id="promos" className="mt-1" />
        <label htmlFor="promos" className="text-sm">
          <strong>News, Promotions and Marketing:</strong> I consent to
          receiving SMS or electronic marketing messages from Fair Trade
          Safaris.
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-[#5c4033] hover:bg-[#3f2d24] text-white font-semibold py-3 px-4 rounded mt-4 transition"
      >
        Submit
      </button>
      {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
    </form>
  );
}
