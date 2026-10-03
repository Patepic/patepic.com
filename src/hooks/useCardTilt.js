import { useCallback } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useCardTilt(strength = 10) {
  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== "mouse" || reducedMotion()) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(0.5 - y) * strength}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * strength}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--bx", `${37 + x * 26}%`);
      el.style.setProperty("--by", `${33 + y * 34}%`);
      el.style.setProperty("--hyp", `${Math.min(1, Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2)}`);
      el.dataset.tilting = "";
    },
    [strength],
  );

  const onPointerLeave = useCallback((e) => {
    const el = e.currentTarget;
    ["--rx", "--ry", "--mx", "--my", "--bx", "--by", "--hyp"].forEach((p) => el.style.removeProperty(p));
    delete el.dataset.tilting;
  }, []);

  return { onPointerMove, onPointerLeave };
}
