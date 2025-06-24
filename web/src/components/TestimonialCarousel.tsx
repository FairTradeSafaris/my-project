"use client";
import { useEffect, useState } from "react";
import sanity from "@/../lib/sanity";

interface Testimonial {
  name: string;
  title?: string;
  text: string;
}

export default function TestimonialJourney() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<{
    heading?: string;
    subheading?: string;
  }>({});

  useEffect(() => {
    sanity
      .fetch(`*[_type == "testimonial"]{ name, title, text }`)
      .then((data) => {
        const requiredCount = 4;
        const missingCount = requiredCount - data.length;
        const dummyTestimonials = Array.from({ length: missingCount }, () => ({
          name: "Coming Soon",
          title: "Placeholder",
          text: "Stay tuned for more stories from our amazing clients.",
        }));
        setTestimonials([...data, ...dummyTestimonials]);
      });

    sanity
      .fetch(`*[_type == "testimonialSettings"][0]{ heading, subheading }`)
      .then(setSettings);
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="bg-[#fff6ed] py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          {settings?.heading || "Client Feedback"}{" "}
          <span className="text-orange-500">& Testimonial</span>
        </h2>

        {/* Animated Path SVG */}
        <svg
          className="absolute top-[160px] left-0 w-full h-40 z-0"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="travelPath"
              d="M0,80
                C 100,0 150,160 250,80
                C 350,0 400,140 500,80
                C 600,20 700,160 800,80
                C 900,0 950,140 1000,60"
              fill="none"
            />
            <mask id="dash-mask">
              <use
                href="#travelPath"
                stroke="#fff"
                strokeDasharray="12,10"
                strokeWidth="4"
              />
            </mask>
          </defs>
          <use
            href="#travelPath"
            stroke="#f97316"
            strokeWidth="4"
            mask="url(#dash-mask)"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
              animation: "drawLine 4s linear forwards",
            }}
          />
          <style>
            {`@keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }`}
          </style>
        </svg>

        {/* Plane Icon */}
        <svg
          className="absolute top-[70px] left-2 z-10"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 16l9.5 2 9.5-8-6-1.5-4.5 4.5-2.5-7L6.5 3z" />
        </svg>

        {/* Safari Car Icon */}
        <svg
          className="absolute top-[70px] right-2 z-10"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12h1l1-3h4l2 3h7l3-4h2l2 4v2h-1a2 2 0 0 1-4 0H7a2 2 0 0 1-4 0H2v-2z" />
          <circle cx="7" cy="18" r="1.5" />
          <circle cx="17" cy="18" r="1.5" />
        </svg>

        <div className="relative z-10">
          <div className="flex justify-between items-center">
            {testimonials.slice(0, 4).map((t, i) => (
              <div
                key={i}
                className={`relative bg-white p-6 w-64 rounded-2xl shadow-xl text-left transition-all 
                ${i % 2 === 0 ? "mt-[-40px]" : "mt-[40px]"}`}
              >
                <div className="text-xl mb-1 font-semibold">{t.name}</div>
                {t.title && (
                  <p className="text-xs text-gray-400 mb-2">{t.title}</p>
                )}
                <p className="text-sm text-gray-600">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
