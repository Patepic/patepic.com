import { Link } from "react-router-dom";
import { ArrowUpRight, Gamepad2 } from "lucide-react";

export const coverUrl = (r) => {
  if (!r?.cover_url) return null;
  return r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
};

/** Bordered listing card: title, date, score badge, "Read" button. */
export function ReviewListing({ review }) {
  const cover = coverUrl(review);
  const genres = Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : [];

  return (
    <div data-testid={`review-card-${review.slug}`}
      className="group relative rounded-lg border border-pixel-black/10 bg-pixel-mint p-4 sm:p-5 flex items-center gap-4 transition-colors">
      {cover && (
        <Link to={`/reviews/${review.slug}`} className="sticker-frame shrink-0 rounded-md overflow-hidden w-20 h-20 sm:w-24 sm:h-24 bg-pixel-mint">
          <img src={cover} alt={review.title} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <Link to={`/reviews/${review.slug}`} className="font-display font-bold text-base sm:text-xl text-pixel-black leading-normal block">
          {review.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-pixel-black/80">
          {review.platform && (
            <span className="w-5 h-5 rounded-full bg-pixel-white border border-pixel-black/10 text-pixel-black grid place-items-center shrink-0">
              <Gamepad2 className="w-3 h-3" />
            </span>
          )}
          {[review.date, review.platform].filter(Boolean).join(" · ")}
        </div>
        {genres.length > 0 && (
          <div className="mt-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-pixel-black/50">
            {genres.slice(0, 3).join(" / ")}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="hidden sm:grid place-items-center w-10 h-10 rounded-full bg-pixel-pink text-pixel-white font-display font-bold text-sm">
          {review.rating}
        </span>
        <Link to={`/reviews/${review.slug}`}
          className="pill pill-ember h-9 sm:h-10 px-4 sm:px-6 rounded-lg text-[0.75rem] uppercase tracking-[0.06em]">
          Read <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
