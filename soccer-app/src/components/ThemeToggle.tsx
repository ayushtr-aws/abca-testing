import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "soccer-app-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Fall back to the user's OS preference, defaulting to light.
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * A toggle switch that lets the user flip between light and dark mode.
 * The choice is applied to the document root via `data-theme` and
 * persisted in localStorage so it survives reloads.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isLight = theme === "light";

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-pressed={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      onClick={toggle}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isLight ? "☀️" : "🌙"}
      </span>
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}
