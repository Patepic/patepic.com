import bisexual from "../assets/bisexual.png";
import pansexual from "../assets/pansexual.png";
import nonbinary from "../assets/nonbinary.png";

const FLAGS = [
  { name: "Bisexual", src: bisexual },
  { name: "Pansexual", src: pansexual },
  { name: "Nonbinary", src: nonbinary },
];

export function PrideFlags({ only, className = "" }) {
  const flags = only ? FLAGS.filter((f) => only.includes(f.name)) : FLAGS;
  return (
    <span className={`pride-flags ${className}`}>
      {flags.map(({ name, src }) => (
        <img key={name} src={src} alt={`${name} flag`} title={name} />
      ))}
    </span>
  );
}
