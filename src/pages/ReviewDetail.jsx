import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight, Check, Trophy, X as XIcon } from "lucide-react";
import { fetchReview, fetchReviews } from "../lib/api";
import { getTier, getTierColor, getTierLabel, getRarity } from "../lib/tier";
import { ReviewDetailDataSkeleton } from "../components/ui/skeleton";
import { ReviewCard, coverUrl } from "../components/ReviewCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { RarityMark } from "../components/RarityMark";
import { PlatformIcon } from "../components/PlatformIcon";

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
  const awards = (Array.isArray(review.awards) ? review.awards : [])
    .map((a) => (typeof a === "string" ? { name: a, explanation: "" } : a))
    .filter((a) => a?.name);
  const facts = [
    { label: "Score", value: `${review.rating} / 10` },
    { label: "Tier", value: `${tier} · ${getTierLabel(tier)}` },
    review.platform && { label: "Platform", value: <span className="inline-flex items-center gap-2 align-middle"><PlatformIcon platform={review.platform} />{review.platform}</span>, center: true },
    genres.length > 0 && { label: genres.length > 1 ? "Genres" : "Genre", value: genres.join(", ") },
    review.playTime && { label: "Play time", value: review.playTime },
    review.date && { label: "Reviewed", value: review.date },
    review.recommended && { label: "Recommended", value: review.recommended === "no" ? "No" : "Yes" },
  ].filter(Boolean);

  return (
    <article className="relative" style={{ "--tier-color": tierColor }}>
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/reviews" className="pill pill-outline h-9 px-4 text-sm mb-8"><ArrowLeft className="w-3.5 h-3.5" /> Back to reviews</Link>
        <h1 className="wordmark text-3xl sm:text-4xl lg:text-5xl text-charcoal-brown !leading-[1.05] max-w-4xl text-balance">{review.title}</h1>
        {review.summary && (
          <p className="mt-6 max-w-3xl pl-4 border-l-4 border-[var(--tier-color)] text-xl lg:text-2xl leading-snug font-bold text-charcoal-brown">
            {review.summary}
          </p>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {cover && (
          <figure className="lg:col-span-8 dex-panel dex-tier !p-2 flex flex-col justify-center" style={{ "--tier-color": tierColor }}>
            <img src={cover} alt={review.title} className="block w-full h-auto rounded-md" />
            {review.imageCredit && (
              <figcaption className="px-1 pt-1.5 text-right text-xs font-semibold text-charcoal-brown/85">
                Image by{" "}
                {/^https?:\/\//i.test(review.imageCreditUrl || "") ? (
                  <a href={review.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-orange decoration-2 underline-offset-2">{review.imageCredit}</a>
                ) : review.imageCredit}
              </figcaption>
            )}
          </figure>
        )}

        <aside className={`dex-panel dex-tier flex flex-col ${cover ? "lg:col-span-4" : "lg:col-span-12"}`} style={{ "--tier-color": tierColor }}>
          <dl>
            {facts.map(({ label, value, center }) => (
              <div key={label} className={`dex-row !grid-cols-[6.5rem_1fr]${center ? " items-center" : ""}`}>
                <dt className={`dex-label${center ? " !pt-0" : ""}`}>{label}</dt>
                <dd className="text-charcoal-brown">{value}</dd>
              </div>
            ))}
          </dl>
          <div className={`rarity-${rarity.tone} mt-auto pt-3 border-t border-charcoal-brown/15 flex items-center justify-between text-xs font-semibold text-charcoal-brown/80`}>
            <span>Rarity</span>
            <RarityMark symbol={rarity.symbol} count={rarity.stars} className="!text-base" />
          </div>
        </aside>
      </section>

      {awards.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8" data-testid="review-awards">
          <div className="dex-panel dex-tier" style={{ "--tier-color": getTierColor("★") }}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h2 className="dex-title !mb-0">{awards.length === 1 ? "Award" : "Awards"}</h2>
              <Link to="/awards" className="pill pill-outline h-8 px-3.5 text-xs">All awards <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            </div>
            <ul className={`grid gap-x-8 ${awards.length > 1 ? "md:grid-cols-2" : ""}`}>
              {awards.map((award, index) => (
                <li key={`${award.name}-${index}`} className="flex gap-3 py-3">
                  <span className="watch-tile-icon !w-10 !h-10 mt-0.5" aria-hidden="true"><Trophy className="w-4 h-4" /></span>
                  <div className="min-w-0">
                    <h3 className="text-lg leading-tight text-charcoal-brown">{award.name}</h3>
                    {award.explanation && <p className="mt-1 text-sm leading-relaxed text-charcoal-brown/90">{award.explanation}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {review.body && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="review-sheet relative prose prose-lg max-w-none
            prose-headings:text-charcoal-brown prose-h1:mb-0
            prose-p:text-charcoal-brown/90 prose-p:leading-relaxed
            prose-a:text-charcoal-brown prose-a:no-underline
            prose-strong:text-charcoal-brown prose-strong:font-extrabold
            prose-blockquote:border-l-charcoal-brown/30 prose-blockquote:text-charcoal-brown/90 prose-blockquote:not-italic
            prose-li:text-charcoal-brown/90 prose-hr:border-honey
            prose-pre:bg-white prose-pre:border prose-pre:border-honey prose-pre:rounded-md prose-kbd:rounded-md">
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
                  <li key={index} className="flex gap-3 text-sm leading-relaxed text-charcoal-brown/95">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-charcoal-brown" />{pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className="dex-panel">
              <h2 className="dex-title">Cons</h2>
              <ul className="space-y-3">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-relaxed text-charcoal-brown/95">
                    <XIcon className="w-4 h-4 shrink-0 mt-0.5 text-orange" />{con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-8 flex justify-center">
        <div className="dex-panel dex-tier flex items-center gap-4 !py-4" style={{ "--tier-color": tierColor }}>
          <div className="score-badge">
            <span className="score-badge-fill">{review.rating}</span>
          </div>
          <div>
            <div className="dex-label">Final verdict</div>
            <div className="font-sans font-bold text-lg text-charcoal-brown leading-tight">{tier} · {getTierLabel(tier)}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-8">
          <div className="pt-12">
            <h2 className="wordmark text-3xl sm:text-4xl text-charcoal-brown mb-10">More {genres.join(" & ")} reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xs sm:max-w-none mx-auto">
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
