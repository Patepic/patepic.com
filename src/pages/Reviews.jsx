import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { MascotNote, Wordmark } from "../components/ui/decor";
import { ReviewCard } from "../components/ReviewCard";
import { PlatformIcon } from "../components/PlatformIcon";
import { fetchReviews } from "../lib/api";
import { TIERS, getTier, getTierColor, getTierLabel } from "../lib/tier";
import { ReviewsDataSkeleton } from "../components/ui/skeleton";
import { usePageTitle } from "../hooks/usePageTitle";

const SORTS = ["recent", "oldest", "score-desc", "score-asc", "a-z"];
const VERDICTS = ["all", "recommended", "avoid"];
const TIER_SLUG = { "★": "favorite", "S+": "splus", "S": "s", "A": "a", "B": "b", "C": "c", "D": "d", "F": "f" };

const parseTiers = (param) => {
  const slugs = param.split(",");
  return TIERS.filter((t) => slugs.includes(TIER_SLUG[t]));
};

let restoreChecked = false;

const openedFromRestoredTab = () => {
  if (restoreChecked) return false;
  restoreChecked = true;
  return performance.getEntriesByType("navigation")[0]?.type === "back_forward";
};

export default function Reviews() {
  usePageTitle("Reviews");
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    if (openedFromRestoredTab() && window.location.search) setParams({}, { replace: true });
  }, [setParams]);

  const setParam = useCallback((changes) => {
    const next = new URLSearchParams(window.location.search);
    if (!("page" in changes)) next.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  }, [setParams]);

  const query = params.get("q") || "";
  const platformParam = params.get("platform") || "";
  const genreParam = params.get("genre") || "";
  const tierParam = params.get("tier") || "";
  const sort = SORTS.includes(params.get("sort")) ? params.get("sort") : "recent";
  const verdict = VERDICTS.includes(params.get("verdict")) ? params.get("verdict") : "all";
  const requestedPage = Math.max(1, parseInt(params.get("page"), 10) || 1);
  const selectedGenres = useMemo(() => (genreParam ? [genreParam] : []), [genreParam]);
  const pickedTiers = useMemo(() => parseTiers(tierParam), [tierParam]);
  const tierFiltered = pickedTiers.length > 0 && pickedTiers.length < TIERS.length;
  const selectedTiers = tierFiltered ? pickedTiers : TIERS;

  const setQuery = (value) => setParam({ q: value });
  const setSelectedGenres = (list) => setParam({ genre: list[0] || "" });
  const toggleTier = (tier) => {
    const live = parseTiers(new URLSearchParams(window.location.search).get("tier") || "");
    const picked = live.length < TIERS.length ? live : [];
    const next = picked.includes(tier) ? picked.filter((t) => t !== tier) : [...picked, tier];
    const list = TIERS.filter((t) => next.includes(t));
    setParam({ tier: list.length < TIERS.length ? list.map((t) => TIER_SLUG[t]).join(",") : "" });
  };
  const setSort = (value) => setParam({ sort: value === "recent" ? "" : value });
  const setVerdict = (value) => setParam({ verdict: value === "all" ? "" : value });
  const setPage = (next) => {
    const value = typeof next === "function" ? next(page) : next;
    setParam({ page: value > 1 ? String(value) : "" });
  };
  const PAGE_SIZE = 12;

  useEffect(() => { fetchReviews().then((d) => setAllReviews(Array.isArray(d) ? d : (d?.items ?? []))).finally(() => setLoading(false)); }, []);

  const PLATFORMS = useMemo(() => [...new Set(allReviews.map((r) => r.platform).filter(Boolean))].sort(), [allReviews]);
  const pickedPlatforms = useMemo(() => PLATFORMS.filter((p) => platformParam.split(",").includes(p)), [PLATFORMS, platformParam]);
  const platformFiltered = pickedPlatforms.length > 0 && pickedPlatforms.length < PLATFORMS.length;
  const togglePlatform = (platform) => {
    const live = (new URLSearchParams(window.location.search).get("platform") || "").split(",");
    const picked = PLATFORMS.filter((p) => live.includes(p));
    const current = picked.length < PLATFORMS.length ? picked : [];
    const next = current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform];
    setParam({ platform: next.length < PLATFORMS.length ? PLATFORMS.filter((p) => next.includes(p)).join(",") : "" });
  };
  const GENRES = useMemo(() => [...new Set(allReviews.flatMap((r) => Array.isArray(r.genre) ? r.genre : [r.genre]))].filter(Boolean).sort(), [allReviews]);

  const filtered = useMemo(() => {
    let res = allReviews.filter((r) => {
      const q = query.trim().toLowerCase();
      const title = (r.title || "").toLowerCase();
      const platform = (r.platform || "").toLowerCase();
      const genres = Array.isArray(r.genre) ? r.genre : r.genre ? [r.genre] : [];
      const genreText = genres.join(" ").toLowerCase();
      if (q && !title.includes(q) && !platform.includes(q) && !genreText.includes(q)) return false;
      if (platformFiltered && !pickedPlatforms.includes(r.platform)) return false;
      if (selectedGenres.length && !genres.some((g) => selectedGenres.includes(g))) return false;
      if (!selectedTiers.includes(getTier(r.rating, r))) return false;
      if (verdict === "recommended" && r.recommended !== "yes") return false;
      if (verdict === "avoid" && r.recommended !== "no") return false;
      return true;
    });
    if (sort === "recent") res = [...res].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (sort === "oldest") res = [...res].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    if (sort === "score-desc") res = [...res].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (sort === "score-asc") res = [...res].sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    if (sort === "a-z") res = [...res].sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [allReviews, query, platformFiltered, pickedPlatforms, selectedGenres, selectedTiers, sort, verdict]);

  const latestReview = useMemo(() => [...allReviews].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0], [allReviews]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearAll = () => setParam({ q: "", platform: "", genre: "", tier: "", verdict: "", sort: "" });
  const activeCount = (platformFiltered ? 1 : 0) + selectedGenres.length + (tierFiltered ? 1 : 0) + (query ? 1 : 0) + (verdict !== "all" ? 1 : 0);

  return (
    <div>
      <div className="relative pb-20 md:pb-28">
        <section className="relative pt-12 lg:pt-16">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Wordmark text="Reviews" tag="every review" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-charcoal-brown" tagClassName="text-charcoal-brown/70" />
            <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-charcoal-brown">
              Every game I've finished, written up in full. Filter by verdict,
              platform, genre or tier. Newest reviews show first unless you change the order.
            </p>
            <p className="mt-2 min-h-[1.5em] text-sm sm:text-base leading-relaxed text-charcoal-brown">
              {latestReview?.date && (
                <>
                  The latest one is{" "}
                  <Link to={`/reviews/${latestReview.slug}`} className="hl underline decoration-orange decoration-2 underline-offset-4">{latestReview.title}</Link>
                  , from {latestReview.date}.
                </>
              )}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="game-panel p-5 sm:p-7 corner-ticks">
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-brown/85" />
                <Input placeholder="Search reviews…" value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 h-12 bg-white border-honey text-charcoal-brown placeholder:text-charcoal-brown/70" />
              </div>
              <Select value={verdict} onValueChange={setVerdict}>
                <SelectTrigger aria-label="Verdict" className="md:w-44 h-12 bg-white border-honey text-charcoal-brown"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-honey text-charcoal-brown">
                  <SelectItem value="all">All verdicts</SelectItem>
                  <SelectItem value="recommended">✓ Recommended</SelectItem>
                  <SelectItem value="avoid">✕ Avoid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedGenres[0] ?? "all"} onValueChange={(v) => setSelectedGenres(v === "all" ? [] : [v])}>
                <SelectTrigger aria-label="Genre" className="md:w-44 h-12 bg-white border-honey text-charcoal-brown"><SelectValue placeholder="All genres" /></SelectTrigger>
                <SelectContent className="bg-white border-honey text-charcoal-brown">
                  <SelectItem value="all">All genres</SelectItem>
                  {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger aria-label="Sort order" className="md:w-44 h-12 bg-white border-honey text-charcoal-brown"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-honey text-charcoal-brown">
                  <SelectItem value="recent">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="score-desc">Highest score</SelectItem>
                  <SelectItem value="score-asc">Lowest score</SelectItem>
                  <SelectItem value="a-z">A → Z</SelectItem>
                </SelectContent>
              </Select>
              <button onClick={() => setMobileFilters(!mobileFilters)}
                className="md:hidden pill pill-outline h-12 px-5 text-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-charcoal-brown text-white text-sm">{activeCount}</span>}
              </button>
            </div>

            <div className={`relative mt-6 flex-wrap xl:flex-nowrap justify-between gap-x-8 gap-y-6 ${mobileFilters ? "flex" : "hidden md:flex"}`}>
              <div>
                <p className="eyebrow mb-3">Platform</p>
                <div className="flex gap-1 flex-wrap" role="group" aria-label="Filter by platform">
                  {PLATFORMS.map((platform) => {
                    const on = !platformFiltered || pickedPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        aria-pressed={platformFiltered && on}
                        aria-label={platform}
                        title={platform}
                        className={`platform-chip${platformFiltered ? (on ? " is-on" : " is-off") : ""}`}
                      >
                        <PlatformIcon platform={platform} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-3">Tiers</p>
                <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by tier">
                  {TIERS.map((tier) => {
                    const on = selectedTiers.includes(tier);
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => toggleTier(tier)}
                        aria-pressed={on}
                        aria-label={getTierLabel(tier)}
                        title={getTierLabel(tier)}
                        style={{ "--tier-color": getTierColor(tier) }}
                        className={`h-9 min-w-9 px-2 rounded-full grid place-items-center text-[0.8rem] font-extrabold text-charcoal-brown border-2 transition-colors ${
                          on ? "bg-[var(--tier-color)] border-tier-ink text-tier-ink" : "bg-white border-[color-mix(in_srgb,var(--tier-color)_62%,var(--color-tier-ink))] hover:bg-[color-mix(in_srgb,var(--tier-color)_30%,var(--color-soft-white))]"
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
          <div className="mb-6 min-h-9 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-charcoal-brown/85">
              {loading ? "Loading reviews…" : (
                filtered.length === 0 ? "No reviews to show" : <>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} reviews</>
              )}
            </p>
            {(activeCount > 0 || sort !== "recent") && (
              <button onClick={clearAll} className="pill pill-outline h-9 px-4 text-sm">
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <ReviewsDataSkeleton />
          ) : filtered.length === 0 ? (
            <div className="border border-honey bg-white p-12 text-center">
              <p className="display-heading text-2xl text-charcoal-brown mb-2">No reviews match those filters.</p>
              <MascotNote className="mt-6 justify-center">Try changing or clearing the filters.</MascotNote>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-xs sm:max-w-none mx-auto">
                {paginated.map((r) => <ReviewCard key={r.slug} review={r} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="pill pill-outline h-9 px-4 text-sm disabled:opacity-30">← Prev</button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…"); acc.push(p); return acc; }, [])
                      .map((p, i) => p === "…" ? (
                        <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-charcoal-brown">…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p)}
                          className={`h-9 w-9 rounded-md text-sm font-bold transition-colors ${page === p ? "bg-charcoal-brown text-white" : "bg-white border border-honey text-charcoal-brown"}`}>{p}</button>
                      ))}
                  </div>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="pill pill-outline h-9 px-4 text-sm disabled:opacity-30">Next →</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
