import { useLayoutEffect, useRef } from "react";

export function useFitText({ maxLines = 2, minSqueeze = 0.4 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const slot = el?.parentElement;
    if (!el || !slot) return undefined;
    let lastWidth = -1;
    const contentWidth = () => {
      const cs = getComputedStyle(slot);
      return slot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    };

    const fit = () => {
      el.style.width = "";
      el.style.marginLeft = "";
      el.style.transform = "";
      const width = contentWidth();
      const lines = () => Math.round(el.scrollHeight / parseFloat(getComputedStyle(el).lineHeight));

      let squeeze = 1;
      while (lines() > maxLines && squeeze - 0.05 >= minSqueeze - 0.001) {
        squeeze -= 0.05;
        el.style.width = `${width / squeeze}px`;
        el.style.marginLeft = `${width - width / squeeze}px`;
        el.style.transform = `scaleX(${squeeze})`;
      }
    };

    const refit = () => {
      const width = contentWidth();
      if (width === lastWidth) return;
      lastWidth = width;
      fit();
    };

    refit();
    const observer = new ResizeObserver(refit);
    observer.observe(slot);
    let live = true;
    document.fonts?.ready.then(() => { if (live) fit(); });
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [maxLines, minSqueeze]);

  return ref;
}
