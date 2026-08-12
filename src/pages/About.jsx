import { Link } from "react-router-dom";
import { Twitch, Youtube, ArrowUpRight } from "lucide-react";
import { creator } from "../data/creator";
import { TwitchProvider } from "../context/TwitchContext";
import { SocialRow, SectionTitle } from "../components/ui/decor";

function AboutContent() {
  return (
    <div>
      {/* ── "Who is Patepic?" — the full bio (the homepage only teases this) ── */}
      <section className="relative bg-surface py-20 md:py-28 overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="label-chip text-lg sm:text-xl">Who is {creator.name}?</h1>

          <div className="mt-8 space-y-5 text-sm sm:text-[0.95rem] leading-[1.75] text-ink/85 text-left">
            <p>
              {creator.name} is a <span className="hl">game reviewer, streamer and VTuber</span> — an owl sorcerer of
              time with strong opinions about difficulty spikes. Reviewer by day, VTuber by night, and the two feed
              each other: what gets played on stream gets written up here.
            </p>
            <p>
              Every review is built on a <span className="hl">credits-rolling playthrough</span>. Nothing gets scored
              early, nothing gets adjusted to match the crowd. If a beloved game did not land, the review says exactly
              why — and if a quiet one did, it gets the same word count.
            </p>
            <p>
              The written reviews are the main event: <span className="hl">long-form pieces</span> with pros, cons and
              a score. The <span className="hl">tier list</span> is where they all settle, and the
              <span className="hl"> scoring guidelines</span> explain why a 5 can still land in F.
            </p>
            <p>
              Off the clock: coffee, baseball, hockey, RPGs, and small coding projects between streams.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-6">
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" className="pill pill-ember h-11 px-6 text-sm">
              <Twitch className="w-4 h-4" /> Follow on Twitch
            </a>
            <a href={creator.youtube.url} target="_blank" rel="noopener noreferrer" className="pill pill-gold h-11 px-6 text-sm">
              <Youtube className="w-4 h-4" /> Subscribe
            </a>
            <Link to="/contact" className="pill pill-outline h-11 px-6 text-sm">Get in touch</Link>
          </div>

          <div className="mt-14">
            <p className="text-sm font-bold uppercase tracking-[0.06em] text-ink mb-4">Follow me on socials!</p>
            <div className="flex justify-center"><SocialRow /></div>
          </div>
        </div>
      </section>

      {/* ── Profile ── */}
      <section className="relative bg-surface py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="magazine-rule mb-6"><span>The profile</span></div>
          <SectionTitle>The frostborn owl, by the numbers.</SectionTitle>

          <div className="mt-10 panel-framed rounded-2xl p-6 sm:p-9 lg:p-12">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-14">
              <ProfileColumn rows={[
                { label: "Birthday", value: "October 24" },
                { label: "Height", value: "168 cm" },
                { label: "Oshi Mark", value: "⌚🦉" },
                { label: "Debut", value: "TBH" },
                { label: "Species", value: "Owl Sorcerer of Time" },
                { label: "Origin", value: "The Time Roulette" },
                { label: "Fanbase", value: "Timekeepers" },
              ]} />
              <ProfileColumn rows={[
                { label: "Hobbies", value: [{ title: "Gaming", desc: "RPGs and Adventure titles are the go-to." }, { title: "Coding", desc: "Tinkers with small projects and tools between streams." }, { title: "Sports", desc: "Loves watching baseball and hockey." }, { title: "Writing game reviews", desc: "Breaks down games they've played after the credits roll." }] },
                { label: "Likes", value: "Coffee, Baseball, Hockey, RPGs, Fried/comfort food" },
                { label: "Dislikes", value: "Slow internet, Cold weather, Brutal difficulty spikes" },
              ]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Where to watch ── */}
      <section className="relative bg-surface pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="magazine-rule mb-8"><span>Where to watch</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WatchCard
              href={creator.twitch.url}
              eyebrow="Live streams"
              title={`Twitch · ${creator.twitch.handle}`}
              body="Main stage. Long sessions, full playthroughs."
              Icon={Twitch}
            />
            <WatchCard
              href={creator.youtube.url}
              eyebrow="VODs & video essays"
              title={`YouTube · ${creator.youtube.handle}`}
              body="Edited recaps, written-review companion videos."
              Icon={Youtube}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function WatchCard({ href, eyebrow, title, body, Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group bg-crimson border border-ink/10 shadow-soft-sm hover:shadow-soft transition-shadow rounded-xl p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 grid place-items-center bg-scarlet text-gold rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[0.75rem] font-bold tracking-[0.06em] uppercase text-ink">{eyebrow}</div>
          <div className="display-hero text-xl text-ink">{title}</div>
        </div>
        <ArrowUpRight className="w-4 h-4 ml-auto text-ink group-hover:text-gold transition-colors" />
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{body}</p>
    </a>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-baseline py-4 border-b border-ink">
      <span className="w-2/5 pr-4 text-sm font-extrabold text-ink">{label}</span>
      <span className="w-3/5 pl-4 text-sm text-ink/80 leading-relaxed">
        {Array.isArray(value) ? (
          <ul className="space-y-2">
            {value.map((item) => <li key={item.title} className="ml-4 list-disc"><span className="font-extrabold text-ink">{item.title}</span> - {item.desc}</li>)}
          </ul>
        ) : value}
      </span>
    </div>
  );
}

function ProfileColumn({ rows }) {
  return <div>{rows.map((row) => <ProfileRow key={row.label} {...row} />)}</div>;
}

export default function About() {
  return <TwitchProvider><AboutContent /></TwitchProvider>;
}
