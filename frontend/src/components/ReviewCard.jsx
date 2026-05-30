import { Link } from "react-router-dom";
import { scoreToTier } from "../data/reviews";
import { Gamepad2 } from "lucide-react";

const tierBadge = {
  S: "from-sky-500 to-blue-600 text-white",
  A: "from-blue-400 to-indigo-500 text-white",
  B: "from-emerald-400 to-emerald-600 text-white",
  C: "from-amber-300 to-amber-500 text-slate-900",
  D: "from-orange-400 to-orange-600 text-white",
  F: "from-rose-500 to-rose-700 text-white",
};

export const ReviewCard = ({ review, featured = false }) => {
  const tier = scoreToTier(review.score);
  const fallback = "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";
  const cover = review.cover_url || fallback;

  return (
    <Link
      to={`/reviews/${review.slug}`}
      data-testid={`review-card-${review.slug}`}
      className={`group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-[0_12px_40px_-12px_rgba(2,132,199,0.25)] transition-all duration-500 flex flex-col ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className={`relative ${featured ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden bg-slate-100`}>
        <img
          src={cover}
          alt={review.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" />

        <div
          className={`absolute top-4 right-4 w-14 h-14 rounded-full grid place-items-center bg-gradient-to-br ${tierBadge[tier]} shadow-lg`}
        >
          <div className="text-center leading-none">
            <div className="font-display font-bold text-lg">{review.score.toFixed(1)}</div>
          </div>
        </div>

        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-white text-xs text-slate-700">
          <Gamepad2 className="w-3 h-3 text-sky-600" />
          {review.platform}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="tracking-[0.2em] uppercase text-sky-700">{review.genre}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{review.year}</span>
        </div>
        <h3
          className={`font-display tracking-tight text-slate-900 group-hover:text-sky-800 transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {review.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-auto">{review.verdict}</p>
      </div>
    </Link>
  );
};
