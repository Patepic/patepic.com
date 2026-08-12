import { Link } from "react-router-dom";
import {
  Trophy,
  Star,
  Gamepad2,
  Swords,
  Monitor,
  Layers,
  Heart,
  Sparkles,
  Frown,
  Zap,
} from "lucide-react";

export function StatisticsSection({ data }) {
  const stats = [
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Game of the Year",
      value: data.gameOfTheYear?.title || "—",
      subtitle: `Scored ${data.gameOfTheYear?.rating}/10`,
      slug: data.gameOfTheYear?.slug,
      accent: "amber",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Highest Rated",
      value: data.highestRated?.title || "—",
      subtitle: `${data.highestRated?.rating}/10`,
      slug: data.highestRated?.slug,
      accent: "emerald",
    },
    {
      icon: <Frown className="w-5 h-5" />,
      label: "Lowest Rated",
      value: data.lowestRated?.title || "—",
      subtitle: `${data.lowestRated?.rating}/10`,
      slug: data.lowestRated?.slug,
      accent: "rose",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "Biggest Surprise",
      value: data.biggestSurprise?.title || "—",
      subtitle: data.biggestSurprise
        ? `Scored ${data.biggestSurprise.rating}/10`
        : null,
      slug: data.biggestSurprise?.slug,
      accent: "blue",
    },
    {
      icon: <Frown className="w-5 h-5" />,
      label: "Biggest Disappointment",
      value: data.biggestDisappointment?.title || "—",
      subtitle: data.biggestDisappointment
        ? `Scored ${data.biggestDisappointment.rating}/10`
        : null,
      slug: data.biggestDisappointment?.slug,
      accent: "rose",
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Average Score",
      value: `${data.averageScore}/10`,
      accent: "amber",
    },
    {
      icon: <Swords className="w-5 h-5" />,
      label: "Most Played Genre",
      value: data.mostPlayedGenre || "—",
      accent: "blue",
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      label: "Most Played Platform",
      value: data.favoritePlatform || "—",
      accent: "purple",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Most Reviewed Franchise",
      value: data.mostReviewedFranchise || "—",
      accent: "emerald",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Games Finished",
      value: data.gamesFinished,
      accent: "rose",
    },
    {
      icon: <Gamepad2 className="w-5 h-5" />,
      label: "Oldest Game Played",
      value: data.oldestGame?.title || "—",
      subtitle: data.oldestGame?.date,
      slug: data.oldestGame?.slug,
      accent: "stone",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Divider */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex-1 h-px bg-crimson" />
        <Trophy className="w-5 h-5 text-off-white" />
        <div className="flex-1 h-px bg-crimson" />
      </div>

      <div className="mb-12">
        <p className="text-sm tracking-[0.06em] uppercase text-off-white mb-3">
          By the numbers
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-off-white tracking-tight">
          Gaming Statistics
        </h2>
        <p className="mt-4 text-off-white max-w-2xl">
          Every stat, carefully calculated from my 2026 reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, subtitle, slug, accent = "amber" }) {
  const accentMap = {
    // Accent keys are kept for call-site compatibility; every value is warm.
    amber: { border: "border-off-white/10 hover:border-off-white/20", bg: "bg-crimson", text: "text-off-white", icon: "text-off-white" },
    emerald: { border: "border-off-white/10 hover:border-off-white/20", bg: "bg-crimson", text: "text-off-white", icon: "text-off-white" },
    rose: { border: "border-gold ", bg: "bg-gold", text: "text-off-white", icon: "text-off-white" },
    blue: { border: "border-off-white/10 hover:border-off-white/20", bg: "bg-crimson", text: "text-off-white", icon: "text-off-white" },
    purple: { border: "border-gold ", bg: "bg-gold/40", text: "text-off-white", icon: "text-off-white" },
    stone: { border: "border-off-white ", bg: "bg-surface", text: "text-off-white", icon: "text-off-white" },
  };

  const colors = accentMap[accent] || accentMap.amber;

  const content = (
    <div
      className={`bg-surface border ${colors.border} rounded-2xl p-5 transition-all duration-300 hover:shadow-md group h-full`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[0.75rem] leading-snug tracking-[0.06em] uppercase text-off-white">
          {label}
        </span>
        <span className={`shrink-0 ${colors.icon} group-hover:scale-110 transition-transform`}>
          {icon}
        </span>
      </div>
      <div className="font-display text-base text-off-white tracking-tight leading-snug break-words">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-off-white mt-1.5 leading-tight break-words">
          {subtitle}
        </div>
      )}
    </div>
  );

  if (slug) {
    return (
      <Link to={`/reviews/${slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}