import { useEffect, useState } from "react";

/**
 * Hook to reactively track light ("dusk") vs dark ("sage" / default) theme
 * from document.documentElement's "data-theme" attribute.
 */
export function useIsLightTheme(): boolean {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const check = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsLight(theme === "dusk");
    };

    check();

    const observer = new MutationObserver(() => check());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return isLight;
}
