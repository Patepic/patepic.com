import React from "react";
import { Link } from "react-router-dom";
import { Snowflake, Twitch, Youtube } from "lucide-react";
import { creator } from "../../data/creator";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-white/5 mt-24 bg-slate-950/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            <span className="font-display text-xl text-slate-50">
              {creator.name}<span className="text-cyan-400">.</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            {creator.tagline}. Long reviews on cold days. Live chaos most nights.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-cyan-500 mb-4">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/reviews" className="text-slate-300 hover:text-cyan-300">
                All Reviews
              </Link>
            </li>
            <li>
              <Link to="/tier-list" className="text-slate-300 hover:text-cyan-300">
                Tier List
              </Link>
            </li>
            <li>
              <Link to="/guidelines" className="text-slate-300 hover:text-cyan-300">
                Scoring Guidelines
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-300 hover:text-cyan-300">
                Pitch a Game
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-cyan-500 mb-4">
            Catch me streaming
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={creator.twitch.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-twitch"
              className="inline-flex items-center gap-3 text-sm text-slate-300 hover:text-purple-300 group"
            >
              <span className="w-9 h-9 rounded-full border border-white/10 grid place-items-center group-hover:border-purple-400/40 group-hover:bg-purple-500/10 transition">
                <Twitch className="w-4 h-4" />
              </span>
              Twitch · {creator.twitch.handle}
            </a>
            <a
              href={creator.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-youtube"
              className="inline-flex items-center gap-3 text-sm text-slate-300 hover:text-rose-300 group"
            >
              <span className="w-9 h-9 rounded-full border border-white/10 grid place-items-center group-hover:border-rose-400/40 group-hover:bg-rose-500/10 transition">
                <Youtube className="w-4 h-4" />
              </span>
              YouTube · {creator.youtube.handle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {creator.name}. Played, written, and streamed in icy blues.</span>
          <span>Reviews by day. VTuber by night.</span>
        </div>
      </div>
    </footer>
  );
};
