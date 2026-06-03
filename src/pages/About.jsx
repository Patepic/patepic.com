import { Link } from "react-router-dom";
import {
  Squirrel,
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
import { useTwitch } from "../context/TwitchContext";

export default function About() {
  const live = useTwitch();

  return (
    <div data-testid="about-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-xs tracking-[0.25em] uppercase text-sky-700 mb-6 shadow-sm">
              <Sparkles className="w-3 h-3" /> The creator
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-900 leading-[1.02]">
              I'm <em className="not-italic text-sky-700">{creator.name}</em>.
              <br />
              Reviewer by day,
              <br />
              VTuber by night.
            </h1>
            <p className="mt-6 text-slate-500 leading-relaxed text-base lg:text-lg max-w-xl">
              {creator.tagline}. I write long-form reviews here, then go yell
              about the same games on stream. One feeds the other.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={creator.twitch.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="about-cta-twitch"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-500 text-sm font-medium shadow-[0_10px_24px_-10px_rgba(126,34,206,0.45)] transition"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 hover:border-sky-300 hover:text-sky-800 text-slate-700 text-sm bg-white"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="relative" data-testid="vtuber-avatar-slot">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={`${creator.name} VTuber avatar`}
                  className="w-full h-full object-contain mt-[-7vh]"
                  style={{
                    filter: "drop-shadow(10px 10px 0 rgba(2,132,199,0.4))",
                  }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center p-8">
                  <div className="absolute inset-8 rounded-3xl border border-dashed border-sky-300" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-sky-100 border border-sky-200 grid place-items-center">
                      <ImageIcon className="w-6 h-6 text-sky-700" />
                    </div>
                  </div>
                </div>
              )}

              {live?.isLive && (
                <div className="mt-4 rounded-2xl bg-white border border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-700">
                      Now playing
                    </div>
                    <div className="font-display text-sm text-slate-900">
                      {live.game || creator.liveGame}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-700">
                      Debut
                    </div>
                    <div className="font-display text-sm text-slate-900">
                      {creator.stats.debutYear}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
        data-testid="vtuber-lore"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">
          The lore
        </p>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl text-slate-900 tracking-tight max-w-3xl leading-tight">
          A frostborn squirrel bounty hunter with a bounty nobody can pay.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-5 text-slate-600 leading-relaxed text-base lg:text-lg">
            <p>The cold came first.</p>

            <p>No warning. Just frost everywhere.</p>

            <p>
              One day the world broke, folding in on itself until entire cities
              vanished between fractured realities. Roads led nowhere. Skies
              split open. History became something people argued about around
              dying campfires. When the collapse finally settled, all that
              remained for {creator.name} was the cold, a name that still felt
              like their own, and the determination to survive long enough to
              figure out what came next.
            </p>

            <p>
              The broken worlds offered few opportunities and even fewer
              mercies. Bounty hunting became the only path forward. Across
              frozen wastelands, ruined settlements, and forgotten corners of
              the fold, {creator.name} tracks fugitives, monsters, and things
              that no longer fit neatly into either category. Every contract is
              another journey through places abandoned by reason and reclaimed
              by chaos.
            </p>

            <p>But survival is only part of the fight.</p>

            <p>
              The fold has a habit of deciding who people are supposed to
              become. It turns fear into identity and necessity into destiny.
              Every hunt forces {creator.name} to confront the person the
              collapse tried to create, someone hardened by loss, shaped by
              isolation, and defined by the cold they carry everywhere they go.
              The battle is no longer just against targets. It is against
              becoming a stranger to themselves.
            </p>

            <p>
              Yet even in a fractured world, some things remain worth finishing.
            </p>

            <p>
              Between contracts and long nights on the road, there are still
              games to play and stories to see through to the end. Every
              adventure completed, every credit rolled, every review written
              after the final chapter. In a universe full of unfinished endings,{" "}
              {creator.name} refuses to leave things half done.
            </p>

            <p>
              The world may have collapsed. The fold may still be writing its
              story. But {creator.name} has not reached the ending yet.
            </p>
          </div>

          <aside className="md:col-span-5 space-y-3">
            <LoreRow
              icon={<Snowflake className="w-4 h-4" />}
              label="Origin"
              value="Survived the collapse. Reborn a squirrel."
            />
            <LoreRow
              icon={<Sparkles className="w-4 h-4" />}
              label="Class"
              value="Frostborn bounty hunter / VTuber"
            />
            <LoreRow
              icon={<Squirrel className="w-4 h-4" />}
              label="Fuel"
              value="Whatever they find in the hoard"
            />
            <LoreRow
              icon={<Headphones className="w-4 h-4" />}
              label="Stream soundtrack"
              value="Lofi + Gaming Favorites"
            />
          </aside>
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-8"
        data-testid="where-to-watch"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">
          Where to watch
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <a
            href={creator.twitch.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="watch-twitch"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-purple-50 p-7 hover:border-purple-300 hover:shadow-lg transition"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-200/40 blur-3xl group-hover:bg-purple-200/60 transition" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 grid place-items-center text-white">
                    <Twitch className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[0.65rem] tracking-[0.25em] uppercase text-purple-700">
                      Live streams
                    </div>
                    <div className="font-display text-xl text-slate-900">
                      Twitch · {creator.twitch.handle}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                  Main stage. Long sessions, full playthroughs, occasionally
                  questionable life choices.
                </p>
              </div>
              {live?.isLive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-[0.65rem] tracking-[0.2em] uppercase text-rose-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />{" "}
                  Live
                </span>
              )}
            </div>
          </a>

          <a
            href={creator.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="watch-youtube"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-rose-50 p-7 hover:border-rose-300 hover:shadow-lg transition"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-200/40 blur-3xl group-hover:bg-rose-200/60 transition" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500 grid place-items-center text-white">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[0.65rem] tracking-[0.25em] uppercase text-rose-700">
                    VODs & video essays
                  </div>
                  <div className="font-display text-xl text-slate-900">
                    YouTube · {creator.youtube.handle}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Edited recaps, written-review companion videos, and the
                occasional rant nobody asked for.
              </p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}

const StatTile = ({ icon, label, value }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-200 transition">
    <div className="flex items-center gap-2 text-sky-700 mb-3">
      {icon}
      <span className="text-[0.65rem] tracking-[0.2em] uppercase">{label}</span>
    </div>
    <div className="font-display text-2xl lg:text-3xl text-slate-900 tracking-tight">
      {value}
    </div>
  </div>
);

const LoreRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
    <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 grid place-items-center text-sky-700 flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[0.65rem] tracking-[0.25em] uppercase text-sky-700 mb-0.5">
        {label}
      </div>
      <div className="font-display text-sm text-slate-900">{value}</div>
    </div>
  </div>
);
