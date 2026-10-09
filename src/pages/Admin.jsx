import { useEffect, useState, useRef, useMemo } from "react";
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
  Hourglass,
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
  adminGetNowPlaying,
  adminSetNowPlaying,
  adminClearNowPlaying,
  adminDiscardUpload,
  errorMessage,
} from "../lib/api";
import { AWARDS_START_YEAR, getYearFromDate } from "../lib/year";
import { usePageTitle } from "../hooks/usePageTitle";
import { DesktopOnly } from "../components/DesktopOnly";

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
  series: [""],
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
  imageCredit: "",
  imageCreditUrl: "",
  awards: [],
};

export default function Admin() {
  usePageTitle("Admin");
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
      const data = await fetchReviews({ fresh: Date.now() });
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
    <DesktopOnly>
    <div
      data-testid="admin-page"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal-brown tracking-tight">
            Reviews dashboard
          </h1>
          <p className="text-sm text-charcoal-brown/80 mt-1">
            {loading
              ? "Loading…"
              : `${reviews.length} reviews in the database.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            data-testid="admin-refresh"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-charcoal-brown/15 hover:border-honey text-sm text-charcoal-brown/90"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setEditing({ ...blank })}
            data-testid="admin-new-review"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-charcoal-brown text-white filter hover:brightness-90 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New review
          </button>
        </div>
      </div>

      <NowPlayingPanel />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-brown/65" />
        <Input
          placeholder="Filter by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="admin-filter-input"
          className="pl-11 h-11 bg-white border-charcoal-brown/15 text-charcoal-brown"
        />
      </div>

      <div className="rounded-2xl border border-charcoal-brown/15 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-charcoal-brown/20 text-charcoal-brown/80 text-xs tracking-[0.06em] uppercase">
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
                  className="hover:text-charcoal-brown"
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
                  className="hover:text-charcoal-brown"
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
                <td colSpan={5} className="py-10 text-center text-charcoal-brown/65">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-charcoal-brown/65">
                  No reviews match.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={r.slug}
                  data-testid={`admin-row-${r.slug}`}
                  className="hover:bg-charcoal-brown/10"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {r.cover_url ? (
                        <img
                          src={r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover bg-charcoal-brown/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-charcoal-brown/20 grid place-items-center text-charcoal-brown/65">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-display text-charcoal-brown flex items-center gap-2">
                          {r.title}
                          {r.isFeatured && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-mango-yellow/30 text-charcoal-brown border border-honey">
                              ★ Gold
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-charcoal-brown/65">{Array.isArray(r.genre) ? r.genre.join(" · ") : r.genre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-charcoal-brown/85 hidden sm:table-cell">
                    {r.platform}
                  </td>
                  <td className="px-5 py-3 text-charcoal-brown/85 hidden md:table-cell">
                    {{
                      remake: "Remake",
                      remaster: "Remaster",
                      show: "Enhanced",
                      dlc: "DLC",
                    }[r.contentType] || "Original"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-mango-yellow/30 text-charcoal-brown border border-honey">
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
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-charcoal-brown/10 text-charcoal-brown/80"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setEditing(r)}
                        title="Edit review"
                        data-testid={`admin-edit-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-mango-yellow/25 text-charcoal-brown/70"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        title="Delete review"
                        data-testid={`admin-delete-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-charcoal-brown/10 text-charcoal-brown"
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
          className="px-4 h-9 rounded-full border border-charcoal-brown/15 text-charcoal-brown/85 text-sm disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-sm text-charcoal-brown/80">
          Page {page} of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        </div>

        <button
          onClick={() =>
            setPage((p) =>
              p < Math.ceil(filtered.length / PAGE_SIZE) ? p + 1 : p
            )
          }
          disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
          className="px-4 h-9 rounded-full border border-charcoal-brown/15 text-charcoal-brown/85 text-sm disabled:opacity-40"
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
        <AlertDialogContent className="bg-white border-charcoal-brown/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-charcoal-brown">
              Delete this review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal-brown/80">
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
              className="bg-charcoal-brown text-white filter hover:brightness-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </DesktopOnly>
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
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInput = useRef(null);
  const previewUrlRef = useRef(null);
  const initialSnapshot = useRef("");

  useEffect(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPendingFile(null);
    setPreviewUrl(null);
    setUploading(false);
    setUploadProgress(0);
    setShowCloseConfirm(false);
    setShowCreateConfirm(false);
    if (review) {
      const hydrated = {
        ...blank,
        ...review,
        isFeatured: !!review.isFeatured,
        series: review.series?.length ? review.series : [""],
        pros: review.pros?.length ? review.pros : [""],
        cons: review.cons?.length ? review.cons : [""],
        awards: review.awards?.length ? review.awards : [],
      };
      setForm(hydrated);
      initialSnapshot.current = JSON.stringify(hydrated);
    }
  }, [review]);

  if (!isOpen) return null;

  const isDirty = () =>
    JSON.stringify(form) !== initialSnapshot.current || !!pendingFile;

  const requestClose = () => {
    setShowCloseConfirm(true);
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

  const dateYear = getYearFromDate(form.date);
  const awardsAllowed = dateYear !== null && dateYear >= AWARDS_START_YEAR;

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

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setPendingFile(file);
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPendingFile(null);
    setPreviewUrl(null);
    set("cover_url", "");
  };

  const doSave = async () => {
    setShowCreateConfirm(false);
    setSaving(true);
    try {
      let coverUrlToSave = form.cover_url;
      if (pendingFile) {
        setUploading(true);
        setUploadProgress(0);
        try {
          const res = await adminUploadImage(pendingFile, setUploadProgress);
          coverUrlToSave = res.url;
        } finally {
          setUploading(false);
          setUploadProgress(0);
        }
      }
      const safeAwards = (form.awards || [])
        .map((a) => (typeof a === "string" ? { name: a, explanation: "" } : a))
        .filter((a) => a && typeof a.name === "string" && a.name.trim())
        .map((a) => ({
          name: a.name.trim(),
          explanation: String(a.explanation || "").trim(),
        }));
      const awardYear = getYearFromDate(form.date);
      if (
        safeAwards.length > 0 &&
        (awardYear === null || awardYear < AWARDS_START_YEAR)
      ) {
        toast.error(
          `Game Awards are only available for reviews dated ${AWARDS_START_YEAR} or later.`
        );
        return;
      }
      const payload = {
        ...form,
        cover_url: coverUrlToSave,
        isFeatured: form.isFeatured,
        series: (form.series || []).map((s) => s.trim()).filter(Boolean),
        pros: form.pros.map((s) => s.trim()).filter(Boolean),
        cons: form.cons.map((s) => s.trim()).filter(Boolean),
        recommended: form.recommended || null,
        contentType: form.contentType || null,
        playTime: form.playTime?.trim ? form.playTime.trim() : form.playTime,
        imageCredit: (form.imageCredit || "").trim(),
        imageCreditUrl: (form.imageCreditUrl || "").trim(),
        awards: safeAwards,
      };
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
    form.awards
      .map((a) => (typeof a === "string" ? a : a?.name))
      .filter((a, i) => i !== excludeIndex && a);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && requestClose()}>
      <DialogContent className="bg-white border-charcoal-brown/15 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-charcoal-brown">
            {isEdit ? `Edit · ${review.title}` : "New review"}
          </DialogTitle>
          <DialogDescription className="text-charcoal-brown/80">
            Recommended and Content Type are dropdowns. All other fields are
            free text.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5 mt-2">
          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
              Image
            </Label>
            <div className="mt-2 flex gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-charcoal-brown/20 border border-charcoal-brown/15 overflow-hidden grid place-items-center text-charcoal-brown/65 flex-shrink-0">
                {previewUrl || form.cover_url ? (
                  <img
                    src={previewUrl || (form.cover_url.startsWith("http") ? form.cover_url : `https://${form.cover_url}`)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-charcoal-brown text-white filter hover:brightness-90 disabled:opacity-60 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading
                      ? `Uploading ${uploadProgress}%`
                      : previewUrl
                        ? "Replace image"
                        : "Upload image"}
                  </button>
                  {(previewUrl || form.cover_url) && (
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-charcoal-brown/15 hover:bg-charcoal-brown/5 text-sm text-charcoal-brown/90 disabled:opacity-60"
                    >
                      <XIcon className="w-4 h-4" /> Remove
                    </button>
                  )}
                </div>
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
                  className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
                />
                <Input
                  placeholder="Image credit (artist name)"
                  value={form.imageCredit || ""}
                  onChange={(e) => set("imageCredit", e.target.value)}
                  maxLength={120}
                  data-testid="admin-field-image-credit"
                  className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
                />
                <Input
                  placeholder="Artist link (optional, https://…)"
                  value={form.imageCreditUrl || ""}
                  onChange={(e) => set("imageCreditUrl", e.target.value)}
                  data-testid="admin-field-image-credit-url"
                  className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
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

          <ListEditor
            label="Series"
            items={form.series || [""]}
            onChange={(i, v) => setListItem("series", i, v)}
            onAdd={() => addListItem("series")}
            onRemove={(i) => removeListItem("series", i)}
            testId="admin-series"
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
              onChange={(v) => {
                set("date", v);
                const y = getYearFromDate(v);
                if (y === null || y < AWARDS_START_YEAR) {
                  setForm((f) => ({ ...f, awards: [] }));
                }
              }}
              testId="admin-field-date"
            />
          </div>

          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Play Time
            </Label>
            <Input
              value={form.playTime || ""}
              onChange={(e) => set("playTime", e.target.value)}
              data-testid="admin-field-playtime"
              placeholder="e.g. 24 hours"
              className="mt-2 h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
            />
          </div>

          {!awardsAllowed && (
            <p className="text-xs text-charcoal-brown/70">
              Game Awards are only available for reviews dated {AWARDS_START_YEAR} or later.
            </p>
          )}

          {awardsAllowed && (
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
                className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-white border-charcoal-brown/15 text-charcoal-brown">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {!!form.recommended && (
              <button
                type="button"
                onClick={() => set("recommended", "")}
                aria-label="Clear recommended"
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-charcoal-brown/70 hover:bg-charcoal-brown/10 hover:text-charcoal-brown"
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
                className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-white border-charcoal-brown/15 text-charcoal-brown">
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
                className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-charcoal-brown/70 hover:bg-charcoal-brown/10 hover:text-charcoal-brown"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </ClearableField>

          <div className="flex items-center justify-between p-4 rounded-xl border border-charcoal-brown/15 bg-charcoal-brown/10">
            <div>
              <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
                Gold Standard
              </Label>
              <p className="text-xs text-charcoal-brown/80 mt-0.5">
                Pin this as the featured game on the homepage
              </p>
            </div>
            <button
              type="button"
              data-testid="admin-field-isFeatured"
              onClick={() => set("isFeatured", !form.isFeatured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isFeatured ? "bg-charcoal-brown" : "bg-charcoal-brown/15"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.isFeatured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
              Summary *
            </Label>
            <Input
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              data-testid="admin-field-summary"
              placeholder="One sentence summary..."
              className="mt-2 h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
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
            <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
              Review Body (Markdown) *
            </Label>
            <Textarea
              rows={16}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              data-testid="admin-field-body"
              placeholder="Write your review here."
              className="mt-2 bg-white border-charcoal-brown/15 text-charcoal-brown resize-y text-sm font-mono"
            />
            <p className="mt-2 text-xs text-charcoal-brown/80">
              Supports Markdown headings, lists, links, bold,s,
              blockquotes, and code blocks.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={requestClose}
              className="px-5 h-10 rounded-full bg-white border border-charcoal-brown/15 hover:bg-charcoal-brown/5 text-sm text-charcoal-brown/90"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-save-review"
              disabled={saving || !canSubmit}
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-charcoal-brown text-white filter hover:brightness-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-charcoal-brown/40 border-t-honey rounded-full animate-spin" />
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
        <AlertDialogContent className="bg-white border-charcoal-brown/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-charcoal-brown">
              Discard unsaved changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal-brown/80">
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
              className="bg-charcoal-brown text-white filter hover:brightness-90"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCreateConfirm} onOpenChange={setShowCreateConfirm}>
        <AlertDialogContent className="bg-white border-charcoal-brown/15">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-charcoal-brown">
              Create this review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal-brown/80">
              "{form.title || "Untitled"}" will be published to the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={doSave}
              className="bg-charcoal-brown text-white filter hover:brightness-90"
            >
              Create review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

const ClearableField = ({ label, children }) => (
  <div>
    <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
      {label}
    </Label>
    <div className="mt-2 flex items-center gap-2">{children}</div>
  </div>
);

const FieldText = ({ label, value, onChange, required, testId }) => (
  <div>
    <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
      {label}
      {required ? " *" : ""}
    </Label>
    <Input
      value={value || ""}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="mt-2 h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
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
      <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70">
        {label}{required ? " *" : ""}
      </Label>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-charcoal-brown/70 hover:text-charcoal-brown inline-flex items-center gap-1"
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
            className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
            placeholder={`${label} item`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${label} item`}
              className="w-9 h-9 grid place-items-center rounded-full text-charcoal-brown/70 hover:bg-charcoal-brown/10 hover:text-charcoal-brown"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const toAwardEntry = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      name: typeof value.name === "string" ? value.name : "",
      explanation: typeof value.explanation === "string" ? value.explanation : "",
    };
  }
  return { name: typeof value === "string" ? value : "", explanation: "" };
};

const AwardsEditor = ({ items, onChange, onAdd, onRemove, usedAwards }) => (
  <div data-testid="admin-awards">
    <div className="flex items-center justify-between mb-2">
      <Label className="text-xs tracking-[0.06em] uppercase text-charcoal-brown/70 flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5" /> Game Awards
      </Label>
      <button
        type="button"
        onClick={onAdd}
        data-testid="admin-awards-add"
        className="text-xs text-charcoal-brown/70 hover:text-charcoal-brown inline-flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add award
      </button>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-charcoal-brown/70">No awards added.</p>
    ) : (
      <div className="space-y-3">
        {items.map((entry, i) => {
          const award = toAwardEntry(entry);
          const value = award.name;
          const taken = new Set(usedAwards(i));
          const update = (patch) => onChange(i, { ...award, ...patch });
          return (
            <div
              key={i}
              className="rounded-lg border border-charcoal-brown/15 bg-charcoal-brown/5 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Select value={value} onValueChange={(v) => update({ name: v })}>
                  <SelectTrigger
                    data-testid={`admin-awards-select-${i}`}
                    className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown"
                  >
                    <SelectValue placeholder="Select an award…" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-charcoal-brown/15 text-charcoal-brown">
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
                  className="w-9 h-9 shrink-0 grid place-items-center rounded-full text-charcoal-brown/70 hover:bg-charcoal-brown/10 hover:text-charcoal-brown"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <Textarea
                value={award.explanation}
                onChange={(e) => update({ explanation: e.target.value })}
                data-testid={`admin-awards-explain-${i}`}
                rows={3}
                placeholder={
                  value
                    ? `Why did this game win “${value}”? What does the award mean for it?`
                    : "Explain what this award means for this game…"
                }
                className="resize-y text-sm"
              />
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const emptyNowPlaying = { title: "", cover_url: "", platform: "", note: "" };

function NowPlayingPanel() {
  const [form, setForm] = useState(emptyNowPlaying);
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const lastUpload = useRef(null);

  useEffect(() => {
    adminGetNowPlaying()
      .then((data) => {
        if (data) {
          setSaved(data);
          setForm({ ...emptyNowPlaying, ...data });
        }
      })
      .catch((e) => toast.error(errorMessage(e)));
  }, []);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const dirty = !saved
    ? Boolean(form.title.trim())
    : ["title", "cover_url", "platform", "note"].some((k) => (form[k] || "") !== (saved[k] || ""));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (fileInput.current) fileInput.current.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadImage(file);
      const previous = form.cover_url;
      set("cover_url", res.url);
      if (previous && previous === lastUpload.current && previous !== saved?.cover_url) {
        adminDiscardUpload(previous).catch(() => {});
      }
      lastUpload.current = res.url;
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const data = await adminSetNowPlaying(form);
      setSaved(data);
      setForm({ ...emptyNowPlaying, ...data });
      toast.success(`Now playing: ${data.title}`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    setBusy(true);
    try {
      await adminClearNowPlaying();
      setSaved(null);
      setForm(emptyNowPlaying);
      toast.success("Now playing cleared");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const cover = form.cover_url ? (form.cover_url.startsWith("http") ? form.cover_url : `https://${form.cover_url}`) : null;

  return (
    <section className="rounded-2xl border border-charcoal-brown/15 bg-white p-5 sm:p-6 mb-8" data-testid="admin-now-playing">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-charcoal-brown" />
          <h2 className="font-display text-xl text-charcoal-brown">Now playing</h2>
          <span className="text-xs text-charcoal-brown/70">
            {saved ? "Showing on the homepage" : "Not set (shows your Twitch game while you're live)"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[7rem_1fr] gap-5">
        <div className="w-28 aspect-[4/3] rounded-md overflow-hidden border border-charcoal-brown/15 bg-charcoal-brown/5 grid place-items-center">
          {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-charcoal-brown/55" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-charcoal-brown/85">Game title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Game title" className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-charcoal-brown/85">Platform</Label>
            <Input value={form.platform} onChange={(e) => set("platform", e.target.value)} placeholder="Platform" className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-charcoal-brown/85">Progress note</Label>
            <Input value={form.note} onChange={(e) => set("note", e.target.value)} maxLength={120} placeholder="Where you are in the game (optional)" className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-charcoal-brown/85">Cover</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-charcoal-brown/15 hover:border-honey text-sm text-charcoal-brown/90 shrink-0 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
              </button>
              <input ref={fileInput} type="file" accept="image/*" onChange={upload} className="hidden" />
              <Input value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} placeholder="…or paste an image URL" className="h-10 bg-white border-charcoal-brown/15 text-charcoal-brown" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 mt-5">
        {saved && (
          <button
            type="button"
            onClick={clear}
            disabled={busy}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-charcoal-brown/15 hover:border-honey text-sm text-charcoal-brown/90 disabled:opacity-50"
          >
            <XIcon className="w-4 h-4" /> Clear
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={busy || uploading || !form.title.trim() || !dirty}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-charcoal-brown text-white filter hover:brightness-90 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
      <p className="text-xs text-charcoal-brown/70 mt-3">Clears itself when you publish a review with the same title.</p>
    </section>
  );
}
