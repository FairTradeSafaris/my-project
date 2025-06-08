"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Users, Search } from "lucide-react";
import { useEffect, useState } from "react";
import sanity from "../../lib/sanity";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from "date-fns";

// Type for sanity image objects
type SanityImage = {
  asset: {
    url: string;
  };
};

export default function HeroWithSearch() {
  const [selectedImage, setSelectedImage] = useState<string>("/hero.jpg");
  const [headline, setHeadline] = useState<string>("");
  const [subheadline, setSubheadline] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const sixMonthsFromNow = addMonths(new Date(), 6);

  useEffect(() => {
    const fetchHeroContent = async () => {
      const result = await sanity.fetch(
        `*[_type == "hero"][0]{
          headline,
          subheadline,
          backgroundImages[]{asset->{url}}
        }`
      );

      if (result) {
        setHeadline(result.headline);
        setSubheadline(result.subheadline);

        const urls =
          (result.backgroundImages as SanityImage[])?.map(
            (img) => img.asset.url
          ) || [];

        if (urls.length > 0) {
          const random = Math.floor(Math.random() * urls.length);
          setSelectedImage(urls[random]);
        }
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <section className="relative h-[90vh] w-full bg-black text-white font-poppins overflow-hidden">
      {/* Background Image */}
      <Image
        src={selectedImage}
        alt="Safari hero background"
        fill
        className="object-cover object-center opacity-80"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md">
          {headline || "Safari. Reimagined."}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
          {subheadline ||
            "Plan your once-in-a-lifetime journey with local experts who care."}
        </p>

        {/* Search Box */}
        <div className="bg-white/5 text-white rounded-1xl px-4 py-4 shadow-xl flex flex-col md:flex-row items-stretch gap-3 md:gap-3 w-full max-w-4xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <MapPin className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Where to?"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <CalendarDays className="w-5 h-5 text-white/70" />
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              monthsShown={3}
              showMonthDropdown
              showYearDropdown
              minDate={sixMonthsFromNow}
              dateFormat="dd/MM/yyyy"
              placeholderText="Travel dates"
              wrapperClassName="w-full"
              calendarClassName="!bg-[#f9f5f0] !text-[#4a3c2c] !font-poppins shadow-xl rounded-lg border border-[#e4dcd2]"
              dayClassName={() =>
                "rounded-md px-1 py-1 hover:bg-[#e8ddcf] hover:text-[#4a3c2c] transition duration-200"
              }
              calendarContainer={({ children }) => (
                <div className="bg-[#f9f5f0] rounded-xl shadow-xl border border-[#e4dcd2] p-4 text-sm w-fit text-[#4a3c2c] font-poppins">
                  <div className="mb-2 text-xs text-[#6b4e3d] font-medium">
                    Select your first day of travel, then your return date.
                  </div>
                  <div className="flex justify-center gap-6">{children}</div>
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-2 border border-white/10 rounded-1xl px-4 py-3 w-full bg-white/5 hover:bg-white/10 transition">
            <Users className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Guests"
              className="bg-transparent outline-none text-sm w-full placeholder-white/60 text-white"
            />
          </div>

          <button className="bg-white text-black rounded-4xl px-6 py-3 font-semibold hover:bg-gray-200 transition text-sm w-full md:w-auto flex items-center justify-center">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
