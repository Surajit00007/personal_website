import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "internships", label: "Internships" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

export function SideNav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      {/* Desktop vertical nav */}
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center justify-evenly border-r border-[var(--nav-border)] bg-[var(--nav-bg)] lg:flex">
        {/* Theme toggle — treated as equal sibling for even distribution */}
        <ThemeToggle />

        {/* Nav items — each one an equal sibling */}
        {items.map((i, index) => {
          const isActive = active === i.id;
          const colorVar = `var(--nav-c${index + 1})`;
          return (
            <button
              key={i.id}
              onClick={() => go(i.id)}
              className="group flex items-center gap-3"
              aria-label={i.label}
            >
              <span
                className="relative inline-block h-1.5 w-1.5 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: colorVar,
                  opacity: isActive ? 1 : 0.4,
                  boxShadow: isActive ? `0 0 12px ${colorVar}` : undefined,
                }}
              />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.35em] [writing-mode:vertical-rl] rotate-180 transition-all duration-500"
                style={{
                  color: colorVar,
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {i.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/70 px-5 py-3 backdrop-blur-2xl lg:hidden">
        <ThemeToggle />
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/10"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-2xl lg:hidden">
          <ul className="flex flex-col items-center gap-6">
            {items.map((i) => {
              const isActive = active === i.id;
              return (
                <li key={i.id}>
                  <button
                    onClick={() => go(i.id)}
                    className="font-display text-4xl tracking-tight transition-opacity hover:opacity-70"
                    style={{ color: isActive ? "var(--accent)" : "var(--foreground)" }}
                  >
                    {i.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
