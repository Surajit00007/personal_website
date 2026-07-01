import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 2200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onComplete, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[20%] animate-drift opacity-30"
          style={{ background: "radial-gradient(circle at 30% 40%, #88bda466, transparent 50%), radial-gradient(circle at 70% 60%, #6592874d, transparent 50%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative font-display text-[10vw] sm:text-[7vw] leading-none tracking-tighter text-foreground/90"
      >
        SURAJIT
      </motion.div>

      <div className="relative mt-10 w-[360px] max-w-[75vw]">
        <div className="h-[6px] w-full rounded-full bg-foreground/10 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            style={{ width: `${pct}%`, boxShadow: "0 0 24px var(--accent-glow)" }}
          />
        </div>
        <div className="mt-4 flex justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Loading{".".repeat(dots)}</span>
          <span className="tabular-nums text-foreground/80">{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>
    </motion.div>
  );
}
