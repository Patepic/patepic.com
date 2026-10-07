import { useState } from "react";
import { Send, CheckCircle2, Twitch, Youtube, ArrowUpRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { sendContact, errorMessage } from "../lib/api";
import { creator } from "../data/creator";
import { Wordmark, CapsuleButton } from "../components/ui/decor";
import { usePageTitle } from "../hooks/usePageTitle";

const MAX_MESSAGE = 200;
const EMAIL = "contact@patepic.com";

export default function Contact() {
  usePageTitle("Contact");
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

  const field = "mt-2 h-12 bg-white border-honey text-charcoal-brown placeholder:text-charcoal-brown/70";
  const fieldError = "text-sm font-semibold text-charcoal-brown/70 mt-1.5";

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="dex-panel text-center !py-12">
          <span className="watch-tile-icon mx-auto mb-6" aria-hidden="true"><CheckCircle2 className="w-6 h-6" /></span>
          <h1 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">Message sent</h1>
          <p className="mt-4 max-w-md mx-auto text-sm sm:text-base leading-relaxed text-charcoal-brown/90">
            Thanks, {form.name || "stranger"}. I read every message. Replies usually go out within a week.
          </p>
          <div className="mt-8 flex justify-center">
            <CapsuleButton as="button" type="button" icon={Send} className="pill-capsule-main"
              onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
              Send another
            </CapsuleButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 text-center">
        <Wordmark text="Contact" tag="business and partnership inquiries" className="wordmark text-6xl sm:text-7xl lg:text-8xl text-charcoal-brown" tagClassName="text-charcoal-brown/70" />
        <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-charcoal-brown">
          For sponsorships, review requests, collaborations and press. Use the form or email me directly.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={submit} noValidate className="lg:col-span-7 dex-panel !p-6 sm:!p-8">
          <h2 className="dex-title">Send a message</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" className="dex-label">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className={field} />
              {errors.name && <p className={fieldError}>{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="dex-label">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={field} />
              {errors.email && <p className={fieldError}>{errors.email}</p>}
            </div>
          </div>
          <div className="mt-5">
            <Label htmlFor="subject" className="dex-label">Subject</Label>
            <Input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Sponsorship, review request, collaboration…" className={field} />
            {errors.subject && <p className={fieldError}>{errors.subject}</p>}
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="dex-label">Message</Label>
              <span className={`text-xs font-semibold tabular-nums ${charsOver ? "text-charcoal-brown/70" : "text-charcoal-brown/75"}`}>
                {form.message.length} / {MAX_MESSAGE}
              </span>
            </div>
            <Textarea id="message" rows={7} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="What would you like to discuss?"
              className="mt-2 bg-white border-honey text-charcoal-brown placeholder:text-charcoal-brown/70 resize-none" />
            {errors.message && <p className={fieldError}>{errors.message}</p>}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-charcoal-brown/75">All fields are required.</p>
            <CapsuleButton as="button" type="submit" icon={Send} disabled={loading || !allFilled} className="pill-capsule-main disabled:opacity-40 disabled:pointer-events-none">
              {loading ? "Sending…" : "Send message"}
            </CapsuleButton>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-8">
          <div className="dex-panel">
            <h2 className="dex-title">Direct</h2>
            <dl>
              <div className="dex-row">
                <dt className="dex-label">Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`} className="font-semibold text-charcoal-brown underline decoration-orange decoration-2 underline-offset-4 break-all">{EMAIL}</a>
                </dd>
              </div>
              <div className="dex-row">
                <dt className="dex-label">Reply time</dt>
                <dd className="text-charcoal-brown">Usually within a week</dd>
              </div>
              <div className="dex-row">
                <dt className="dex-label">Best for</dt>
                <dd className="text-charcoal-brown">Sponsorships, review requests, collaborations, press</dd>
              </div>
            </dl>
          </div>

          <ChannelTile href={creator.twitch.url} color="var(--color-charcoal-brown)" Icon={Twitch} title={`Twitch · ${creator.twitch.handle}`} body="Live streams and the schedule." />
          <ChannelTile href={creator.youtube.url} color="var(--color-charcoal-brown)" Icon={Youtube} title={`YouTube · ${creator.youtube.handle}`} body="My main channel." />
          {creator.pixie.url && (
            <ChannelTile href={creator.pixie.url} color="var(--color-charcoal-brown)" Icon={Youtube} title={`YouTube · ${creator.pixie.handle || creator.pixie.name}`} body="My second channel, with the newest videos." />
          )}
        </div>
      </section>
    </div>
  );
}

function ChannelTile({ href, color, Icon, title, body }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="dex-panel watch-tile group" style={{ "--tier-color": color }}>
      <span className="watch-tile-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
      <div className="min-w-0">
        <div className="font-sans font-bold text-lg text-charcoal-brown leading-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-charcoal-brown/90">{body}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 shrink-0 ml-auto text-charcoal-brown/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
