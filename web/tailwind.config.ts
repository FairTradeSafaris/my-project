import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  darkMode: "class",
  content: [
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        script: ["'Dancing Script'", "cursive"],
      },
      backgroundColor: {
        background: "var(--background)",
      },
      textColor: {
        foreground: "var(--foreground)",
      },
      colors: {
        background: "#f5efe6", // Soft light beige
        foreground: "#000000", // Black for text
        accent: "#5d4037", // Safari brown
        surface: "#d7ccc8", // Light brown / surface
        border: "#bcae9e", // Muted outline
        "onSurface-light": "#2a2a2a", // Contrast for light bg
      },
      customTheme: {
        sand: {
          light: "#f5f1eb",
          DEFAULT: "#d8c3a5",
          dark: "#a1887f",
        },
        surface: {
          light: "#f4eee7",
          dark: "#1a1a1a",
        },
        onSurface: {
          light: "#2a2a2a",
          dark: "#f5f1eb",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSlow: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
        fadeIn: "fadeIn 0.8s ease-out forwards",
        fadeInSlow: "fadeInSlow 1.4s ease-out forwards",
        "pulse-once": "pulseOnce 0.5s ease",
        bounceSlow: "bounceSlow 1s ease-in-out infinite",
      },
    },
  },
  plugins: [lineClamp],
};

export default config;
