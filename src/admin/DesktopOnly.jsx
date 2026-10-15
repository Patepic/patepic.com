import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

const MIN_WIDTH = 768;
const MIN_HEIGHT = 480;

export function DesktopOnly({ children }) {
  const query = `(min-width: ${MIN_WIDTH}px) and (min-height: ${MIN_HEIGHT}px)`;
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.(query)?.matches === true
  );

  // Once the admin UI has mounted, keep it mounted (just hidden) if the window
  // shrinks, so resizing never throws away an unsaved form.
  const [hasMounted, setHasMounted] = useState(isDesktop);
  if (isDesktop && !hasMounted) setHasMounted(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  if (isDesktop) return <div className="contents">{children}</div>;

  return (
    <>
    {hasMounted && <div className="hidden">{children}</div>}
    <div
      data-testid="desktop-only-guard"
      className="min-h-[80vh] grid place-items-center px-4 py-16"
    >
      <div className="w-full max-w-md text-center">
        <div className="panel-framed p-8">
          <Monitor className="w-10 h-10 mx-auto text-charcoal-brown mb-4" />
          <h1 className="display-hero text-3xl text-charcoal-brown">
            Bigger screen required
          </h1>
          <p className="text-sm text-charcoal-brown/90 mt-3">
            The admin area isn't built for small screens. Please open it on
            a bigger screen like a desktop.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
