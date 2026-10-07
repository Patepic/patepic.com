import { useFitText } from "../hooks/useFitText";

export function CardTitle({ children }) {
  const ref = useFitText();
  return (
    <span className="pc-title">
      <span ref={ref} className="pc-title-fit">{children}</span>
    </span>
  );
}
