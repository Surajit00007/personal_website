import { useEffect, useState } from "react";

type Theme = "sage" | "dusk";

const STORAGE_KEY = "portfolio-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("sage");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "sage";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "sage" ? "dusk" : "sage";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const isDusk = theme === "dusk";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDusk ? "sage" : "violet dusk"} theme`}
      title={isDusk ? "Violet Dusk" : "Sage"}
      className="relative inline-flex h-7 w-14 items-center rounded-full border transition-all duration-500"
      style={{
        borderColor: isDusk ? "rgba(200,195,188,0.4)" : "rgba(255,255,255,0.12)",
        background: isDusk
          ? "linear-gradient(135deg, #1a1a18 0%, #c8c3bc 55%, #f5f0eb 100%)"
          : "linear-gradient(135deg, #0d0d0d 0%, #3a3a3a 55%, #f2f2f0 100%)",
        boxShadow: isDusk
          ? "0 0 14px rgba(200,195,188,0.35), inset 0 0 8px rgba(0,0,0,0.2)"
          : "0 0 14px rgba(255,255,255,0.15), inset 0 0 8px rgba(0,0,0,0.5)",
      }}
    >
      <span
        className="absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500"
        style={{
          left: isDusk ? "calc(100% - 1.375rem)" : "0.25rem",
          background: isDusk ? "#1a1a18" : "#f2f2f0",
          boxShadow: `0 2px 8px rgba(0,0,0,0.45), 0 0 10px ${isDusk ? "rgba(245,240,235,0.6)" : "rgba(242,242,240,0.4)"}`,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: isDusk ? "#f5f0eb" : "#0d0d0d" }}
        />
      </span>
    </button>
  );
}
