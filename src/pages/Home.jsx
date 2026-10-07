import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { useRecentVideos } from "../hooks/useRecentVideos";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { creator } from "../data/creator";
import { ReviewCard } from "../components/ReviewCard";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { HeroVideo, VideoCard } from "../components/VideoCard";
import { CreatorCard } from "../components/CreatorCard";
import { Wordmark, CapsuleButton, SocialRow, WaveDivider, ChipBackdrop, PokerChip, PageBackdrop } from "../components/ui/decor";
import { HomeDataSkeleton, SkeletonReviewCard, SkeletonVideoCard } from "../components/ui/skeleton";
import { ArrowUpRight, ArrowDown, BookOpen, Play, Sparkle, Trophy } from "lucide-react";
import { useMemo } from "react";
import { usePageTitle } from "../hooks/usePageTitle";

const HERO_SPARKLES = [
  ["hero-sparkle-1", true], ["hero-sparkle-2", false], ["hero-sparkle-3", false],
  ["hero-sparkle-4", false], ["hero-sparkle-5", true], ["hero-sparkle-6", false],
];

export default function Home() {
  usePageTitle(null);
  const { reviews, loading, error } = useReviews();
  const { latest: latestVideo, recent: recentVideos, channelUrl: videoChannelUrl, loading: videosLoading } = useRecentVideos();
  const highestScore = reviews.length ? Math.max(...reviews.map((r) => parseFloat(r.rating) || 0)) : 0;
  const goldStandard = reviews.find((r) => r.isFeatured) || reviews.filter((r) => !Number.isNaN(parseFloat(r.rating))).find((r) => parseFloat(r.rating) === highestScore);
  const recent = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).filter((r) => r.slug !== goldStandard?.slug).slice(0, 3),
    [reviews, goldStandard],
  );
  const nowPlayingRaw = useNowPlaying();
  const sameTitle = (a, b) => a.toLowerCase().replace(/[^a-z0-9]+/g, "") === b.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const nowPlaying = nowPlayingRaw && !reviews.some((r) => sameTitle(r.title || "", nowPlayingRaw.title)) ? nowPlayingRaw : null;
  const latestRow = nowPlaying ? recent.slice(0, 2) : recent;
  if (error) return <HomeDataState title="Could not load reviews" />;


  return (
    <div>
      <section className="hero relative overflow-x-clip">
        <div className="hero-bg" aria-hidden="true" />
        <PageBackdrop className="hero-backdrop" />
        <PokerChip className="hero-chip" />

        <div className="relative z-[1] flex flex-col items-center text-center px-4 pt-14 md:pt-20">
          <div className="relative">
            {HERO_SPARKLES.map(([cls, accent], i) => (
              <Sparkle key={i} aria-hidden="true" className={`hero-sparkle ${cls} ${accent ? "text-orange fill-orange" : "text-charcoal-brown"}`} />
            ))}
            <h1 className="wordmark hero-name">{creator.name}</h1>
          </div>
          <p className="hero-tagline">Reviewer · Streamer · VTuber</p>

          <a href={creator.pixie.url} target="_blank" rel="noopener noreferrer" className="hero-cta mt-8">
            <span className="hero-cta-bg" aria-hidden="true" />
            <span className="hero-cta-icon" aria-hidden="true"><Play className="w-5 h-5" fill="currentColor" /></span>
            <span className="hero-cta-label">Watch on Pixie</span>
          </a>

          <SocialRow className="hero-follow mt-7" />
        </div>

        <div className="relative z-[1] flex justify-center px-4 mt-12">
          <CreatorCard reviews={reviews} loading={loading} className="w-full max-w-[21rem] -rotate-2" />
        </div>

        <span className="hero-arrow hero-arrow-l" aria-hidden="true"><ArrowDown /></span>
        <span className="hero-arrow hero-arrow-r" aria-hidden="true"><ArrowDown /></span>
      </section>

      {(videosLoading || latestVideo) && (
        <>
          <div className="mt-24 mb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-md mx-auto">
              <Wordmark
                text="Latest Video"
                className="wordmark text-4xl sm:text-5xl text-charcoal-brown"
              />
              <p className="mt-2 text-sm text-charcoal-brown/70">My newest upload on {creator.pixie.url ? "the Pixie channel" : "the channel"}.</p>
            </div>
          </div>

          <section className="relative py-8 md:py-10 bg-[var(--color-straw)] overflow-x-clip">
            <WaveDivider color="var(--color-straw)" position="top" mirror />

            <div className="watch-row">
              <div className="watch-gutter py-20" aria-hidden="true"><span /><span /></div>
              <div className="watch-video relative isolate">
                <ChipBackdrop className="card-chips" />
                {latestVideo ? <HeroVideo video={latestVideo} className="w-full" /> : <SkeletonVideoCard size="lg" />}
              </div>
              <div className="watch-gutter py-20" aria-hidden="true"><span /><span /></div>
            </div>

            <WaveDivider color="var(--color-straw)" position="bottom" flip />
          </section>
        </>
      )}

      {(videosLoading || recentVideos.length > 0) && (
        <section className="relative pt-16 pb-4" data-testid="recent-videos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <Wordmark text="More Videos" className="wordmark text-4xl sm:text-5xl text-charcoal-brown" />
              <a href={videoChannelUrl || creator.youtube.url} target="_blank" rel="noopener noreferrer" className="pill pill-outline h-10 px-5 text-sm">
                See all videos <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="deal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosLoading
                ? Array.from({ length: 6 }, (_, i) => <SkeletonVideoCard key={i} />)
                : recentVideos.map((video) => <VideoCard key={video.id} video={video} />)}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-16 md:py-24" data-testid="featured-review">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <Wordmark text="Featured" tag="top pick" className="wordmark text-4xl sm:text-5xl text-charcoal-brown" tagClassName="text-charcoal-brown/70" />
            <Link to="/reviews" className="pill pill-outline h-10 px-5 text-sm">View all reviews <ArrowUpRight className="w-4 h-4" /></Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-4 max-w-xs mx-auto lg:mx-0 w-full">
              {loading ? (
                <SkeletonReviewCard size="lg" />
              ) : goldStandard ? (
                <ReviewCard review={goldStandard} size="lg" />
              ) : null}
            </div>

            <div className="lg:col-span-8">
              <p className="eyebrow mb-4">Latest reviews</p>
              {loading ? (
                <HomeDataSkeleton />
              ) : recent[0] || nowPlaying ? (
                <div className="deal card-fan grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xs sm:max-w-none mx-auto">
                  {nowPlaying && (
                    <div>
                      <NowPlayingCard game={nowPlaying} />
                    </div>
                  )}
                  {latestRow.map((r) => (
                    <div key={r.slug}>
                      <ReviewCard review={r} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-charcoal-brown/80">I haven't judged anything yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate py-20 md:py-28">
        <PageBackdrop className="section-backdrop section-backdrop-chip" chip />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wordmark
            text="My Approach"
            tag="no shortcuts"
            className="wordmark text-4xl sm:text-6xl text-charcoal-brown"
            tagClassName="text-charcoal-brown/70"
          />
          <p className="mt-7 mx-auto max-w-xl leading-relaxed text-sm sm:text-base text-charcoal-brown">
            I grade every review off a full playthrough. What you read is my actual verdict, with no
            early calls and no crowd-pleasing scores.
          </p>
          <div className="mt-9 flex gap-4 flex-wrap justify-center">
            <CapsuleButton as={Link} to="/guidelines" icon={BookOpen}>Read the guidelines</CapsuleButton>
            <CapsuleButton as={Link} to="/contact" icon={Trophy} className="pill-capsule-main">Get in touch</CapsuleButton>
          </div>

        </div>
      </section>
    </div>
  );
}

const HomeDataState = ({
  title,
  subtitle = "Check the API connection and database, then refresh.",
  eyebrow = "Reviews unavailable",
  compact = false,
}) => (
  <div className={compact ? "border border-honey bg-white p-10 text-center" : "min-h-[70vh] grid place-items-center px-4"}>
    <div className="max-w-md text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-hero mt-3 text-3xl text-charcoal-brown">{title}</h1>
      <p className="mt-3 text-sm font-semibold text-charcoal-brown/90">{subtitle}</p>
    </div>
  </div>
);
