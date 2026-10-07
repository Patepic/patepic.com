import { Link } from "react-router-dom";
import { Zap, Frown, Sparkles, Monitor, Layers, Trophy } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function ByTheNumbers({ data, loading }) {
  const headline = [
    { label: "Games finished", value: data.gamesFinished },
    { label: "Average score", value: loading ? "" : `${data.averageScore}` },
    { label: "Top genre", value: data.mostPlayedGenre || "N/A" },
  ];

  const secondary = [
    { icon: Monitor, label: "Top platform", value: data.favoritePlatform || "N/A" },
    { icon: Zap, label: "Highest rated", value: data.highestRated?.title, subtitle: data.highestRated ? `${data.highestRated.rating}/10` : null, slug: data.highestRated?.slug },
    { icon: Frown, label: "Lowest rated", value: data.lowestRated?.title, subtitle: data.lowestRated ? `${data.lowestRated.rating}/10` : null, slug: data.lowestRated?.slug },
    { icon: Sparkles, label: "Biggest surprise", value: data.biggestSurprise?.title, subtitle: data.biggestSurprise ? `${data.biggestSurprise.rating}/10` : null, slug: data.biggestSurprise?.slug },
    { icon: Trophy, label: "Most reviewed franchise", value: data.mostReviewedFranchise || "N/A" },
    { icon: Layers, label: "Genres played", value: data.totalGenresPlayed },
  ].filter((s) => s.value);

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">By the numbers</h2>
          <p className="mt-3 text-sm text-charcoal-brown/80">My year, tallied up.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {headline.map((stat) => (
            <div key={stat.label} className="dex-panel text-center">
              {loading ? (
                <Skeleton className="mx-auto h-16 w-24" />
              ) : (
                <div className="dex-stat">{stat.value}</div>
              )}
              <div className="dex-label mt-3">{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dex-panel"><Skeleton className="h-12" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {secondary.map(({ icon: Icon, label, value, subtitle, slug }) => {
              const content = (
                <div className={`dex-panel h-full ${slug ? "watch-tile !block" : ""}`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="dex-label !pt-0">{label}</span>
                    <Icon className="w-4 h-4 text-charcoal-brown shrink-0" />
                  </div>
                  <div className="font-sans font-bold text-charcoal-brown leading-snug">{value}</div>
                  {subtitle && <div className="text-sm text-charcoal-brown/80 mt-0.5">{subtitle}</div>}
                </div>
              );
              return slug ? (
                <Link key={label} to={`/reviews/${slug}`}>{content}</Link>
              ) : (
                <div key={label}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
