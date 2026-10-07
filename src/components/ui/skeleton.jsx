const SHIMMER_DELAY_MS = 400;

export const Skeleton = ({ className = "", delay = SHIMMER_DELAY_MS }) => (
  <div
    className={`animate-shimmer bg-gradient-to-r from-straw/60 via-straw to-straw/60 bg-[length:200%_100%] ${className}`}
    style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    aria-hidden="true"
  />
);

const Bar = ({ className = "" }) => <Skeleton className={`rounded-sm ${className}`} />;
const NBSP = "\u00a0";

const VERDICT_LINES = ["w-full", "w-11/12", "w-full", "w-5/6", "w-1/2"];
const STAT_LABELS = ["Strengths", "Weaknesses"];

export const SkeletonReviewCard = ({ size = "sm", showRibbon = true }) => {
  const lg = size === "lg" ? " pc-lg" : "";
  const body = (layer) => (
    <>
      <div className="pc-head">
        {showRibbon && <span className="pc-stage">{NBSP}</span>}
        <span className="pc-score"><span className="pc-score-fill">{NBSP}</span></span>
        <span className="pc-title">{layer === "info" ? <Bar className="h-[1.15em] w-3/5 ml-auto" /> : NBSP}</span>
      </div>
      <div className="pc-art">
        {layer === "face" && <div className="card-back absolute inset-0" />}
      </div>
      <div className="pc-strip">
        <div className="pc-flavor">{layer === "info" ? <Bar className="h-[1em] my-[0.125em] w-2/3 mx-auto" /> : NBSP}</div>
      </div>
      <div className="pc-text">
        <div className="pc-verdict">
          {VERDICT_LINES.map((w, i) => (
            layer === "info" ? <Bar key={i} className={`h-[1em] my-[0.225em] mx-auto ${w}`} /> : <div key={i} className="h-[1.45em]" />
          ))}
        </div>
      </div>
      <div className="pc-stats">
        {STAT_LABELS.map((label) => (
          <div key={label} className="pc-stat">
            <span className="pc-stat-label">{label}</span>
            <span className="pc-stat-value is-count">{NBSP}</span>
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
        <span className="pc-title">{layer === "info" ? <Bar className="h-[1.15em] w-1/2 ml-auto" /> : NBSP}</span>
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
    <div className={`pc-wrap pc-video${lg}`} style={{ "--tier-color": "var(--color-mango-yellow)" }} aria-hidden="true">
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
    className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xs sm:max-w-none mx-auto"
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
    className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-xs sm:max-w-none mx-auto"
    aria-label={label}
  >
    {TIER_CARD_REVEAL.map((revealClass, j) => (
      <div key={j} className={revealClass}>
        <SkeletonReviewCard showRibbon={showRibbon} />
      </div>
    ))}
  </div>
);

const NEUTRAL = { "--tier-color": "var(--color-mango-yellow)" };

export const ReviewDetailDataSkeleton = () => (
  <div data-testid="review-detail-data-skeleton" aria-label="Loading review">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <Skeleton className="h-[1.97rem] sm:h-[2.36rem] lg:h-[3.15rem] w-2/3 max-w-xl" />
      <div className="mt-6 max-w-3xl pl-4 border-l-4 border-honey">
        <Skeleton className="h-[1.72rem] lg:h-[2.06rem] w-full" />
        <Skeleton className="h-[1.72rem] lg:h-[2.06rem] w-3/5" />
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" aria-hidden="true">
      <div className="lg:col-span-8 dex-panel dex-tier !p-2 flex items-center" style={NEUTRAL}>
        <Skeleton className="aspect-video w-full rounded-md" />
      </div>
      <div className="lg:col-span-4 dex-panel dex-tier flex flex-col" style={NEUTRAL}>
        {["w-16", "w-24", "w-12", "w-28", "w-20", "w-24"].map((w, i) => (
          <div key={i} className="dex-row !grid-cols-[6.5rem_1fr]">
            <Skeleton className="h-3 w-14 mt-1" />
            <Skeleton className={`h-5 ${w}`} />
          </div>
        ))}
        <div className="mt-auto pt-3 border-t border-charcoal-brown/15 flex items-center justify-between">
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
      <div className="dex-panel dex-tier flex items-center gap-4 !py-4" style={NEUTRAL}>
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
      <div key={i} aria-hidden="true" className="flex flex-col h-full border border-honey bg-white overflow-hidden">
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

const TitleBlock = ({ lines = 2 }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 flex flex-col items-center text-center" aria-hidden="true">
    <Skeleton className="h-[3.375rem] sm:h-[4.05rem] lg:h-[5.4rem] w-3/4 max-w-md" />
    <Skeleton className="mt-3 h-4 sm:h-5 w-28" />
    <div className="mt-5 w-full max-w-xl flex flex-col items-center">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-[1.42rem] sm:h-[1.625rem] ${i === lines - 1 && lines > 1 ? "w-4/6" : "w-full"}`} />
      ))}
    </div>
  </div>
);

const PanelLines = ({ rows = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (<Skeleton key={i} className={`h-[1.42rem] ${i === rows - 1 ? "w-3/5" : "w-full"}`} />))}
  </div>
);

const ReviewsShell = () => (
  <div aria-label="Loading reviews">
    <TitleBlock />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <Skeleton className="mt-8 h-[5.25rem] rounded-2xl" />
      <Skeleton className="mt-6 h-[17rem] md:h-[13.5rem] rounded-[10px]" />
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 pb-20">
      <Skeleton className="h-4 w-48 mb-6" />
      <ReviewsDataSkeleton />
    </div>
  </div>
);

const ReviewDetailShell = () => (
  <div className="relative">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" aria-hidden="true">
      <Skeleton className="h-9 w-40 rounded-full mb-8" />
    </div>
    <ReviewDetailDataSkeleton />
  </div>
);

const AwardsShell = () => (
  <div aria-label="Loading awards">
    <TitleBlock lines={1} />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pb-24">
      <Skeleton className="mt-8 h-[5.25rem] rounded-2xl" />
      <div className="mt-6 flex items-center justify-between gap-4" aria-hidden="true">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-44 rounded-lg" />
      </div>
      <AwardsDataSkeleton />
    </div>
  </div>
);

const YearInGamingShell = () => (
  <div aria-label="Loading year in gaming">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center" aria-hidden="true">
      <Skeleton className="h-9 w-32 rounded-lg" />
      <Skeleton className="mt-6 h-[5rem] sm:h-[7rem] lg:h-[9rem] w-64 sm:w-80 lg:w-96" />
      <Skeleton className="mt-6 h-8 w-56" />
      <Skeleton className="mt-8 h-5 w-44" />
    </div>
    <div className="flex flex-col items-center pb-20" aria-hidden="true">
      <Skeleton className="h-[2.7rem] w-80 max-w-[80%]" />
      <div className="mt-16 w-full max-w-xs px-4"><SkeletonReviewCard size="lg" /></div>
    </div>
  </div>
);

const GuidelinesShell = () => (
  <div aria-label="Loading guidelines">
    <TitleBlock lines={3} />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 pb-20" aria-hidden="true">
      <Skeleton className="h-[2.7rem] w-56" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="dex-panel" style={NEUTRAL}>
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-[2.6rem] h-[2.6rem] rounded-full shrink-0" />
              <Skeleton className="h-[1.65rem] w-32" />
            </div>
            <PanelLines rows={2} />
            <div className="pt-4 flex justify-end"><Skeleton className="h-4 w-10" /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutShell = () => (
  <div aria-label="Loading about">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center" aria-hidden="true">
      <div className="lg:col-span-7">
        <Skeleton className="h-[5.4rem] sm:h-[6.75rem] lg:h-[8.1rem] w-4/5 max-w-md" />
        <Skeleton className="mt-3 h-4 sm:h-5 w-64" />
        <div className="mt-8 max-w-xl space-y-4">
          <PanelLines rows={4} />
          <PanelLines rows={4} />
          <PanelLines rows={2} />
        </div>
        <div className="mt-9 flex gap-4 flex-wrap">
          <Skeleton className="h-[3.2rem] w-56 rounded-full" />
          <Skeleton className="h-[3.2rem] w-40 rounded-full" />
          <Skeleton className="h-[3.2rem] w-44 rounded-full" />
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col items-center gap-4">
        <Skeleton className="w-full max-w-[21rem] aspect-[21/31] rounded-2xl" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" aria-hidden="true">
      <div className="lg:col-span-5 dex-panel" style={NEUTRAL}>
        <Skeleton className="h-[1.65rem] w-24 mb-4" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="dex-row"><Skeleton className="h-3 w-16 mt-1" /><Skeleton className="h-5 w-28" /></div>
        ))}
      </div>
      <div className="lg:col-span-7 space-y-8">
        <div className="dex-panel" style={NEUTRAL}><Skeleton className="h-[1.65rem] w-28 mb-4" /><PanelLines rows={4} /></div>
        <div className="dex-panel" style={NEUTRAL}><Skeleton className="h-[1.65rem] w-44 mb-4" /><PanelLines rows={3} /></div>
      </div>
    </div>
  </div>
);

const ContactShell = () => (
  <div aria-label="Loading contact">
    <TitleBlock />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" aria-hidden="true">
      <div className="lg:col-span-7 dex-panel !p-6 sm:!p-8" style={NEUTRAL}>
        <Skeleton className="h-[1.65rem] w-44" />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
        <Skeleton className="mt-5 h-12 rounded-lg" />
        <Skeleton className="mt-5 h-48 rounded-lg" />
        <Skeleton className="mt-6 h-[3.2rem] w-48 rounded-full" />
      </div>
      <div className="lg:col-span-5 space-y-8">
        <div className="dex-panel" style={NEUTRAL}>
          <Skeleton className="h-[1.65rem] w-20 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="dex-row"><Skeleton className="h-3 w-16 mt-1" /><Skeleton className="h-5 w-40" /></div>
          ))}
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="dex-panel flex items-center gap-4" style={NEUTRAL}>
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-52 mt-2" /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminLoginShell = () => (
  <div className="min-h-[80vh] grid place-items-center px-4 py-16" aria-label="Loading sign in">
    <div className="w-full max-w-md" aria-hidden="true">
      <div className="flex flex-col items-center mb-10">
        <Skeleton className="h-[2.4rem] w-60" />
        <Skeleton className="h-4 w-36 mt-3" />
      </div>
      <div className="panel-framed p-7">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="mt-2 h-12 rounded-lg mb-5" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-12 rounded-lg mb-7" />
        <Skeleton className="h-12 rounded-full" />
      </div>
    </div>
  </div>
);

const AdminShell = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-label="Loading admin">
    <div aria-hidden="true">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div><Skeleton className="h-[2.5rem] w-72" /><Skeleton className="h-4 w-48 mt-2" /></div>
        <div className="flex gap-2"><Skeleton className="h-10 w-28 rounded-full" /><Skeleton className="h-10 w-36 rounded-full" /></div>
      </div>
      <Skeleton className="h-[17rem] rounded-2xl mb-8" />
      <Skeleton className="h-11 rounded-lg mb-6" />
      <div className="rounded-2xl border border-honey overflow-hidden">
        <Skeleton className="h-11" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-t border-honey">
            <Skeleton className="w-10 h-10 rounded-md shrink-0" />
            <Skeleton className="h-5 w-1/3" />
            <span className="flex-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CenteredShell = () => (
  <div className="min-h-[70vh] grid place-items-center px-4" aria-label="Loading page">
    <div className="w-full max-w-md flex flex-col items-center" aria-hidden="true">
      <Skeleton className="h-3 w-10" />
      <Skeleton className="mt-3 h-[2.6rem] sm:h-[3.1rem] w-72" />
      <Skeleton className="mt-4 h-5 w-80 max-w-full" />
      <Skeleton className="mt-8 h-12 w-40 rounded-full" />
    </div>
  </div>
);

const ROUTE_SHELLS = [
  [/^\/reviews\/[^/]+\/?$/, ReviewDetailShell],
  [/^\/reviews\/?$/, ReviewsShell],
  [/^\/awards\/?$/, AwardsShell],
  [/^\/year-in-gaming(\/[^/]+)?\/?$/, YearInGamingShell],
  [/^\/guidelines\/?$/, GuidelinesShell],
  [/^\/about\/?$/, AboutShell],
  [/^\/contact\/?$/, ContactShell],
  [/^\/admin\/login\/?$/, AdminLoginShell],
  [/^\/admin\/?$/, AdminShell],
];

export const RouteSkeleton = ({ pathname }) => {
  const match = ROUTE_SHELLS.find(([pattern]) => pattern.test(pathname));
  const Shell = match ? match[1] : CenteredShell;
  return (
    <div data-testid="route-skeleton" className="min-h-[calc(100vh_-_4rem)]">
      <Shell />
    </div>
  );
};
