import React from "react";
import { Link } from "react-router-dom";
import { scoreToTier } from "../data/reviews";
import { Gamepad2 } from "lucide-react";

const tierBadge = {
  S: "from-cyan-400 to-cyan-600 text-slate-950",
  A: "from-blue-400 to-blue-600 text-slate-950",
  B: "from-emerald-400 to-emerald-600 text-slate-950",
  C: "from-amber-400 to-amber-600 text-slate-950",
  D: "from-orange-400 to-orange-600 text-slate-950",
  F: "from-red-500 to-red-700 text-slate-50",
};

export const ReviewCard = ({ review, featured = false }) => {
  const tier = scoreToTier(review.score);

  return (
    <Link
      to={`/reviews/${review.slug}`}
      data-testid={`review-card-${review.slug}`}
      className={`group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all duration-500 flex flex-col ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className={`relative ${featured ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden`}>
        <img
          src={review.cover}
          alt={review.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div
          className={`absolute top-4 right-4 w-14 h-14 rounded-full grid place-items-center bg-gradient-to-br ${tierBadge[tier]} shadow-lg shadow-black/40`}
        >
          <div className="text-center leading-none">
            <div className="font-display font-bold text-lg">{review.score.toFixed(1)}</div>
          </div>
        </div>

        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm border border-white/10 text-xs text-slate-200">
          <Gamepad2 className="w-3 h-3 text-cyan-400" />
          {review.platform}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="tracking-[0.2em] uppercase text-cyan-500">{review.genre}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">{review.year}</span>
        </div>
        <h3
          className={`font-display tracking-tight text-slate-50 group-hover:text-cyan-200 transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {review.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 mt-auto">{review.verdict}</p>
      </div>
    </Link>
  );
};
