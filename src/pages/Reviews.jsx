import React, { useEffect, useMemo, useState } from "react";
import { ReviewCard } from "../components/ReviewCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../components/ui/input";
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
  const [verdict, setVerdict] = useState("all"); // "all" | "recommended" | "avoid"
  const [mobileFilters, setMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    fetchReviews()
      .then((d) => setAllReviews(Array.isArray(d) ? d : (d?.items ?? [])))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, selectedPlatforms, selectedGenres, scoreRange, sort, verdict]);

  const PLATFORMS = useMemo(
    () =>
      [...new Set(allReviews.map((r) => r.platform).filter(Boolean))].sort(),
    [allReviews],
  );
  const GENRES = useMemo(
    () =>
      [
        ...new Set(
          allReviews.flatMap((r) =>
            Array.isArray(r.genre) ? r.genre : [r.genre],
          ),
        ),
      ]
        .filter(Boolean)
        .sort(),
    [allReviews],
  );

  const toggle = (list, setList, value) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const filtered = useMemo(() => {
    let res = allReviews.filter((r) => {
      const q = query.trim().toLowerCase();

      const title = (r.title || "").toLowerCase();
      const platform = (r.platform || "").toLowerCase();

      const genres = Array.isArray(r.genre)
        ? r.genre
        : r.genre
          ? [r.genre]
          : [];

      const genreText = genres.join(" ").toLowerCase();

      if (
        q &&
        !title.includes(q) &&
        !platform.includes(q) &&
        !genreText.includes(q)
      ) {
        return false;
      }

      if (selectedPlatforms.length && !selectedPlatforms.includes(r.platform)) {
        return false;
      }

      if (
        selectedGenres.length &&
        !genres.some((g) => selectedGenres.includes(g))
      ) {
        return false;
      }

      const rating = Number(r.rating || 0);

      if (rating < scoreRange[0] || rating > scoreRange[1]) {
        return false;
      }

      if (verdict === "recommended" && r.recommended !== "yes") return false;
      if (verdict === "avoid" && r.recommended !== "no") return false;

      return true;
    });

    if (sort === "recent") {
      res = [...res].sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
      );

    }
    if (sort === "oldest") {
      res = [...res].sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0),
      );
    }

    if (sort === "score-desc") {
      res = [...res].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
      );
    }

    if (sort === "score-asc") {
      res = [...res].sort(
        (a, b) => Number(a.rating || 0) - Number(b.rating || 0),
      );
    }

    if (sort === "a-z") {
      res = [...res].sort((a, b) => a.title.localeCompare(b.title));
    }

    return res;
  }, [allReviews, query, selectedPlatforms, selectedGenres, scoreRange, sort, verdict]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAll = () => {
    setQuery("");
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setScoreRange([0, 10]);
    setVerdict("all");
    setPage(1);
  };

  const activeCount =
    selectedPlatforms.length +
    selectedGenres.length +
    (scoreRange[0] !== 0 || scoreRange[1] !== 10 ? 1 : 0) +
    (query ? 1 : 0) +
    (verdict !== "all" ? 1 : 0);

  return (
    <div
      data-testid="reviews-page"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
    >
      <div className="mb-12">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-3">
          The catalogue
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tighter">
          Every review, one search.
        </h1>
        <p className="mt-4 text-slate-500 max-w-2xl">
          Filter by platform, genre or score range. Sorted by recency unless you
          say otherwise.
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
          <SelectTrigger
            data-testid="reviews-sort-select"
            className="md:w-56 h-12 bg-white border-slate-200 text-slate-700"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 text-slate-700">
            <SelectItem value="recent">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
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
              <button
                onClick={clearAll}
                data-testid="reviews-clear-filters"
                className="text-xs text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <FilterGroup label="Verdict">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All" },
                { value: "recommended", label: "✓ Recommended" },
                { value: "avoid", label: "✕ Avoid" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setVerdict(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    verdict === value
                      ? value === "recommended"
                        ? "bg-green-50 border-green-400 text-green-700"
                        : value === "avoid"
                        ? "bg-red-50 border-red-400 text-red-700"
                        : "bg-sky-50 border-sky-400 text-sky-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Platform">
            <Select
              value={selectedPlatforms[0] ?? "all"}
              onValueChange={(v) => setSelectedPlatforms(v === "all" ? [] : [v])}
            >
              <SelectTrigger className="w-full bg-white border-slate-200 text-slate-700">
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="all">All platforms</SelectItem>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup label="Genre">
            <Select
              value={selectedGenres[0] ?? "all"}
              onValueChange={(v) => setSelectedGenres(v === "all" ? [] : [v])}
            >
              <SelectTrigger className="w-full bg-white border-slate-200 text-slate-700">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="all">All genres</SelectItem>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup label={`Score: ${scoreRange[0]} – ${scoreRange[1]}`}>
            <Slider
              data-testid="filter-score-range"
              min={0}
              max={10}
              step={1}
              value={scoreRange}
              onValueChange={setScoreRange}
              className="mt-2"
            />
          </FilterGroup>
        </aside>

        <div className="md:col-span-9">
          <div
            className="mb-5 text-sm text-slate-500"
            data-testid="reviews-result-count"
          >
            {loading ? (
              "Loading…"
            ) : (
              <>
                Showing{" "}
                <span className="text-slate-900 font-medium">
                  {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-medium">{filtered.length}</span>{" "}
                reviews
              </>
            )}
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-16 text-center bg-white">
              <p className="text-slate-700 font-display text-xl mb-2">
                No reviews match those filters.
              </p>
              <p className="text-slate-400 text-sm">
                Try widening the score range or clearing filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1">
                {paginated.map((r) => (
                  <ReviewCard key={r.slug} review={r} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "…" ? (
                          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-slate-400 text-sm">
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                              page === p
                                ? "bg-sky-600 text-white border border-sky-600"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const FilterGroup = ({ label, children }) => (
  <div>
    <p className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-4">
      {label}
    </p>
    <div className="space-y-3">{children}</div>
  </div>
);