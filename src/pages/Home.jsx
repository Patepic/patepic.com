import { Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { creator } from "../data/creator";
import { ReviewListing } from "../components/ReviewListing";
import { HomeDataSkeleton } from "../components/ui/skeleton";
import { SocialRow, SectionTitle, Kicker, StickerBadge } from "../components/ui/decor";
import { ArrowUpRight, Star, Gamepad2, Trophy, Twitch, Feather } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const { reviews, loading, error } = useReviews();
  if (error) return <HomeDataState title="Could not load reviews" />;

  const totalReviews = reviews.length;
  const averageScore = totalReviews ? (reviews.reduce((s, r) => s + (parseFloat(r.rating) || 0), 0) / totalReviews).toFixed(1) : "—";
  const platformCounts = reviews.reduce((acc, r) => { if (r.platform) acc[r.platform] = (acc[r.platform] || 0) + 1; return acc; }, {});
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const highestScore = reviews.length ? Math.max(...reviews.map((r) => parseFloat(r.rating) || 0)) : 0;
  const goldStandard = reviews.find((r) => r.isFeatured) || reviews.filter((r) => !Number.isNaN(parseFloat(r.rating))).find((r) => parseFloat(r.rating) === highestScore);
  const recent = useMemo(() => [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5), [reviews]);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-2xl animate-reveal">
            <div className="flex items-center gap-4">
              <StickerBadge icon={Feather} className="w-14 h-14 lg:w-16 lg:h-16" />
              <div>
                <Kicker tone="text-pixel-black">Hello, I&apos;m</Kicker>
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black/60">
                  Owl Sorcerer of Time
                </p>
              </div>
            </div>
            <h1 className="display-hero mt-4 text-3xl sm:text-4xl lg:text-6xl text-pixel-black">
              {creator.name}<span className="text-pixel-pink">.</span>
            </h1>
            <p className="display-heading mt-5 text-xl sm:text-2xl lg:text-3xl text-pixel-black">
              Reviewer, Streamer, VTuber
            </p>
            <p className="mt-8 max-w-lg text-sm sm:text-base leading-relaxed text-pixel-black/70">
              Long-form reviews from someone who finishes every game before saying a word about it.
              Catch the playthrough live, then read the verdict after the credits roll.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/reviews" className="pill pill-gold h-12 px-7 text-sm">
                Browse the catalogue <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="/guidelines" className="pill pill-outline h-12 px-7 text-sm">How I score</Link>
              {creator.isLive && (
                <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" className="pill pill-live h-12 px-7 text-sm">
                  <span className="w-2.5 h-2.5 bg-pixel-forest animate-blink" />
                  <Twitch className="w-4 h-4" /> Live now · {creator.liveGame}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Short teaser — the full bio lives on /about, this is just the hook ── */}
      <section className="relative pb-20 lg:pb-28">
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-chip text-lg sm:text-xl">Meet {creator.name}</div>

          <p className="mt-8 text-sm sm:text-base leading-[1.75] text-pixel-black/85">
            <span className="hl">Reviewer by day, VTuber by night</span> — the two feed each other. Nothing gets
            scored until the credits roll, and the same playthrough shows up here as a long-form review and on
            stream as full-length chaos.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/about" className="pill pill-ember h-11 px-6 text-sm">
              Meet the full {creator.name} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[0.06em] text-pixel-black mb-4">Follow me on socials!</p>
            <div className="flex justify-center"><SocialRow /></div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative bg-pixel-blush py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`bg-pixel-mint border border-pixel-black/10 shadow-pixel-sm rounded-2xl p-5 ${["md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-5"][i]}`}>
                <div className="animate-pulse bg-pixel-mint h-8 w-12 rounded-lg" />
              </div>
            )) : (
              <>
                <StatCard className="md:col-span-2 animate-reveal delay-1" label="Reviews" value={String(totalReviews).padStart(2, "0")} icon={<Feather className="w-4 h-4" />} testId="stat-total-reviews" />
                <StatCard className="md:col-span-2 animate-reveal delay-2" label="Average score" value={averageScore} icon={<Star className="w-4 h-4" />} testId="stat-average-score" />
                <StatCard className="md:col-span-3 animate-reveal delay-3" label="Top platform" value={topPlatform} icon={<Gamepad2 className="w-4 h-4" />} testId="stat-top-platform" />
                {goldStandard && (
                  <Link to={`/reviews/${goldStandard.slug}`} data-testid="stat-gold-standard" className="md:col-span-5 bg-pixel-mint border border-pixel-black/10 shadow-pixel-sm rounded-2xl p-5 animate-reveal delay-4 hover:border-pixel-teal transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold uppercase tracking-[0.06em] text-pixel-black">Gold standard</span>
                      <Trophy className="w-4 h-4 text-pixel-pink" />
                    </div>
                    <div className="display-hero text-2xl text-pixel-black">{goldStandard.title}</div>
                    <div className="text-sm font-bold text-pixel-black/60 mt-1">Scored {goldStandard.rating} / 10</div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Latest reviews ── */}
      <section className="relative bg-pixel-blush pb-20 lg:pb-28" data-testid="recent-reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <div className="magazine-rule mb-4"><span>Latest reviews</span></div>
              <SectionTitle>The verdict is in.</SectionTitle>
            </div>
            <Link to="/reviews" className="pill pill-outline h-10 px-5 text-sm">View all <ArrowUpRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <HomeDataSkeleton /> : recent[0] ? (
            <div className="space-y-4">
              {recent.map((r, i) => (
                <div key={r.slug} className="animate-reveal" style={{ animationDelay: `${0.1 * i}s` }}>
                  <ReviewListing review={r} />
                </div>
              ))}
            </div>
          ) : <HomeDataState title="No reviews found yet" compact />}
        </div>
      </section>

      {/* ── Method band ── */}
      <section className="relative pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto panel-framed rounded-2xl px-6 py-12 sm:px-12 lg:py-16">
            <div className="relative">
              <div className="magazine-rule mb-5"><span>The {creator.name} Method</span></div>
              <SectionTitle>No score until the credits roll.</SectionTitle>
              <p className="mt-6 leading-relaxed text-sm sm:text-base text-pixel-black/70">
                Every score comes from a finished playthrough. What you read is what I actually think.
              </p>
              <div className="mt-9 flex gap-3 flex-wrap justify-center">
                <Link to="/guidelines" className="pill pill-outline h-12 px-6 text-sm">Read the scoring guide</Link>
                <Link to="/contact" className="pill pill-gold h-12 px-6 text-sm">Get in touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ label, value, icon, className = "", testId }) => (
  <div data-testid={testId} className={`bg-pixel-mint border border-pixel-black/10 shadow-pixel-sm rounded-2xl p-5 ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-3">
      <span className="text-sm font-bold uppercase tracking-[0.06em] text-pixel-black">{label}</span>
      <span className="text-pixel-pink">{icon}</span>
    </div>
    <div className="display-hero text-3xl text-pixel-black break-words">{value}</div>
  </div>
);

const HomeDataState = ({ title, compact = false }) => (
  <div className={compact ? "bg-pixel-mint border border-pixel-black/10 shadow-pixel-sm rounded-2xl p-10 text-center" : "min-h-[70vh] grid place-items-center px-4 bg-pixel-blush"}>
    <div className="max-w-md text-center">
      <p className="text-sm font-bold uppercase tracking-[0.06em] text-pixel-black">Reviews unavailable</p>
      <h1 className="display-hero mt-3 text-3xl text-pixel-black">{title}</h1>
      <p className="mt-3 text-sm font-semibold text-pixel-black/70">Check the API connection and database, then refresh.</p>
    </div>
  </div>
);
