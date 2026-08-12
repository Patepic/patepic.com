import { Link } from "react-router-dom";
import { SectionTitle, Kicker } from "../components/ui/decor";

const tiers = [
  { tier: "★", label: "Favorite", chip: "bg-gold text-surface", desc: "Personal favorite. Not always the best, but the one that stuck with me the most." },
  { tier: "S+", label: "Masterpiece", chip: "bg-gold text-surface", desc: "Everything I expected and more. A flawless experience that I can't stop thinking about." },
  { tier: "S", label: "Elite", chip: "bg-gold text-surface", desc: "Exceptional from beginning to end. A few minor flaws exist, but they never get in the way." },
  { tier: "A", label: "Excellent", chip: "bg-crimson text-off-white", desc: "Easy to recommend. Consistently engaging with only a handful of flaws." },
  { tier: "B", label: "Great", chip: "bg-crimson text-off-white", desc: "A strong experience that delivers on its promises. Some noticeable flaws hold it back." },
  { tier: "C", label: "Above Average", chip: "bg-scarlet text-off-white", desc: "Moments of brilliance surrounded by too much filler." },
  { tier: "D", label: "Below Average", chip: "bg-scarlet text-off-white", desc: "The vision was there. Almost nothing else was." },
  { tier: "F", label: "Avoid", chip: "bg-scarlet text-off-white", desc: "Either scored 3 or below, or it's a game I can't recommend regardless of the score." },
];

const principles = [
  { title: "I finish the game", body: "Every review is based on a credits-rolling playthrough. I finish almost everything I play." },
  { title: "Scores are a range not a ranking", body: "An 8 and a 9 tell you something. The difference between two 8s tells you nothing." },
  { title: "I review the game I played", body: "Bugs at launch count. Day one patches I had access to also count." },
  { title: "Ignore the crowd", body: "I do not adjust scores to match others. If I disliked a beloved game I will tell you exactly why." },
  { title: "Genre over hype", body: "A great RPG and a great FPS are not competing for the same score." },
];

export default function Guidelines() {
  return (
    <div>
      <div className="relative bg-surface pb-20 md:pb-28 overflow-hidden">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 text-center">
          <Kicker>How I score</Kicker>
          <h1 className="display-heading -mt-1 text-5xl sm:text-6xl lg:text-7xl text-off-white">Guidelines</h1>
          <p className="mt-5 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-off-white/70">
            A score tells you how good the game is. The tier tells you whether I think you should play it.
          </p>
        </section>

        {/* Tier rows as bordered rounded cards */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
          <div className="space-y-4">
            {tiers.map((t) => (
              <div key={t.tier}
                className="rounded-2xl border border-off-white/10 bg-crimson p-4 sm:p-5 flex items-center gap-4 sm:gap-6 hover:border-off-white transition-colors">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full grid place-items-center shrink-0 font-display font-bold text-2xl ${t.chip}`}>
                  {t.tier}
                </div>
                <div className="min-w-0">
                  <div className="display-hero text-xl sm:text-2xl text-off-white">{t.label}</div>
                  <p className="mt-1 text-sm sm:text-sm leading-relaxed text-off-white/70">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* House rules */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-28">
          <div className="magazine-rule mb-6"><span>House rules</span></div>
          <SectionTitle>Five things I never compromise on.</SectionTitle>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <div key={p.title} className="relative overflow-hidden panel-framed rounded-2xl p-7">
                <div className="display-hero text-7xl absolute top-1 right-4 select-none pointer-events-none text-gold/25">
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="relative display-hero text-xl text-off-white mb-3">{p.title}</h3>
                <p className="relative text-sm leading-relaxed text-off-white/70">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
          <div className="pt-12 border-t border-off-white">
            <p className="accent-serif text-2xl lg:text-3xl leading-relaxed text-off-white">
              &ldquo;The score gets you in the door. The review tells you if you should stay.&rdquo;
            </p>
            <div className="magazine-rule mt-6 max-w-xs mx-auto"><span>the only rule that matters</span></div>
            <div className="mt-9 flex flex-wrap gap-3 justify-center">
              <Link to="/tier-list" className="pill pill-ember h-12 px-7 text-sm">See the tier list</Link>
              <Link to="/reviews" className="pill pill-outline h-12 px-7 text-sm">Browse reviews</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
