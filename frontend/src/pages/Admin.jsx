import React, { useEffect, useState, useRef } from "react";
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
import { PLATFORMS, GENRES, scoreToTier } from "../data/reviews";

const blank = {
  title: "",
  studio: "",
  year: new Date().getFullYear(),
  platform: "PC",
  platforms: [],
  genre: "RPG",
  score: 8,
  cover_url: "",
  verdict: "",
  pros: [""],
  cons: [""],
  body: "",
};

export default function Admin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {slug...} = edit
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = reviews.filter((r) =>
    !query ? true : r.title.toLowerCase().includes(query.toLowerCase()),
  );

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
    <div data-testid="admin-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-2">Control room</p>
          <h1 className="font-display text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Reviews dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Loading…" : `${reviews.length} reviews in the database.`}
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
              <th className="text-left px-5 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Platform</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Genre</th>
              <th className="text-left px-5 py-3 font-medium">Score</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-slate-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-slate-400">No reviews match.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.slug} data-testid={`admin-row-${r.slug}`} className="border-t border-slate-100 hover:bg-sky-50/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {r.cover_url ? (
                        <img src={r.cover_url} alt="" className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 grid place-items-center text-slate-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-display text-slate-900">{r.title}</div>
                        <div className="text-xs text-slate-400">{r.year} · {r.studio}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{r.platform}</td>
                  <td className="px-5 py-3 text-slate-600 hidden md:table-cell">{r.genre}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-full text-xs font-medium ${tierClasses(scoreToTier(r.score))}`}>
                      {r.score.toFixed(1)} · {scoreToTier(r.score)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/reviews/${r.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View public page"
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100 text-slate-500"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setEditing(r)}
                        data-testid={`admin-edit-${r.slug}`}
                        title="Edit"
                        className="w-8 h-8 grid place-items-center rounded-full hover:bg-sky-100 text-sky-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(r)}
                        data-testid={`admin-delete-${r.slug}`}
                        title="Delete"
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

      <ReviewEditor
        review={editing}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="bg-white border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete this review?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              "{deleting?.title}" will be removed from the database and its cover image deleted from R2. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="admin-delete-cancel">Cancel</AlertDialogCancel>
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

function tierClasses(tier) {
  switch (tier) {
    case "S": return "bg-sky-100 text-sky-800 border border-sky-200";
    case "A": return "bg-blue-100 text-blue-800 border border-blue-200";
    case "B": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "C": return "bg-amber-100 text-amber-800 border border-amber-200";
    case "D": return "bg-orange-100 text-orange-800 border border-orange-200";
    default:  return "bg-rose-100 text-rose-800 border border-rose-200";
  }
}

// ─────────────────────────────────────────────────────────────────
// Review editor (create + edit) — Dialog
// ─────────────────────────────────────────────────────────────────
function ReviewEditor({ review, onClose, onSaved }) {
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
        platforms: review.platforms || [],
      });
    }
  }, [review]);

  if (!isOpen) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setListItem = (key, i, v) =>
    setForm((f) => ({ ...f, [key]: f[key].map((x, idx) => (idx === i ? v : x)) }));
  const addListItem = (key) => setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  const removeListItem = (key, i) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const res = await adminUploadImage(file, setUploadProgress);
      set("cover_url", res.url);
      toast.success("Cover uploaded to R2");
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
      score: parseFloat(form.score),
      year: parseInt(form.year, 10),
      pros: form.pros.map((s) => s.trim()).filter(Boolean),
      cons: form.cons.map((s) => s.trim()).filter(Boolean),
      platforms: (form.platforms || []).filter(Boolean),
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
            Markdown is supported in the body. Cover image gets uploaded to your Cloudflare R2 bucket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5 mt-2">
          {/* Cover */}
          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">Cover image</Label>
            <div className="mt-2 flex gap-4 items-start">
              <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden grid place-items-center text-slate-400 flex-shrink-0">
                {form.cover_url ? (
                  <img src={form.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  data-testid="admin-upload-button"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-60 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? `Uploading ${uploadProgress}%` : "Upload to R2"}
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
                  data-testid="admin-cover-url"
                  className="h-10 bg-white border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldText label="Title" required value={form.title} onChange={(v) => set("title", v)} testId="admin-field-title" />
            <FieldText label="Studio" value={form.studio} onChange={(v) => set("studio", v)} testId="admin-field-studio" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FieldNumber label="Year" value={form.year} onChange={(v) => set("year", v)} testId="admin-field-year" />
            <FieldNumber label="Score" step="0.1" min="0" max="10" value={form.score} onChange={(v) => set("score", v)} testId="admin-field-score" />

            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">Platform</Label>
              <Select value={form.platform} onValueChange={(v) => set("platform", v)}>
                <SelectTrigger data-testid="admin-field-platform" className="mt-2 h-10 bg-white border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  {PLATFORMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">Genre</Label>
              <Select value={form.genre} onValueChange={(v) => set("genre", v)}>
                <SelectTrigger data-testid="admin-field-genre" className="mt-2 h-10 bg-white border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  {GENRES.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FieldText label="Verdict (one-line summary)" value={form.verdict} onChange={(v) => set("verdict", v)} testId="admin-field-verdict" />

          <ListEditor
            label="Pros"
            items={form.pros}
            onChange={(i, v) => setListItem("pros", i, v)}
            onAdd={() => addListItem("pros")}
            onRemove={(i) => removeListItem("pros", i)}
            color="emerald"
            testId="admin-pros"
          />
          <ListEditor
            label="Cons"
            items={form.cons}
            onChange={(i, v) => setListItem("cons", i, v)}
            onAdd={() => addListItem("cons")}
            onRemove={(i) => removeListItem("cons", i)}
            color="rose"
            testId="admin-cons"
          />

          <div>
            <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">Body (Markdown)</Label>
            <Textarea
              rows={10}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              data-testid="admin-field-body"
              placeholder="## Heading…&#10;Long-form review here. Markdown supported."
              className="mt-2 bg-white border-slate-200 resize-y font-mono text-sm"
            />
          </div>

          <DialogFooter className="pt-4">
            <button type="button" onClick={onClose} className="px-5 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-sm text-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-save-review"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-60 text-sm font-medium"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {isEdit ? "Save changes" : "Create review"}
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
    <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">{label}{required ? " *" : ""}</Label>
    <Input
      value={value || ""}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="mt-2 h-10 bg-white border-slate-200"
    />
  </div>
);

const FieldNumber = ({ label, value, onChange, step = "1", min, max, testId }) => (
  <div>
    <Label className="text-xs tracking-[0.2em] uppercase text-sky-700">{label}</Label>
    <Input
      type="number"
      step={step}
      min={min}
      max={max}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      data-testid={testId}
      className="mt-2 h-10 bg-white border-slate-200"
    />
  </div>
);

const ListEditor = ({ label, items, onChange, onAdd, onRemove, color, testId }) => (
  <div data-testid={testId}>
    <div className="flex items-center justify-between mb-2">
      <Label className={`text-xs tracking-[0.2em] uppercase text-${color}-700`}>{label}</Label>
      <button type="button" onClick={onAdd} className="text-xs text-sky-700 hover:text-sky-900 inline-flex items-center gap-1">
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={it} onChange={(e) => onChange(i, e.target.value)} className="h-10 bg-white border-slate-200" placeholder={`${label} item`} />
          {items.length > 1 && (
            <button type="button" onClick={() => onRemove(i)} className="w-9 h-9 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100">
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);
