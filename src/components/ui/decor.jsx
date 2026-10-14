import { useEffect, useState } from "react";
import { Twitch, Youtube, Mail, ArrowUp } from "lucide-react";
import { creator } from "../../data/creator";

export const SocialRow = ({ className = "", size = "w-11 h-11" }) => {
  const items = [
    { href: creator.twitch.url, label: "Twitch", text: "Twitch", Icon: Twitch },
    ...creator.youtubeChannels.map((c) => ({ href: c.url, label: `YouTube: ${c.name}`, text: c.name, Icon: Youtube })),
    { href: "mailto:contact@patepic.com", label: "Email", text: "Email", Icon: Mail },
  ];
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {items.map(({ href, label, text, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          data-testid={`social-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className="group inline-flex flex-col items-center gap-1.5 text-charcoal-brown"
        >
          <span className={`${size} rounded-md bg-white border border-honey group-hover:border-charcoal-brown grid place-items-center transition-colors`}>
            <Icon className="w-5 h-5" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.06em]">{text}</span>
        </a>
      ))}
    </div>
  );
};

export const SetInfoBanner = ({ emblem, name, stats = [], className = "" }) => (
  <div className={`relative rounded-2xl border-2 border-charcoal-brown bg-charcoal-brown px-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
    <BlossomCorner small />
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-lg bg-white grid place-items-center text-charcoal-brown shrink-0" aria-hidden="true">
        {emblem}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Showing</div>
        <div className="font-sans font-bold text-white text-lg leading-tight">{name}</div>
      </div>
    </div>
    {stats.map((s) => (
      <div key={s.label} className="flex items-center gap-x-8">
        <div className="h-9 w-px bg-white/15 hidden sm:block" />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">{s.label}</div>
          <div className="font-sans font-bold text-white text-lg leading-tight">{s.value}</div>
        </div>
      </div>
    ))}
  </div>
);

export const Wordmark = ({ text, tag, className = "", tagClassName = "" }) => (
  <span className={`inline-block ${className}`}>
    <span className="wordmark-text block">{text}</span>
    {tag && (
      <span className={`sticker-tag block mt-3 text-xs sm:text-sm ${tagClassName}`}>
        {tag}
      </span>
    )}
  </span>
);

export const CapsuleButton = ({ as: Tag = "a", icon: Icon, solidIcon = false, children, className = "", ...props }) => (
  <Tag className={`pill-capsule ${className}`} {...props}>
    {Icon && (
      <span className="pill-capsule-icon" aria-hidden="true">
        <Icon className="w-4 h-4" fill={solidIcon ? "currentColor" : "none"} />
      </span>
    )}
    <span>{children}</span>
  </Tag>
);

const WAVE_CURVE = "M0,50 C180,95 180,5 360,50 C540,95 540,5 720,50 C900,95 900,5 1080,50 C1260,95 1260,5 1440,50";

export const WaveEdge = ({ color = "var(--color-charcoal-brown)", className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 1440"
    preserveAspectRatio="none"
    className={`absolute right-full top-0 h-full w-8 -mr-px pointer-events-none ${className}`}
  >
    <g transform="matrix(0 1 1 0 0 0)">
      <path d={`${WAVE_CURVE} L1440,120 L0,120 Z`} fill={color} />
      <path d={WAVE_CURVE} fill="none" stroke="var(--color-charcoal-brown)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export const WaveDivider = ({
  color = "var(--color-charcoal-brown)",
  position = "bottom",
  flip = false,
  mirror = false,
  className = "",
}) => {
  const curve = WAVE_CURVE;
  const isTop = position === "top";

  const style = {
    position: "absolute",
    left: 0,
    right: 0,
    top: isTop ? 0 : "auto",
    bottom: isTop ? "auto" : 0,
    transform: [
      isTop ? "translateY(-99%)" : "translateY(99%)",
      flip && "scaleY(-1)",
      mirror && "scaleX(-1)",
    ].filter(Boolean).join(" "),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`wave-divider w-full h-12 sm:h-16 z-10 pointer-events-none ${className}`}
      style={style}
    >
      <path d={`${curve} L1440,120 L0,120 Z`} fill={color} />
      <path d={curve} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const PETAL = "M0 0C-34 -22 -46 -62 -20 -92L0 -76L20 -92C46 -62 34 -22 0 0Z";
export const PETAL_ANGLES = [0, 72, 144, 216, 288];

export const Blossom = ({ className = "", detailed = false, ...props }) => (
  <svg className={className} viewBox="-110 -110 220 220" aria-hidden="true" fill="currentColor" strokeLinejoin="round" {...props}>
    {PETAL_ANGLES.map((a) => <path key={a} d={PETAL} transform={`rotate(${a})`} />)}
    {detailed && (
      <g fill="var(--color-honey)" stroke="none">
        {PETAL_ANGLES.map((a) => (
          <g key={a} transform={`rotate(${a + 36})`}>
            <path d="M0 -12V-36" fill="none" stroke="var(--color-honey)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="0" cy="-40" r="5" />
          </g>
        ))}
        <circle r="11" />
      </g>
    )}
  </svg>
);

export const BlossomCorner = ({ small = false }) => (
  <span className={`blossom-corner${small ? " is-small" : ""}`} aria-hidden="true">
    <Blossom detailed className="text-mango-yellow" />
    <Blossom detailed className="text-pink-dusty" />
  </span>
);

export const PokerChip = ({ className = "", reverse = false, still = false }) => (
  <svg className={className} viewBox="0 0 1000 1000" aria-hidden="true">
    <g className={still ? undefined : `chip-spin${reverse ? " chip-spin-reverse" : ""}`} fill="none" stroke="currentColor">
      <circle cx="500" cy="500" r="478" strokeWidth="14" />
      <circle cx="500" cy="500" r="430" strokeWidth="72" strokeDasharray="169 168.7" />
      <circle cx="500" cy="500" r="352" strokeWidth="12" />
      <circle cx="500" cy="500" r="306" strokeWidth="8" strokeDasharray="16 16" />
      <g transform="translate(500 505) scale(2.1)" fill="currentColor" stroke="none">
        {PETAL_ANGLES.map((a) => <path key={a} d={PETAL} transform={`rotate(${a})`} />)}
      </g>
    </g>
  </svg>
);

export const PageBackdrop = ({ className = "page-backdrop", chip = false, spin = false }) => {
  const ring = { fill: "none", stroke: "currentColor", strokeWidth: 44, strokeDasharray: "30 9" };
  const inner = { fill: "none", stroke: "currentColor", strokeWidth: 10 };
  return (
    <div className={className} aria-hidden="true">
      {["page-backdrop-ring-l", "page-backdrop-ring-r"].map((side) => (
        <svg key={side} className={`page-backdrop-ring ${side}`} viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="430" {...ring} />
          <circle cx="500" cy="500" r="330" {...inner} />
        </svg>
      ))}
      {chip && <PokerChip className="page-backdrop-chip" still={!spin} />}
    </div>
  );
};

export const ChipBackdrop = ({ className = "card-chips" }) => (
  <div className={className} aria-hidden="true">
    <PokerChip className="page-backdrop-ring page-backdrop-ring-l" />
    <PokerChip className="page-backdrop-ring page-backdrop-ring-r" reverse />
  </div>
);

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
