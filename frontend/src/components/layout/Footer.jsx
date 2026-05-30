import React from "react";
import { Link } from "react-router-dom";
import { Snowflake, Twitter, Youtube, Github } from "lucide-react";

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
              frostbyte<span className="text-cyan-400">.</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Cold takes on hot games. Independent reviews, no review-bombing
            agenda, just honest play.
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
            Elsewhere
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              data-testid="social-twitter"
              className="w-10 h-10 rounded-full border border-white/10 grid place-items-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="social-youtube"
              className="w-10 h-10 rounded-full border border-white/10 grid place-items-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="social-github"
              className="w-10 h-10 rounded-full border border-white/10 grid place-items-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Frostbyte. Played, written, and chilled.</span>
          <span>Built in icy blues.</span>
        </div>
      </div>
    </footer>
  );
};
