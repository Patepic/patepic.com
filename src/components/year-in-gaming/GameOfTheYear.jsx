import { Crown } from "lucide-react";
import { SkeletonReviewCard } from "../ui/skeleton";
import { ReviewCard } from "../ReviewCard";
import { WaveDivider, ChipBackdrop } from "../ui/decor";
import { getTier, getTierLabel } from "../../lib/tier";

export function GameOfTheYear({ data, loading }) {
  const goty = data.gameOfTheYear;
  if (!loading && !goty) return null;

  const tier = goty ? getTier(goty.rating, goty) : null;
  const genres = goty ? (Array.isArray(goty.genre) ? goty.genre.filter(Boolean) : goty.genre ? [goty.genre] : []) : [];
  const stats = goty
    ? [
        { label: "Score", value: `${goty.rating} / 10` },
        { label: "Tier", value: getTierLabel(tier) },
        goty.platform && { label: "Platform", value: goty.platform },
        genres.length > 0 && { label: genres.length > 1 ? "Genres" : "Genre", value: genres.join(", ") },
        goty.playTime && { label: "Play time", value: goty.playTime },
        goty.date && { label: "Reviewed", value: goty.date },
      ].filter(Boolean)
    : [];
  const runnersUp = goty
    ? (data.reviews || []).filter((r) => r.slug !== goty.slug && parseFloat(r.rating) === parseFloat(goty.rating))
    : [];

  return (
    <section className="relative pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="text-center mb-20 px-4">
        <h2 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">Game of the Year</h2>
      </div>

      <div className="relative bg-[var(--color-charcoal-brown)] py-10 md:py-14 overflow-x-clip">
        <WaveDivider color="var(--color-charcoal-brown)" position="top" mirror />
        <div className="goty-crown" aria-hidden="true"><Crown /></div>
        <div className="relative isolate max-w-xs mx-auto px-4 sm:px-0">
          <ChipBackdrop />
          {loading ? (
            <SkeletonReviewCard size="lg" />
          ) : (
            <ReviewCard review={goty} size="lg" />
          )}
        </div>

        {stats.length > 0 && (
          <dl className="goty-stats relative mt-10 max-w-4xl mx-auto px-4">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {runnersUp.length > 0 && (
          <div className="relative mt-12 px-4">
            <h3 className="uppercase text-2xl sm:text-3xl text-white text-center">Runners-up</h3>
            <p className="mt-2 text-sm text-white/80 text-center">
              Also scored {goty.rating} in {data.year}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {runnersUp.map((r) => (
                <div key={r.slug} className="w-64 max-w-full">
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          </div>
        )}
        <WaveDivider color="var(--color-charcoal-brown)" position="bottom" flip />
      </div>
    </section>
  );
}
