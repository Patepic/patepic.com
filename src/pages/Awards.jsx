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
  const [pickedYear, setYear] = useState(null);
  const latestAwardYear = useMemo(() => {
    const awarded = (reviews || [])
      .filter((r) => normalizeAwards(r.awards).length > 0)
      .map((r) => getYearFromDate(r.date))
      .filter((y) => years.includes(y));
    return awarded.length ? Math.max(...awarded) : null;
  }, [reviews, years]);
  const preferredYear = defaultAwardsYear();
  const year = pickedYear ?? latestAwardYear ?? (years.includes(preferredYear) ? preferredYear : years[0]);

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
          <h1 className="display-hero mt-3 text-3xl text-charcoal-brown">
            Could not load reviews
          </h1>
          <p className="mt-3 text-sm text-charcoal-brown/90">
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
          <Wordmark text="Awards" tag="yearly awards" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-charcoal-brown" tagClassName="text-charcoal-brown/70" />
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-charcoal-brown">
            The honors I hand out each year, with a note on why each game earned
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
            <CalendarDays className="w-4 h-4 text-charcoal-brown/70" />
            <span className="eyebrow !text-[0.65rem]">Awards year</span>
          </div>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(parseInt(v, 10))}
          >
            <SelectTrigger
              data-testid="awards-year-filter"
              className="w-44 h-12 bg-white border-honey text-charcoal-brown"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-honey text-charcoal-brown">
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
          <div className="mt-12 border border-honey bg-white p-12 text-center">
            <p className="display-heading text-2xl text-charcoal-brown mb-2">
              No awards for {year} yet.
            </p>
            <p className="text-sm text-charcoal-brown">
              I hand out awards once the year{"'"}s reviews are in.{years.length > 1 ? " Try another year from the menu above." : " Check back at the end of the year."}
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
    <article className="flex flex-col h-full border border-honey bg-white hover:border-charcoal-brown/50 transition-colors overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="w-16 h-16 object-cover rounded-md border border-honey"
          />
        ) : (
          <div className="w-16 h-16 rounded-md bg-charcoal-brown/20 grid place-items-center text-charcoal-brown/65 shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          {game.date && (
            <div className="eyebrow !text-[0.55rem] text-charcoal-brown/85">{game.date}</div>
          )}
          <Link
            to={`/reviews/${game.slug}`}
            className="display-heading text-xl text-charcoal-brown hover:text-charcoal-brown transition-colors leading-snug block mt-1"
          >
            {game.title}
          </Link>
        </div>
      </div>
      <div className="mt-auto">
        {game.awards.map((award, i) => (
          <div key={`${award.name}-${i}`} className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-charcoal-brown/70 shrink-0" />
              <h3 className="font-sans text-lg font-semibold text-charcoal-brown">
                {award.name}
              </h3>
            </div>
            {award.explanation && (
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-brown/90">
                {award.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
