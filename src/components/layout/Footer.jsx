import { Link } from "react-router-dom";
import { Twitch, Youtube, Mail } from "lucide-react";
import { creator } from "../../data/creator";
import { Wordmark, WaveDivider, PageBackdrop } from "../ui/decor";

const navLinks = [
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/awards", label: "Awards" },
  { to: "/year-in-gaming", label: "Year in Gaming" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const half = Math.ceil(navLinks.length / 2);
const linkColumns = [navLinks.slice(0, half), navLinks.slice(half)];

const EMAIL = "contact@patepic.com";

const socialIcon = "text-bone hover:text-blush transition-colors";
const footLink = "text-sm font-bold uppercase text-bone hover:text-blush transition-colors";

export const Footer = () => {
  return (
    <footer className="relative mt-28">
      <div className="relative bg-void pt-16 pb-10">
        <WaveDivider color="var(--void)" position="top" mirror />
        <PageBackdrop className="footer-backdrop" chip />
        <div className="relative z-[12] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:items-start text-center">
            <div className="md:text-left">
              <h3 className="wordmark text-[40px] text-bone md:mt-6 mb-10">Socials</h3>
              <div className="flex items-start justify-center md:justify-start gap-6">
                <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" data-testid="footer-twitch" aria-label="Twitch" className={socialIcon}>
                  <Twitch className="w-8 h-8" />
                </a>
                {creator.youtubeChannels.map((c) => (
                  <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" data-testid={`footer-youtube-${c.name.toLowerCase()}`}
                    aria-label={`YouTube: ${c.name}`} title={`YouTube: ${c.name}`} className={`${socialIcon} inline-flex flex-col items-center gap-1`}>
                    <Youtube className="w-8 h-8" />
                    {creator.youtubeChannels.length > 1 && <span className="text-[0.65rem] font-bold uppercase">{c.name}</span>}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="wordmark text-[64px] text-bone mb-10">Links</h3>
              <nav className="inline-grid grid-cols-2 text-left">
                {linkColumns.map((column, i) => (
                  <div key={i} className={`flex flex-col gap-4 ${i === 0 ? "pr-10 items-end text-right" : "pl-10 items-start border-l-[3px] border-blush"}`}>
                    {column.map((l) => (
                      <Link key={l.to} to={l.to} className={footLink}>{l.label}</Link>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="mt-10">
                <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 text-sm font-bold text-bone hover:text-blush transition-colors">
                  <Mail className="w-6 h-6" /> {EMAIL}
                </a>
              </div>
            </div>

            <div className="md:text-right">
              <h3 className="wordmark text-[40px] text-bone md:mt-6">Thanks for reading</h3>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Wordmark
              text={creator.name}
              className="wordmark text-[clamp(3rem,13vw,150px)] text-bone"
            />
          </div>

          <div className="mt-8 text-center text-sm font-bold text-bone/35">
            copyright © {new Date().getFullYear()} {creator.name}
          </div>
        </div>
      </div>
    </footer>
  );
};
