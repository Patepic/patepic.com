import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const gradientStops = {
  "★":  <><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#f43f5e"/></>,
  "S+": <><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#7c3aed"/></>,
  "S":  <><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#3b82f6"/></>,
  "A":  <><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#4338ca"/></>,
  "B":  <><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#0d9488"/></>,
  "C":  <><stop offset="0%" stopColor="#facc15"/><stop offset="100%" stopColor="#d97706"/></>,
  "D":  <><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#f97316"/></>,
  "F":  <><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f43f5e"/></>,
};

const ratingToTier = (rating, recommended, cons, isFeatured) => {
  if (isFeatured) return "★";
  const n = parseFloat(rating);
  if (n <= 3 || recommended === "no") return "F";
  if (n <= 5) return "D";
  if (n <= 7) return "C";
  if (n === 8) return "B";
  if (n === 9) return "A";
  if (Array.isArray(cons) && cons.includes("Hard to point to any real flaws")) return "S+";
  return "S";
};

const HexScore = ({ rating, tier, size = 14 }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id={`hex-grad-${tier.replace("+", "plus")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {gradientStops[tier]}
        </linearGradient>
      </defs>
      <polygon points="28,2 52,15 52,41 28,54 4,41 4,15" fill={`url(#hex-grad-${tier.replace("+", "plus")})`} />
    </svg>
    <div className="absolute inset-0 grid place-items-center">
      <span className="font-display font-bold text-white leading-none" style={{ fontSize: size * 0.32 }}>
        {rating}
      </span>
    </div>
  </div>
);

export const ReviewCard = ({ review, featured = false }) => {
  const tier = ratingToTier(review.rating, review.recommended, review.cons, review.isFeatured);
  const fallback =
    "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";
  const cover = review.cover_url
    ? review.cover_url.startsWith("http")
      ? review.cover_url
      : `https://${review.cover_url}`
    : fallback;
  const genres = Array.isArray(review.genre)
    ? review.genre
    : review.genre
    ? review.genre.split(",").map((g) => g.trim())
    : [];

  if (featured) {
    return (
      <Link
        to={`/reviews/${review.slug}`}
        data-testid={`review-card-${review.slug}`}
        className="group relative overflow-hidden rounded-xl bg-white hover:shadow-[0_12px_40px_-12px_rgba(2,132,199,0.25)] transition-all duration-300 flex flex-col md:col-span-2 md:row-span-2 border border-slate-200 hover:border-sky-300"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={cover}
            alt={review.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <HexScore rating={review.rating} tier={tier} size={56} />
          </div>
        </div>
        <div className="p-5 flex flex-col gap-2 flex-1">
          <h3 className="font-display text-2xl md:text-3xl text-slate-900 tracking-tight group-hover:text-sky-800 transition-colors">
            {review.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">{review.summary}</p>
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-sky-500" />
              <span className="uppercase tracking-wide">{review.platform}</span>
            </span>
            {genres.map((g) => (
              <span key={g} className="uppercase tracking-wide">{g}</span>
            ))}
            <span className="ml-auto">{review.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/reviews/${review.slug}`}
      data-testid={`review-card-${review.slug}`}
      className="group flex items-stretch transition-all duration-300 border-b border-slate-300 overflow-hidden p-3 pb-4 gap-3"
    >
      <div className="relative w-24 sm:w-32 md:w-64 shrink-0 overflow-hidden rounded-[5px]">
        <img
          src={cover}
          alt={review.title}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-[5px]" />

        <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2">
          <HexScore rating={review.rating} tier={tier} size={40} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 flex-1 py-1">
        <h3 className="font-display text-sm sm:text-base text-slate-900 tracking-tight group-hover:text-sky-800 group-hover:underline transition-colors leading-snug">
          {review.title}
        </h3>

        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {review.date} - {review.summary}
        </p>

        <div className="flex items-center gap-2 sm:gap-3 mt-auto text-[0.6rem] sm:text-[0.65rem] text-slate-500 uppercase tracking-wide flex-wrap">
          <span className="flex items-center gap-1">
            <Gamepad2 className="w-3 h-3 text-sky-500" />
            {review.platform}
          </span>

          {genres.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};