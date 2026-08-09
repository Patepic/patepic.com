import { Link } from "react-router-dom";
import { Star, Gamepad2, ChevronRight, Layers } from "lucide-react";

const fallback =
  "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg";

export function SeriesMarathon({ seriesMarathons }) {
  if (!seriesMarathons || seriesMarathons.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      {/* Divider */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex-1 h-px bg-pixel-mint" />
        <Layers className="w-5 h-5 text-pixel-black" />
        <div className="flex-1 h-px bg-pixel-mint" />
      </div>

      <div className="mb-12">
        <p className="text-sm tracking-[0.06em] uppercase text-pixel-black mb-3">
          Series marathons
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-pixel-black tracking-tight">
          Franchise Deep Dives
        </h2>
        <p className="mt-4 text-pixel-black max-w-2xl">
          When I find a series I love, I really commit. These are the franchises
          where I played <strong className="text-pixel-black">5 or more</strong> games in 2026.
        </p>
      </div>

      <div className="space-y-16">
        {seriesMarathons.map(({ series, games, count }) => (
          <div key={series} className="group">
            {/* Series header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-pixel-mint border border-pixel-teal flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-pixel-black" />
              </div>
              <div>
                <h3 className="font-display text-xl lg:text-2xl text-pixel-black tracking-tight group-hover:text-pixel-pink transition-colors">
                  {series}
                </h3>
                <p className="text-sm text-pixel-black mt-0.5">
                  {count} games played this year
                </p>
              </div>
            </div>

            {/* Horizontal scrollable card gallery */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent -mx-4 px-4">
                {games.map((game) => {
                  const cover = game.cover_url
                    ? game.cover_url.startsWith("http")
                      ? game.cover_url
                      : `https://${game.cover_url}`
                    : fallback;
                  const genres = Array.isArray(game.genre)
                    ? game.genre
                    : game.genre
                    ? game.genre.split(",").map((g) => g.trim())
                    : [];

                  return (
                    <Link
                      key={game.slug}
                      to={`/reviews/${game.slug}`}
                      className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start group/card"
                    >
                      <div className="bg-pixel-blush border border-pixel-teal rounded-2xl overflow-hidden  hover:shadow-lg transition-all duration-300 h-full">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={cover}
                            alt={game.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-pixel-black/40 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pixel-blush text-sm font-bold text-pixel-black">
                              <Star className="w-3 h-3 text-pixel-black" />
                              {game.rating}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-display text-sm text-pixel-black group-hover/card:text-pixel-pink transition-colors leading-snug">
                            {game.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-[0.75rem] uppercase tracking-wider text-pixel-black flex-wrap">
                            {game.platform && (
                              <span className="inline-flex items-center gap-1">
                                <Gamepad2 className="w-3 h-3" />
                                {game.platform}
                              </span>
                            )}
                            {genres.slice(0, 2).map((g) => (
                              <span key={g}>{g}</span>
                            ))}
                          </div>
                          <div className="text-[0.75rem] text-pixel-black mt-2">
                            {game.date}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/* Scroll hint */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-full bg-gradient-to-l from-pixel-mint to-transparent pointer-events-none lg:block hidden" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}