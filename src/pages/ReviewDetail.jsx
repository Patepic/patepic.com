import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Check, Gamepad2, X as XIcon } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";

const ratingToTier = (rating) => {
  const n = parseFloat(rating);
  if (isNaN(n)) return "C";
  if (n >= 9) return "S";
  if (n >= 8) return "A";
  if (n >= 7) return "B";
  if (n >= 5) return "C";
  if (n >= 3) return "D";
  return "F";
};

const tierGradients = {
  S: "from-sky-500 to-blue-600 text-white",
  A: "from-blue-400 to-indigo-500 text-white",
  B: "from-emerald-400 to-emerald-600 text-white",
  C: "from-amber-300 to-amber-500 text-slate-900",
  D: "from-orange-400 to-orange-600 text-white",
  F: "from-rose-500 to-rose-700 text-white",
};

export default function ReviewDetail() {
  const { slug } = useParams();
  const [review, setReview] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchReview(slug)
      .then(async (r) => {
        setReview(r);
        try {
          const all = await fetchReviews();
          const genre = Array.isArray(r.genre) ? r.genre[0] : r.genre;
          setRelated(
            all.filter((x) => {
              const xGenre = Array.isArray(x.genre) ? x.genre[0] : x.genre;
              return x.slug !== r.slug && xGenre === genre;
            }).slice(0, 3)
          );
        } catch (e) { /* ignore */ }
      })
      .catch((e) => {
        if (e?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/reviews" replace />;
  if (loading || !review) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
          Loading review…
        </div>
      </div>
    );
  }

  const tier = ratingToTier(review.rating);
  const genre = Array.isArray(review.genre) ? review.genre.join(", ") : review.genre;
  const cover = review.cover_url
    ? review.cover_url.startsWith("http") ? review.cover_url : `https://${review.cover_url}`
    : "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";

  return (
    <article data-testid={`review-detail-${review.slug}`}>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={cover} alt={review.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link to="/reviews" data-testid="back-to-reviews" className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-sky-700 mb-6 w-fit bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to reviews
          </Link>

          <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
            {review.platform && (
              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 inline-flex items-center gap-1.5">
                <Gamepad2 className="w-3 h-3 text-sky-600" /> {review.platform}
              </span>
            )}
            {genre && (
              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-sky-700 tracking-[0.15em] uppercase">{genre}</span>
            )}
            {(review.releaseDate || review.date) && (
              <span className="text-slate-600 bg-white/70 px-2.5 py-1 rounded-full">
                {review.releaseDate || review.date}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tighter text-slate-900 leading-[0.95] max-w-4xl">
            {review.title}
          </h1>
          {review.summary && (
            <p className="mt-5 text-lg lg:text-xl text-slate-700 max-w-2xl font-display italic">
              "{review.summary}"
            </p>
          )}
        </div>

        <div className="absolute top-1/2 right-4 sm:right-8 lg:right-16 -translate-y-1/2 hidden md:block">
          <div data-testid="review-score-badge" className={`score-glow w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br ${tierGradients[tier]} grid place-items-center`}>
            <div className="text-center leading-none">
              <div className="font-display text-5xl lg:text-6xl font-bold">{review.rating}</div>
              <div className="text-[0.6rem] tracking-[0.3em] uppercase font-medium mt-2">Tier {tier}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className={`score-glow inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-br ${tierGradients[tier]}`}>
          <span className="font-display text-2xl font-bold">{review.rating}</span>
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Tier {tier}</span>
        </div>
      </div>

      {(review.pros?.length || review.cons?.length) ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {review.pros?.length ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
              <p className="text-xs tracking-[0.25em] uppercase text-emerald-700 mb-4">Pros</p>
              <ul className="space-y-3">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {review.cons?.length ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6">
              <p className="text-xs tracking-[0.25em] uppercase text-rose-700 mb-4">Cons</p>
              <ul className="space-y-3">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <XIcon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {review.body ? (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose-frost">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
        </section>
      ) : null}

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">More in {genre}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => {
              const relatedCover = r.cover_url
                ? r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`
                : cover;
              return (
                <Link to={`/reviews/${r.slug}`} key={r.slug} className="group rounded-2xl bg-white border border-slate-200 hover:border-sky-300 overflow-hidden transition hover:shadow-lg">
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img src={relatedCover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-1">{r.platform}</div>
                    <div className="font-display text-lg text-slate-900 group-hover:text-sky-800">{r.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}