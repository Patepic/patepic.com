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
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-2">
            Control room
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Reviews dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading
              ? "Loading…"
              : `${reviews.length} reviews in the database.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            data-testid="admin-refresh"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-slate-200 hover:border-sky-300 text-sm text-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setEditing({ ...blank })}
            data-testid="admin-new-review"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-slate-900 text-white hover:bg-slate-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New review
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Filter by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="admin-filter-input"
          className="pl-11 h-11 bg-white border-slate-200"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs tracking-[0.15em] uppercase">
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
                  className="hover:text-slate-900"
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
                  className="hover:text-slate-900"
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
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No reviews match.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={r.slug}
                  data-testid={`admin-row-${r.slug}`}
                  className="border-t border-slate-100 hover:bg-sky-50/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {r.cover_url ? (
                        <img
                          src={r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover bg-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 grid place-items-center text-slate-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-display text-slate-900 flex items-center gap-2">
                          {r.title}
                          {r.isFeatured && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                              ★ Gold
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{Array.isArray(r.genre) ? r.genre.join(" · ") : r.genre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">
                    {r.platform}
                  </td>
                  <td className="px-5 py-3 text-slate-600 hidden md:table-cell">
                    {{
                      remake: "Remake",
                      remaster: "Remaster",
                      show: "Enhanced",
                      dlc: "DLC",
                    }[r.contentType] || "Original"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200">
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
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100 text-slate-500"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setEditing(r)}
                        title="Edit review"
                        data-testid={`admin-edit-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-sky-100 text-sky-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        title="Delete review"
                        data-testid={`admin-delete-${r.slug}`}
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-rose-100 text-rose-600"
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
          className="px-4 h-9 rounded-full border border-slate-200 text-sm disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-sm text-slate-500">
          Page {page} of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        </div>

        <button
          onClick={() =>
            setPage((p) =>
              p < Math.ceil(filtered.length / PAGE_SIZE) ? p + 1 : p
            )
          }
          disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
          className="px-4 h-9 rounded-full border border-slate-200 text-sm disabled:opacity-40"
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
        <AlertDialogContent className="bg-white border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
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
              className="bg-rose-600 text-white hover:bg-rose-500"
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
  const fileInput = useRef(null);

  useEffect(() => {
    if (review) {
      setForm({
        ...blank,
        ...review,
        pros: review.pros?.length ? review.pros : [""],
        cons: review.cons?.length ? review.cons : [""],
      });
    }
  }, [review]);

  if (!isOpen) return null;

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

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      pros: form.pros.map((s) => s.trim()).filter(Boolean),
      cons: form.cons.map((s) => s.trim()).filter(Boolean),
      recommended: form.recommended || null,
      contentType: form.contentType || null,
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

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white border-slate-200 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEdit ? `Edit · ${review.title}` : "New review"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Recommended and Content Type are dropdowns. All other fields are
            free text.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5 mt-2">
          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
              Image
            </Label>
            <div className="mt-2 flex gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden grid place-items-center text-slate-400 flex-shrink-0">
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
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-60 text-sm"
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
                  className="h-10 bg-white border-slate-200"
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
            color="sky"
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

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
              Recommended
            </Label>
            <Select
              value={form.recommended ?? ""}
              onValueChange={(v) => set("recommended", v)}
            >
              <SelectTrigger
                data-testid="admin-field-recommended"
                className="mt-2 h-10 bg-white border-slate-200"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
              Content Type
            </Label>
            <Select
              value={form.contentType ?? ""}
              onValueChange={(v) => set("contentType", v)}
            >
              <SelectTrigger
                data-testid="admin-field-contentType"
                className="mt-2 h-10 bg-white border-slate-200"
              >
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="remake">Remake</SelectItem>
                <SelectItem value="remaster">Remaster</SelectItem>
                <SelectItem value="show">Enhanced</SelectItem>
                <SelectItem value="dlc">DLC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gold Standard toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
                Gold Standard
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                Pin this as the featured game on the homepage
              </p>
            </div>
            <button
              type="button"
              data-testid="admin-field-isFeatured"
              onClick={() => set("isFeatured", !form.isFeatured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isFeatured ? "bg-sky-600" : "bg-slate-200"
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
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
              Summary *
            </Label>
            <Input
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              data-testid="admin-field-summary"
              placeholder="One sentence summary..."
              className="mt-2 h-10 bg-white border-slate-200"
            />
          </div>

          <ListEditor
            label="Pros"
            required
            items={form.pros}
            onChange={(i, v) => setListItem("pros", i, v)}
            onAdd={() => addListItem("pros")}
            onRemove={(i) => removeListItem("pros", i)}
            color="emerald"
            testId="admin-pros"
          />

          <ListEditor
            label="Cons"
            required
            items={form.cons}
            onChange={(i, v) => setListItem("cons", i, v)}
            onAdd={() => addListItem("cons")}
            onRemove={(i) => removeListItem("cons", i)}
            color="rose"
            testId="admin-cons"
          />

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
              Review Body (Markdown) *
            </Label>
            <Textarea
              rows={16}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              data-testid="admin-field-body"
              placeholder="Write your review here."
              className="mt-2 bg-white border-slate-200 resize-y text-sm font-mono"
            />
            <p className="mt-2 text-xs text-slate-500">
              Supports Markdown headings, lists, links, bold, italics,
              blockquotes, and code blocks.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-sm text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-save-review"
              disabled={saving || !canSubmit}
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
    </Dialog>
  );
}

const FieldText = ({ label, value, onChange, required, testId }) => (
  <div>
    <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">
      {label}
      {required ? " *" : ""}
    </Label>
    <Input
      value={value || ""}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="mt-2 h-10 bg-white border-slate-200"
    />
  </div>
);

const ListEditor = ({
  label,
  items,
  onChange,
  onAdd,
  onRemove,
  color,
  required,
  testId,
}) => (
  <div data-testid={testId}>
    <div className="flex items-center justify-between mb-2">
      <Label className={`text-xs tracking-[0.2em] uppercase text-${color}-700`}>
        {label}{required ? " *" : ""}
      </Label>
      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-sky-700 hover:text-sky-900 inline-flex items-center gap-1"
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
            className="h-10 bg-white border-slate-200"
            placeholder={`${label} item`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="w-9 h-9 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);