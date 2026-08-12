import { useReviews } from "../hooks/useReviews";
import { useYearInGamingData } from "../components/year-in-gaming/useYearInGamingData";
import { HeroSection } from "../components/year-in-gaming/HeroSection";
import { YearRecap } from "../components/year-in-gaming/YearRecap";
import { SeriesMarathon } from "../components/year-in-gaming/SeriesMarathon";
import { MonthlyTimeline } from "../components/year-in-gaming/MonthlyTimeline";
import { StatisticsSection } from "../components/year-in-gaming/StatisticsSection";
import { PersonalReflection } from "../components/year-in-gaming/PersonalReflection";
import { Skeleton } from "../components/ui/skeleton";
import { Gamepad2, Snowflake } from "lucide-react";

export default function YearInGaming2026() {
  const { reviews, loading, error } = useReviews();
  const data = useYearInGamingData(reviews);

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <p className="text-sm tracking-[0.06em] uppercase text-off-white">
            Data unavailable
          </p>
          <h1 className="font-display mt-3 text-3xl text-off-white">
            Could not load reviews
          </h1>
          <p className="mt-3 text-sm text-off-white">
            Check the API connection and database, then refresh.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <YearInGamingSkeleton />;
  }

  if (!data.hasData) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crimson border border-off-white/10 text-sm tracking-[0.06em] uppercase text-off-white mb-6">
            <Snowflake className="w-3 h-3" /> Year in Gaming
          </div>
          <h1 className="font-display mt-3 text-4xl text-off-white tracking-tight">
            No 2026 Reviews Yet
          </h1>
          <p className="mt-4 text-off-white leading-relaxed">
            The year is still unfolding. Reviews with a 2026 date will
            automatically appear here as they're published.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-off-white">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm">Check back soon for the story of 2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection data={data} />
      <YearRecap data={data} />
      <SeriesMarathon seriesMarathons={data.seriesMarathons} />
      <MonthlyTimeline monthlyGames={data.monthlyGames} />
      <StatisticsSection data={data} />
      <PersonalReflection />

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-crimson via-surface to-crimson border border-off-white p-10 lg:p-16 text-center shadow-soft">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl text-off-white tracking-tight">
              Thanks for reading
            </h2>
            <p className="mt-5 text-off-white leading-relaxed max-w-lg mx-auto">
              Every review on this page represents a completed journey. Here's
              to another year of great games.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-off-white">
              <Snowflake className="w-5 h-5" />
              <span className="font-display text-lg tracking-tight">
                Patepic<span className="text-off-white">.</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function YearInGamingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden bg-scarlet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-16 w-96 mb-4" />
          <Skeleton className="h-16 w-64 mb-6" />
          <Skeleton className="h-6 w-80 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-12 w-80 mb-4" />
        <Skeleton className="h-5 w-96 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-[16/9] rounded-3xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-28 flex-1 rounded-2xl" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-28 flex-1 rounded-2xl" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-28 flex-1 rounded-2xl" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}