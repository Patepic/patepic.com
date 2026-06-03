import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Snowflake, Menu, X, Radio, LogOut, Lock } from "lucide-react";
import { creator } from "../../data/creator";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function useTwitchLive(handle) {
  const [live, setLive] = useState(null);

  useEffect(() => {
    if (!handle) return;

    const check = async () => {
      try {
        const tokenRes = await fetch(
          `https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&client_secret=${import.meta.env.VITE_TWITCH_SECRET_KEY}&grant_type=client_credentials`,
          { method: "POST" },
        );
        const { access_token } = await tokenRes.json();

        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${handle}`,
          {
            headers: {
              "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        const { data } = await streamRes.json();
        const stream = data[0] ?? null;
        setLive({
          isLive: !!stream,
          title: stream?.title ?? "",
          game: stream?.game_name ?? "",
          viewers: stream?.viewer_count ?? 0,
        });
      } catch {
        setLive({ isLive: false });
      }
    };

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [handle]);

  return live;
}

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handle =
    creator.twitch?.handle ?? creator.twitch?.url?.split("/").pop();
  const live = useTwitchLive(handle);

  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <Snowflake className="w-5 h-5 text-sky-600 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-display text-xl tracking-tight text-slate-900">
            {creator.name}
            <span className="text-sky-600">.</span>
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
                    ? "text-sky-700 bg-sky-100/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LiveBadge live={live} />
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <Link
                  to="/admin"
                  data-testid="nav-admin"
                  className="px-3 h-9 inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-700 text-xs font-medium tracking-wide transition"
                >
                  <Lock className="w-3.5 h-3.5" /> Admin
                </Link>
                <button
                  onClick={logout}
                  data-testid="nav-logout"
                  title="Log out"
                  className="w-9 h-9 grid place-items-center rounded-full border border-slate-200 hover:bg-slate-100 text-slate-500"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-700 p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
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
                      ? "text-sky-700 bg-sky-100/70"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
                end={l.to === "/"}
              >
                {l.label}
              </NavLink>
            ))}
            {user && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm rounded-lg bg-slate-900 text-white inline-flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Admin
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-3 py-2.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 inline-flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const LiveBadge = ({ live }) => {
  if (live?.isLive) {
    return (
      <a
        href={creator.twitch.url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="live-badge-online"
        className="group inline-flex items-center gap-2 pl-2.5 pr-3 h-9 rounded-full bg-rose-50 border border-rose-300/80 hover:bg-rose-100 transition"
        title={live.title ? `Live on Twitch: ${live.title}` : "Live on Twitch"}
      >
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
        </span>
        <span className="text-[0.65rem] tracking-[0.25em] uppercase font-medium text-rose-700">
          Live
        </span>
      </a>
    );
  }

  return null;
};
