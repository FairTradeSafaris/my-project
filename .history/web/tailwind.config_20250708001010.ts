import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
    },
  },
  plugins: [lineClamp],
};

module.exports = {
  theme: {
    extend: {
      keyframes: {
        pulseOnce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-once": "pulseOnce 0.5s ease",
      },
    },
  },
  plugins: [],
};

export default config;
