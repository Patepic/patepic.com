import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import { Skeleton } from "../components/ui/skeleton";
import { Wordmark } from "../components/ui/decor";
import { PlatformIcon } from "../components/PlatformIcon";
import { PrideFlags } from "../components/PrideFlags";
import { usePageTitle } from "../hooks/usePageTitle";

const PAGE_SIZE = 12;

const safeUrl = (url) => (/^https?:\/\//i.test(url || "") ? url : null);

const CreditName = ({ name, url }) => {
  const href = safeUrl(url);
  if (!href) return <span>{name}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-orange decoration-2 underline-offset-4">
      {name} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
    </a>
  );
};

export default function Credits() {
  usePageTitle("Credits");
  const { reviews, loading } = useReviews();
  const [requestedPage, setPage] = useState(1);

  const artists = useMemo(() => {
    const byName = new Map();
    for (const review of reviews) {
      const name = (review.imageCredit || "").trim();
      if (!name) continue;
      const entry = byName.get(name.toLowerCase()) || { name, url: "", games: [] };
      entry.url = entry.url || safeUrl(review.imageCreditUrl) || "";
      entry.games.push(review);
      byName.set(name.toLowerCase(), entry);
    }
    return [...byName.values()]
      .filter((entry) => entry.url)
      .map((entry) => ({ ...entry, games: entry.games.sort((a, b) => a.title.localeCompare(b.title)) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(artists.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const pageArtists = artists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="relative">
      <section className="relative pt-12 lg:pt-16">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wordmark text="Credits" tag="the people behind the art" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-charcoal-brown" tagClassName="text-charcoal-brown/70" />
          <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-charcoal-brown">
            I didn't make the art on this site. Most of it is official game art or other people's work, and
            the only images that are mine are screenshots from my own gameplay. These are the artists whose
            work I'm using, with links to where you can find more of it.
          </p>
        </div>
      </section>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16 md:pb-24 space-y-8">
        <section className="dex-panel">
          <h2 className="dex-title">Site art</h2>
          <div className="dex-row items-center">
            <div className="dex-label !pt-0">Pixel icons</div>
            <div className="text-charcoal-brown">
              <CreditName name="Caz Wolf" url="https://cazwolf.itch.io/" />
              <p className="mt-1 text-sm text-charcoal-brown/85">The console icons and the pride flags.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {["GameCube", "Game Boy", "Switch", "SNES"].map((platform) => (
                  <PlatformIcon key={platform} platform={platform} />
                ))}
                <PrideFlags />
              </div>
            </div>
          </div>
        </section>

        <section className="dex-panel">
          <h2 className="dex-title">Review images</h2>
          {loading ? (
            <div className="space-y-3" aria-label="Loading credits">
              <Skeleton className="h-[1.42rem] w-full" />
              <Skeleton className="h-[1.42rem] w-4/5" />
              <Skeleton className="h-[1.42rem] w-3/5" />
            </div>
          ) : artists.length === 0 ? (
            <p className="text-sm text-charcoal-brown/90">
              I'm still adding these. Each review will credit the artist of its image as I go.
            </p>
          ) : (
            <>
              <dl>
                {pageArtists.map(({ name, url, games }) => (
                  <div key={name} className="dex-row">
                    <dt className="font-bold text-charcoal-brown"><CreditName name={name} url={url} /></dt>
                    <dd className="text-sm leading-relaxed text-charcoal-brown">
                      {games.length > 1 ? (
                        `Artwork used on ${games.length} reviews`
                      ) : (
                        <Link to={`/reviews/${games[0].slug}`} className="hover:text-orange transition-colors">{games[0].title}</Link>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pill pill-outline h-9 px-4 text-sm disabled:opacity-30">← Prev</button>
                  <span className="text-sm font-bold text-charcoal-brown">{page} / {totalPages}</span>
                  <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="pill pill-outline h-9 px-4 text-sm disabled:opacity-30">Next →</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
