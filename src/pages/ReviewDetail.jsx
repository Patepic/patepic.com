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
  "★":  { label: "Favorite" },
  "S+": { label: "Masterpiece" },
  "S":  { label: "Excellent" },
  "A":  { label: "Excellent" },
  "B":  { label: "Great" },
  "C":  { label: "Above Average" },
  "D":  { label: "Below Average" },
  "F":  { label: "Avoid" },
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
        const genre = Array.isArray(r.genre) ? r.genre : r.genre ? [r.genre] : [];
        setRelated(
          all
            .filter((x) => {
              if (x.slug === r.slug) return false;
              const xGenres = Array.isArray(x.genre) ? x.genre : x.genre ? [x.genre] : [];
              return genre.some((g) => xGenres.includes(g));
            })
            .sort(() => Math.random() - 0.5)
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

          <div className="md:hidden w-full">
            <div className="relative aspect-video rounded-md overflow-hidden shadow-[5px_5px_rgba(15,23,42,0.35)]">
              <img src={cover} alt={review.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start">
            <Link to="/reviews" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-4 w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to reviews
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {review.platform && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs uppercase tracking-widest">
                  <Gamepad2 className="w-3 h-3 text-sky-500" /> {review.platform}
                </span>
              )}
              {genres.map((g) => (
                <span key={g} className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs uppercase tracking-widest whitespace-nowrap">
                  {g}
                </span>
              ))}
              {review.date && (
                <span className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 text-xs tracking-widest">
                  {review.date}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl tracking-tight text-slate-900 leading-tight uppercase">
              {review.title}
            </h1>

            {review.summary && (
              <p className="mt-5 text-slate-600 text-base md:text-lg max-w-2xl italic">
                "{review.summary}"
              </p>
            )}
          </div>

          <div className="hidden md:block w-1/2">
            <div className="relative aspect-video rounded-md overflow-hidden shadow-[5px_5px_rgba(15,23,42,0.35)]">
              <img src={cover} alt={review.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {review.body && (
        <section className="max-w-5xl mx-auto px-6 mt-14">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-sky-700 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base prose-h1:mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
          </div>
        </section>
      )}

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
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" /> {p}
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
                    <XIcon className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="max-w-5xl mx-auto px-6 mt-14 flex items-center gap-6">
        <div className="flex-1 h-px bg-slate-200" />
        <div className="text-center">
          <div className="font-display text-6xl font-bold text-slate-900 leading-none">{review.rating}</div>
          <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mt-2">
            {tier === "★" ? "Favorite" : tierMeta[tier]?.label}
          </div>
        </div>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {related.length > 0 && (
        <section className="border-t border-slate-100 mt-14">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-700 font-semibold mb-8">
              More in {genres.join(" & ")}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const relatedCover = r.cover_url?.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
                return (
                  <Link
                    key={r.slug}
                    to={`/reviews/${r.slug}`}
                    className="group rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img src={relatedCover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="text-[0.65rem] uppercase tracking-widest text-slate-400 mb-1">{r.platform}</div>
                      <div className="font-display text-base text-slate-900 group-hover:text-sky-700 transition leading-snug font-bold uppercase">
                        {r.title}
                      </div>
                      <div className="inline-flex items-center px-2.5 py-0.5 bg-slate-900 rounded-full text-xs text-white mt-1">{r.rating}</div>
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