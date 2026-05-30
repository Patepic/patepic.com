import React from "react";
import { Link } from "react-router-dom";
import { reviews, scoreToTier } from "../data/reviews";

const tierListBg =
  "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/c371302cc1d213a0735c27a15e2c7e73630634edb15ea39bd85662383a88074c.png";

const tierMeta = {
  S: { color: "from-cyan-400 to-cyan-600", glow: "shadow-[0_0_45px_rgba(34,211,238,0.35)]", label: "Hall of fame" },
  A: { color: "from-blue-400 to-blue-600", glow: "", label: "Essential" },
  B: { color: "from-emerald-400 to-emerald-600", glow: "", label: "Strongly recommend" },
  C: { color: "from-amber-400 to-amber-600", glow: "", label: "Worth a look" },
  D: { color: "from-orange-400 to-orange-600", glow: "", label: "Conditional" },
  F: { color: "from-red-500 to-red-700", glow: "", label: "Avoid" },
};

export default function TierList() {
  const grouped = ["S", "A", "B", "C", "D", "F"].reduce((acc, t) => {
    acc[t] = reviews.filter((r) => scoreToTier(r.score) === t).sort((a, b) => b.score - a.score);
    return acc;
  }, {});

  return (
    <div data-testid="tier-list-page">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={tierListBg} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/85 to-slate-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">The verdict, distilled</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-slate-50 max-w-3xl leading-[1.02]">
            The Frostbyte tier list.
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Every review on this site, sorted by where the score lands. S-tier glows. F-tier doesn't.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {["S", "A", "B", "C", "D", "F"].map((t) => {
          const meta = tierMeta[t];
          const list = grouped[t];
          return (
            <div
              key={t}
              data-testid={`tier-row-${t}`}
              className={`grid grid-cols-1 md:grid-cols-[140px_1fr] gap-0 md:gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden ${
                t === "S" ? meta.glow : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br ${meta.color} text-slate-950 p-6 md:p-8 flex flex-col items-center justify-center text-center`}
              >
                <div className="font-display text-6xl md:text-7xl font-bold leading-none">{t}</div>
                <div className="text-[0.65rem] tracking-[0.25em] uppercase font-medium mt-2">{meta.label}</div>
                <div className="text-xs mt-2 opacity-70">{list.length} {list.length === 1 ? "title" : "titles"}</div>
              </div>

              <div className="p-5 md:p-6">
                {list.length === 0 ? (
                  <div className="h-full grid place-items-center text-slate-500 italic text-sm py-8">
                    Nothing here yet. (And honestly, that's the goal for the lower tiers.)
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {list.map((r) => (
                      <Link
                        to={`/reviews/${r.slug}`}
                        key={r.slug}
                        data-testid={`tier-item-${r.slug}`}
                        className="group flex items-center gap-3 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-2 pr-4 transition"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        </div>
                        <div>
                          <div className="font-display text-sm text-slate-50 group-hover:text-cyan-200 leading-tight">{r.title}</div>
                          <div className="text-xs text-slate-500">{r.platform} · {r.score.toFixed(1)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
