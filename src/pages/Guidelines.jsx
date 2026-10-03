import { Link } from "react-router-dom";
import { Gamepad2, Trophy } from "lucide-react";
import { Wordmark, CapsuleButton } from "../components/ui/decor";
import { getTierColor, getRarity } from "../lib/tier";
import { usePageTitle } from "../hooks/usePageTitle";

const tiers = [
  { tier: "★", label: "Favorite", desc: "Personal favorite. Not always the best, but the one that stuck with me the most." },
  { tier: "S+", label: "Masterpiece", desc: "Everything I expected and more. A flawless experience that I can't stop thinking about." },
  { tier: "S", label: "Elite", desc: "Exceptional from beginning to end. A few minor flaws exist, but they never get in the way." },
  { tier: "A", label: "Excellent", desc: "Easy to recommend. Consistently engaging with only a handful of flaws." },
  { tier: "B", label: "Great", desc: "A strong experience that delivers on its promises. Some noticeable flaws hold it back." },
  { tier: "C", label: "Above Average", desc: "Moments of brilliance surrounded by too much filler." },
  { tier: "D", label: "Below Average", desc: "The vision was there. Almost nothing else was." },
  { tier: "F", label: "Avoid", desc: "Either scored 3 or below, or a game I can't recommend regardless of the score." },
];

const principles = [
  { title: "I finish the game", body: "Every review is based on a credits-rolling playthrough. I finish almost everything I play." },
  { title: "Scores are a range not a ranking", body: "An 8 and a 9 tell you something. The difference between two 8s tells you nothing." },
  { title: "I review the game I played", body: "Bugs at launch count. Day one patches I had access to also count." },
  { title: "Ignore the crowd", body: "I do not adjust scores to match others. If I disliked a beloved game I will tell you exactly why." },
  { title: "Genre over hype", body: "A great RPG and a great FPS are not competing for the same score." },
  { title: "The tier is the verdict", body: "The score rates the game. The tier says whether I think you should play it, which is why a 5 can still land in F." },
];

export default function Guidelines() {
  usePageTitle("Guidelines");
  return (
    <div>
      <div className="relative pb-20 md:pb-28">
        <section className="relative pt-12 lg:pt-16">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Wordmark text="Guidelines" tag="how I score" className="wordmark text-5xl sm:text-7xl lg:text-8xl text-void" tagClassName="text-void/50" />
            <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-ink">
              A score tells you how good the game is. The tier tells you whether I think you should play it.
              Each tier below carries a short note on what that ranking means to me. Spot a tier on a review and
              look it up here.
            </p>
          </div>
        </section>

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16">
          <Wordmark text="The tiers" className="wordmark text-4xl sm:text-5xl text-void" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(({ tier, label, desc }) => {
              const rarity = getRarity(tier);
              return (
                <div key={tier} className="dex-panel flex flex-col" style={{ "--tier-color": getTierColor(tier) }}>
                  <div className="flex items-center gap-3">
                    <span className="tier-stamp">{tier}</span>
                    <h3 className="dex-title !mb-0">{label}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-void/85">{desc}</p>
                  <div className={`rarity-${rarity.tone} mt-auto pt-4 flex justify-end`}>
                    <span className="pc-rarity !text-base" aria-hidden="true">{rarity.symbol.repeat(rarity.stars)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-28">
          <Wordmark text="The principles" className="wordmark text-4xl sm:text-5xl text-void" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle) => (
              <div key={principle.title} className="dex-panel">
                <h3 className="dex-title">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-void/85">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
          <p className="text-2xl lg:text-3xl leading-relaxed text-void/85 italic">
            &ldquo;The score gets you in the door. The review tells you if you should stay.&rdquo;
          </p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <CapsuleButton as={Link} to="/tier-list" icon={Trophy} className="!bg-mint !border-mint">See the tier list</CapsuleButton>
            <CapsuleButton as={Link} to="/reviews" icon={Gamepad2} className="!bg-transparent !border-void/25">Browse reviews</CapsuleButton>
          </div>
        </section>
      </div>
    </div>
  );
}
