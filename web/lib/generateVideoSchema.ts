type Testimonial = {
  name: string;
  location: string;
  videoUrl: string;
  quote: string;
  thumbnailUrl: string;
  uploadDate: string; // ✅ required
  videoDuration: string; // ✅ required (in ISO 8601, e.g., PT2M30S)
};

export function generateVideoSchema(testimonials: Testimonial[]) {
  return testimonials.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${testimonial.name} in ${testimonial.location}`,
    description: testimonial.quote,
    thumbnailUrl: testimonial.thumbnailUrl,
    embedUrl: testimonial.videoUrl,
    contentUrl: testimonial.videoUrl,
    uploadDate: testimonial.uploadDate,
    duration: testimonial.videoDuration,
  }));
}
