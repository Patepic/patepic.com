import React, { useState } from "react";
import { Send, CheckCircle2, Twitch, Youtube, Mail } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { sendContact, errorMessage } from "../lib/api";
import { creator } from "../data/creator";
import { StickerBadge } from "../components/ui/decor";

const MAX_MESSAGE = 200;
const EMAIL = "contact@patepic.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (k, v) => { setForm((f) => ({ ...f, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })); };
  const charsOver = form.message.length > MAX_MESSAGE;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.length < 10) e.message = "Tell me a bit more (10+ chars)";
    else if (charsOver) e.message = `${form.message.length - MAX_MESSAGE} characters over the limit`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const allFilled = form.name.trim() && form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.subject.trim() && form.message.trim().length >= 10 && !charsOver;

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { const res = await sendContact(form); setSent(true); if (res?.dev_mode) toast.success("Message logged (Resend not configured)"); else toast.success("Message sent! I'll reply soon."); } catch (err) { toast.error(errorMessage(err)); } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="relative bg-pixel-blush">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="panel-framed rounded-2xl px-6 py-14 sm:px-12 text-center">
            <div className="relative inline-grid place-items-center w-16 h-16 rounded-full mb-6 bg-pixel-forest">
              <CheckCircle2 className="w-7 h-7 text-pixel-pink" />
            </div>
            <h1 className="relative display-heading text-4xl sm:text-5xl text-pixel-black">Message received.</h1>
            <p className="relative mt-4 max-w-md mx-auto text-sm sm:text-base leading-relaxed text-pixel-black/75">
              Thanks, {form.name || "stranger"}. I read every message — replies usually go out within a week.
            </p>
            <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
              className="relative pill pill-ember h-11 px-6 text-sm mt-8">Send another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-pixel-blush">
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pt-28">
        {/* Envelope flap peeking out from behind the card — the letter is "inside" */}
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-3 lg:top-6 w-[88%] max-w-[520px] h-20 sm:h-24">
          <div className="absolute inset-0 bg-pixel-pink rounded-t-2xl" style={{ clipPath: "polygon(0 100%, 50% 15%, 100% 100%)" }} />
        </div>

        {/* ── Cream bordered contact box ── */}
        <div className="panel-framed relative z-10 rounded-2xl px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="relative text-center">
            <StickerBadge icon={Mail} className="mx-auto mb-4" />
            <h1 className="display-heading text-5xl sm:text-6xl text-pixel-black">Contact</h1>
            <a href={`mailto:${EMAIL}`}
              className="inline-block mt-4 text-sm sm:text-base font-semibold text-pixel-black underline decoration-pixel-pink decoration-2 underline-offset-[6px] hover:decoration-pixel-forest">
              {EMAIL}
            </a>
            <p className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-pixel-black">
              Business Inquiries ONLY
            </p>
          </div>

          <form onSubmit={submit} className="relative mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-pixel-black">Name <span className="text-pixel-black">*</span></Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name"
                  className="mt-2 h-12 bg-pixel-blush border-pixel-teal text-pixel-black placeholder:text-pixel-black/40" />
                {errors.name && <p className="text-sm font-bold text-pixel-black mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-pixel-black">Email <span className="text-pixel-black">*</span></Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com"
                  className="mt-2 h-12 bg-pixel-blush border-pixel-teal text-pixel-black placeholder:text-pixel-black/40" />
                {errors.email && <p className="text-sm font-bold text-pixel-black mt-1.5">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-5">
              <Label htmlFor="subject" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-pixel-black">Subject <span className="text-pixel-black">*</span></Label>
              <Input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Business / partnerships / feedback"
                className="mt-2 h-12 bg-pixel-blush border-pixel-teal text-pixel-black placeholder:text-pixel-black/40" />
              {errors.subject && <p className="text-sm font-bold text-pixel-black mt-1.5">{errors.subject}</p>}
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="message" className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-pixel-black">Message <span className="text-pixel-black">*</span></Label>
                <span className={`text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-full border ${charsOver ? "bg-pixel-forest border-pixel-teal text-pixel-blush" : "bg-pixel-blush border-pixel-teal text-pixel-black/60"}`}>
                  {form.message.length} / {MAX_MESSAGE}
                </span>
              </div>
              <Textarea id="message" rows={7} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Say what's on your mind…"
                className="bg-pixel-blush border-pixel-teal text-pixel-black placeholder:text-pixel-black/40 resize-none" />
              {errors.message && <p className="text-sm font-bold text-pixel-black mt-1.5">{errors.message}</p>}
            </div>
            <button type="submit" disabled={loading || !allFilled}
              className="mt-8 w-full pill pill-gold h-12 px-8 text-sm disabled:opacity-40">
              {loading ? <><span className="w-4 h-4 rounded-full border-2 border-pixel-forest/30 border-t-pixel-forest animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send message</>}
            </button>
          </form>
        </div>
      </section>

      {/* ── Channel blocks with golden pill buttons (the agent row in the reference) ── */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <ChannelBlock
            wordmark={creator.twitch.handle}
            sub="Live streams"
            Icon={Twitch}
            href={creator.twitch.url}
            action={creator.twitch.handle}
            caption="Stream Schedule"
          />
          <ChannelBlock
            wordmark={creator.name}
            sub="Video & VODs"
            Icon={Youtube}
            href={creator.youtube.url}
            action={creator.youtube.handle}
            caption="YouTube Channel"
          />
        </div>
      </section>
    </div>
  );
}

function ChannelBlock({ wordmark, sub, Icon, href, action, caption }) {
  return (
    <div className="text-center">
      <div className="inline-flex flex-col items-center">
        <div className="w-16 h-16 grid place-items-center bg-pixel-pink text-pixel-black border border-pixel-black/10 shadow-pixel-sm rounded-lg">
          <Icon className="w-7 h-7" />
        </div>
        <div className="display-hero mt-3 text-2xl text-pixel-black">{wordmark}</div>
        <div className="text-[0.75rem] font-bold uppercase tracking-[0.06em] text-pixel-black mt-1">{sub}</div>
      </div>
      <div className="mt-5">
        <a href={href} target="_blank" rel="noopener noreferrer" className="pill pill-gold h-10 px-6 text-sm">{action}</a>
        <p className="mt-2 text-[0.8rem] font-extrabold uppercase tracking-[0.06em] text-pixel-black/60">{caption}</p>
      </div>
    </div>
  );
}
