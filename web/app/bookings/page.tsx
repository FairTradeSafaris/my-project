"use client";
import { useEffect, useState } from "react";
import HeroController from "@/components/HeroController";
type BookingService = {
  id: string;
  name: string;
  description: string;
  duration: number;
};

export default function BookingsPage() {
  const [services, setServices] = useState<BookingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<BookingService | null>(
    null,
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/bookings/services");
        const data = await res.json();
        setServices(data.data || []);
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  const heroData = {
    headline: "Book Your Safari Consultation",
    subheadline:
      "Schedule time with our team to plan your perfect African journey.",
    action: "none" as const,
    backgroundImages: [],
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Bookings", href: "/bookings" },
  ];

  return (
    <>
      <HeroController heroData={heroData} breadcrumbs={breadcrumbs} />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

        {loading && <p>Loading available appointment types...</p>}

        {!loading && services.length === 0 && (
          <p>No booking services available. Please try again later.</p>
        )}

        {!loading && services.length > 0 && (
          <ul className="space-y-4">
            {services.map((service) => (
              <li
                key={service.id}
                className={`border rounded p-4 cursor-pointer ${
                  selectedService?.id === service.id
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <h2 className="text-xl font-semibold">{service.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {service.duration} minutes
                </p>
              </li>
            ))}
          </ul>
        )}

        {selectedService && (
          <div className="mt-8">
            <p className="text-lg font-medium text-green-700">
              Selected: {selectedService.name}
            </p>
            {/* 🧭 Next step: show time slots here */}
          </div>
        )}
      </div>
    </>
  );
}
