import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";

const tierMeta = {
  S: {
    color: "from-sky-500 to-blue-600 text-white",
    glow: "shadow-[0_20px_60px_-20px_rgba(2,132,199,0.45)]",
    label: "Masterpiece",
  },
  A: {
    color: "from-blue-400 to-indigo-500 text-white",
    glow: "",
    label: "Excellent",
  },
  B: {
    color: "from-emerald-400 to-emerald-600 text-white",
    glow: "",
    label: "Great",
  },
  C: {
    color: "from-amber-400 to-amber-600 text-white",
    glow: "",
    label: "Above Average",
  },
  D: {
    color: "from-orange-400 to-orange-600 text-white",
    glow: "",
    label: "Below Average",
  },
  F: {
    color: "from-rose-500 to-rose-700 text-white",
    glow: "",
    label: "Avoid",
  },
};

const ratingToTier = (rating, recommended) => {
  const n = parseFloat(rating);
  if (n <= 3 || recommended === "No") return "F";
  if (n <= 5) return "D";
  if (n <= 7) return "C";
  if (n === 8) return "B";
  if (n === 9) return "A";
  return "S";
};

export default function TierList() {
  const { reviews, loading } = useReviews();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-sky-300 border-t-transparent rounded-full animate-spin" />
          Loading tier list…
        </div>
      </div>
    );
  }

  const grouped = ["S", "A", "B", "C", "D", "F"].reduce((acc, t) => {
    acc[t] = reviews
      .filter((r) => ratingToTier(r.rating, r.recommended) === t)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return acc;
  }, {});

  return (
    <div data-testid="tier-list-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">
          Where everything landed
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-slate-900 max-w-3xl leading-[1.02]">
          Every game I finished, sorted.
        </h1>
        <p className="mt-6 text-lg text-slate-500 max-w-2xl">
          Sorted by tier, not by score. A 5 can still land in F. Read the
          guidelines if that surprises you.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
        {["S", "A", "B", "C", "D", "F"].map((t) => {
          const meta = tierMeta[t];
          const list = grouped[t];
          return (
            <div
              key={t}
              data-testid={`tier-row-${t}`}
              className={`grid grid-cols-1 md:grid-cols-[140px_1fr] gap-0 md:gap-6 rounded-3xl border border-slate-200 bg-white overflow-hidden ${
                t === "S" ? meta.glow : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br ${meta.color} p-6 md:p-8 flex flex-col items-center justify-center text-center`}
              >
                <div className="font-display text-6xl md:text-7xl font-bold leading-none">
                  {t}
                </div>
                <div className="text-[0.65rem] tracking-[0.25em] uppercase font-medium mt-2 opacity-90">
                  {meta.label}
                </div>
                <div className="text-xs mt-2 opacity-70">
                  {list.length} {list.length === 1 ? "title" : "titles"}
                </div>
              </div>

              <div className="p-5 md:p-6">
                {list.length === 0 ? (
                  <div className="h-full grid place-items-center text-slate-400 italic text-sm py-8">
                    Nothing here yet. (And honestly, that's the goal for the
                    lower tiers.)
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {list.map((r) => {
                      const cover = r.cover_url
                        ? r.cover_url.startsWith("http")
                          ? r.cover_url
                          : `https://${r.cover_url}`
                        : "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";
                      return (
                        <Link
                          to={`/reviews/${r.slug}`}
                          key={r.slug}
                          data-testid={`tier-item-${r.slug}`}
                          className="group flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-white rounded-xl p-2 pr-4 transition"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            <img
                              src={cover}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          </div>
                          <div>
                            <div className="font-display text-sm text-slate-900 group-hover:text-sky-800 leading-tight">
                              {r.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              {r.platform} · {r.rating}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
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
