import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";

export type Testimonial = {
  name: string;
  title?: string;
  text: string;
  rating?: number;
  regionVisited?: string;
  sourceLink?: string;
  sourceLogo?: {
    asset: {
      url: string;
    };
  };
};

export default function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARDS_PER_VIEW = isMobile ? 1 : 4;

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(
        `*[_type == "testimonial"]{
          name, title, text, rating, regionVisited, sourceLink, sourceLogo{asset->{url}}
        }`
      );
      const dummyCount = Math.max(0, 4 - data.length);
      const dummy = Array.from({ length: dummyCount }, () => ({
        name: "Coming Soon",
        title: "Placeholder",
        text: "Stay tuned for more stories from our amazing clients.",
        rating: 5,
      }));
      setTestimonials([...data, ...dummy]);
    };

    const fetchHeading = async () => {
      const data = await client.fetch(
        `*[_type == "testimonialSettings"][0]{ heading }`
      );
      setHeading(data?.heading || "");
    };

    fetchData();
    fetchHeading();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => next(), 6000);
    return () => clearInterval(interval);
  }, [testimonials, currentIndex, isMobile]);

  const next = () => {
    setCurrentIndex((prev) => (prev + CARDS_PER_VIEW) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - CARDS_PER_VIEW + testimonials.length) % testimonials.length
    );
  };

  const renderStars = (count = 5) =>
    Array.from({ length: count }, (_, i) => (
      <svg
        key={i}
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09L5.5 12.5.622 8.91l6.684-.91L10 2l2.694 6 6.684.91L14.5 12.5l1.378 5.59z" />
      </svg>
    ));

  return {
    testimonials,
    heading,
    currentIndex,
    CARDS_PER_VIEW,
    next,
    prev,
    renderStars,
  };
}
