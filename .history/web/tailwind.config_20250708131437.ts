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
        pulseOnce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        bounceSlow: {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "ease-in-out",
          },
          "50%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "ease-in-out",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out forwards",
        "pulse-once": "pulseOnce 0.5s ease",
        bounceSlow: "bounceSlow 1s ease-in-out infinite",
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
