import React from "react";
import { Link } from "react-router-dom";
import { Snowflake, Twitch, Youtube } from "lucide-react";
import { creator } from "../../data/creator";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-slate-200 mt-24 bg-white/70 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Snowflake className="w-5 h-5 text-sky-600" />
            <span className="font-display text-xl text-slate-900">
              {creator.name}<span className="text-sky-600">.</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            {creator.tagline}. Long reviews on cold days. Live chaos most nights.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/reviews" className="text-slate-600 hover:text-sky-700">All Reviews</Link></li>
            <li><Link to="/tier-list" className="text-slate-600 hover:text-sky-700">Tier List</Link></li>
            <li><Link to="/guidelines" className="text-slate-600 hover:text-sky-700">Scoring Guidelines</Link></li>
            <li><Link to="/contact" className="text-slate-600 hover:text-sky-700">Pitch a Game</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-4">Catch me streaming</p>
          <div className="flex flex-col gap-2">
            <a
              href={creator.twitch.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-twitch"
              className="inline-flex items-center gap-3 text-sm text-slate-600 hover:text-purple-700 group"
            >
              <span className="w-9 h-9 rounded-full border border-slate-200 grid place-items-center group-hover:border-purple-300 group-hover:bg-purple-50 transition">
                <Twitch className="w-4 h-4" />
              </span>
              Twitch · {creator.twitch.handle}
            </a>
            <a
              href={creator.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-youtube"
              className="inline-flex items-center gap-3 text-sm text-slate-600 hover:text-rose-700 group"
            >
              <span className="w-9 h-9 rounded-full border border-slate-200 grid place-items-center group-hover:border-rose-300 group-hover:bg-rose-50 transition">
                <Youtube className="w-4 h-4" />
              </span>
              YouTube · {creator.youtube.handle}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {creator.name}. Played, written, and streamed in icy blues.</span>
          <span>Reviews by day. VTuber by night.</span>
        </div>
      </div>
    </footer>
  );
};
