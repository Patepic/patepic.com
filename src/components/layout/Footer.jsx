import { Link } from "react-router-dom";
import { Twitch, Youtube, Mail } from "lucide-react";
import { creator } from "../../data/creator";

const navLinks = [
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Footer = () => {
  return (
    <footer className="relative mt-16 bg-pixel-mint border-t border-pixel-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="pill pill-outline h-7 px-3 rounded-md text-[0.7rem] uppercase tracking-[0.06em]">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" data-testid="footer-twitch"
              aria-label="Twitch"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Twitch className="w-4 h-4" />
            </a>
            <a href={creator.youtube.url} target="_blank" rel="noopener noreferrer" data-testid="footer-youtube"
              aria-label="YouTube"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="mailto:contact@patepic.com" aria-label="Email"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pixel-black/10 flex flex-wrap items-center justify-between gap-2 text-sm text-pixel-black/60">
          <span>Copyright © {new Date().getFullYear()} {creator.name}</span>
          <span>{creator.tagline}</span>
        </div>
      </div>
    </footer>
  );
};
