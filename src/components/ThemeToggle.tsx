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
        borderColor: isDusk ? "rgba(246,219,192,0.35)" : "rgba(101,146,135,0.35)",
        background: isDusk
          ? "linear-gradient(135deg, #502D55 0%, #935073 55%, #F6DBC0 100%)"
          : "linear-gradient(135deg, #0f1a16 0%, #2d4a42 55%, #b1d3b9 100%)",
        boxShadow: isDusk
          ? "0 0 14px rgba(147,80,115,0.55), inset 0 0 8px rgba(0,0,0,0.35)"
          : "0 0 14px rgba(136,189,164,0.45), inset 0 0 8px rgba(0,0,0,0.35)",
      }}
    >
      <span
        className="absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500"
        style={{
          left: isDusk ? "calc(100% - 1.375rem)" : "0.25rem",
          background: isDusk ? "#F8F4E9" : "#e6f2dd",
          boxShadow: `0 2px 8px rgba(0,0,0,0.45), 0 0 10px ${isDusk ? "#F6DBC0" : "#b1d3b9"}`,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: isDusk ? "#502D55" : "#659287" }}
        />
      </span>
    </button>
  );
}
