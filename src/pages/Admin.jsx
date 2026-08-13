import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Save,
  X as XIcon,
  Image as ImageIcon,
  Search,
  RefreshCw,
  ArrowUpRight,
  Clock,
  Trophy,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  fetchReviews,
  adminCreateReview,
  adminUpdateReview,
  adminDeleteReview,
  adminUploadImage,
  errorMessage,
} from "../lib/api";

const AWARD_OPTIONS = [
  "Game of the Year",
  "Best Game Direction",
  "Best Narrative",
  "Best Art Direction",
  "Best Soundtrack",
  "Hidden Gem",
  "Biggest Surprise",
  "Biggest Disappointment",
  "Most Innovative",
  "Best Replayability",
  "Best Boss Fights",
  "Series Standout",
  "Best Gameplay",
  "Most Fun",
  "Best Ending",
];

const blank = {
  title: "",
  platform: "",
  genre: [""],
  rating: "",
  date: "",
  summary: "",
  body: "",
  cover_url: "",
  recommended: null,
  contentType: null,
  pros: [""],
  cons: [""],
  isFeatured: false,
  playTime: "",
  awards: [],
};

export default function Admin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("none");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const PLATFORMS = useMemo(
    () => [...new Set(reviews.map((r) => r.platform).filter(Boolean))].sort(),
    [reviews],
  );
  const GENRES = useMemo(
    () => [...new Set(reviews.map((r) => r.genre).filter(Boolean))].sort(),
    [reviews],
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews();
      setReviews(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

const filtered = useMemo(() => {
  const items = reviews.filter((r) =>
    !query
      ? true
      : r.title.toLowerCase().includes(query.toLowerCase())
  );

  if (sort === "title-asc") {
    return [...items].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sort === "title-desc") {
    return [...items].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }

  if (sort === "rating-desc") {
    return [...items].sort(
      (a, b) =>
        (parseFloat(b.rating) || 0) -
        (parseFloat(a.rating) || 0)
    );
  }

  if (sort === "rating-asc") {
    return [...items].sort(
      (a, b) =>
        (parseFloat(a.rating) || 0) -
        (parseFloat(b.rating) || 0)
    );
  }

  return items;
}, [reviews, query, sort]);

const paginated = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filtered.slice(start, end);
}, [filtered, page]);

  const handleSaved = () => {
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await adminDeleteReview(deleting.slug);
      toast.success(`Deleted "${deleting.title}"`);
      setDeleting(null);
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <div
      data-testid="admin-page"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs tracking-[0.06em] uppercase text-gold mb-2">
            Control room
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-off-white tracking-tight">
            Reviews dashboard
          </h1>
          <p className="text-sm text-off-white/60 mt-1">
            {loading
              ? "Loading…"
              : `${reviews.length} reviews in the database.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            data-testid="admin-refresh"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface border border-off-white/15 hover:border-gold text-sm text-off-white/80"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setEditing({ ...blank })}
            data-testid="admin-new-review"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-scarlet text-off-white filter hover:brightness-90 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New review
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-off-white/40" />
        <Input
          placeholder="Filter by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="admin-filter-input"
          className="pl-11 h-11 bg-surface border-off-white/15 text-off-white"
        />
      </div>

      <div className="rounded-2xl border border-off-white/15 bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-crimson/20 text-off-white/60 text-xs tracking-[0.06em] uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() =>
                  setSort((s) => {
                    if (s === "title-asc") return "title-desc";
                    if (s === "title-desc") return "none";
                    return "title-asc";
                  })
                }
                  className="hover:text-off-white"
                >
                  TITLE
                  {sort === "title-asc" && " ↑"}
                  {sort === "title-desc" && " ↓"}
                </button>
              </th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">
                Platform
              </th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                Content Type
              </th>
              <th className="text-left px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() =>
                    setSort((s) => {
                      if (s === "rating-desc") return "rating-asc";
                      if (s === "rating-asc") return "none";
                      return "rating-desc";
                    })
                  }
                  className="hover:text-off-white"
                >
                  RATING
                  {sort === "rating-desc" && " ↓"}
                  {sort === "rating-asc" && " ↑"}
                </button>
              </th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-off-white/40">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-off-white/40">
                  No reviews match.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={r.slug}
                  data-testid={`admin-row-${r.slug}`}
                  className="border-t border-off-white/10 hover:bg-crimson/10"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {r.cover_url ? (
                        <img
                          src={r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover bg-crimson/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-crimson/20 grid place-items-center text-off-white/40">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-display text-off-white flex items-center gap-2">
                          {r.title}
                          {r.isFeatured && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gold/20 text-gold border border-gold/30">
                              ★ Gold
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-off-white/40">{Array.isArray(r.genre) ? r.genre.join(" · ") : r.genre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-off-white/70 hidden sm:table-cell">
                    {r.platform}
                  </td>
                  <td className="px-5 py-3 text-off-white/70 hidden md:table-cell">
                    {{
                      remake: "Remake",
                      remaster: "Remaster",
                      show: "Enhanced",
                      dlc: "DLC",
                    }[r.contentType] || "Original"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold border border-gold/30">
                      {r.rating}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/reviews/${r.slug}`}
                        title="View review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-off-white/10 text-off-white/60"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setEditing(r)}
                        title="Edit review"
                        data-testid={`admin-edit-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-gold/10 text-gold"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        title="Delete review"
                        data-testid={`admin-delete-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-scarlet/10 text-scarlet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 h-9 rounded-full border border-off-white/15 text-off-white/70 text-sm disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-sm text-off-white/60">
          Page {page} of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        </div>

        <button
          onClick={() =>
            setPage((p) =>
              p < Math.ceil(filtered.length / PAGE_SIZE) ? p + 1 : p
            )
          }
          disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
          className="px-4 h-9 rounded-full border border-off-white/15 text-off-white/70 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <ReviewEditor
        review={editing}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
        platforms={PLATFORMS}
        genres={GENRES}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
      >
        <AlertDialogContent className="bg-surface border-off-white/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-off-white">
              Delete this review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-off-white/60">
              "{deleting?.title}" will be permanently removed. This can't be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="admin-delete-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="admin-delete-confirm"
              onClick={handleDelete}
              className="bg-scarlet text-off-white filter hover:brightness-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ReviewEditor({ review, onClose, onSaved, platforms, genres }) {
  const isOpen = !!review;
  const isEdit = !!(review && review.slug);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const fileInput = useRef(null);
  const initialSnapshot = useRef("");

  useEffect(() => {
    if (review) {
      const hydrated = {
        ...blank,
        ...review,
        isFeatured: !!review.isFeatured,
        pros: review.pros?.length ? review.pros : [""],
        cons: review.cons?.length ? review.cons : [""],
        awards: review.awards?.length ? review.awards : [],
      };
      setForm(hydrated);
      initialSnapshot.current = JSON.stringify(hydrated);
    }
  }, [review]);

  if (!isOpen) return null;

  const isDirty = () => JSON.stringify(form) !== initialSnapshot.current;

  const requestClose = () => {
    if (isDirty()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setListItem = (key, i, v) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].map((x, idx) => (idx === i ? v : x)),
    }));
  const addListItem = (key) =>
    setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  const removeListItem = (key, i) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const hideAwardsAndPlaytime = form.date.includes("2025");

  const canSubmit = isEdit || (
    !!form.title.trim() &&
    !!form.platform.trim() &&
    form.genre.some((g) => g.trim()) &&
    !!form.rating.trim() &&
    !!form.date.trim() &&
    !!form.summary.trim() &&
    !!form.body.trim() &&
    form.pros.some((p) => p.trim()) &&
    form.cons.some((c) => c.trim())
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const res = await adminUploadImage(file, setUploadProgress);
      set("cover_url", res.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const doSave = async () => {
    setShowCreateConfirm(false);
    setSaving(true);
    const payload = {
      ...form,
      isFeatured: form.isFeatured,
      pros: form.pros.map((s) => s.trim()).filter(Boolean),
      cons: form.cons.map((s) => s.trim()).filter(Boolean),
      recommended: form.recommended || null,
      contentType: form.contentType || null,
      playTime: form.playTime?.trim ? form.playTime.trim() : form.playTime,
      awards: (form.awards || []).filter(Boolean),
    };
    try {
      if (isEdit) {
        await adminUpdateReview(review.slug, payload);
        toast.success("Review updated");
      } else {
        await adminCreateReview(payload);
        toast.success("Review created");
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isEdit) {
      setShowCreateConfirm(true);
      return;
    }
    doSave();
  };

  const usedAwards = (excludeIndex) =>
    form.awards.filter((a, i) => i !== excludeIndex && a);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && requestClose()}>
      <DialogContent className="bg-surface border-off-white/15 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-off-white">
            {isEdit ? `Edit · ${review.title}` : "New review"}
          </DialogTitle>
          <DialogDescription className="text-off-white/60">
            Recommended and Content Type are dropdowns. All other fields are
            free text.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5 mt-2">
          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-gold">
              Image
            </Label>
            <div className="mt-2 flex gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-crimson/20 border border-off-white/15 overflow-hidden grid place-items-center text-off-white/40 flex-shrink-0">
                {form.cover_url ? (
                  <img
                    src={form.cover_url.startsWith("http") ? form.cover_url : `https://${form.cover_url}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-scarlet text-off-white filter hover:brightness-90 disabled:opacity-60 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? `Uploading ${uploadProgress}%` : "Upload image"}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Input
                  placeholder="…or paste an image URL"
                  value={form.cover_url}
                  onChange={(e) => set("cover_url", e.target.value)}
                  className="h-10 bg-surface border-off-white/15 text-off-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldText
              label="Title"
              required
              value={form.title}
              onChange={(v) => set("title", v)}
              testId="admin-field-title"
            />
            <FieldText
              label="Platform"
              required
              value={form.platform}
              onChange={(v) => set("platform", v)}
              testId="admin-field-platform"
            />
          </div>

          <ListEditor
            label="Genre"
            required
            items={form.genre}
            onChange={(i, v) => setListItem("genre", i, v)}
            onAdd={() => addListItem("genre")}
            onRemove={(i) => removeListItem("genre", i)}
            testId="admin-genre"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldText
              label="Rating"
              required
              value={form.rating}
              onChange={(v) => set("rating", v)}
              testId="admin-field-rating"
            />
            <FieldText
              label="Date"
              required
              value={form.date}
              onChange={(v) => set("date", v)}
              testId="admin-field-date"
            />
          </div>

          {!hideAwardsAndPlaytime && (
            <div>
              <Label className="text-xs tracking-[0.06em] uppercase text-gold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Play Time
              </Label>
              <Input
                value={form.playTime || ""}
                onChange={(e) => set("playTime", e.target.value)}
                data-testid="admin-field-playtime"
                placeholder="e.g. 24 hours"
                className="mt-2 h-10 bg-surface border-off-white/15 text-off-white"
              />
            </div>
          )}

          {!hideAwardsAndPlaytime && (
            <AwardsEditor
              items={form.awards}
              onChange={(i, v) => setListItem("awards", i, v)}
              onAdd={() => addListItem("awards")}
              onRemove={(i) => removeListItem("awards", i)}
              usedAwards={usedAwards}
            />
          )}

          <ClearableField label="Recommended">
            <Select
              value={form.recommended ?? ""}
              onValueChange={(v) => set("recommended", v)}
            >
              <SelectTrigger
                data-testid="admin-field-recommended"
                className="h-10 bg-surface border-off-white/15 text-off-white"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-off-white/15 text-off-white">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {!!form.recommended && (
              <button
                type="button"
                onClick={() => set("recommended", "")}
                aria-label="Clear recommended"
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-off-white/50 hover:bg-off-white/10 hover:text-off-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </ClearableField>

          <ClearableField label="Content Type">
            <Select
              value={form.contentType ?? ""}
              onValueChange={(v) => set("contentType", v)}
            >
              <SelectTrigger
                data-testid="admin-field-contentType"
                className="h-10 bg-surface border-off-white/15 text-off-white"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-off-white/15 text-off-white">
                <SelectItem value="remake">Remake</SelectItem>
                <SelectItem value="remaster">Remaster</SelectItem>
                <SelectItem value="show">Enhanced</SelectItem>
                <SelectItem value="dlc">DLC</SelectItem>
              </SelectContent>
            </Select>
            {!!form.contentType && (
              <button
                type="button"
                onClick={() => set("contentType", "")}
                aria-label="Clear content type"
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-off-white/50 hover:bg-off-white/10 hover:text-off-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </ClearableField>

          <div className="flex items-center justify-between p-4 rounded-xl border border-off-white/15 bg-crimson/10">
            <div>
              <Label className="text-xs tracking-[0.06em] uppercase text-gold">
                Gold Standard
              </Label>
              <p className="text-xs text-off-white/60 mt-0.5">
                Pin this as the featured game on the homepage
              </p>
            </div>
            <button
              type="button"
              data-testid="admin-field-isFeatured"
              onClick={() => set("isFeatured", !form.isFeatured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isFeatured ? "bg-scarlet" : "bg-off-white/15"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-off-white shadow transition-transform ${
                  form.isFeatured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-gold">
              Summary *
            </Label>
            <Input
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              data-testid="admin-field-summary"
              placeholder="One sentence summary..."
              className="mt-2 h-10 bg-surface border-off-white/15 text-off-white"
            />
          </div>

          <ListEditor
            label="Pros"
            required
            items={form.pros}
            onChange={(i, v) => setListItem("pros", i, v)}
            onAdd={() => addListItem("pros")}
            onRemove={(i) => removeListItem("pros", i)}
            testId="admin-pros"
          />

          <ListEditor
            label="Cons"
            required
            items={form.cons}
            onChange={(i, v) => setListItem("cons", i, v)}
            onAdd={() => addListItem("cons")}
            onRemove={(i) => removeListItem("cons", i)}
            testId="admin-cons"
          />

          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-gold">
              Review Body (Markdown) *
            </Label>
            <Textarea
              rows={16}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              data-testid="admin-field-body"
              placeholder="Write your review here."
              className="mt-2 bg-surface border-off-white/15 text-off-white resize-y text-sm font-mono"
            />
            <p className="mt-2 text-xs text-off-white/60">
              Supports Markdown headings, lists, links, bold, italics,
              blockquotes, and code blocks.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={requestClose}
              className="px-5 h-10 rounded-full bg-surface border border-off-white/15 hover:bg-off-white/5 text-sm text-off-white/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-save-review"
              disabled={saving || !canSubmit}
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-scarlet text-off-white filter hover:brightness-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-off-white/40 border-t-off-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />{" "}
                  {isEdit ? "Save changes" : "Create review"}
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="bg-surface border-off-white/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-off-white">
              Discard unsaved changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-off-white/60">
              You have unsaved changes on this review. Closing now will lose
              them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCloseConfirm(false);
                onClose();
              }}
              className="bg-scarlet text-off-white filter hover:brightness-90"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCreateConfirm} onOpenChange={setShowCreateConfirm}>
        <AlertDialogContent className="bg-surface border-off-white/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-off-white">
              Create this review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-off-white/60">
              "{form.title || "Untitled"}" will be published to the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={doSave}
              className="bg-scarlet text-off-white filter hover:brightness-90"
            >
              Create review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

/** Label + control row with room for a trailing clear button. */
const ClearableField = ({ label, children }) => (
  <div>
    <Label className="text-xs tracking-[0.06em] uppercase text-gold">
      {label}
    </Label>
    <div className="mt-2 flex items-center gap-2">{children}</div>
  </div>
);

const FieldText = ({ label, value, onChange, required, testId }) => (
  <div>
    <Label className="text-xs tracking-[0.06em] uppercase text-gold">
      {label}
      {required ? " *" : ""}
    </Label>
    <Input
      value={value || ""}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="mt-2 h-10 bg-surface border-off-white/15 text-off-white"
    />
  </div>
);

const ListEditor = ({
  label,
  items,
  onChange,
  onAdd,
  onRemove,
  required,
  testId,
}) => (
  <div data-testid={testId}>
    <div className="flex items-center justify-between mb-2">
      <Label className="text-xs tracking-[0.06em] uppercase text-gold">
        {label}{required ? " *" : ""}
      </Label>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-gold hover:text-off-white inline-flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={it}
            onChange={(e) => onChange(i, e.target.value)}
            className="h-10 bg-surface border-off-white/15 text-off-white"
            placeholder={`${label} item`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${label} item`}
              className="w-9 h-9 grid place-items-center rounded-full text-off-white/50 hover:bg-off-white/10 hover:text-off-white"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

/** Array editor for Game Awards — each row is a dropdown (not free text),
    already-picked awards are excluded from the other rows' options, and
    every row can be cleared with the X button so a stray click never
    permanently sticks an award onto the review. */
const AwardsEditor = ({ items, onChange, onAdd, onRemove, usedAwards }) => (
  <div data-testid="admin-awards">
    <div className="flex items-center justify-between mb-2">
      <Label className="text-xs tracking-[0.06em] uppercase text-gold flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5" /> Game Awards
      </Label>
      <button
        type="button"
        onClick={onAdd}
        data-testid="admin-awards-add"
        className="text-xs text-gold hover:text-off-white inline-flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add award
      </button>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-off-white/50">No awards added.</p>
    ) : (
      <div className="space-y-2">
        {items.map((value, i) => {
          const taken = new Set(usedAwards(i));
          return (
            <div key={i} className="flex items-center gap-2">
              <Select value={value || ""} onValueChange={(v) => onChange(i, v)}>
                <SelectTrigger
                  data-testid={`admin-awards-select-${i}`}
                  className="h-10 bg-surface border-off-white/15 text-off-white"
                >
                  <SelectValue placeholder="Select an award…" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-off-white/15 text-off-white">
                  {AWARD_OPTIONS.filter((opt) => opt === value || !taken.has(opt)).map(
                    (opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove award"
                className="w-9 h-9 shrink-0 grid place-items-center rounded-full text-off-white/50 hover:bg-off-white/10 hover:text-off-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
