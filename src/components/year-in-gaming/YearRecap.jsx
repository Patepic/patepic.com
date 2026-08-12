import { Link } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  ArrowUpRight,
  Sparkles,
  Frown,
  Layers,
} from "lucide-react";
import { Kicker } from "../ui/decor";

const fallback =
  "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";

export function YearRecap({ data }) {
  const getCover = (review) => {
    if (!review?.cover_url) return fallback;
    return review.cover_url.startsWith("http")
      ? review.cover_url
      : `https://${review.cover_url}`;
  };

  const goty = data.gameOfTheYear;
  const platformsUsed = data.platformEntries?.length || 0;
  const uniqueGenres = data.genreEntries?.length || 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-14">
        <Kicker>The highlight reel</Kicker>
        <h2 className="display-heading mt-3 text-3xl sm:text-4xl lg:text-5xl text-off-white tracking-tight">
          The Year in Review
        </h2>
        <p className="mt-4 text-off-white/70 max-w-2xl">
          From the first credits to the last — here's how 2026 shaped up.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left - GOTY hero card */}
        <div className="lg:col-span-8">
          <Link
            to={`/reviews/${goty?.slug}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-surface border border-off-white transition-all duration-500 hover:shadow-soft-lg"
          >
            <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
              <img
                src={getCover(goty)}
                alt={goty?.title || "Game of the Year"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-crimson text-off-white text-[0.7rem] sm:text-sm font-bold tracking-wider uppercase shadow-lg">
                  <Trophy className="w-3.5 h-3.5" /> Game of the Year
                </span>
              </div>

            {/* Medallion score badge, overlapping the image edge */}
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-crimson shadow-lg grid place-items-center">
                <div className="text-center leading-none">
                  <div className="font-display text-lg sm:text-2xl text-off-white">
                    {goty?.rating ?? "—"}
                  </div>
                  <div className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-wider text-off-white/60">
                    / 10
                  </div>
                </div>
              </div>
              </div>

              <div className="absolute bottom-4 left-4 right-20 sm:right-28">
                <div className="font-display text-xl sm:text-2xl lg:text-3xl text-off-white group-hover:text-gold transition-colors drop-shadow-lg leading-tight">
                  {goty?.title}
                </div>
                <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                  {goty?.platform && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-off-white/20 text-off-white text-[0.75rem] sm:text-sm">
                      <Gamepad2 className="w-3 h-3" />
                      {goty.platform}
                    </div>
                  )}
                  {goty?.date && (
                    <span className="text-[0.75rem] sm:text-sm text-off-white/60">{goty.date}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-8 sm:pt-9 flex items-center justify-between gap-3 flex-1">
              <p className="text-sm text-off-white/80 flex-1 line-clamp-2">
                {goty?.summary || "Read the full review"}
              </p>
              <ArrowUpRight className="w-5 h-5 text-off-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </div>
          </Link>
        </div>

        {/* Right - unique stat highlights (not in hero or stats section) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <RecapHighlightCard
            icon={<Sparkles className="w-4 h-4" />}
            label="Biggest Surprise"
            value={data.biggestSurprise?.title || "—"}
            subtitle={data.biggestSurprise ? `Scored ${data.biggestSurprise.rating}/10` : null}
            slug={data.biggestSurprise?.slug}
            badgeClass="bg-off-white text-surface"
          />
          <RecapHighlightCard
            icon={<Frown className="w-4 h-4" />}
            label="Biggest Disappointment"
            value={data.biggestDisappointment?.title || "—"}
            subtitle={data.biggestDisappointment ? `Scored ${data.biggestDisappointment.rating}/10` : null}
            slug={data.biggestDisappointment?.slug}
            badgeClass="bg-gold text-surface"
          />

          <div className="rounded-2xl border border-off-white bg-surface p-1 flex-1 grid grid-cols-2 divide-x divide-off-white/40">
            <MiniStat
              icon={<Gamepad2 className="w-4 h-4" />}
              label="Platforms"
              value={platformsUsed}
            />
            <MiniStat
              icon={<Layers className="w-4 h-4" />}
              label="Genres"
              value={uniqueGenres}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function RecapHighlightCard({
  icon,
  label,
  value,
  subtitle,
  slug,
  badgeClass = "bg-off-white text-surface",
  className = "",
}) {
  const content = (
    <div
      className={`group h-full bg-surface border border-off-white rounded-2xl p-4 transition-all duration-300 hover:border-gold hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[0.7rem] leading-snug tracking-[0.06em] uppercase text-off-white/60">
          {label}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center ${badgeClass}`}>
          {icon}
        </span>
      </div>
      <div className="font-display text-base sm:text-lg text-off-white tracking-tight leading-snug break-words line-clamp-2">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-off-white/60 mt-1 leading-tight break-words">
          {subtitle}
        </div>
      )}
    </div>
  );

  if (slug) {
    return (
      <Link to={`/reviews/${slug}`} className={`block h-full ${className}`}>
        {content}
      </Link>
    );
  }

  return content;
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-3 py-4">
      <span className="text-off-white/50 mb-1.5">{icon}</span>
      <div className="font-display text-2xl text-off-white leading-none">{value}</div>
      <div className="text-[0.65rem] font-bold uppercase tracking-[0.06em] text-off-white/50 mt-1">
        {label}
      </div>
    </div>
  );
}