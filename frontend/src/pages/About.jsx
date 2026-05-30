import React from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  Headphones,
  Snowflake,
  Twitch,
  Youtube,
  Sparkles,
  Image as ImageIcon,
  Heart,
  Clock,
  Gamepad2,
} from "lucide-react";
import { creator } from "../data/creator";

const aboutImg =
  "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/da8bde4ec5a30380a4b792bf5d066036073fa49b2c523228a5cf15443fd2d585.png";

export default function About() {
  return (
    <div data-testid="about-page">
      {/* HERO + AVATAR */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs tracking-[0.25em] uppercase text-cyan-300 mb-6">
              <Sparkles className="w-3 h-3" /> The creator
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-50 leading-[1.02]">
              I'm <em className="not-italic text-cyan-300">{creator.name}</em>.<br />
              Reviewer by day,<br />
              VTuber by night.
            </h1>
            <p className="mt-6 text-slate-300 leading-relaxed text-base lg:text-lg max-w-xl">
              {creator.tagline}. I write long-form reviews here, then go yell about the same games on stream. One feeds the other. Both are seasonally cold.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={creator.twitch.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="about-cta-twitch"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-400 text-sm font-medium shadow-[0_0_24px_rgba(168,85,247,0.35)] transition"
              >
                <Twitch className="w-4 h-4" /> Follow on Twitch
              </a>
              <a
                href={creator.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="about-cta-youtube"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-400 text-sm font-medium transition"
              >
                <Youtube className="w-4 h-4" /> Subscribe
              </a>
              <Link
                to="/contact"
                data-testid="about-cta-contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/5 text-slate-100 text-sm"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {/* Avatar placeholder */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative" data-testid="vtuber-avatar-slot">
              <div className="absolute -inset-3 bg-gradient-to-br from-cyan-500/40 via-blue-500/20 to-purple-500/30 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 overflow-hidden aspect-[4/5] bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40">
                {creator.avatarUrl ? (
                  <img
                    src={creator.avatarUrl}
                    alt={`${creator.name} VTuber avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-center p-8">
                    {/* Decorative frost ring */}
                    <div className="absolute inset-8 rounded-3xl border border-dashed border-cyan-400/30" />
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 grid place-items-center">
                        <ImageIcon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <p className="font-display text-2xl text-slate-100">Avatar slot</p>
                      <p className="text-xs tracking-[0.25em] uppercase text-cyan-500">drop your model here</p>
                      <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed mt-2">
                        Add a URL to <code className="text-cyan-300 bg-slate-900/60 px-1 py-0.5 rounded">creator.avatarUrl</code> in <span className="text-slate-300">/src/data/creator.js</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Floating snowflakes */}
                <Snowflake className="absolute top-4 right-4 w-4 h-4 text-cyan-300/60 animate-pulse" />
                <Snowflake className="absolute bottom-6 left-5 w-3 h-3 text-cyan-400/40 animate-pulse [animation-delay:600ms]" />
                <Snowflake className="absolute top-1/3 left-6 w-5 h-5 text-cyan-200/30 animate-pulse [animation-delay:1200ms]" />
              </div>

              {/* Caption card */}
              <div className="mt-4 rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[0.65rem] tracking-[0.25em] uppercase text-cyan-500">Now playing</div>
                  <div className="font-display text-sm text-slate-100">{creator.liveGame}</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.65rem] tracking-[0.25em] uppercase text-cyan-500">Debut</div>
                  <div className="font-display text-sm text-slate-100">{creator.stats.debutYear}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHANNEL STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" data-testid="channel-stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile icon={<Heart className="w-4 h-4" />} label="Followers" value={creator.stats.followers} />
          <StatTile icon={<Clock className="w-4 h-4" />} label="Hours streamed" value={creator.stats.hoursStreamed} />
          <StatTile icon={<Gamepad2 className="w-4 h-4" />} label="Games beaten on stream" value={creator.stats.gamesCompleted} />
          <StatTile icon={<Sparkles className="w-4 h-4" />} label="Streaming since" value={creator.stats.debutYear} />
        </div>
      </section>

      {/* LORE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" data-testid="vtuber-lore">
        <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">The lore</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-50 tracking-tight max-w-3xl leading-tight">
          A frostborn critic with a tabletop habit and a complicated relationship with backlogs.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-5 text-slate-300 leading-relaxed text-base lg:text-lg">
            <p>
              The story goes that {creator.name} was born from a frozen save file in the year of the great patch. Refused to be deleted. Started reviewing games to justify the disk space.
            </p>
            <p>
              In practice: I'm a generalist. I'll play your prestige RPG, your sweaty roguelike, and your seven-hour walking sim with the same energy. The score on the badge tells you how much I'd recommend it. The review tells you whether <em>you</em> should care. The stream is where the controller actually breaks.
            </p>
            <p>
              I never score a game I haven't finished. Day-one bugs count. Studio access doesn't. If I bounced off a beloved title, I'll tell you exactly why, and we can argue about it in chat.
            </p>
            <p>
              Off-camera: too much cold brew, an unhealthy collection of mechanical keyboards, a TTRPG group that hasn't finished a campaign since 2019.
            </p>
          </div>

          <aside className="md:col-span-5 space-y-3">
            <LoreRow icon={<Snowflake className="w-4 h-4" />} label="Origin" value="A frozen save file" />
            <LoreRow icon={<Sparkles className="w-4 h-4" />} label="Class" value="Critic / Variety streamer" />
            <LoreRow icon={<Coffee className="w-4 h-4" />} label="Fuel" value="Iced oat latte (always iced)" />
            <LoreRow icon={<Headphones className="w-4 h-4" />} label="Stream soundtrack" value="NieR: Automata OST on loop" />
            <LoreRow icon={<Gamepad2 className="w-4 h-4" />} label="Comfort game" value="Stardew Valley" />
          </aside>
        </div>
      </section>

      {/* WHERE TO WATCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" data-testid="where-to-watch">
        <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">Where to watch</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <a
            href={creator.twitch.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="watch-twitch"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-purple-950/30 p-7 hover:border-purple-400/50 transition"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 grid place-items-center text-white">
                    <Twitch className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-purple-300">Live streams</div>
                    <div className="font-display text-xl text-slate-50">Twitch · {creator.twitch.handle}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  Main stage. Long sessions, full playthroughs, occasionally questionable life choices.
                </p>
              </div>
              {creator.isLive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-[0.65rem] tracking-[0.2em] uppercase text-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> Live
                </span>
              )}
            </div>
          </a>

          <a
            href={creator.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="watch-youtube"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-rose-950/30 p-7 hover:border-rose-400/50 transition"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl group-hover:bg-rose-500/30 transition" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500 grid place-items-center text-white">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[0.65rem] tracking-[0.25em] uppercase text-rose-300">VODs & video essays</div>
                  <div className="font-display text-xl text-slate-50">YouTube · {creator.youtube.handle}</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Edited recaps, written-review companion videos, and the occasional rant nobody asked for.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Tools / setup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 via-transparent to-blue-500/20 rounded-3xl blur-2xl" />
              <img
                src={aboutImg}
                alt="Gaming setup with mechanical keyboard"
                className="relative rounded-3xl border border-white/10 w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">The setup</p>
            <h2 className="font-display text-3xl lg:text-4xl text-slate-50 tracking-tight max-w-xl leading-tight">
              Cold room. Hot keyboard. One blue light way too close to my face.
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed max-w-xl">
              Reviews are written on the same rig the streams run on — so when I complain about performance, it's because I just felt it. No press review code, no embargoed previews disguised as verdicts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const StatTile = ({ icon, label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition">
    <div className="flex items-center gap-2 text-cyan-500 mb-3">
      {icon}
      <span className="text-[0.65rem] tracking-[0.2em] uppercase">{label}</span>
    </div>
    <div className="font-display text-2xl lg:text-3xl text-slate-50 tracking-tight">{value}</div>
  </div>
);

const LoreRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 grid place-items-center text-cyan-300 flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[0.65rem] tracking-[0.25em] uppercase text-cyan-500 mb-0.5">{label}</div>
      <div className="font-display text-sm text-slate-100">{value}</div>
    </div>
  </div>
);
