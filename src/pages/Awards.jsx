import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, CalendarDays, Gamepad2 } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import { SetInfoBanner, Wordmark } from "../components/ui/decor";
import { AwardsDataSkeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  buildYearRange,
  defaultAwardsYear,
  getYearFromDate,
} from "../lib/year";
import { usePageTitle } from "../hooks/usePageTitle";

const normalizeAwards = (list) =>
  (list || [])
    .map((a) => (typeof a === "string" ? { name: a, explanation: "" } : a))
    .filter((a) => a && typeof a.name === "string" && a.name.trim());

export default function Awards() {
  const { reviews, loading, error } = useReviews();
  const years = useMemo(() => buildYearRange(), []);
  const [year, setYear] = useState(() => {
    const preferred = defaultAwardsYear();
    return years.includes(preferred) ? preferred : years[0];
  });

  const games = useMemo(() => {
    return (reviews || [])
      .filter((r) => getYearFromDate(r.date) === year)
      .map((r) => ({ ...r, awards: normalizeAwards(r.awards) }))
      .filter((r) => r.awards.length > 0)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [reviews, year]);

  usePageTitle(`Awards ${year}`);

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <p className="eyebrow justify-center">Awards unavailable</p>
          <h1 className="display-hero mt-3 text-3xl text-void">
            Could not load reviews
          </h1>
          <p className="mt-3 text-sm text-void/80">
            Check the API connection and database, then refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <section className="relative pt-12 lg:pt-16">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wordmark text="Awards" tag="yearly awards" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-void" tagClassName="text-void/50" />
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-ink">
            The honors handed out each year, with a note on why each game earned
            its award.
          </p>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pb-24">
        <div className="mt-8">
          <SetInfoBanner
            emblem={<Trophy className="w-5 h-5" />}
            name={`Awards ${year}`}
            stats={[{ label: "Games", value: loading ? "…" : games.length }]}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-blush-deep" />
            <span className="eyebrow !text-[0.65rem]">Awards year</span>
          </div>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(parseInt(v, 10))}
          >
            <SelectTrigger
              data-testid="awards-year-filter"
              className="w-44 h-12 bg-bone border-hairline text-void"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-bone border-hairline text-void">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <AwardsDataSkeleton />
        ) : games.length === 0 ? (
          <div className="mt-12 border border-hairline bg-bone p-12 text-center">
            <p className="display-heading text-2xl text-void mb-2">
              No awards for {year}.
            </p>
            <p className="text-sm text-ink">
              Awards appear here once titles dated {year} are given honors in the
              admin form.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <GameAwardCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function GameAwardCard({ game }) {
  const cover = game.cover_url
    ? game.cover_url.startsWith("http")
      ? game.cover_url
      : `https://${game.cover_url}`
    : null;
  return (
    <article className="flex flex-col h-full border border-hairline bg-bone hover:border-jade/50 transition-colors overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="w-16 h-16 object-cover rounded-md border border-hairline"
          />
        ) : (
          <div className="w-16 h-16 rounded-md bg-jade/20 grid place-items-center text-void/40 shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          {game.date && (
            <div className="eyebrow !text-[0.55rem] text-ash">{game.date}</div>
          )}
          <Link
            to={`/reviews/${game.slug}`}
            className="display-heading text-xl text-void hover:text-jade transition-colors leading-snug block mt-1"
          >
            {game.title}
          </Link>
        </div>
      </div>
      <div className="mt-auto">
        {game.awards.map((award, i) => (
          <div key={`${award.name}-${i}`} className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blush-deep shrink-0" />
              <h3 className="font-gothic text-lg font-semibold text-void">
                {award.name}
              </h3>
            </div>
            {award.explanation && (
              <p className="mt-1.5 text-sm leading-relaxed text-void/80">
                {award.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
