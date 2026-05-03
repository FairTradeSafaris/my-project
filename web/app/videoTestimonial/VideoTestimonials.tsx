"use client";

import VideoTestimonialCard from "./VideoTestimonialCard";

export type VideoTestimonial = {
  _id: string;
  name: string;
  slug: string;
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
        <div className="text-center mb-10">
          <span className="block text-sm uppercase tracking-widest text-[#c4a484] mb-2">
            Real Experiences
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-[#3c2a1e] tracking-tight">
            Traveler Stories
          </h2>

          <span className="block w-16 h-[2px] bg-[#c4a484] mx-auto mt-4"></span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <VideoTestimonialCard key={item._id} testimonial={item} />
          ))}
        </div>
      </section>
    </>
  );
}
