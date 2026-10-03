import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { SkeletonTierCards, SkeletonReviewCard } from "../components/ui/skeleton";
import { ReviewCard } from "../components/ReviewCard";
import { Wordmark } from "../components/ui/decor";
import { TIERS, getTier, getTierColor, getTierLabel } from "../lib/tier";
import { usePageTitle } from "../hooks/usePageTitle";

export default function TierList() {
  usePageTitle("Tier List");
  const { reviews, loading } = useReviews();

  const grouped = useMemo(() => TIERS.reduce((acc, tier) => {
    acc[tier] = reviews.filter((review) => getTier(review.rating, review) === tier).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return acc;
  }, {}), [reviews]);

  return (
    <div className="relative">
      <section className="relative pt-12 lg:pt-16">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wordmark text="Tier List" tag="ranked, not scored" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-void" tagClassName="text-void/50" />
          <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-ink">
            Sorted by tier, not by score. A 5 can still land in F.
            {" "}<Link to="/guidelines" className="underline decoration-jade decoration-2 underline-offset-4 font-bold text-void">Read the guidelines</Link>{" "}
            if that surprises you.
          </p>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pb-24">
        <div className="relative space-y-3">
          {TIERS.map((tier) => {
            const tierColor = getTierColor(tier);
            const entries = grouped[tier] || [];
            return (
              <div key={tier} className="border-2 border-void rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ background: tierColor }}
                >
                  <span className="display-hero text-4xl text-void leading-none">{tier}</span>
                  <span className="font-gothic text-base font-bold text-void">{getTierLabel(tier)}</span>
                  <span className="flex-1" />
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-void/70">
                    {loading ? "…" : `${entries.length} ${entries.length === 1 ? "title" : "titles"}`}
                  </span>
                </div>

                <div className="bg-bone p-5">
                  {loading ? (
                    tier === "★" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        <SkeletonReviewCard showRibbon={false} />
                      </div>
                    ) : (
                      <SkeletonTierCards label="Loading tier entries" showRibbon={false} />
                    )
                  ) : entries.length === 0 ? (
                    <div className="py-4 font-gothic text-base text-void/45">Nothing here yet.</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {entries.map((review) => (
                        <ReviewCard key={review.slug} review={review} showRibbon={false} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-14 text-center">
          <Link to="/reviews" className="pill pill-jade h-12 px-8 text-sm">Browse all reviews</Link>
        </div>
      </div>
    </div>
  );
}
