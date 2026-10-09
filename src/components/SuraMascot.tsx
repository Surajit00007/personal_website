import { useState, useRef, useEffect, useCallback } from "react";
import { createAvatar, type AvatarController } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import suraDefinition from "../assets/sura.avatar.json";

// Dark Theme Avatar: Platinum Chalk Body (#e8e8e6) with Obsidian Eyes (#0d0d0d) on Dark UI
const SuraDarkAvatar = createAvatar({
  ...suraDefinition,
  colors: { body: "#e8e8e6", eyes: "#0d0d0d" },
});

// Light Theme Avatar: Obsidian Charcoal Body (#1a1a18) with Chalk Eyes (#f5f0eb) on Light UI
const SuraLightAvatar = createAvatar({
  ...suraDefinition,
  colors: { body: "#1a1a18", eyes: "#f5f0eb" },
});

export type SuraAnimationKey =
  | "idle"
  | "thinking"
  | "curious"
  | "working"
  | "celebrate"
  | "listening"
  | "sleeping"
  | "waking"
  | "excited"
  | "playful"
  | "happy"
  | "searching"
  | "shy"
  | "laughing"
  | "drowsy"
  | "confused"
  | "bored"
  | "suspicious"
  | "angry"
  | "surprised"
  | "proud"
  | "sad"
  | "scared";

import { useIsLightTheme } from "@/lib/use-theme";

export interface SuraMascotProps {
  /** Size in pixels or CSS value. Defaults to 180 */
  size?: number | string;
  /** Initial animation to start in uncontrolled mode. Defaults to 'idle' */
  defaultAnimation?: SuraAnimationKey;
  /** Controlled animation override. Leave undefined for full reactive mode */
  animation?: SuraAnimationKey;
  /** Force specific color theme ('dark' | 'light'). When omitted, automatically synchronizes with website theme */
  themeVariant?: "dark" | "light";
  /** Whether reactive visitor behavior is enabled. Defaults to true */
  reactive?: boolean;
  /** Selector for the main button. Defaults to '[data-mascot-target="main-button"], a[href="#projects"]' */
  mainButtonSelector?: string;
  /** Inactivity sleep threshold in ms. Defaults to 30,000 (30s) */
  inactivityTimeoutMs?: number;
  /** Additional container classes */
  className?: string;
  /** Callback when avatar is clicked */
  onClick?: () => void;
}

export function SuraMascot({
  size = 180,
  defaultAnimation = "idle",
  animation,
  themeVariant,
  reactive = true,
  mainButtonSelector = '[data-mascot-target="main-button"], a[href="#projects"]',
  inactivityTimeoutMs = 30000,
  className = "",
  onClick,
}: SuraMascotProps) {
  const controller = useRef<AvatarController>(null);
  const [clickReactionActive, setClickReactionActive] = useState(false);

  // Automatically track website light ("dusk") vs dark ("sage") theme
  const isWebsiteLight = useIsLightTheme();
  const isLight = themeVariant !== undefined ? themeVariant === "light" : isWebsiteLight;
  const ActiveAvatar = isLight ? SuraLightAvatar : SuraDarkAvatar;

  // Inactivity and state timers
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drowsyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSleepingOrDrowsyRef = useRef(false);

  // Safe playback honoring visitor's reduced motion preferences
  const safePlay = useCallback((anim: SuraAnimationKey) => {
    if (typeof window === "undefined" || !controller.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      controller.current.setExpression("neutral");
      controller.current.pause();
      return;
    }
    controller.current.play(anim);
  }, []);

  // Handle onAnimationEnd callback from @bible-strong/avatar-react
  const handleAnimationEnd = useCallback(
    (finishedAnim: string) => {
      // When 'waking' ends naturally, switch to 'idle'
      if (finishedAnim === "waking") {
        safePlay("idle");
      }
    },
    [safePlay],
  );

  // ─── 1. Page Load ("waking" -> "idle") & Reduced Motion Check ─────────────────
  useEffect(() => {
    if (!reactive) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      controller.current?.setExpression("neutral");
      controller.current?.pause();
      return;
    }

    // Reaction 1: Page opens -> play "waking"
    safePlay("waking");

    // Fallback: switch to "idle" after 2s if "waking" loops
    const wakeTimer = setTimeout(() => {
      const state = controller.current?.getState();
      if (state?.activeAnimation === "waking") {
        safePlay("idle");
      }
    }, 2000);

    return () => clearTimeout(wakeTimer);
  }, [reactive, safePlay]);

  // ─── 2. Inactivity Tracking (30s -> "drowsy" -> "sleeping") ──────────────────
  useEffect(() => {
    if (!reactive) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return;

    const resetInactivity = () => {
      if (isSleepingOrDrowsyRef.current) {
        isSleepingOrDrowsyRef.current = false;
        safePlay("waking");
        setTimeout(() => safePlay("idle"), 1500);
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        isSleepingOrDrowsyRef.current = true;
        safePlay("drowsy");

        drowsyTimerRef.current = setTimeout(() => {
          if (isSleepingOrDrowsyRef.current) {
            safePlay("sleeping");
          }
        }, 4000);
      }, inactivityTimeoutMs);
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"];

    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivity, { passive: true }));

    resetInactivity();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (drowsyTimerRef.current) clearTimeout(drowsyTimerRef.current);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetInactivity));
    };
  }, [reactive, inactivityTimeoutMs, safePlay]);

  // ─── 3. Main Button Reactions (Desktop Hover / Phone Tap -> "excited") ───────
  useEffect(() => {
    if (!reactive) return;

    const button = document.querySelector<HTMLElement>(mainButtonSelector);
    if (!button) return;

    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

    const handleMouseEnter = () => {
      isSleepingOrDrowsyRef.current = false;
      safePlay("excited");
    };

    const handleMouseLeave = () => {
      safePlay("idle");
    };

    const handleTap = () => {
      isSleepingOrDrowsyRef.current = false;
      safePlay("excited");
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = setTimeout(() => safePlay("idle"), 1800);
    };

    if (isTouchDevice) {
      button.addEventListener("pointerdown", handleTap, { passive: true });
    } else {
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (isTouchDevice) {
        button.removeEventListener("pointerdown", handleTap);
      } else {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [reactive, mainButtonSelector, safePlay]);

  // ─── 4. Form Submissions ("celebrate") & Errors ("confused") ──────────────────
  useEffect(() => {
    if (!reactive) return;

    const handleFormSent = () => {
      isSleepingOrDrowsyRef.current = false;
      safePlay("celebrate");
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = setTimeout(() => safePlay("idle"), 3000);
    };

    const handleFormError = () => {
      isSleepingOrDrowsyRef.current = false;
      safePlay("confused");
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = setTimeout(() => safePlay("idle"), 2500);
    };

    const handleGenericReaction = (e: Event) => {
      const customEvent = e as CustomEvent<{ animation: SuraAnimationKey }>;
      if (customEvent.detail?.animation) {
        isSleepingOrDrowsyRef.current = false;
        safePlay(customEvent.detail.animation);
      }
    };

    window.addEventListener("mascot:form-sent", handleFormSent);
    window.addEventListener("mascot:form-error", handleFormError);
    window.addEventListener("mascot:reaction", handleGenericReaction);

    return () => {
      window.removeEventListener("mascot:form-sent", handleFormSent);
      window.removeEventListener("mascot:form-error", handleFormError);
      window.removeEventListener("mascot:reaction", handleGenericReaction);
    };
  }, [reactive, safePlay]);

  // ─── 5. Mascot Click Reaction ("laughing") ──────────────────────────────────
  const handleClick = () => {
    onClick?.();
    if (!reactive) return;

    isSleepingOrDrowsyRef.current = false;
    safePlay("laughing");
    setClickReactionActive(true);

    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => {
      setClickReactionActive(false);
      safePlay("idle");
    }, 2500);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      aria-label="SURA — Interactive AI/ML Mascot"
      title="Click me!"
      /* No layout jumps: fixed aspect-ratio, contain-layout, rigid box size */
      className={`relative inline-flex items-center justify-center cursor-pointer select-none aspect-square shrink-0 ${
        clickReactionActive ? "scale-105" : ""
      } transition-transform duration-200 ${className}`}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        contain: "layout style",
      }}
    >
      <ActiveAvatar
        ref={controller}
        size={size}
        defaultAnimation={defaultAnimation}
        animation={animation}
        autoplay={true}
        onAnimationEnd={handleAnimationEnd}
        ariaLabel="SURA — Interactive AI/ML Mascot"
      />
    </div>
  );
}
