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
      <section
        className="relative h-[400px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url('/sunset-safari.webp')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
          <h1 className="text-5xl font-bold text-[#fdf8f3] mb-4">
            Real Voices From the Journey
          </h1>
          <p className="text-lg text-[#fdf8f3]/90 max-w-2xl">
            Our travelers share more than reviews — they share their
            transformations. Watch how ethical travel reshaped their lives.
          </p>
        </div>
      </section>

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
