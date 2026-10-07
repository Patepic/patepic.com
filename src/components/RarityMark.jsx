const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const DIAMOND = "M12 3l7.5 9-7.5 9-7.5-9z";
const CROSS = "M6 6l12 12M18 6L6 18";

const SHAPES = {
  "★": <path d={STAR} />,
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
