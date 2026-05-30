import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Snowflake, Menu, X, Radio } from "lucide-react";
import { creator } from "../../data/creator";

const links = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <Snowflake className="w-5 h-5 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-display text-xl tracking-tight text-slate-50">
            {creator.name}<span className="text-cyan-400">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm tracking-wide rounded-full transition-colors ${
                  isActive
                    ? "text-cyan-300 bg-cyan-500/10"
                    : "text-slate-400 hover:text-slate-50 hover:bg-white/5"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LiveBadge />

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-200 p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm rounded-lg ${
                    isActive
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-slate-300 hover:bg-white/5"
                  }`
                }
                end={l.to === "/"}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const LiveBadge = () => {
  if (creator.isLive) {
    return (
      <a
        href={creator.twitch.url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="live-badge-online"
        className="group inline-flex items-center gap-2 pl-2.5 pr-3 sm:pr-4 h-9 rounded-full bg-rose-500/15 border border-rose-400/40 hover:bg-rose-500/25 transition relative"
        title={`Live on Twitch: ${creator.liveTitle}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
        <span className="text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase font-medium text-rose-200">
          Live
        </span>
        <span className="hidden lg:inline text-xs text-rose-100/80 max-w-[140px] truncate border-l border-rose-400/30 pl-2">
          {creator.liveGame}
        </span>
      </a>
    );
  }

  return (
    <a
      href={creator.twitch.url}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="live-badge-offline"
      className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500/40 transition text-xs text-slate-400 hover:text-cyan-300"
      title="Currently offline — follow on Twitch"
    >
      <Radio className="w-3.5 h-3.5" />
      <span className="tracking-[0.2em] uppercase">Offline</span>
    </a>
  );
};
