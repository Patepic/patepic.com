import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getReviewBySlug, scoreToTier, reviews } from "../data/reviews";
import { ArrowLeft, Check, Gamepad2, X as XIcon } from "lucide-react";

const tierGradients = {
  S: "from-cyan-400 to-cyan-600",
  A: "from-blue-400 to-blue-600",
  B: "from-emerald-400 to-emerald-600",
  C: "from-amber-400 to-amber-600",
  D: "from-orange-400 to-orange-600",
  F: "from-red-500 to-red-700",
};

export default function ReviewDetail() {
  const { slug } = useParams();
  const review = getReviewBySlug(slug);

  if (!review) return <Navigate to="/reviews" replace />;

  const tier = scoreToTier(review.score);
  const related = reviews.filter((r) => r.slug !== slug && r.genre === review.genre).slice(0, 3);

  return (
    <article data-testid={`review-detail-${review.slug}`}>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={review.cover}
          alt={review.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link
            to="/reviews"
            data-testid="back-to-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-cyan-300 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to reviews
          </Link>

          <div className="flex items-center gap-2 text-xs mb-4">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-slate-200 inline-flex items-center gap-1.5">
              <Gamepad2 className="w-3 h-3 text-cyan-400" /> {review.platform}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-cyan-300 tracking-[0.15em] uppercase">
              {review.genre}
            </span>
            <span className="text-slate-500">{review.year} · {review.studio}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tighter text-slate-50 leading-[0.95] max-w-4xl">
            {review.title}
          </h1>
          <p className="mt-5 text-lg lg:text-xl text-slate-300 max-w-2xl font-display italic">
            "{review.verdict}"
          </p>
        </div>

        {/* Floating score badge */}
        <div className="absolute top-1/2 right-4 sm:right-8 lg:right-16 -translate-y-1/2 hidden md:block">
          <div
            data-testid="review-score-badge"
            className={`score-glow w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br ${tierGradients[tier]} grid place-items-center text-slate-950 shadow-2xl`}
          >
            <div className="text-center leading-none">
              <div className="font-display text-5xl lg:text-6xl font-bold">{review.score.toFixed(1)}</div>
              <div className="text-[0.6rem] tracking-[0.3em] uppercase font-medium mt-2">Tier {tier}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile score */}
      <div className="md:hidden max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div
          className={`score-glow inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-br ${tierGradients[tier]} text-slate-950`}
        >
          <span className="font-display text-2xl font-bold">{review.score.toFixed(1)}</span>
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Tier {tier}</span>
        </div>
      </div>

      {/* Pros / cons */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <p className="text-xs tracking-[0.25em] uppercase text-emerald-300 mb-4">Pros</p>
          <ul className="space-y-3">
            {review.pros.map((p, i) => (
              <li key={i} className="flex gap-3 text-slate-200">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
          <p className="text-xs tracking-[0.25em] uppercase text-rose-300 mb-4">Cons</p>
          <ul className="space-y-3">
            {review.cons.map((c, i) => (
              <li key={i} className="flex gap-3 text-slate-200">
                <XIcon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose-frost">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">More in {review.genre}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                to={`/reviews/${r.slug}`}
                key={r.slug}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 overflow-hidden transition"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-5">
                  <div className="text-xs tracking-[0.2em] uppercase text-cyan-500 mb-1">{r.platform}</div>
                  <div className="font-display text-lg text-slate-50 group-hover:text-cyan-200">{r.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
