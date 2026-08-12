import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Check, Gamepad2, X as XIcon, ArrowUpRight } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";
import { ReviewDetailDataSkeleton } from "../components/ui/skeleton";

const ratingToTier = (rating, recommended, cons, isFeatured) => {
  if (isFeatured) return "★";
  const n = parseFloat(rating);
  if (recommended === "no" || n <= 3) return "F";
  if (n <= 4) return "D";
  if (n <= 6) return "C";
  if (n === 8) return "B";
  if (n === 9) return "A";
  if (n === 10) { if (Array.isArray(cons) && cons.includes("Hard to point to any real flaws")) return "S+"; return "S"; }
  return "S";
};

const tierMeta = { "★": { label: "Favorite" }, "S+": { label: "Masterpiece" }, "S": { label: "Excellent" }, "A": { label: "Excellent" }, "B": { label: "Great" }, "C": { label: "Above Average" }, "D": { label: "Below Average" }, "F": { label: "Avoid" } };

export default function ReviewDetail() {
  const { slug } = useParams();
  const [review, setReview] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true); setNotFound(false);
    fetchReview(slug).then(async (r) => {
      setReview(r);
      const all = await fetchReviews();
      const genre = Array.isArray(r.genre) ? r.genre : r.genre ? [r.genre] : [];
      setRelated(all.filter((x) => { if (x.slug === r.slug) return false; const xGenres = Array.isArray(x.genre) ? x.genre : x.genre ? [x.genre] : []; return genre.some((g) => xGenres.includes(g)); }).sort(() => Math.random() - 0.5).slice(0, 3));
    }).catch((e) => { if (e?.response?.status === 404) setNotFound(true); }).finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/reviews" replace />;
  if (loading || !review) return <ReviewDetailDataSkeleton />;

  const tier = ratingToTier(review.rating, review.recommended, review.cons, review.isFeatured);
  const cover = review.cover_url?.startsWith("http") ? review.cover_url : `https://${review.cover_url}`;
  const genres = Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : [];

  return (
    <article className="bg-pixel-blush">
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pb-14">
          <Link to="/reviews" className="pill pill-outline h-9 px-4 text-sm mb-8"><ArrowLeft className="w-3.5 h-3.5" /> Back to reviews</Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {review.platform && (
                  <span className="pill h-8 px-4 text-[0.8rem] uppercase tracking-[0.06em] bg-pixel-forest text-pixel-black">
                    <Gamepad2 className="w-3 h-3 text-pixel-pink" /> {review.platform}
                  </span>
                )}
                {genres.map((g) => (
                  <span key={g} className="pill h-8 px-4 text-[0.8rem] uppercase tracking-[0.06em] bg-pixel-mint text-pixel-black">{g}</span>
                ))}
                {review.date && (
                  <span className="pill h-8 px-4 text-[0.8rem] uppercase tracking-[0.06em] border-pixel-teal text-pixel-black/60">{review.date}</span>
                )}
              </div>
              <h1 className="display-hero text-2xl sm:text-3xl lg:text-4xl text-pixel-black">{review.title}</h1>
              {review.summary && (
                <p className="mt-6 text-base lg:text-lg font-bold max-w-2xl leading-relaxed text-pixel-black/75">
                  &ldquo;{review.summary}&rdquo;
                </p>
              )}
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-xl border border-pixel-black/10 shadow-pixel">
                <img src={cover} alt={review.title} className="w-full aspect-video object-cover" />
                <div className="absolute bottom-3 left-3 grid place-items-center w-12 h-12 rounded-full bg-pixel-pink text-pixel-white font-display font-bold text-lg">
                  {review.rating}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {review.body && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10">
          <div className="panel-framed rounded-2xl p-6 sm:p-10 lg:p-14">
            <div className="relative prose prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-pixel-black
              prose-p:text-pixel-black/85 prose-p:leading-relaxed
              prose-a:text-pixel-black prose-a:decoration-pixel-pink
              prose-strong:text-pixel-black prose-strong:font-extrabold
              prose-blockquote:border-l-pixel-pink prose-blockquote:text-pixel-black prose-blockquote:not-italic
              prose-li:text-pixel-black/85 prose-hr:border-pixel-teal
              prose-pre:rounded-none prose-kbd:rounded-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid md:grid-cols-2 gap-6">
          {review.pros?.length > 0 && (
            <div className="rounded-2xl border border-pixel-black/10 bg-pixel-mint p-6">
              <p className="flex items-center gap-2 text-[0.8rem] font-extrabold uppercase tracking-[0.06em] mb-5 text-pixel-black"><Check className="w-4 h-4" /> Pros</p>
              <ul className="space-y-3">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-pixel-black/85">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-pixel-pink" />{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className="rounded-2xl border border-pixel-black/10 bg-pixel-blush p-6">
              <p className="flex items-center gap-2 text-[0.8rem] font-extrabold uppercase tracking-[0.06em] mb-5 text-pixel-black"><XIcon className="w-4 h-4" /> Cons</p>
              <ul className="space-y-3">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-pixel-black/85">
                    <XIcon className="w-4 h-4 shrink-0 mt-0.5 text-pixel-black" />{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pixel-mint to-transparent" />
          <div className="text-center">
            <div className="display-hero text-4xl leading-none text-pixel-black">{review.rating}</div>
            <div className="text-[0.8rem] font-extrabold uppercase tracking-[0.06em] mt-2 text-pixel-black">
              {tier === "★" ? "Favorite" : tierMeta[tier]?.label}
            </div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-pixel-mint to-transparent" />
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-8">
          <div className="pt-12 border-t border-pixel-teal">
            <div className="magazine-rule mb-8"><span>More in {genres.join(" & ")}</span></div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const relatedCover = r.cover_url?.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
                return (
                  <Link key={r.slug} to={`/reviews/${r.slug}`}
                    className="group rounded-2xl border border-pixel-black/10 bg-pixel-mint overflow-hidden hover:border-pixel-teal transition-colors">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={relatedCover} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="text-[0.75rem] font-extrabold uppercase tracking-[0.06em] mb-1 text-pixel-black">{r.platform}</div>
                      <div className="font-display font-bold text-base leading-normal text-pixel-black">{r.title}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-pixel-pink text-pixel-white font-display font-bold text-sm">{r.rating}</span>
                        <ArrowUpRight className="w-4 h-4 text-pixel-black group-hover:text-pixel-pink transition-colors" />
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
