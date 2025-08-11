"use client";

import VideoTestimonialCard from "./VideoTestimonialCard";

export type VideoTestimonial = {
  _id: string;
  name: string;
  location: string;
  videoUrl: string;
  quote: string;
  thumbnailUrl?: string;
};

export default function VideoTestimonials({
  testimonials,
}: {
  testimonials: VideoTestimonial[];
}) {
  return (
    <>
      {/* Hero Section */}

      {/* Testimonials Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold mb-10 text-center">
          Traveler Stories
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <VideoTestimonialCard key={item._id} testimonial={item} />
          ))}
        </div>
      </section>
    </>
  );
}
