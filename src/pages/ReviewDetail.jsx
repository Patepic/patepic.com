import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";
import { getTier, getTierColor, getTierLabel, getRarity } from "../lib/tier";
import { ReviewDetailDataSkeleton } from "../components/ui/skeleton";
import { ReviewCard, coverUrl } from "../components/ReviewCard";
import { usePageTitle } from "../hooks/usePageTitle";

export default function ReviewDetail() {
  const { slug } = useParams();
  const [review, setReview] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true); setNotFound(false);
    fetchReview(slug).then(async (fetched) => {
      setReview(fetched);
      const all = await fetchReviews();
      const genreList = Array.isArray(fetched.genre) ? fetched.genre : fetched.genre ? [fetched.genre] : [];
      setRelated(all.filter((other) => { if (other.slug === fetched.slug) return false; const otherGenres = Array.isArray(other.genre) ? other.genre : other.genre ? [other.genre] : []; return genreList.some((g) => otherGenres.includes(g)); }).sort(() => Math.random() - 0.5).slice(0, 3));
    }).catch((e) => { if (e?.response?.status === 404) setNotFound(true); }).finally(() => setLoading(false));
  }, [slug]);

  usePageTitle(review ? `${review.title} review${review.rating ? ` · ${review.rating}/10` : ""}` : "Review");

  if (notFound) return <Navigate to="/reviews" replace />;

  if (loading || !review) {
    return (
      <article className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link to="/reviews" className="pill pill-outline h-9 px-4 text-sm mb-8"><ArrowLeft className="w-3.5 h-3.5" /> Back to reviews</Link>
        </div>
        <ReviewDetailDataSkeleton />
      </article>
    );
  }

  const tier = getTier(review.rating, review);
  const tierColor = getTierColor(tier);
  const rarity = getRarity(tier);
  const genres = Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : [];
  const cover = coverUrl(review);
  const facts = [
    { label: "Score", value: `${review.rating} / 10` },
    { label: "Tier", value: `${tier} · ${getTierLabel(tier)}` },
    review.platform && { label: "Platform", value: review.platform },
    genres.length > 0 && { label: genres.length > 1 ? "Genres" : "Genre", value: genres.join(", ") },
    review.playTime && { label: "Play time", value: review.playTime },
    review.date && { label: "Reviewed", value: review.date },
    review.recommended && { label: "Recommended", value: review.recommended === "no" ? "No" : "Yes" },
  ].filter(Boolean);

  return (
    <article className="relative" style={{ "--tier-color": tierColor }}>
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/reviews" className="pill pill-outline h-9 px-4 text-sm mb-8"><ArrowLeft className="w-3.5 h-3.5" /> Back to reviews</Link>
        <h1 className="wordmark text-3xl sm:text-4xl lg:text-5xl text-void !leading-[1.05] max-w-4xl text-balance">{review.title}</h1>
        {review.summary && (
          <p className="mt-6 text-base lg:text-lg max-w-3xl leading-relaxed text-void/80 italic">
            &ldquo;{review.summary}&rdquo;
          </p>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {cover && (
          <figure className="lg:col-span-8 dex-panel !p-2 flex items-center" style={{ "--tier-color": tierColor }}>
            <img src={cover} alt={review.title} className="block w-full h-auto rounded-md" />
          </figure>
        )}

        <aside className={`dex-panel flex flex-col ${cover ? "lg:col-span-4" : "lg:col-span-12"}`} style={{ "--tier-color": tierColor }}>
          <dl>
            {facts.map(({ label, value }) => (
              <div key={label} className="dex-row !grid-cols-[6.5rem_1fr]">
                <dt className="dex-label">{label}</dt>
                <dd className="text-void">{value}</dd>
              </div>
            ))}
          </dl>
          <div className={`rarity-${rarity.tone} mt-auto pt-3 border-t border-void/15 flex items-center justify-between text-xs font-semibold text-void/60`}>
            <span>Stars</span>
            <span className="pc-rarity !text-base" aria-hidden="true">{rarity.symbol.repeat(rarity.stars)}</span>
          </div>
        </aside>
      </section>

      {review.body && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="review-sheet relative prose prose-lg max-w-none
            prose-headings:text-void prose-h1:mb-0
            prose-p:text-void/80 prose-p:leading-relaxed
            prose-a:text-jade prose-a:no-underline
            prose-strong:text-void prose-strong:font-extrabold
            prose-blockquote:border-l-blush prose-blockquote:text-void/80 prose-blockquote:not-italic
            prose-li:text-void/80 prose-hr:border-hairline
            prose-pre:bg-bone prose-pre:border prose-pre:border-hairline prose-pre:rounded-md prose-kbd:rounded-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
          </div>
        </section>
      )}

      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 grid md:grid-cols-2 gap-6 items-stretch">
          {review.pros?.length > 0 && (
            <div className="dex-panel">
              <h2 className="dex-title">Pros</h2>
              <ul className="space-y-3">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-relaxed text-void/85">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-jade" />{pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className="dex-panel" style={{ "--tier-color": "var(--blush)" }}>
              <h2 className="dex-title">Cons</h2>
              <ul className="space-y-3">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-relaxed text-void/85">
                    <XIcon className="w-4 h-4 shrink-0 mt-0.5 text-blush-deep" />{con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-8 flex justify-center">
        <div className="dex-panel flex items-center gap-4 !py-4" style={{ "--tier-color": tierColor }}>
          <div className="score-badge">
            <span className="score-badge-fill">{review.rating}</span>
          </div>
          <div>
            <div className="dex-label">Final verdict</div>
            <div className="font-gothic font-bold text-lg text-void leading-tight">{tier} · {getTierLabel(tier)}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
          <div className="pt-12">
            <h2 className="wordmark text-3xl sm:text-4xl text-void mb-10">More {genres.join(" & ")} reviews</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.map((relatedReview) => (
                <ReviewCard key={relatedReview.slug} review={relatedReview} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
