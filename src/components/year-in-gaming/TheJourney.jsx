import { Layers } from "lucide-react";
import { Skeleton, SkeletonReviewCard } from "../ui/skeleton";
import { ReviewCard } from "../ReviewCard";

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR_TO_INDEX = MONTH_NAMES_FULL.reduce((acc, name, idx) => {
  acc[name.slice(0, 3).toLowerCase()] = idx;
  return acc;
}, {});

function parseMonth(key) {
  const raw = String(key).trim();
  const dashMatch = raw.match(/^\d{4}-(\d{1,2})$/);
  if (dashMatch) {
    const idx = parseInt(dashMatch[1], 10) - 1;
    if (idx >= 0 && idx < 12) return { name: MONTH_NAMES_FULL[idx], sortIndex: idx };
  }
  const abbr = raw.toLowerCase().slice(0, 3);
  if (abbr in MONTH_ABBR_TO_INDEX) {
    const idx = MONTH_ABBR_TO_INDEX[abbr];
    return { name: MONTH_NAMES_FULL[idx], sortIndex: idx };
  }
  return { name: raw, sortIndex: 99 };
}

const CARD_GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4";

export function TheJourney({ data, loading }) {
  const seriesMarathons = data.seriesMarathons || [];
  const months = Object.entries(data.monthlyGames || {}).sort(([a], [b]) => parseMonth(a).sortIndex - parseMonth(b).sortIndex);

  if (!loading && months.length === 0) return null;

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">The journey</h2>
        </div>

        {loading ? (
          <div className={`${CARD_GRID} mb-14`}>
            {Array.from({ length: 4 }).map((_, i) => (<SkeletonReviewCard key={i} />))}
          </div>
        ) : seriesMarathons.length > 0 && (
          <div className="mb-16">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-charcoal-brown/85 mb-4 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-charcoal-brown" /> Franchise deep dives
            </p>
            <div className="space-y-8">
              {seriesMarathons.map(({ series, games, count }) => (
                <div key={series}>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="font-semibold text-charcoal-brown">{series}</h3>
                    <span className="text-sm text-charcoal-brown/85">{count} games</span>
                  </div>
                  <div className={CARD_GRID}>
                    {games.map((game) => (
                      <ReviewCard key={game.slug} review={game} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-6" />
                <div className={CARD_GRID}>
                  {Array.from({ length: 4 }).map((_, j) => (<SkeletonReviewCard key={j} />))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {months.map(([monthKey, monthData]) => {
              const games = Array.isArray(monthData?.games) ? monthData.games : [];
              if (games.length === 0) return null;
              const monthLabel = monthData?.monthName || parseMonth(monthKey).name;
              return (
                <div key={monthKey}>
                  <div className="flex items-baseline gap-3 mb-6">
                    <h3 className="font-semibold text-charcoal-brown">{monthLabel}</h3>
                    <span className="text-sm text-charcoal-brown/85">{games.length} {games.length === 1 ? "game" : "games"}</span>
                  </div>
                  <div className={CARD_GRID}>
                    {games.map((game, gi) => (
                      <ReviewCard key={game.slug || `${monthKey}-${gi}`} review={game} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
