import { Trophy, Gamepad2, Star, Frown, Sparkles, PenLine } from "lucide-react";

const ENTRIES = [
  {
    icon: Star,
    rarity: "Common",
    rarityClass: "text-pixel-mint",
    medalClass: "bg-pixel-mint",
    title: "Favorite Gaming Moments",
    placeholder:
      "What moments stood out this year? A boss fight that made your heart race? A story beat that stuck with you? A co-op session with friends?",
  },
  {
    icon: Gamepad2,
    rarity: "Rare",
    rarityClass: "text-pixel-mint",
    medalClass: "bg-pixel-mint",
    title: "How My Gaming Changed",
    placeholder:
      "Did you discover a new genre? Start playing on a different platform? Change how you approach games? Maybe you started achievement hunting or went full backlog mode.",
  },
  {
    icon: Sparkles,
    rarity: "Epic",
    rarityClass: "text-pixel-mint",
    medalClass: "bg-pixel-mint",
    title: "Biggest Surprises",
    placeholder:
      "Which games exceeded your expectations? Any hidden gems or titles that came out of nowhere and blew you away?",
  },
  {
    icon: Frown,
    rarity: "Debuff",
    rarityClass: "text-pixel-mint",
    medalClass: "bg-pixel-mint",
    title: "Biggest Disappointments",
    placeholder:
      "Which games didn't live up to the hype? Any sequels that missed the mark or beloved franchises that let you down?",
  },
  {
    icon: Trophy,
    rarity: "Legendary",
    rarityClass: "text-pixel-mint",
    medalClass: "bg-pixel-mint",
    title: "What I Want to Play Next Year",
    placeholder:
      "What's on your radar for 2027? Upcoming releases, backlog titles you're excited to finally start, or series you want to dive deeper into?",
  },
];

export function PersonalReflection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-pixel-black text-[0.7rem] font-bold uppercase tracking-[0.06em] mb-5">
            <Trophy className="w-3.5 h-3.5" />
            Achievements Unlocked
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-pixel-black tracking-tight">
            My Year in Gaming
          </h2>
          <p className="mt-4 text-pixel-black max-w-lg mx-auto">
            Five reflections, unlocked the way this year actually played out.
          </p>
        </div>

        <div className="space-y-4">
          {ENTRIES.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div
                key={entry.title}
                className="group relative flex items-center gap-4 sm:gap-5 rounded-2xl bg-pixel-forest px-4 sm:px-6 py-4 sm:py-5"
              >
                <div
                  className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl grid place-items-center shadow-[0_0_20px_-4px_rgba(255,255,255,0.15)] ${entry.medalClass}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.06em] text-pixel-blush/80">
                      Achievement Unlocked
                    </p>
                    <span
                      className={`text-[0.6rem] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full border ${entry.rarityClass}`}
                    >
                      {entry.rarity}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-base sm:text-lg text-pixel-blush tracking-tight">
                    {entry.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-pixel-blush/80 leading-relaxed">
                    {entry.placeholder}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}