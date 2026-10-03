import { Trophy, Gamepad2, Star, Frown, Sparkles } from "lucide-react";

function buildEntries(year) {
  return [
    {
      icon: Star,
      title: "Favorite Gaming Moments",
      placeholder: "What moments stood out this year? A boss fight that made your heart race? A story beat that stuck with you? A co-op session with friends?",
    },
    {
      icon: Gamepad2,
      title: "How My Gaming Changed",
      placeholder: "Did you discover a new genre? Start playing on a different platform? Change how you approach games? Maybe you started achievement hunting or went full backlog mode.",
    },
    {
      icon: Sparkles,
      title: "Biggest Surprises",
      placeholder: "Which games exceeded your expectations? Any hidden gems or titles that came out of nowhere and blew you away?",
    },
    {
      icon: Frown,
      title: "Biggest Disappointments",
      placeholder: "Which games didn't live up to the hype? Any sequels that missed the mark or beloved franchises that let you down?",
    },
    {
      icon: Trophy,
      title: "What I Want to Play Next Year",
      placeholder: `What's on your radar for ${year + 1}? Upcoming releases, backlog titles you're excited to finally start, or series you want to dive deeper into?`,
    },
  ];
}

export function Achievements({ year }) {
  const entries = buildEntries(year);
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="wordmark text-4xl sm:text-5xl text-void">My year in gaming</h2>
          <p className="mt-3 text-sm text-void/60">Highlights from the year.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.title} className="dex-panel">
                <span className="watch-tile-icon mb-4" style={{ background: "var(--blush)" }} aria-hidden="true">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <h3 className="dex-title">{entry.title}</h3>
                <p className="text-sm text-void/80 leading-relaxed">{entry.placeholder}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
