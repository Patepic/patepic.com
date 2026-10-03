import { useEffect } from "react";

const DEFAULT_TITLE = "Patepic | Game Reviews & VTuber Streams";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Patepic` : DEFAULT_TITLE;
  }, [title]);
}
