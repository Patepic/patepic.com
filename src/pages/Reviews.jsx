import React, { useEffect, useMemo, useState } from "react";
import { Skeleton, SkeletonReviewListing } from "../components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Kicker } from "../components/ui/decor";
import { ReviewListing } from "../components/ReviewListing";
import { fetchReviews } from "../lib/api";

export default function Reviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [scoreRange, setScoreRange] = useState([1, 10]);
  const [sort, setSort] = useState("recent");
  const [verdict, setVerdict] = useState("all");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => { fetchReviews().then((d) => setAllReviews(Array.isArray(d) ? d : (d?.items ?? []))).finally(() => setLoading(false)); }, []);
  useEffect(() => { setPage(1); }, [query, selectedPlatforms, selectedGenres, scoreRange, sort, verdict]);

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
      const rating = Number(r.rating || 0);
      if (rating < scoreRange[0] || rating > scoreRange[1]) return false;
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
  }, [allReviews, query, selectedPlatforms, selectedGenres, scoreRange, sort, verdict]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearAll = () => { setQuery(""); setSelectedPlatforms([]); setSelectedGenres([]); setScoreRange([1, 10]); setVerdict("all"); setPage(1); };
  const activeCount = selectedPlatforms.length + selectedGenres.length + (scoreRange[0] !== 1 || scoreRange[1] !== 10 ? 1 : 0) + (query ? 1 : 0) + (verdict !== "all" ? 1 : 0);

  return (
    <div>
      <div className="relative bg-pixel-blush pb-24 lg:pb-32">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 text-center">
          <Kicker>Every finished playthrough</Kicker>
          <h1 className="display-heading -mt-1 text-5xl sm:text-6xl lg:text-7xl text-pixel-black">Reviews</h1>
          <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-pixel-black/70">
            Every finished playthrough, written up in full. Filter by platform, genre or score range —
            sorted newest first unless you say otherwise.
          </p>
        </section>

        {/* ── Filter panel ── */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="panel-framed rounded-2xl p-5 sm:p-7">
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pixel-black" />
                <Input placeholder="Search by title, platform, or genre…" value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 h-12 bg-pixel-white border-pixel-teal text-pixel-black placeholder:text-pixel-black/40" />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="md:w-56 h-12 bg-pixel-white border-pixel-teal text-pixel-black"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-pixel-white border-pixel-teal">
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
                {activeCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-pixel-forest text-pixel-blush text-sm">{activeCount}</span>}
              </button>
            </div>

            <div className={`relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 ${mobileFilters ? "block" : "hidden md:grid"}`}>
              <div>
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black mb-3">Verdict</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "recommended", label: "✓ Recommended" },
                    { value: "avoid", label: "✕ Avoid" },
                  ].map(({ value, label }) => (
                    <button key={value} onClick={() => setVerdict(value)}
                      className={`pill h-8 px-3.5 text-[0.7rem] ${verdict === value ? "pill-ember" : "pill-outline"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black mb-3">Platform</p>
                <Select value={selectedPlatforms[0] ?? "all"} onValueChange={(v) => setSelectedPlatforms(v === "all" ? [] : [v])}>
                  <SelectTrigger className="w-full bg-pixel-white border-pixel-teal text-pixel-black"><SelectValue placeholder="All platforms" /></SelectTrigger>
                  <SelectContent className="bg-pixel-white border-pixel-teal">
                    <SelectItem value="all">All platforms</SelectItem>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black mb-3">Genre</p>
                <Select value={selectedGenres[0] ?? "all"} onValueChange={(v) => setSelectedGenres(v === "all" ? [] : [v])}>
                  <SelectTrigger className="w-full bg-pixel-white border-pixel-teal text-pixel-black"><SelectValue placeholder="All genres" /></SelectTrigger>
                  <SelectContent className="bg-pixel-white border-pixel-teal">
                    <SelectItem value="all">All genres</SelectItem>
                    {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-pixel-black mb-3">Score: {scoreRange[0]} – {scoreRange[1]}</p>
                <Slider min={1} max={10} step={1} value={scoreRange} onValueChange={setScoreRange} />
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

        {/* ── Listings (event-card layout) ── */}
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
          <div className="mb-6 text-sm font-bold uppercase tracking-[0.06em] text-pixel-black">
            {loading ? <Skeleton className="h-4 w-48" /> : (
              <>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} reviews</>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (<SkeletonReviewListing key={i} />))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="panel-framed rounded-2xl p-12 text-center">
              <p className="display-heading text-2xl text-pixel-black mb-2">No reviews match those filters.</p>
              <p className="text-sm text-pixel-black/70">Try widening the score range or clearing filters.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginated.map((r) => <ReviewListing key={r.slug} review={r} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="pill pill-outline h-9 px-4 text-sm disabled:opacity-30">← Prev</button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…"); acc.push(p); return acc; }, [])
                      .map((p, i) => p === "…" ? (
                        <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-pixel-black">…</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p)}
                          className={`h-9 w-9 rounded-full text-sm font-bold transition-colors ${page === p ? "bg-pixel-forest text-pixel-blush" : "bg-pixel-mint border border-pixel-black/10 text-pixel-black"}`}>{p}</button>
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
