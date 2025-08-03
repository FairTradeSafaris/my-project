// app/video-testimonials/page.tsx
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import VideoTestimonials from "./VideoTestimonials";

const query = groq`*[_type == "videoTestimonial"] | order(_createdAt desc){
  _id,
  name,
  location,
  videoUrl,
  quote,
  "thumbnailUrl": thumbnail.asset->url
}`;

export default async function Page() {
  const testimonials = await client.fetch(query);
  return <VideoTestimonials testimonials={testimonials} />;
}
