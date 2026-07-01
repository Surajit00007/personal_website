/**
 * Animated 3D perspective grid backgrounds.
 * Pure CSS — two planes (floor + ceiling) with scrolling gradient lines
 * that create an infinite tron-like tunnel effect. Colors inherit from
 * the current theme via var(--accent-glow).
 */
export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden [perspective:600px] [perspective-origin:50%_50%]">
      {/* Floor plane */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[220vh] w-[300vw] -translate-x-1/2 origin-top [transform:rotateX(65deg)] opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--accent-glow) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-glow) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          animation: "gridScroll 12s linear infinite",
        }}
      />
      {/* Ceiling plane */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[220vh] w-[300vw] -translate-x-1/2 origin-bottom [transform:rotateX(-65deg)] opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--accent-glow) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-glow) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "linear-gradient(to top, transparent 0%, black 25%, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, black 25%, black 75%, transparent 100%)",
          animation: "gridScrollReverse 16s linear infinite",
        }}
      />
      {/* Vignette to blend edges into background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, var(--background) 85%)",
        }}
      />
    </div>
  );
}
