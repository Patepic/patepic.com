import React from "react";
import { Link } from "react-router-dom";
import { reviews } from "../data/reviews";
import { creator } from "../data/creator";
import { ReviewCard } from "../components/ReviewCard";
import { ArrowUpRight, Snowflake, Star, Trophy, Twitch } from "lucide-react";

const heroBg =
  "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/57bbd4568ba5fe66ce9f60834b97aab84841af000b9b8e142606bd422c8f5a3f.png";

export default function Home() {
  const totalReviews = reviews.length;
  const averageScore = (
    reviews.reduce((s, r) => s + r.score, 0) / totalReviews
  ).toFixed(1);
  const platformCounts = reviews.reduce((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + 1;
    return acc;
  }, {});
  const topPlatform = Object.entries(platformCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  const highestScore = Math.max(...reviews.map((r) => r.score));
  const goldStandard = reviews.find((r) => r.score === highestScore);

  const recent = [...reviews].sort((a, b) => b.year - a.year).slice(0, 5);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs tracking-[0.25em] uppercase text-cyan-300 mb-8">
              <Snowflake className="w-3 h-3" /> Vol. 03 · Winter Issue
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-slate-50 leading-[1.05]">
              Cold takes on <em className="text-cyan-300 not-italic font-display">hot games</em>.
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">
              Long-form reviews, honest scores, and a tier list that doesn't pretend everything is a masterpiece. Played fully. Written carefully.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/reviews"
                data-testid="hero-cta-browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-slate-950 font-medium hover:bg-cyan-300 transition shadow-[0_0_30px_rgba(34,211,238,0.25)]"
              >
                Browse the catalogue <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/guidelines"
                data-testid="hero-cta-guidelines"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-slate-100 hover:bg-white/5 transition"
              >
                How I score
              </Link>
              {creator.isLive && (
                <a
                  href={creator.twitch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-live-cta"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-200 hover:bg-rose-500/25 transition"
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
        </div>
      </section>

      {/* STATS BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          <StatCard
            className="md:col-span-4"
            label="Reviews shipped"
            value={totalReviews.toString().padStart(2, "0")}
            icon={<Snowflake className="w-4 h-4" />}
            testId="stat-total-reviews"
          />
          <StatCard
            className="md:col-span-3"
            label="Average score"
            value={averageScore}
            icon={<Star className="w-4 h-4" />}
            testId="stat-average-score"
          />
          <StatCard
            className="md:col-span-2"
            label="Top platform"
            value={topPlatform}
            testId="stat-top-platform"
          />
          <Link
            to={`/reviews/${goldStandard.slug}`}
            data-testid="stat-gold-standard"
            className="md:col-span-3 relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-6 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-[0.2em] uppercase text-cyan-500">
                Gold standard
              </span>
              <Trophy className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-display text-xl text-slate-50 group-hover:text-cyan-200 transition leading-tight">
              {goldStandard.title}
            </div>
            <div className="text-sm text-slate-400 mt-1">Scored {goldStandard.score.toFixed(1)} / 10</div>
          </Link>
        </div>
      </section>

      {/* RECENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" data-testid="recent-reviews">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-3">
              Latest verdicts
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-50 tracking-tight">
              Fresh off the ice.
            </h2>
          </div>
          <Link
            to="/reviews"
            data-testid="view-all-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 group"
          >
            View all <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <ReviewCard review={recent[0]} featured />
          </div>
          {recent.slice(1, 5).map((r) => (
            <ReviewCard key={r.slug} review={r} />
          ))}
        </div>
      </section>

      {/* CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border border-cyan-500/10 p-10 lg:p-16">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">
              The Frostbyte method
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-slate-50 tracking-tight leading-tight">
              No score until I roll the credits. No exceptions.
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed">
              Every review on this site is based on a finished playthrough — sometimes two. Read the methodology, see how the tiers map, and pitch your favourite obscure indie.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                to="/guidelines"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
              >
                Read the scoring guide
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-sm"
              >
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
  <div
    data-testid={testId}
    className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 ${className}`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs tracking-[0.2em] uppercase text-cyan-500">{label}</span>
      {icon && <span className="text-cyan-400">{icon}</span>}
    </div>
    <div className="font-display text-3xl lg:text-4xl text-slate-50 tracking-tight">
      {value}
    </div>
  </div>
);
