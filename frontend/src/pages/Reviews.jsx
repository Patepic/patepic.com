import React, { useEffect, useMemo, useState } from "react";
import { ReviewCard } from "../components/ReviewCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { fetchReviews } from "../lib/api";

export default function Reviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [scoreRange, setScoreRange] = useState([0, 10]);
  const [sort, setSort] = useState("recent");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    fetchReviews()
      .then((d) => setAllReviews(Array.isArray(d) ? d : d?.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const PLATFORMS = useMemo(() => [...new Set(allReviews.map((r) => r.platform).filter(Boolean))].sort(), [allReviews]);
  const GENRES = useMemo(() => [...new Set(allReviews.map((r) => r.genre).filter(Boolean))].sort(), [allReviews]);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    let res = allReviews.filter((r) => {
      const q = query.trim().toLowerCase();
      if (q && !r.title.toLowerCase().includes(q) && !r.studio.toLowerCase().includes(q) && !r.genre.toLowerCase().includes(q))
        return false;
      if (selectedPlatforms.length && !selectedPlatforms.includes(r.platform)) return false;
      if (selectedGenres.length && !selectedGenres.includes(r.genre)) return false;
      if (r.score < scoreRange[0] || r.score > scoreRange[1]) return false;
      return true;
    });
    if (sort === "recent") res = res.sort((a, b) => b.year - a.year);
    if (sort === "score-desc") res = res.sort((a, b) => b.score - a.score);
    if (sort === "score-asc") res = res.sort((a, b) => a.score - b.score);
    if (sort === "a-z") res = res.sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [allReviews, query, selectedPlatforms, selectedGenres, scoreRange, sort]);

  const clearAll = () => {
    setQuery("");
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setScoreRange([0, 10]);
  };

  const activeCount =
    selectedPlatforms.length +
    selectedGenres.length +
    (scoreRange[0] !== 0 || scoreRange[1] !== 10 ? 1 : 0) +
    (query ? 1 : 0);

  return (
    <div data-testid="reviews-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="mb-12">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-3">The catalogue</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tighter">
          Every review, one search.
        </h1>
        <p className="mt-4 text-slate-500 max-w-2xl">
          Filter by platform, genre or score range. Sorted by recency unless you say otherwise.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            data-testid="reviews-search-input"
            placeholder="Search by title, studio, or genre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-sky-400"
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger data-testid="reviews-sort-select" className="md:w-56 h-12 bg-white border-slate-200 text-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 text-slate-700">
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="score-desc">Highest score</SelectItem>
            <SelectItem value="score-asc">Lowest score</SelectItem>
            <SelectItem value="a-z">A → Z</SelectItem>
          </SelectContent>
        </Select>

        <button
          data-testid="reviews-mobile-filter-toggle"
          onClick={() => setMobileFilters(!mobileFilters)}
          className="md:hidden inline-flex items-center justify-center gap-2 h-12 px-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-sky-600 text-white text-xs font-medium">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside
          data-testid="reviews-filters"
          className={`md:col-span-3 space-y-8 ${mobileFilters ? "block" : "hidden md:block"}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-slate-900">Filters</h3>
            {activeCount > 0 && (
              <button onClick={clearAll} data-testid="reviews-clear-filters" className="text-xs text-sky-700 hover:text-sky-900 inline-flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <FilterGroup label="Platform">
            {PLATFORMS.map((p) => (
              <label key={p} className="flex items-center gap-2.5 text-sm cursor-pointer group">
                <Checkbox
                  data-testid={`filter-platform-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  checked={selectedPlatforms.includes(p)}
                  onCheckedChange={() => toggle(selectedPlatforms, setSelectedPlatforms, p)}
                  className="border-slate-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 data-[state=checked]:text-white"
                />
                <span className="text-slate-600 group-hover:text-slate-900">{p}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup label="Genre">
            {GENRES.map((g) => (
              <label key={g} className="flex items-center gap-2.5 text-sm cursor-pointer group">
                <Checkbox
                  data-testid={`filter-genre-${g.toLowerCase()}`}
                  checked={selectedGenres.includes(g)}
                  onCheckedChange={() => toggle(selectedGenres, setSelectedGenres, g)}
                  className="border-slate-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 data-[state=checked]:text-white"
                />
                <span className="text-slate-600 group-hover:text-slate-900">{g}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup label={`Score: ${scoreRange[0].toFixed(1)} – ${scoreRange[1].toFixed(1)}`}>
            <Slider data-testid="filter-score-range" min={0} max={10} step={0.5} value={scoreRange} onValueChange={setScoreRange} className="mt-2" />
          </FilterGroup>
        </aside>

        <div className="md:col-span-9">
          <div className="mb-5 text-sm text-slate-500" data-testid="reviews-result-count">
            {loading ? "Loading…" : (
              <>Showing <span className="text-slate-900 font-medium">{filtered.length}</span> of {allReviews.length} reviews</>
            )}
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-16 text-center bg-white">
              <p className="text-slate-700 font-display text-xl mb-2">No reviews match those filters.</p>
              <p className="text-slate-400 text-sm">Try widening the score range or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <ReviewCard key={r.slug} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FilterGroup = ({ label, children }) => (
  <div>
    <p className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-4">{label}</p>
    <div className="space-y-3">{children}</div>
  </div>
);