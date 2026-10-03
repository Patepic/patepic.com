import { Link } from "react-router-dom";
import { Twitch, Youtube, ArrowUpRight, Gamepad2, Code2, Trophy, PenLine, Heart, X as XIcon, Mail } from "lucide-react";
import { creator } from "../data/creator";
import { useReviews } from "../hooks/useReviews";
import { CreatorCard } from "../components/CreatorCard";
import { Wordmark, CapsuleButton } from "../components/ui/decor";
import { usePageTitle } from "../hooks/usePageTitle";

const PROFILE = [
  { label: "Birthday", value: "October 24" },
  { label: "Height", value: "168 cm" },
  { label: "Oshi mark", value: "♠🐰" },
  { label: "Debut", value: "TBH" },
  { label: "Species", value: "Bunny" },
  { label: "Based in", value: "The Final Table" },
  { label: "Community", value: "The Crew" },
];

const HOBBIES = [
  { Icon: Gamepad2, title: "Gaming", desc: "RPGs and adventure titles are the go-to." },
  { Icon: PenLine, title: "Writing game reviews", desc: "Breaks games down after the credits roll." },
  { Icon: Code2, title: "Coding", desc: "Tinkers with small projects and tools between streams." },
  { Icon: Trophy, title: "Sports", desc: "Loves watching baseball and hockey." },
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
                text={`About ${creator.name}`}
                tag="the person behind the reviews"
                className="wordmark text-5xl sm:text-6xl lg:text-7xl text-void"
                tagClassName="text-void/55"
              />
            </h1>

            <div className="mt-8 space-y-4 max-w-xl text-sm sm:text-base leading-relaxed text-ink">
              <p>
                {creator.name} is a <span className="hl">game reviewer, streamer and VTuber</span> with strong
                opinions on games. Most reviews come from games played on stream, but not all of them. Some
                games are better played off stream and are still worth reviewing, so they get written up here too.
              </p>
              <p>
                Every review is built on a <span className="hl">credits-rolling playthrough</span>. Nothing gets
                scored early, nothing gets adjusted to match the crowd. If a beloved game didn't land, the write-up
                says exactly why. If a quiet one did, it gets the same word count.
              </p>
              <p>
                The <Link to="/reviews" className="hl underline decoration-blush decoration-2 underline-offset-4">reviews</Link> are
                the main event, the <Link to="/tier-list" className="hl underline decoration-blush decoration-2 underline-offset-4">tier list</Link> is
                where they all settle, and the <Link to="/guidelines" className="hl underline decoration-blush decoration-2 underline-offset-4">guidelines</Link> explain
                why a 5 can still land in F.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <CapsuleButton href={creator.twitch.url} target="_blank" rel="noopener noreferrer" icon={Twitch} className="!bg-mint !border-mint">
                Follow on Twitch
              </CapsuleButton>
              <CapsuleButton href={creator.youtube.url} target="_blank" rel="noopener noreferrer" icon={Youtube} className="!bg-transparent !border-void/25">
                Subscribe
              </CapsuleButton>
              <CapsuleButton as={Link} to="/contact" icon={Mail} className="!bg-transparent !border-void/25">
                Get in touch
              </CapsuleButton>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            <CreatorCard reviews={reviews} loading={loading} className="w-full max-w-[21rem] rotate-2" />
            <p className="text-xs text-void/50">Click the card to flip it.</p>
          </div>
        </div>
      </section>

      <section className="relative pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 dex-panel">
            <h2 className="dex-title">Profile</h2>
            <dl>
              {PROFILE.map(({ label, value }) => (
                <div key={label} className="dex-row">
                  <dt className="dex-label">{label}</dt>
                  <dd className="text-void">{value}</dd>
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
          <Wordmark text="Where to watch" className="wordmark text-4xl sm:text-5xl text-void" />
          <div className={`mt-10 grid grid-cols-1 gap-6 ${creator.pixie.url ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            <WatchCard
              href={creator.twitch.url}
              color="#A58BF2"
              Icon={Twitch}
              title={`Twitch · ${creator.twitch.handle}`}
              body="Long sessions and full playthroughs, live."
            />
            <WatchCard
              href={creator.youtube.url}
              color="#FF6F61"
              Icon={Youtube}
              title={`YouTube · ${creator.youtube.handle}`}
              body="The main channel. No new uploads for now."
            />
            {creator.pixie.url && (
              <WatchCard
                href={creator.pixie.url}
                color="#E693B3"
                Icon={Youtube}
                title={`YouTube · ${creator.pixie.handle || creator.pixie.name}`}
                body="The second channel, and where new videos are going up."
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
        <div className="font-gothic font-bold text-lg text-void leading-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-void/75">{body}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 shrink-0 text-void/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
