import { Trophy, Gamepad2, Star, Frown, Sparkles } from "lucide-react";
import { getYearHighlights } from "../../data/yearHighlights";

const ENTRIES = [
  { key: "moments", icon: Star, title: "Favorite Gaming Moments" },
  { key: "changed", icon: Gamepad2, title: "How My Gaming Changed" },
  { key: "surprises", icon: Sparkles, title: "Biggest Surprises" },
  { key: "disappointments", icon: Frown, title: "Biggest Disappointments" },
  { key: "nextYear", icon: Trophy, title: "What I Want to Play Next Year" },
];

export function Achievements({ year }) {
  const highlights = getYearHighlights(year);
  const entries = ENTRIES.map((entry) => ({ ...entry, text: String(highlights[entry.key] || "").trim() })).filter((entry) => entry.text);
  if (entries.length === 0) return null;
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="wordmark text-4xl sm:text-5xl text-charcoal-brown">My year in gaming</h2>
          <p className="mt-3 text-sm text-charcoal-brown/80">Highlights from my year.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.title} className="dex-panel">
                <span className="watch-tile-icon mb-4" aria-hidden="true">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <h3 className="dex-title">{entry.title}</h3>
                <p className="text-sm text-charcoal-brown/90 leading-relaxed">{entry.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
