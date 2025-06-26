"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // On mount, sync with localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-gray-800 transition bg-white border rounded dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <span>
          <span role="img" aria-label="moon">
            🌙
          </span>{" "}
          Dark
        </span>
      ) : (
        <span>
          <span role="img" aria-label="sun">
            ☀️
          </span>{" "}
          Light
        </span>
      )}
    </button>
  );
}
