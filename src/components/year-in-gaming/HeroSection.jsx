import { Trophy, Star, Target, Gamepad2, BookOpen } from "lucide-react";

export function HeroSection({ data }) {
  return (
    <section className="relative overflow-hidden bg-pixel-forest">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pixel-mint/20 border border-pixel-teal/30 text-sm tracking-[0.06em] uppercase text-pixel-white mb-8">
            <Trophy className="w-3.5 h-3.5" /> 2026 Year in Review
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl tracking-tighter text-pixel-blush leading-[1.15]">
            Year in Gaming
            <em className="text-pixel-mint not-italic font-display block mt-2">
              2026
            </em>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-pixel-blush/70 max-w-xl leading-relaxed">
            A look back at every game I played, finished, and reviewed during a
            year of discovery, challenge, and unforgettable stories.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          <HeroStatCard
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Total Games"
            value={data.totalReviews}
          />
          <HeroStatCard
            icon={<Star className="w-4 h-4" />}
            label="Average Score"
            value={`${data.averageScore}/10`}
          />
          <HeroStatCard
            icon={<Target className="w-4 h-4" />}
            label="Top Platform"
            value={data.favoritePlatform || "—"}
          />
          <HeroStatCard
            icon={<BookOpen className="w-4 h-4" />}
            label="Top Genre"
            value={data.mostPlayedGenre || "—"}
          />
          <HeroStatCard
            icon={<Trophy className="w-4 h-4" />}
            label="GOTY Score"
            value={`${data.gameOfTheYear?.rating || "—"}/10`}
            subtitle={data.gameOfTheYear?.title?.split(":")[0] || ""}
          />
        </div>
      </div>
    </section>
  );
}

function HeroStatCard({ icon, label, value, subtitle, className = "" }) {
  return (
    <div
      className={`bg-pixel-white/10 border border-pixel-white/15 rounded-lg p-4 hover:bg-pixel-white/15 transition-colors duration-200 group ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[0.75rem] leading-snug tracking-[0.06em] uppercase text-pixel-blush/60 whitespace-nowrap">
          {label}
        </span>
        <span className="shrink-0 text-pixel-blush/60 group-hover:text-pixel-mint transition-colors">
          {icon}
        </span>
      </div>
      <div className="font-display text-lg lg:text-xl text-pixel-blush tracking-tight leading-snug break-words">
        {value}
      </div>
      {subtitle && (
        <div className="text-[0.75rem] text-pixel-blush/50 mt-1 leading-snug break-words">
          {subtitle}
        </div>
      )}
    </div>
  );
}