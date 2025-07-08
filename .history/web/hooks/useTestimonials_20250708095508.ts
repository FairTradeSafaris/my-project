// /hooks/useTestimonials.ts
import { useEffect, useState } from "react";
import { client as sanity } from "@/lib/sanity";

interface Testimonial {
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
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<{ heading?: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const CARDS_PER_VIEW = isMobile ? 1 : 4;

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    sanity
      .fetch(
        `*[_type == "testimonial"]{
          name, title, text, rating, regionVisited, sourceLink, sourceLogo{asset->{url}}
        }`
      )
      .then((data: Testimonial[]) => {
        const dummyCount = Math.max(0, 4 - data.length);
        const dummyTestimonials = Array.from({ length: dummyCount }, () => ({
          name: "Coming Soon",
          title: "Placeholder",
          text: "Stay tuned for more stories from our amazing clients.",
          rating: 5,
        }));
        setTestimonials([...data, ...dummyTestimonials]);
      });

    sanity
      .fetch(`*[_type == "testimonialSettings"][0]{ heading }`)
      .then((data: { heading?: string }) => setSettings(data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => next(), 6000);
    return () => clearInterval(interval);
  }, [testimonials, currentIndex, isMobile]);

  const next = () => {
    const nextIndex = (currentIndex + CARDS_PER_VIEW) % testimonials.length;
    setCurrentIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex =
      (currentIndex - CARDS_PER_VIEW + testimonials.length) %
      testimonials.length;
    setCurrentIndex(prevIndex);
  };

  const cardsToShow = testimonials.slice(
    currentIndex,
    currentIndex + CARDS_PER_VIEW
  );

  const shouldWrap = cardsToShow.length < CARDS_PER_VIEW;
  if (shouldWrap) {
    const overflow = CARDS_PER_VIEW - cardsToShow.length;
    cardsToShow.push(...testimonials.slice(0, overflow));
  }

  return {
    testimonials,
    settings,
    currentIndex,
    cardsToShow,
    next,
    prev,
  };
}
