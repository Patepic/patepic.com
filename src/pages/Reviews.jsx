import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Diamond } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { MascotNote, SetInfoBanner, Wordmark } from "../components/ui/decor";
import { ReviewCard } from "../components/ReviewCard";
import { fetchReviews } from "../lib/api";
import { TIERS, getTier, getTierColor, getTierLabel } from "../lib/tier";
import { ReviewsDataSkeleton } from "../components/ui/skeleton";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Reviews() {
  usePageTitle("Reviews");
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [sort, setSort] = useState("recent");
  const [verdict, setVerdict] = useState("all");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => { fetchReviews().then((d) => setAllReviews(Array.isArray(d) ? d : (d?.items ?? []))).finally(() => setLoading(false)); }, []);
  useEffect(() => { setPage(1); }, [query, selectedPlatforms, selectedGenres, selectedTiers, sort, verdict]);

  const PLATFORMS = useMemo(() => [...new Set(allReviews.map((r) => r.platform).filter(Boolean))].sort(), [allReviews]);
  const GENRES = useMemo(() => [...new Set(allReviews.flatMap((r) => Array.isArray(r.genre) ? r.genre : [r.genre]))].filter(Boolean).sort(), [allReviews]);

  const filtered = useMemo(() => {
    let res = allReviews.filter((r) => {
      const q = query.trim().toLowerCase();
      const title = (r.title || "").toLowerCase();
      const platform = (r.platform || "").toLowerCase();
      const genres = Array.isArray(r.genre) ? r.genre : r.genre ? [r.genre] : [];
      const genreText = genres.join(" ").toLowerCase();
      if (q && !title.includes(q) && !platform.includes(q) && !genreText.includes(q)) return false;
      if (selectedPlatforms.length && !selectedPlatforms.includes(r.platform)) return false;
      if (selectedGenres.length && !genres.some((g) => selectedGenres.includes(g))) return false;
      if (selectedTiers.length && !selectedTiers.includes(getTier(r.rating, r))) return false;
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
  }, [allReviews, query, selectedPlatforms, selectedGenres, selectedTiers, sort, verdict]);

  const latestReview = useMemo(() => [...allReviews].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0], [allReviews]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearAll = () => { setQuery(""); setSelectedPlatforms([]); setSelectedGenres([]); setSelectedTiers([]); setVerdict("all"); setPage(1); };
  const activeCount = selectedPlatforms.length + selectedGenres.length + (selectedTiers.length && selectedTiers.length < TIERS.length ? 1 : 0) + (query ? 1 : 0) + (verdict !== "all" ? 1 : 0);

  return (
    <div>
      <div className="relative pb-20 md:pb-28">
        <section className="relative pt-12 lg:pt-16">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Wordmark text="Reviews" tag="every review" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-void" tagClassName="text-void/50" />
            <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-ink">
              Every finished playthrough, written up in full. Sort by platform,
              genre, or score range. Newest reviews show first unless you change the order.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <SetInfoBanner
            emblem={<Diamond className="w-5 h-5" />}
            name="All Reviews"
            stats={[
              { label: "Reviews", value: loading ? "…" : allReviews.length },
              { label: "Latest", value: loading ? "…" : (latestReview?.date || "N/A") },
            ]}
          />
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="game-panel p-5 sm:p-7 corner-ticks">
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void/65" />
                <Input placeholder="Search by title, platform, or genre…" value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 h-12 bg-bone border-hairline text-void placeholder:text-void/45" />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="md:w-56 h-12 bg-bone border-hairline text-void"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-bone border-hairline text-void">
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
                {activeCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-jade text-mint text-sm">{activeCount}</span>}
              </button>
            </div>

            <div className={`relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 ${mobileFilters ? "grid" : "hidden md:grid"}`}>
              <div>
                <p className="eyebrow mb-3">Verdict</p>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "recommended", label: "✓ Recommended" },
                    { value: "avoid", label: "✕ Avoid" },
                  ].map(({ value, label }) => (
                    <button key={value} onClick={() => setVerdict(value)}
                      className={`pill h-8 px-3.5 text-[0.7rem] ${verdict === value ? "pill-jade" : "pill-outline"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-3">Platform</p>
                <Select value={selectedPlatforms[0] ?? "all"} onValueChange={(v) => setSelectedPlatforms(v === "all" ? [] : [v])}>
                  <SelectTrigger className="w-full bg-bone border-hairline text-void"><SelectValue placeholder="All platforms" /></SelectTrigger>
                  <SelectContent className="bg-bone border-hairline text-void">
                    <SelectItem value="all">All platforms</SelectItem>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="eyebrow mb-3">Genre</p>
                <Select value={selectedGenres[0] ?? "all"} onValueChange={(v) => setSelectedGenres(v === "all" ? [] : [v])}>
                  <SelectTrigger className="w-full bg-bone border-hairline text-void"><SelectValue placeholder="All genres" /></SelectTrigger>
                  <SelectContent className="bg-bone border-hairline text-void">
                    <SelectItem value="all">All genres</SelectItem>
                    {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <p className="eyebrow mb-3">
                  Tier: {selectedTiers.length && selectedTiers.length < TIERS.length ? TIERS.filter((t) => selectedTiers.includes(t)).map(getTierLabel).join(", ") : "All"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {TIERS.map((tier) => {
                    const on = selectedTiers.includes(tier);
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedTiers((cur) => (on ? cur.filter((t) => t !== tier) : [...cur, tier]))}
                        aria-pressed={on}
                        aria-label={getTierLabel(tier)}
                        title={getTierLabel(tier)}
                        style={{ "--tier-color": getTierColor(tier) }}
                        className={`h-9 min-w-9 px-2 rounded-full grid place-items-center text-[0.8rem] font-extrabold text-void border-2 transition-colors ${
                          on ? "bg-[var(--tier-color)] border-void" : "bg-bone border-[var(--tier-color)] hover:bg-[color-mix(in_srgb,var(--tier-color)_30%,var(--bone))]"
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-end">
                {activeCount > 0 && (
                  <button onClick={clearAll} className="pill pill-outline h-9 px-4 text-sm">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
          <div className="mb-6 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ash">
            {loading ? "Loading reviews…" : (
              <>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} reviews</>
            )}
          </div>

          {loading ? (
            <ReviewsDataSkeleton />
          ) : filtered.length === 0 ? (
            <div className="border border-hairline bg-bone p-12 text-center">
              <p className="display-heading text-2xl text-void mb-2">No reviews match those filters.</p>
              <p className="text-sm text-ink">Try widening the score range or clearing filters.</p>
              <MascotNote className="mt-6 justify-center">Try changing or clearing the filters.</MascotNote>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-void">…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p)}
                          className={`h-9 w-9 rounded-md text-sm font-bold transition-colors ${page === p ? "bg-jade text-mint" : "bg-bone border border-hairline text-void"}`}>{p}</button>
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
