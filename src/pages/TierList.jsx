import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { SkeletonTierCards } from "../components/ui/skeleton";
import { PillHeading, Kicker } from "../components/ui/decor";

const tierMeta = {
  "★": { chip: "bg-pixel-pink text-pixel-white", label: "Favorite" },
  "S+": { chip: "bg-pixel-pink text-pixel-white", label: "Masterpiece" },
  "S": { chip: "bg-pixel-pink text-pixel-white", label: "Elite" },
  "A": { chip: "bg-pixel-mint text-pixel-black", label: "Excellent" },
  "B": { chip: "bg-pixel-mint text-pixel-black", label: "Great" },
  "C": { chip: "bg-pixel-forest text-pixel-black", label: "Above Average" },
  "D": { chip: "bg-pixel-forest text-pixel-black", label: "Below Average" },
  "F": { chip: "bg-pixel-forest text-pixel-black", label: "Avoid" },
};

const TIERS = ["★", "S+", "S", "A", "B", "C", "D", "F"];

const ratingToTier = (rating, recommended, cons, isFeatured) => {
  if (isFeatured) return "★";
  const n = parseFloat(rating);
  const consCount = Array.isArray(cons) ? cons.length : 0;
  const hasNoRealFlaws = Array.isArray(cons) && cons.includes("Hard to point to any real flaws");
  if (n <= 3 || recommended === "no") return "F";
  if (n <= 5) return "D";
  if (n <= 6) return "C";
  if (n === 7) return consCount <= 2 ? "B" : "C";
  if (n === 8) return consCount <= 2 ? "A" : "B";
  if (n === 9) { if (hasNoRealFlaws) return "S+"; return consCount <= 2 ? "S" : "A"; }
  if (n === 10) return hasNoRealFlaws ? "S+" : "S";
  return "C";
};

export default function TierList() {
  const { reviews, loading } = useReviews();
  const grouped = TIERS.reduce((acc, t) => {
    acc[t] = reviews.filter((r) => ratingToTier(r.rating, r.recommended, r.cons, r.isFeatured) === t).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return acc;
  }, {});

  return (
    <div className="relative bg-pixel-blush">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="panel-framed rounded-2xl px-4 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="relative text-center">
            <Kicker>Where everything landed</Kicker>
            <h1 className="display-heading -mt-1 text-5xl sm:text-6xl lg:text-7xl text-pixel-black">Tier List</h1>
            <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-pixel-black/70">
              Sorted by tier, not by score. A 5 can still land in F —
              {" "}<Link to="/guidelines" className="underline decoration-pixel-pink decoration-2 underline-offset-4 font-bold text-pixel-black">read the guidelines</Link>{" "}
              if that surprises you.
            </p>
          </div>

          <div className="relative mt-12 space-y-10">
            {TIERS.map((t) => {
              const meta = tierMeta[t];
              return (
                <div key={t}>
                  <div className="flex items-center justify-center">
                    <PillHeading>
                      <span className="not-italic font-extrabold tracking-wide mr-2">{t}</span>
                      {meta.label}
                    </PillHeading>
                  </div>

                  <div className="mt-5 rounded-xl border border-pixel-black/10 bg-pixel-blush/70 p-4 sm:p-5 min-h-[104px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center h-6 px-3 rounded-full text-[0.75rem] font-extrabold uppercase tracking-[0.06em] ${meta.chip}`}>
                        Tier {t}
                      </span>
                      {!loading && (
                        <span className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black">
                          {grouped[t].length} {grouped[t].length === 1 ? "title" : "titles"}
                        </span>
                      )}
                    </div>

                    {loading ? <SkeletonTierCards count={3} /> : grouped[t].length === 0 ? (
                      <div className="grid place-items-center py-6 display-heading text-sm text-pixel-black/45">Nothing here yet.</div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {grouped[t].map((r) => {
                          const cover = r.cover_url?.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
                          return (
                            <Link key={r.slug} to={`/reviews/${r.slug}`}
                              className="group flex items-start gap-3 bg-pixel-mint border border-pixel-black/10 hover:border-pixel-pink rounded-lg p-2 w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)] transition-colors">
                              <div className="sticker-frame w-14 h-14 overflow-hidden shrink-0 bg-pixel-mint rounded-md">
                                <img src={cover} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-display font-bold text-base text-pixel-black leading-normal">{r.title}</div>
                                <div className="text-sm font-bold text-pixel-black/70 mt-1">{r.platform} · {r.rating}</div>
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
          </div>

          <div className="relative mt-14 text-center">
            <Link to="/reviews" className="pill pill-ember h-12 px-8 text-sm">Browse every review</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
