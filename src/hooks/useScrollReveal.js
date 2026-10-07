import { useEffect } from "react";

export function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal", "in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const seen = new WeakSet();
    const tag = () => {
      root.querySelectorAll("section:not(.hero)").forEach((el) => {
        if (seen.has(el) || el.getAttribute("data-reveal") === "in") return;
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.setAttribute("data-reveal", "");
        io.observe(el);
      });
    };
    tag();
    const mo = new MutationObserver(tag);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [rootRef]);
}
