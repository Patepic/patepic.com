import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Check, Gamepad2, X as XIcon } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";

const ratingToTier = (rating, recommended, cons, isFeatured) => {
  if (isFeatured) return "★";
  const n = parseFloat(rating);
  if (recommended === "no" || n <= 3) return "F";
  if (n <= 4) return "D";
  if (n <= 6) return "C";
  if (n === 8) return "B";
  if (n === 9) return "A";
  if (n === 10) {
    if (Array.isArray(cons) && cons.includes("Hard to point to any real flaws")) return "S+";
    return "S";
  }
  return "S";
};

const tierMeta = {
  "★":  { label: "Favorite",      stops: ["#f472b6", "#f43f5e"] },
  "S+": { label: "Masterpiece",   stops: ["#a78bfa", "#7c3aed"] },
  "S":  { label: "Elite",         stops: ["#38bdf8", "#3b82f6"] },
  "A":  { label: "Excellent",     stops: ["#60a5fa", "#4338ca"] },
  "B":  { label: "Great",         stops: ["#34d399", "#0d9488"] },
  "C":  { label: "Above Average", stops: ["#facc15", "#d97706"] },
  "D":  { label: "Below Average", stops: ["#fdba74", "#f97316"] },
  "F":  { label: "Avoid",         stops: ["#ef4444", "#f43f5e"] },
};

const HexScore = ({ rating, tier, size = 80 }) => {
  const meta = tierMeta[tier] ?? tierMeta["F"];
  const safeId = `hex-grad-${tier.replace("+", "plus")}-${size}`;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={safeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={meta.stops[0]} />
            <stop offset="100%" stopColor={meta.stops[1]} />
          </linearGradient>
        </defs>
        <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill={`url(#${safeId})`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className="font-display font-bold text-white" style={{ fontSize: size * 0.32 }}>
            {rating}
          </div>
          {size >= 120 && (
            <div className="text-white/80 uppercase tracking-widest font-semibold mt-1" style={{ fontSize: size * 0.09 }}>
              {tier === "★" ? "Favorite" : meta.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
        const all = await fetchReviews();
        const genre = Array.isArray(r.genre) ? r.genre[0] : r.genre;
        setRelated(
          all
            .filter((x) => x.slug !== r.slug && (Array.isArray(x.genre) ? x.genre[0] : x.genre) === genre)
            .slice(0, 3)
        );
      })
      .catch((e) => { if (e?.response?.status === 404) setNotFound(true); })
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

  const tier = ratingToTier(review.rating, review.recommended, review.cons, review.isFeatured);
  const cover = review.cover_url?.startsWith("http")
    ? review.cover_url
    : `https://${review.cover_url}`;
  const genres = Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : [];

  return (
    <article>
      <section className="relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 py-6 md:py-16 flex flex-col md:flex-row gap-8">

          {/* MOBILE IMAGE FIRST */}
          <div className="md:hidden w-full">
            <div className="relative aspect-video rounded-md overflow-hidden shadow-[5px_5px_rgba(15,23,42,0.35)]">
              <img
                src={cover}
                alt={review.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">

            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-4 w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Back to reviews
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {review.platform && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs uppercase tracking-widest">
                  <Gamepad2 className="w-3 h-3 text-sky-500" /> {review.platform}
                </span>
              )}

              {genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs uppercase tracking-widest whitespace-nowrap"
                >
                  {g}
                </span>
              ))}

              {review.date && (
                <span className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 text-xs tracking-widest">
                  {review.date}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="flex-1 min-w-0 font-display text-2xl sm:text-3xl lg:text-5xl tracking-tight text-slate-900 leading-tight uppercase">
                {review.title}
              </h1>

              <div className="md:hidden shrink-0">
                <HexScore rating={review.rating} tier={tier} size={56} />
              </div>

              <div className="hidden md:block shrink-0">
                <HexScore rating={review.rating} tier={tier} size={120} />
              </div>
            </div>

            {review.summary && (
              <p className="mt-5 text-slate-600 text-base md:text-lg max-w-2xl italic">
                "{review.summary}"
              </p>
            )}
          </div>

          <div className="hidden md:block w-1/2">
            <div className="relative aspect-video rounded-md overflow-hidden shadow-[5px_5px_rgba(15,23,42,0.35)]">
              <img
                src={cover}
                alt={review.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <section className="max-w-5xl mx-auto px-6 mt-12 grid md:grid-cols-2 gap-6">
          {review.pros?.length > 0 && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-800 mb-5 font-semibold">
                <Check className="w-4 h-4" /> Pros
              </p>
              <ul className="space-y-3">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex gap-3 text-slate-800 text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rose-800 mb-5 font-semibold">
                <XIcon className="w-4 h-4" /> Cons
              </p>
              <ul className="space-y-3">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex gap-3 text-slate-800 text-sm leading-relaxed">
                    <XIcon className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {review.body && (
        <section className="max-w-5xl mx-auto px-6 mt-14 pb-20">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-sky-700 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-700 font-semibold mb-8">
              More in {genres[0]}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const relatedCover = r.cover_url?.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
                const relatedTier = ratingToTier(r.rating, r.recommended, r.cons, r.isFeatured);
                return (
                  <Link
                    key={r.slug}
                    to={`/reviews/${r.slug}`}
                    className="group rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={relatedCover}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute bottom-2 left-2">
                        <HexScore rating={r.rating} tier={relatedTier} size={52} />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[0.65rem] uppercase tracking-widest text-slate-400 mb-1">{r.platform}</div>
                      <div className="font-display text-base text-slate-900 group-hover:text-sky-700 transition leading-snug font-bold uppercase">
                        {r.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}