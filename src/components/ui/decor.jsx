import { useEffect, useState } from "react";
import { Twitch, Youtube, Mail, ArrowUp } from "lucide-react";
import { creator } from "../../data/creator";
import modelImg from "../../assets/model.png";

export const SocialRow = ({ className = "", size = "w-10 h-10" }) => {
  const items = [
    { href: creator.twitch.url, label: "Twitch", Icon: Twitch },
    ...creator.youtubeChannels.map((c) => ({ href: c.url, label: `YouTube: ${c.name}`, Icon: Youtube })),
    { href: "mailto:contact@patepic.com", label: "Email", Icon: Mail },
  ];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          data-testid={`social-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
          className={`${size} rounded-md bg-bone text-void/80 border border-hairline hover:border-jade hover:text-void grid place-items-center transition-colors`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
};

export const SetInfoBanner = ({ emblem, name, stats = [], className = "" }) => (
  <div className={`rounded-2xl border-2 border-void bg-void px-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-lg bg-bone grid place-items-center text-void shrink-0" aria-hidden="true">
        {emblem}
      </div>
      <div>
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-bone/50">Showing</div>
        <div className="font-gothic font-bold text-bone text-lg leading-tight">{name}</div>
      </div>
    </div>
    {stats.map((s) => (
      <div key={s.label} className="flex items-center gap-x-8">
        <div className="h-9 w-px bg-bone/15 hidden sm:block" />
        <div>
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-bone/50">{s.label}</div>
          <div className="font-gothic font-bold text-bone text-lg leading-tight">{s.value}</div>
        </div>
      </div>
    ))}
  </div>
);

export const MascotNote = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img
      src={modelImg}
      alt=""
      aria-hidden="true"
      className="w-8 h-8 rounded-full object-cover object-top mix-blend-luminosity opacity-90 border border-jade/30 shrink-0"
    />
    <p className="text-sm text-void/70 italic">{children}</p>
  </div>
);

export const Wordmark = ({ text, tag, className = "", tagClassName = "" }) => (
  <span className={`inline-block ${className}`}>
    <span className="block">{text}</span>
    {tag && (
      <span className={`sticker-tag block mt-3 text-xs sm:text-sm ${tagClassName}`}>
        {tag}
      </span>
    )}
  </span>
);

export const CapsuleButton = ({ as: Tag = "a", icon: Icon, children, className = "", ...props }) => (
  <Tag className={`pill-capsule ${className}`} {...props}>
    {Icon && (
      <span className="pill-capsule-icon" aria-hidden="true">
        <Icon className="w-4 h-4" fill="currentColor" />
      </span>
    )}
    <span>{children}</span>
  </Tag>
);

const WAVE_CURVE = "M0,50 C180,95 180,5 360,50 C540,95 540,5 720,50 C900,95 900,5 1080,50 C1260,95 1260,5 1440,50";

export const WaveEdge = ({ color = "var(--void)", className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 1440"
    preserveAspectRatio="none"
    className={`absolute right-full top-0 h-full w-8 -mr-px pointer-events-none ${className}`}
  >
    <g transform="matrix(0 1 1 0 0 0)">
      <path d={`${WAVE_CURVE} L1440,120 L0,120 Z`} fill={color} />
      <path d={WAVE_CURVE} fill="none" stroke="var(--void)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export const WaveDivider = ({
  color = "var(--void)",
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
      <path d={curve} fill="none" stroke="var(--void)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

const SPADE = "M12 2 C9 7 4 9 4 14 C4 16.5 6 18 9 18 L9 22 L15 22 L15 18 C18 18 20 16.5 20 14 C20 9 15 7 12 2 Z";

export const PokerChip = ({ className = "", reverse = false, still = false }) => (
  <svg className={className} viewBox="0 0 1000 1000" aria-hidden="true">
    <g className={still ? undefined : `chip-spin${reverse ? " chip-spin-reverse" : ""}`} fill="none" stroke="currentColor">
      <circle cx="500" cy="500" r="478" strokeWidth="14" />
      <circle cx="500" cy="500" r="430" strokeWidth="72" strokeDasharray="169 168.7" />
      <circle cx="500" cy="500" r="352" strokeWidth="12" />
      <circle cx="500" cy="500" r="306" strokeWidth="8" strokeDasharray="16 16" />
      <path d={SPADE} transform="translate(320 315) scale(15)" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

export const PageBackdrop = ({ className = "page-backdrop", chip = false }) => {
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
      {chip && <PokerChip className="page-backdrop-chip" still />}
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
