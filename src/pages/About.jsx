import { Link } from "react-router-dom";
import { Twitch, Youtube, ArrowUpRight, Gamepad2, Code2, Trophy, PenLine, Heart, X as XIcon, Mail } from "lucide-react";
import { creator } from "../data/creator";
import { useReviews } from "../hooks/useReviews";
import { CreatorCard } from "../components/CreatorCard";
import { PrideFlags } from "../components/PrideFlags";
import { Wordmark, CapsuleButton } from "../components/ui/decor";
import { usePageTitle } from "../hooks/usePageTitle";

const PROFILE = [
  { label: "Birthday", value: "October 24" },
  { label: "Debut", value: "TBH" },
  { label: "Height", value: "169 cm" },
  { label: "Based in", value: "Eastern United States" },
  { label: "Oshi mark", value: "♠🐶" },
  { label: "Gender", value: <span className="inline-flex items-center gap-2.5"><PrideFlags only={["Nonbinary"]} />Nonbinary</span>, center: true },
  { label: "Pronouns", value: "They/them" },
  { label: "Orientation", value: <span className="inline-flex items-center gap-2.5"><PrideFlags only={["Bisexual", "Pansexual"]} />Bisexual, pansexual</span>, center: true },
  { label: "Unit", value: "Wild Card" },
  { label: "Community", value: "Handlers" },
];

const HOBBIES = [
  { Icon: Gamepad2, title: "Gaming", desc: "RPGs and adventure titles are my go-to." },
  { Icon: PenLine, title: "Writing game reviews", desc: "I break games down after the credits roll." },
  { Icon: Code2, title: "Coding", desc: "I tinker with small projects and tools between streams." },
  { Icon: Trophy, title: "Sports", desc: "I love watching baseball and hockey." },
];

const LIKES = ["Coffee", "Baseball", "Hockey", "RPGs", "Fried / comfort food"];
const DISLIKES = ["Slow internet", "Cold weather", "Brutal difficulty spikes"];

export default function About() {
  usePageTitle("About");
  const { reviews, loading } = useReviews();

  return (
    <div>
      <section className="relative pt-12 lg:pt-16 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <h1 className="leading-none">
              <Wordmark
                text="About Me"
                tag="the person behind the reviews"
                className="wordmark text-5xl sm:text-6xl lg:text-7xl text-charcoal-brown"
                tagClassName="text-charcoal-brown/70"
              />
            </h1>

            <div className="mt-8 space-y-4 max-w-xl text-sm sm:text-base leading-relaxed text-charcoal-brown">
              <p>
                I'm a <span className="hl">game reviewer, streamer and VTuber</span> with strong opinions on games.
                Most of what I review gets played live on stream, and some of it off stream when a game is better
                that way. Either way, I don't review anything until the credits roll, and I don't change a score to
                match the crowd.
              </p>
              <p>
                I'm nonbinary, and I'm bi and pan. “Man” and “woman” never really felt like me, and nonbinary did. I
                use both bi and pan because bi is the label I've always known, and pan fits the fact that gender
                isn't a deciding factor for me. I don't make content about being LGBTQIA+, but I don't hide it
                either, and I want everyone who shows up here to feel welcome.
              </p>
              <p>
                The <Link to="/reviews" className="hl underline decoration-orange decoration-2 underline-offset-4">reviews</Link> are
                the main event, the <Link to="/tier-list" className="hl underline decoration-orange decoration-2 underline-offset-4">tier list</Link> is
                where they all settle, and the <Link to="/guidelines" className="hl underline decoration-orange decoration-2 underline-offset-4">guidelines</Link> explain
                why a 5 can still land in F.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <CapsuleButton href={creator.twitch.url} target="_blank" rel="noopener noreferrer" icon={Twitch} className="pill-capsule-main">
                Follow on Twitch
              </CapsuleButton>
              <CapsuleButton href={creator.youtube.url} target="_blank" rel="noopener noreferrer" icon={Youtube} >
                Subscribe
              </CapsuleButton>
              <CapsuleButton as={Link} to="/contact" icon={Mail} >
                Get in touch
              </CapsuleButton>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            <CreatorCard reviews={reviews} loading={loading} className="w-full max-w-[21rem] rotate-2" />
            <p className="text-xs text-charcoal-brown/70">Click the card to flip it.</p>
          </div>
        </div>
      </section>

      <section className="relative pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:self-stretch dex-panel">
            <h2 className="dex-title">Profile</h2>
            <dl>
              {PROFILE.map(({ label, value, center }) => (
                <div key={label} className={`dex-row${center ? " items-center" : ""}`}>
                  <dt className={`dex-label${center ? " !pt-0" : ""}`}>{label}</dt>
                  <dd className="text-charcoal-brown">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="dex-panel">
              <h2 className="dex-title">Hobbies</h2>
              <div className="creator-moves">
                {HOBBIES.map(({ Icon, title, desc }) => (
                  <div key={title} className="creator-move">
                    <span className="creator-cost" aria-hidden="true"><Icon /></span>
                    <div className="min-w-0">
                      <div className="creator-move-name">{title}</div>
                      <p className="creator-move-text !text-[0.8rem]">{desc}</p>
                    </div>
                    <span />
                  </div>
                ))}
              </div>
            </div>

            <div className="dex-panel">
              <h2 className="dex-title">Likes and dislikes</h2>
              <div className="space-y-4">
                <ChipRow Icon={Heart} label="Likes" items={LIKES} tone="like" />
                <ChipRow Icon={XIcon} label="Dislikes" items={DISLIKES} tone="dislike" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Wordmark text="Where to watch" className="wordmark text-4xl sm:text-5xl text-charcoal-brown" />
          <div className={`mt-10 grid grid-cols-1 gap-6 ${creator.pixie.url ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            <WatchCard
              href={creator.twitch.url}
              color="var(--color-charcoal-brown)"
              Icon={Twitch}
              title={`Twitch · ${creator.twitch.handle}`}
              body="Long sessions and full playthroughs, live."
            />
            <WatchCard
              href={creator.youtube.url}
              color="var(--color-charcoal-brown)"
              Icon={Youtube}
              title={`YouTube · ${creator.youtube.handle}`}
              body="My main channel. No new uploads for now."
            />
            {creator.pixie.url && (
              <WatchCard
                href={creator.pixie.url}
                color="var(--color-charcoal-brown)"
                Icon={Youtube}
                title={`YouTube · ${creator.pixie.handle || creator.pixie.name}`}
                body="My second channel, where new videos are going up."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChipRow({ Icon, label, items, tone }) {
  return (
    <div>
      <div className="dex-label flex items-center gap-1.5 mb-2"><Icon className="w-3.5 h-3.5" /> {label}</div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className={`dex-chip dex-chip-${tone}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function WatchCard({ href, color, Icon, title, body }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="dex-panel watch-tile group" style={{ "--tier-color": color }}>
      <span className="watch-tile-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
      <div className="min-w-0">
        <div className="font-sans font-bold text-lg text-charcoal-brown leading-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-charcoal-brown/90">{body}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 shrink-0 text-charcoal-brown/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
