export const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-shimmer bg-gradient-to-r from-pixel-teal/20 via-pixel-white to-pixel-teal/20 bg-[length:200%_100%] ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ lines = 1, className = "" }) => (
  <div className={`space-y-3 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 && lines > 1 ? "w-3/5" : "w-full"}`} />
    ))}
  </div>
);

export const SkeletonImage = ({ aspectRatio = "video", className = "" }) => {
  const ratio = aspectRatio === "square" ? "aspect-square" : "aspect-video";
  return <Skeleton className={`${ratio} w-full ${className}`} />;
};

/** Matches ReviewListing's shape: square thumbnail, two text lines, pill button. */
export const SkeletonReviewListing = () => (
  <div className="rounded-2xl border border-pixel-black/10 bg-pixel-mint p-3 sm:p-4 flex items-center gap-4" aria-hidden="true">
    <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
    <Skeleton className="h-9 sm:h-10 w-24 rounded-lg shrink-0" />
  </div>
);

export const HomeDataSkeleton = () => (
  <div data-testid="home-data-skeleton" className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (<SkeletonReviewListing key={i} />))}
  </div>
);

export const ReviewsDataSkeleton = () => (
  <div data-testid="reviews-data-skeleton" className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (<SkeletonReviewListing key={i} />))}
  </div>
);

export const SkeletonTierCards = ({ count = 4 }) => (
  <div className="flex flex-wrap gap-3">
    {Array.from({ length: count }).map((_, j) => (
      <div key={j} className="flex items-center gap-3 bg-pixel-white border border-pixel-black/10 rounded-xl p-2 w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]">
        <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const TierListDataSkeleton = () => (
  <div data-testid="tier-list-data-skeleton" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
    {Array.from({ length: 5 }).map((_, t) => (
      <div key={t} className="rounded-2xl border border-pixel-black/10 bg-pixel-white p-5 space-y-4">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <SkeletonTierCards />
      </div>
    ))}
  </div>
);

export const ReviewDetailDataSkeleton = () => (
  <div data-testid="review-detail-data-skeleton" className="bg-pixel-blush">
    <section className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <div className="md:hidden mb-6"><SkeletonImage aspectRatio="video" /></div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4" /><SkeletonText lines={3} />
        </div>
        <div className="hidden md:block w-1/2"><SkeletonImage aspectRatio="video" /></div>
      </div>
      <div className="mt-14 space-y-4 max-w-4xl mx-auto">
        <SkeletonText lines={8} /><Skeleton className="h-4 w-3/4 mt-6" /><SkeletonText lines={6} />
      </div>
      <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-pixel-black/10 bg-pixel-white p-6 space-y-3">
          <Skeleton className="h-3 w-16" />
          {Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-4 w-full" />))}
        </div>
        <div className="rounded-2xl border border-pixel-black/10 bg-pixel-white p-6 space-y-3">
          <Skeleton className="h-3 w-16" />
          {Array.from({ length: 2 }).map((_, i) => (<Skeleton key={i} className="h-4 w-full" />))}
        </div>
      </div>
    </section>
  </div>
);
