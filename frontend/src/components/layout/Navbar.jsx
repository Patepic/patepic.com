import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Snowflake, Menu, X } from "lucide-react";
import { useState } from "react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2 group"
        >
          <Snowflake className="w-5 h-5 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-display text-xl tracking-tight text-slate-50">
            frostbyte<span className="text-cyan-400">.</span>
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

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-200 p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
