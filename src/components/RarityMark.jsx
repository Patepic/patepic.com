import { PETAL, PETAL_ANGLES } from "./ui/decor";

const DIAMOND = "M12 3l7.5 9-7.5 9-7.5-9z";
const CROSS = "M6 6l12 12M18 6L6 18";

const SHAPES = {
  "★": (
    <g className="rarity-blossom" transform="translate(12 12) scale(0.118)">
      {PETAL_ANGLES.map((a) => <path key={a} d={PETAL} transform={`rotate(${a})`} vectorEffect="non-scaling-stroke" />)}
      <circle r="13" fill="var(--color-tier-ink)" fillOpacity="0.4" stroke="none" />
    </g>
  ),
  "◆": <path d={DIAMOND} />,
  "✕": <path d={CROSS} className="rarity-cross" />,
};

export function RarityMark({ symbol, count = 1, className = "", title }) {
  return (
    <span className={`pc-rarity ${className}`} aria-hidden="true" title={title}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24">{SHAPES[symbol] ?? SHAPES["★"]}</svg>
      ))}
    </span>
  );
}
