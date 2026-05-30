import React, { useState } from "react";
import axios from "axios";
import { Mail, Send, Snowflake, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.length < 10) e.message = "Tell me a bit more (10+ chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      setSent(true);
      if (res.data?.dev_mode) {
        toast.success("Message logged (dev mode — no Resend key configured)");
      } else {
        toast.success("Message sent! I'll reply soon.");
      }
    } catch (err) {
      const detail = err?.response?.data?.detail || "Failed to send. Try again later.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div data-testid="contact-success" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-grid place-items-center w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-400/30 mb-6">
          <CheckCircle2 className="w-7 h-7 text-cyan-300" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-slate-50 tracking-tighter">Message received.</h1>
        <p className="mt-4 text-slate-400 max-w-md mx-auto">
          Thanks, {form.name || "stranger"}. I read every message — replies usually go out within a week.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", subject: "", message: "" });
          }}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/5 text-sm"
          data-testid="contact-send-another"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div data-testid="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs tracking-[0.25em] uppercase text-cyan-300 mb-6">
            <Snowflake className="w-3 h-3" /> Inbox open
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-50 tracking-tighter leading-[1.05]">
            Pitch a game.<br />Argue a score.<br />
            <em className="not-italic text-cyan-300">Say hi.</em>
          </h1>
          <p className="mt-6 text-slate-300 leading-relaxed">
            I read everything, even the hate mail (especially the hate mail). Use the form, or write to me directly.
          </p>

          <div className="mt-10 space-y-4">
            <ContactRow icon={<Mail className="w-4 h-4" />} label="Direct" value="hello@frostbyte.test" />
          </div>

          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs tracking-[0.2em] uppercase text-cyan-500 mb-2">Pitching a game?</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Include a link, a steam/eshop ID, and one honest paragraph on why it matters. No press kits required.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="contact-form"
          className="lg:col-span-7 backdrop-blur-xl bg-slate-950/60 border border-white/5 rounded-3xl p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" className="text-xs tracking-[0.2em] uppercase text-cyan-500">Name</Label>
              <Input
                id="name"
                data-testid="contact-input-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                className="mt-2 h-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-xs tracking-[0.2em] uppercase text-cyan-500">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="contact-input-email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor="subject" className="text-xs tracking-[0.2em] uppercase text-cyan-500">Subject</Label>
            <Input
              id="subject"
              data-testid="contact-input-subject"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="Pitch / feedback / heated correction"
              className="mt-2 h-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500"
            />
            {errors.subject && <p className="text-xs text-rose-400 mt-1.5">{errors.subject}</p>}
          </div>

          <div className="mt-5">
            <Label htmlFor="message" className="text-xs tracking-[0.2em] uppercase text-cyan-500">Message</Label>
            <Textarea
              id="message"
              data-testid="contact-input-message"
              rows={7}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Say what's on your mind…"
              className="mt-2 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 resize-none"
            />
            {errors.message && <p className="text-xs text-rose-400 mt-1.5">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="contact-submit-button"
            className="mt-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-12 rounded-full bg-cyan-400 text-slate-950 font-medium hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 grid place-items-center text-cyan-300">
      {icon}
    </div>
    <div>
      <div className="text-[0.65rem] tracking-[0.25em] uppercase text-cyan-500 mb-0.5">{label}</div>
      <div className="text-slate-100 font-display">{value}</div>
    </div>
  </div>
);
