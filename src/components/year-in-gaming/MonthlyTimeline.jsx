import { Link } from "react-router-dom";
import { Star, Gamepad2, CalendarDays } from "lucide-react";
import { Kicker } from "../ui/decor";

const fallback =
  "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Single source of truth: derive the "jan" -> "January" lookup from the full names array
const MONTH_ABBR_TO_INDEX = MONTH_NAMES_FULL.reduce((acc, name, idx) => {
  acc[name.slice(0, 3).toLowerCase()] = idx;
  return acc;
}, {});

// Turns "2026-01", "01", "1", "jan", "January" etc. into { name: "January", sortIndex: 0 }
const parseMonth = (key) => {
  const raw = String(key).trim();

  const dashMatch = raw.match(/^\d{4}-(\d{1,2})$/);
  if (dashMatch) {
    const idx = parseInt(dashMatch[1], 10) - 1;
    if (idx >= 0 && idx < 12) return { name: MONTH_NAMES_FULL[idx], sortIndex: idx };
  }

  if (/^\d{1,2}$/.test(raw)) {
    const idx = parseInt(raw, 10) - 1;
    if (idx >= 0 && idx < 12) return { name: MONTH_NAMES_FULL[idx], sortIndex: idx };
  }

  const abbr = raw.toLowerCase().slice(0, 3);
  if (abbr in MONTH_ABBR_TO_INDEX) {
    const idx = MONTH_ABBR_TO_INDEX[abbr];
    return { name: MONTH_NAMES_FULL[idx], sortIndex: idx };
  }

  return { name: raw, sortIndex: 99 };
};

const toText = (val, fallbackText = "") => {
  if (val === null || val === undefined) return fallbackText;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.name) return String(val.name);
    if (val.label) return String(val.label);
    if (val.value) return String(val.value);
    if (val.title) return String(val.title);
    return fallbackText;
  }
  return fallbackText;
};

const coverUrl = (game) => {
  if (!game?.cover_url) return fallback;
  const url = String(game.cover_url);
  return url.startsWith("http") ? url : `https://${url}`;
};

export function MonthlyTimeline({ monthlyGames }) {
  const months = Object.entries(monthlyGames || {}).sort(([a], [b]) => {
    return parseMonth(a).sortIndex - parseMonth(b).sortIndex;
  });

  if (months.length === 0) return null;

  return (
    <div className="relative bg-pixel-blush pb-24 lg:pb-32">
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 text-center">
        <Kicker>Month by month</Kicker>
        <h1 className="display-heading -mt-1 text-5xl sm:text-6xl lg:text-7xl text-pixel-black">
          A Journey Through 2026
        </h1>
        <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-pixel-black/70">
          Every game I played, month by month — the full trail from January
          to December.
        </p>
      </section>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
        {months.map(([monthKey, monthData]) => {
          const games = Array.isArray(monthData?.games) ? monthData.games : [];
          if (games.length === 0) return null;

          const monthLabel =
            monthData?.label && typeof monthData.label === "string"
              ? monthData.label
              : parseMonth(monthKey).name;

          return (
            <div key={toText(monthKey, "month")} className="mb-8 lg:mb-10">
              <div className="mb-3 flex items-center gap-3">
                <CalendarDays className="w-3.5 h-3.5 text-pixel-black shrink-0" />
                <p className="text-sm font-bold uppercase tracking-[0.06em] text-pixel-black whitespace-nowrap">
                  {monthLabel}
                </p>
                <div className="flex-1 h-px bg-pixel-forest" />
                <span className="text-sm text-pixel-black/60 whitespace-nowrap">
                  {games.length} {games.length === 1 ? "game" : "games"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {games.map((game, gi) => {
                  const cover = coverUrl(game);
                  const title = toText(game?.title, "Untitled");
                  const platform = toText(game?.platform, "");
                  const rating = toText(game?.rating, "-");
                  const slug = toText(game?.slug, `game-${gi}`);

                  return (
                    <Link
                      key={slug}
                      to={`/reviews/${slug}`}
                      data-testid={`review-card-${slug}`}
                      className="group relative rounded-xl border border-pixel-black/10 bg-pixel-mint overflow-hidden transition-colors"
                    >
                      <div className="relative aspect-square overflow-hidden bg-pixel-mint">
                        <img
                          src={cover}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pixel-black/40 via-transparent to-transparent" />
                        <div className="absolute top-1 right-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-pixel-pink text-pixel-black text-[0.7rem] font-display font-bold">
                          <Star className="w-2.5 h-2.5" />
                          {rating}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-display font-bold text-[0.75rem] text-pixel-black leading-snug line-clamp-2">
                          {title}
                        </p>
                        {platform && (
                          <div className="mt-1 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-pixel-black/60">
                            <Gamepad2 className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{platform}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}