import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { creator } from "../data/creator";
import { ReviewCard } from "../components/ReviewCard";
import { ArrowUpRight, Snowflake, Star, Trophy, Twitch } from "lucide-react";

const heroBg =
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  const { reviews, loading } = useReviews();

  if (loading) return <PageLoader />;

  const totalReviews = reviews.length;
  const averageScore = totalReviews
    ? (reviews.reduce((s, r) => s + r.score, 0) / totalReviews).toFixed(1)
    : "—";
  const platformCounts = reviews.reduce((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + 1;
    return acc;
  }, {});
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const highestScore = reviews.length ? Math.max(...reviews.map((r) => r.score)) : 0;
  const goldStandard = reviews.find((r) => r.score === highestScore);
  const recent = [...reviews].sort((a, b) => b.year - a.year).slice(0, 5);

  return (
    <div data-testid="home-page">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-xs tracking-[0.25em] uppercase text-sky-700 mb-8 shadow-sm">
                <Snowflake className="w-3 h-3" /> Vol. 03 · Winter Issue
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-slate-900 leading-[1.02]">
                Cold takes on <em className="text-sky-700 not-italic font-display">hot games</em>.
              </h1>
              <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
                Long-form reviews, honest scores, and a tier list that doesn't pretend everything is a masterpiece. Played fully. Written carefully.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/reviews"
                  data-testid="hero-cta-browse"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-700 transition shadow-[0_10px_30px_-10px_rgba(15,23,42,0.45)]"
                >
                  Browse the catalogue <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/guidelines"
                  data-testid="hero-cta-guidelines"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-800 transition"
                >
                  How I score
                </Link>
                {creator.isLive && (
                  <a
                    href={creator.twitch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="hero-live-cta"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 transition"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                    </span>
                    <Twitch className="w-4 h-4" />
                    <span className="text-sm">Live now · {creator.liveGame}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-sky-200/60 via-blue-100/40 to-white blur-xl" />
                <div className="relative rounded-3xl overflow-hidden border border-white shadow-[0_20px_60px_-20px_rgba(2,132,199,0.35)] aspect-[4/5]">
                  <img src={heroBg} alt="Winter mountains" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-200">This winter</p>
                    <p className="font-display text-2xl leading-tight mt-1">{recent[0]?.title || "New reviews loading…"}</p>
                  </div>
                  <Snowflake className="absolute top-4 right-4 w-5 h-5 text-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          <StatCard className="md:col-span-4" label="Reviews shipped" value={String(totalReviews).padStart(2, "0")} icon={<Snowflake className="w-4 h-4" />} testId="stat-total-reviews" />
          <StatCard className="md:col-span-3" label="Average score" value={averageScore} icon={<Star className="w-4 h-4" />} testId="stat-average-score" />
          <StatCard className="md:col-span-2" label="Top platform" value={topPlatform} testId="stat-top-platform" />
          {goldStandard && (
            <Link
              to={`/reviews/${goldStandard.slug}`}
              data-testid="stat-gold-standard"
              className="md:col-span-3 relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg p-6 group transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-[0.2em] uppercase text-sky-700">Gold standard</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-display text-xl text-slate-900 group-hover:text-sky-800 transition leading-tight">
                {goldStandard.title}
              </div>
              <div className="text-sm text-slate-500 mt-1">Scored {goldStandard.score.toFixed(1)} / 10</div>
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" data-testid="recent-reviews">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-3">Latest verdicts</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
              Fresh off the ice.
            </h2>
          </div>
          <Link
            to="/reviews"
            data-testid="view-all-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-sky-700 hover:text-sky-900 group"
          >
            View all <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>

        {recent[0] && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
              <ReviewCard review={recent[0]} featured />
            </div>
            {recent.slice(1, 5).map((r) => (
              <ReviewCard key={r.slug} review={r} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/60 to-white border border-sky-100 p-10 lg:p-16 shadow-[0_30px_80px_-30px_rgba(2,132,199,0.25)]">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">The Patepic method</p>
            <h2 className="font-display text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              No score until I roll the credits. No exceptions.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Every review is based on a finished playthrough — sometimes two. Read the methodology, see how the tiers map, and pitch your favourite obscure indie.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/guidelines" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-sky-300 text-slate-700 text-sm">
                Read the scoring guide
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-700 text-sm">
                Pitch a game
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ label, value, icon, className = "", testId }) => (
  <div data-testid={testId} className={`bg-white border border-slate-200 rounded-2xl p-6 hover:border-sky-200 transition ${className}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs tracking-[0.2em] uppercase text-sky-700">{label}</span>
      {icon && <span className="text-sky-600">{icon}</span>}
    </div>
    <div className="font-display text-3xl lg:text-4xl text-slate-900 tracking-tight">{value}</div>
  </div>
);

const PageLoader = () => (
  <div className="min-h-[60vh] grid place-items-center text-slate-400 text-sm">
    <div className="flex items-center gap-3">
      <span className="w-4 h-4 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
      Loading reviews…
    </div>
  </div>
);
