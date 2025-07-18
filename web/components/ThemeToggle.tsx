"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // ✅ Debug logs
  console.log("🌓 theme:", theme);
  console.log("🖥 systemTheme:", systemTheme);
  console.log("🌗 currentTheme:", currentTheme);

  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        console.log("🌞 Switching to:", nextTheme);
        setTheme(nextTheme);
      }}
      title="Toggle Theme"
      aria-label="Toggle Theme"
      style={{ color: "var(--foreground)" }}
    >
      {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
