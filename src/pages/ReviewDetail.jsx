import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Check, Gamepad2, X as XIcon } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";

const ratingToTier = (rating, recommended) => {
  const n = parseFloat(rating);
  if (n <= 3 || recommended === "no") return "F";
  if (n <= 5) return "D";
  if (n <= 7) return "C";
  if (n === 8) return "B";
  if (n === 9) return "A";
  return "S";
};

const tierGradients = {
  S: "from-sky-500 to-blue-600 text-white",
  A: "from-blue-400 to-indigo-500 text-white",
  B: "from-emerald-400 to-emerald-600 text-white",
  C: "from-amber-400 to-amber-600 text-white",
  D: "from-orange-400 to-orange-600 text-white",
  F: "from-rose-500 to-rose-700 text-white",
};

const gradientStops = {
  S: <><stop offset="0%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#2563eb"/></>,
  A: <><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#6366f1"/></>,
  B: <><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#059669"/></>,
  C: <><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706"/></>,
  D: <><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#ea580c"/></>,
  F: <><stop offset="0%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#be123c"/></>,
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
            all
              .filter((x) => {
                const xGenre = Array.isArray(x.genre) ? x.genre[0] : x.genre;
                return x.slug !== r.slug && xGenre === genre;
              })
              .slice(0, 3),
          );
        } catch (e) {
          /* ignore */
        }
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
  const genre = Array.isArray(review.genre)
    ? review.genre.join(", ")
    : review.genre;
  const cover = review.cover_url
    ? review.cover_url.startsWith("http")
      ? review.cover_url
      : `https://${review.cover_url}`
    : "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";

  return (
    <article data-testid={`review-detail-${review.slug}`}>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={cover}
          alt={review.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link
            to="/reviews"
            data-testid="back-to-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-6 w-fit bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Back to reviews
          </Link>

          <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
            {review.platform && (
            <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white inline-flex items-center gap-1.5">
              <Gamepad2 className="w-3 h-3 text-sky-300" /> {review.platform}
            </span>
            )}
            {(Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : []).map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white tracking-[0.15em] uppercase whitespace-nowrap">
                  {g}
                </span>
              ))}
            {review.date && (
              <span className="text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30">
                {review.date}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tighter text-white leading-[0.95] max-w-4xl">
            {review.title}
          </h1>
          {review.summary && (
            <p className="mt-5 text-lg lg:text-xl text-white/75 max-w-2xl font-display italic">
              "{review.summary}"
            </p>
          )}
        </div>

        <div className="absolute top-1/2 right-4 sm:right-8 lg:right-16 -translate-y-1/2 hidden md:block">
          <div data-testid="review-score-badge" className="relative w-32 h-32 lg:w-40 lg:h-40">
            <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-xl">
              <defs>
                <linearGradient id="hex-grad-detail" x1="0%" y1="0%" x2="100%" y2="100%">
                  {gradientStops[tier]}
                </linearGradient>
              </defs>
              <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill="url(#hex-grad-detail)" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center leading-none">
                <div className="font-display text-5xl lg:text-6xl font-bold text-white">
                  {review.rating}
                </div>
                <div className="text-[0.6rem] tracking-[0.3em] uppercase font-medium mt-2 text-white">
                  Tier {tier}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="relative inline-block w-16 h-16">
          <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="hex-grad-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                {gradientStops[tier]}
              </linearGradient>
            </defs>
            <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill="url(#hex-grad-mobile)" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center leading-none">
              <div className="font-display text-2xl font-bold text-white">{review.rating}</div>
              <div className="text-[0.5rem] tracking-[0.2em] uppercase text-white mt-1">Tier {tier}</div>
            </div>
          </div>
        </div>
      </div>

      {review.pros?.length || review.cons?.length ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {review.pros?.length ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
              <p className="text-xs tracking-[0.25em] uppercase text-emerald-700 mb-4">
                Pros
              </p>
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
              <p className="text-xs tracking-[0.25em] uppercase text-rose-700 mb-4">
                Cons
              </p>
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
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-sky-700 [&>p]:mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {review.body}
            </ReactMarkdown>
          </div>
        </section>
      ) : null}

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">
            More in {genre}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => {
              const relatedCover = r.cover_url
                ? r.cover_url.startsWith("http")
                  ? r.cover_url
                  : `https://${r.cover_url}`
                : cover;
              return (
                <Link
                  to={`/reviews/${r.slug}`}
                  key={r.slug}
                  className="group rounded-2xl bg-white border border-slate-200 hover:border-sky-300 overflow-hidden transition hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={relatedCover}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-1">
                      {r.platform}
                    </div>
                    <div className="font-display text-lg text-slate-900 group-hover:text-sky-800">
                      {r.title}
                    </div>
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