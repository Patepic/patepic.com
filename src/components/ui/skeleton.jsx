const SHIMMER_DELAY_MS = 400;

export const Skeleton = ({ className = "", delay = SHIMMER_DELAY_MS }) => (
  <div
    className={`animate-shimmer bg-gradient-to-r from-ash/10 via-ash/25 to-ash/10 bg-[length:200%_100%] ${className}`}
    style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    aria-hidden="true"
  />
);

const Bar = ({ className = "" }) => <Skeleton className={`rounded-sm ${className}`} />;
const NBSP = "\u00a0";

const VERDICT_LINES = ["w-full", "w-11/12", "w-full", "w-5/6", "w-1/2"];
const STAT_LINES = [["Platform", ["w-2/3"]], ["Genre", ["w-4/5", "w-1/2"]]];

export const SkeletonReviewCard = ({ size = "sm", showRibbon = true }) => {
  const lg = size === "lg" ? " pc-lg" : "";
  const body = (layer) => (
    <>
      <div className="pc-head">
        {showRibbon && <span className="pc-stage">{NBSP}</span>}
        <span className="pc-title flex-1">{layer === "info" ? <Bar className="h-[1.15em] w-3/5" /> : NBSP}</span>
      </div>
      <div className="pc-art">
        {layer === "face" && <div className="card-back absolute inset-0" />}
      </div>
      <div className="pc-text">
        <div className="pc-verdict">
          {VERDICT_LINES.map((w, i) => (
            layer === "info" ? <Bar key={i} className={`h-[1em] my-[0.175em] ${w}`} /> : <div key={i} className="h-[1.35em]" />
          ))}
        </div>
      </div>
      <div className="pc-stats">
        {STAT_LINES.map(([label, widths]) => (
          <div key={label} className="pc-stat">
            <span className="pc-stat-label">{label}</span>
            {widths.map((w, i) => (
              <span key={i} className="pc-stat-value">{layer === "info" ? <Bar className={`h-[1em] my-[0.15em] mx-auto ${w}`} /> : NBSP}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="pc-setline">
        {layer === "info" ? <Bar className="h-[1.2em] w-1/2" /> : <span>{NBSP}</span>}
      </div>
    </>
  );
  return (
    <div className={`pc-wrap pc-skeleton${lg}`} aria-hidden="true">
      <div className={`profile-card${lg}`}>
        <div className="pc-face">{body("face")}</div>
        <div className="pc-info">{body("info")}</div>
      </div>
    </div>
  );
};

export const SkeletonVideoCard = ({ size = "sm" }) => {
  const lg = size === "lg" ? " pc-lg" : "";
  const body = (layer) => (
    <>
      <div className="pc-head">
        <span className="pc-stage">{NBSP}</span>
        <span className="pc-title flex-1">{layer === "info" ? <Bar className="h-[1.15em] w-1/2" /> : NBSP}</span>
      </div>
      <div className="pc-art" style={{ aspectRatio: "16 / 9", boxSizing: "content-box" }}>
        {layer === "face" && <div className="card-back absolute inset-0" />}
      </div>
      <div className="pc-setline">
        {layer === "info" ? <Bar className="h-[1.2em] w-1/3 ml-auto" /> : <span>{NBSP}</span>}
      </div>
    </>
  );
  return (
    <div className={`pc-wrap pc-video${lg}`} style={{ "--tier-color": "var(--blush)" }} aria-hidden="true">
      <div className={`profile-card${lg}`}>
        <div className="pc-face">{body("face")}</div>
        <div className="pc-info">{body("info")}</div>
      </div>
    </div>
  );
};

export const HomeDataSkeleton = () => (
  <div
    data-testid="home-data-skeleton"
    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    aria-label="Loading recent reviews"
  >
    {Array.from({ length: 3 }).map((_, i) => (<SkeletonReviewCard key={i} />))}
  </div>
);

export const ReviewsDataSkeleton = () => (
  <div
    data-testid="reviews-data-skeleton"
    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    aria-label="Loading reviews"
  >
    {Array.from({ length: 12 }).map((_, i) => (<SkeletonReviewCard key={i} />))}
  </div>
);

const TIER_CARD_REVEAL = ["", "", "hidden sm:block", "hidden md:block"];

export const SkeletonTierCards = ({ label = "Loading tier entries", showRibbon = true }) => (
  <div
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
    aria-label={label}
  >
    {TIER_CARD_REVEAL.map((revealClass, j) => (
      <div key={j} className={revealClass}>
        <SkeletonReviewCard showRibbon={showRibbon} />
      </div>
    ))}
  </div>
);

const NEUTRAL = { "--tier-color": "#D6CCBF" };

export const ReviewDetailDataSkeleton = () => (
  <div data-testid="review-detail-data-skeleton" aria-label="Loading review">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <Skeleton className="h-[1.97rem] sm:h-[2.36rem] lg:h-[3.15rem] w-2/3 max-w-xl" />
      <div className="mt-6 max-w-3xl">
        <Skeleton className="h-[1.625rem] lg:h-[1.83rem] w-full" />
        <Skeleton className="h-[1.625rem] lg:h-[1.83rem] w-3/5" />
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" aria-hidden="true">
      <div className="lg:col-span-8 dex-panel !p-2 flex items-center" style={NEUTRAL}>
        <Skeleton className="aspect-video w-full rounded-md" />
      </div>
      <div className="lg:col-span-4 dex-panel flex flex-col" style={NEUTRAL}>
        {["w-16", "w-24", "w-12", "w-28", "w-20", "w-24"].map((w, i) => (
          <div key={i} className="dex-row !grid-cols-[6.5rem_1fr]">
            <Skeleton className="h-3 w-14 mt-1" />
            <Skeleton className={`h-5 ${w}`} />
          </div>
        ))}
        <div className="mt-auto pt-3 border-t border-void/15 flex items-center justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14" aria-hidden="true">
      <div className="review-sheet space-y-7">
        {[["w-full", "w-full", "w-11/12", "w-2/3"], ["w-full", "w-full", "w-4/5"], ["w-full", "w-5/6"]].map((lines, i) => (
          <div key={i}>
            {lines.map((w, j) => (<Skeleton key={j} className={`h-[2rem] ${w}`} />))}
          </div>
        ))}
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 grid md:grid-cols-2 gap-6 items-stretch" aria-hidden="true">
      {[4, 3].map((count, i) => (
        <div key={i} className="dex-panel" style={NEUTRAL}>
          <Skeleton className="h-[1.65rem] w-20 mb-[0.6rem]" />
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, j) => (<Skeleton key={j} className="h-[1.42rem] w-full" />))}
          </div>
        </div>
      ))}
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-8 flex justify-center" aria-hidden="true">
      <div className="dex-panel flex items-center gap-4 !py-4" style={NEUTRAL}>
        <Skeleton className="w-[2.6rem] h-12" />
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-28 mt-1" />
        </div>
      </div>
    </div>
  </div>
);

export const AwardsDataSkeleton = () => (
  <div
    data-testid="awards-data-skeleton"
    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
    aria-label="Loading awards"
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} aria-hidden="true" className="flex flex-col h-full border border-hairline bg-bone overflow-hidden">
        <div className="flex items-center gap-4 p-5">
          <Skeleton className="w-16 h-16 rounded-md shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-6 w-3/4 mt-2" />
          </div>
        </div>
        <div className="mt-auto">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 shrink-0" />
              <Skeleton className="h-[1.75rem] w-1/2" />
            </div>
            <Skeleton className="h-[1.42rem] w-full mt-[0.375rem]" />
            <Skeleton className="h-[1.42rem] w-5/6" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const PageShellSkeleton = () => (
  <div
    data-testid="page-shell-skeleton"
    className="min-h-[calc(100vh_-_4rem)] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-20"
    aria-label="Loading page"
  >
    <div className="flex flex-col items-center text-center" aria-hidden="true">
      <Skeleton className="h-[3.375rem] sm:h-[4.05rem] lg:h-[5.4rem] w-3/4 max-w-md" />
      <Skeleton className="mt-3 h-4 sm:h-5 w-28" />
      <div className="mt-5 w-full max-w-xl flex flex-col items-center">
        <Skeleton className="h-[1.42rem] sm:h-[1.625rem] w-full" />
        <Skeleton className="h-[1.42rem] sm:h-[1.625rem] w-4/6" />
      </div>
    </div>
    <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (<SkeletonReviewCard key={i} />))}
    </div>
  </div>
);
