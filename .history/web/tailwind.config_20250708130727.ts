import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        sand: {
          light: "#f5f1eb",
          DEFAULT: "#d8c3a5",
          dark: "#a1887f",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", filter: "blur(8px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out forwards",
        "pulse-once": "pulseOnce 0.5s ease",
        popIn: "popIn 0.4s ease-out forwards", // ✅ Add this
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
