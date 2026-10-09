import type { SuraAnimationKey } from "@/components/SuraMascot";

export function triggerMascotReaction(animation: SuraAnimationKey) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mascot:reaction", { detail: { animation } }));
  }
}

export function triggerMascotFormSent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mascot:form-sent"));
  }
}

export function triggerMascotFormError() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mascot:form-error"));
  }
}
