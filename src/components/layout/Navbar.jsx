import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { creator } from "../../data/creator";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/year-in-gaming/2026", label: "Year in Gaming" },
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
          { method: "POST" }
        );
        const { access_token } = await tokenRes.json();
        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${handle}`,
          { headers: { "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID, Authorization: `Bearer ${access_token}` } }
        );
        const { data } = await streamRes.json();
        const stream = data[0] ?? null;
        setLive({ isLive: !!stream, title: stream?.title ?? "", game: stream?.game_name ?? "", viewers: stream?.viewer_count ?? 0 });
      } catch { setLive({ isLive: false }); }
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [handle]);
  return live;
}

const navLink = ({ isActive }) =>
  `relative py-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
    isActive ? "text-off-white" : "text-off-white/60 hover:text-off-white"
  }`;

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const handle = creator.twitch?.handle ?? creator.twitch?.url?.split("/").pop();
  const live = useTwitchLive(handle);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-crimson/95 border-b border-off-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
          <span className="display-heading text-xl text-off-white tracking-tight">
            {creator.name}<span className="text-gold">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLink}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gold" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {live?.isLive && (
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer"
              className="pill pill-live h-8 px-3 rounded-full text-[0.75rem] uppercase tracking-[0.06em]">
              <span className="w-2 h-2 rounded-full bg-scarlet" /> Live
            </a>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/admin" className="pill pill-gold h-8 px-4 rounded-lg text-[0.7rem] uppercase tracking-[0.06em]">Admin</Link>
              <button onClick={logout} aria-label="Log out"
                className="w-8 h-8 grid place-items-center rounded-lg border border-off-white/10 text-off-white hover:bg-surface/60 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-off-white" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-crimson pt-20 px-6 overflow-y-auto">
          <div className="flex flex-col items-start gap-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} end={l.to === "/"}
                className={({ isActive }) =>
                  `pill h-11 px-6 rounded-lg text-sm uppercase tracking-[0.06em] w-full ${isActive ? "pill-gold" : "pill-outline"}`
                }>
                {l.label}
              </NavLink>
            ))}
          </div>
          {user && (
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-off-white/10">
              <Link to="/admin" onClick={() => setOpen(false)} className="pill pill-gold h-11 px-6 rounded-lg text-sm">Admin</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="pill pill-outline h-11 px-6 rounded-lg text-sm">Log out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
