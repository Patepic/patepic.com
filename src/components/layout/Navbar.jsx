import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Twitch, Youtube, Mail } from "lucide-react";
import { creator } from "../../data/creator";
import { useAuth } from "../../context/AuthContext";
import { PokerChip, WaveEdge } from "../ui/decor";
import { api } from "../../lib/api";

const links = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/awards", label: "Awards" },
  { to: "/year-in-gaming", label: "Year in Gaming" },
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
        const { data } = await api.get("/twitch/live", { params: { handle } });
        setLive(data);
      } catch {
        setLive({ isLive: false });
      }
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [handle]);
  return live;
}

const navLink = ({ isActive }) =>
  `relative py-2 text-[0.9rem] font-extrabold uppercase transition-colors ${
    isActive ? "text-void" : "text-void/75 hover:text-void"
  }`;

const iconBtn = "text-bone hover:text-blush transition-colors";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const handle = creator.twitch?.handle ?? creator.twitch?.url?.split("/").pop();
  const live = useTwitchLive(handle);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 lg:top-6 left-0 right-0 z-50 pointer-events-none">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 mx-auto px-7 rounded-full border border-hairline bg-bone/60 backdrop-blur-md shadow-soft pointer-events-auto">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLink}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-leaf" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {live?.isLive && (
          <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer"
            className="hidden lg:inline-flex absolute left-1/2 top-full -translate-x-1/2 mt-1 pill pill-live h-7 px-3 rounded-full text-[0.68rem] uppercase tracking-[0.14em] bg-bone pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" /> Live
          </a>
        )}

        {user && (
          <div className="hidden lg:flex fixed right-5 bottom-[4.75rem] z-40 flex-col gap-2 pointer-events-auto">
            <Link to="/admin" aria-label="Admin" title="Admin"
              className="w-11 h-11 grid place-items-center rounded-[4px] bg-blush text-void border border-blush-soft hover:bg-[#DB7FA3] transition-colors">
              <LayoutDashboard className="w-4 h-4" />
            </Link>
            <button onClick={logout} aria-label="Log out" title="Log out"
              className="w-11 h-11 grid place-items-center rounded-[4px] bg-bone text-void border border-hairline hover:border-jade transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex lg:hidden items-center gap-2 ml-auto pointer-events-auto">
          {live?.isLive && (
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer"
              className="pill pill-live h-8 px-3 rounded-md text-[0.72rem] uppercase tracking-[0.14em] bg-bone">
              <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" /> Live
            </a>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden relative z-[60] h-11 px-5 rounded-full bg-bone text-void grid place-items-center shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] border border-void/10"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden pointer-events-auto">
          <button type="button" aria-label="Close menu" onClick={close} className="fixed inset-0 z-40 bg-void/40 animate-in fade-in duration-200" />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-sm bg-void animate-in slide-in-from-right duration-300">
            <WaveEdge />
            <div className="nav-chip-layer" aria-hidden="true">
              <PokerChip still className="absolute -top-24 -left-20 w-72 h-72 text-bone opacity-[0.08]" />
            </div>

            <div className="relative z-[2] h-full flex flex-col items-end justify-between overflow-y-auto px-5 pt-24 pb-8">
              <nav className="flex flex-col items-end gap-3 my-auto text-right">
                {links.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={close} end={l.to === "/"}
                    className={({ isActive }) => `wordmark text-[2.1rem] !leading-none transition-colors ${isActive ? "text-mint" : "text-bone hover:text-blush"}`}>
                    {l.label}
                  </NavLink>
                ))}
                {user && (
                  <>
                    <Link to="/admin" onClick={close} className="wordmark text-[2.1rem] !leading-none text-blush-soft hover:text-blush">Admin</Link>
                    <button onClick={() => { logout(); close(); }} className="mt-1 text-sm font-bold uppercase text-bone/70 hover:text-blush">Log out</button>
                  </>
                )}
              </nav>

              <div className="flex items-center gap-6 pt-8">
                <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" aria-label="Twitch" className={iconBtn}><Twitch className="w-7 h-7" /></a>
                {creator.youtubeChannels.map((c) => (
                  <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`YouTube: ${c.name}`} title={`YouTube: ${c.name}`} className={iconBtn}><Youtube className="w-7 h-7" /></a>
                ))}
                <a href="mailto:contact@patepic.com" aria-label="Email" className={iconBtn}><Mail className="w-7 h-7" /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
