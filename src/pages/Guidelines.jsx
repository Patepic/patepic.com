import { Snowflake } from "lucide-react";

const tiers = [
  {
    tier: "★",
    label: "Favorite",
    color: "from-pink-400 to-rose-500 text-white",
    desc: "Personal favorite. Not always the best, but the one that stuck with me the most.",
  },
  {
    tier: "S",
    label: "Masterpiece",
    color: "from-sky-400 to-blue-500 text-white",
    desc: "Dropped everything to finish it. It may have a few flaws, but none that mattered.",
  },
  {
    tier: "A",
    label: "Excellent",
    color: "from-blue-400 to-indigo-600 text-white",
    desc: "Stayed with me after the credits. Minor issues, nothing that undercuts the experience.",
  },
  {
    tier: "B",
    label: "Great",
    color: "from-emerald-400 to-teal-600 text-white",
    desc: "Delivered on what it promised. Not essential, but consistently good. Solid from start to finish, even if it doesn't push boundaries.",
  },
  {
    tier: "C",
    label: "Above Average",
    color: "from-yellow-400 to-amber-600 text-white",
    desc: "Moments of brilliance surrounded by too much filler. Fans of the genre might find enough here. Everyone else should look elsewhere first.",
  },
  {
    tier: "D",
    label: "Below Average",
    color: "from-orange-300 to-orange-500 text-white",
    desc: "The vision was there. Almost nothing else was. Hard to justify recommending even to genre fans.",
  },
  {
    tier: "F",
    label: "Avoid",
    color: "from-red-500 to-rose-700 text-white",
    desc: "Either scored 3 or below, or it's a game I can't recommend regardless of the score. Finished it so the score is honest. That's the only reason I made it to the end.",
  },
];

const principles = [
  {
    title: "I finish the game",
    body: "Every review is based on a credits-rolling playthrough. I finish almost everything I play. Less than 1% of games don't get completed, and I'll still review those if I've gone far enough to give a fair take. For open-ended games, I commit to a defined number of hours before reviewing.",
  },
  {
    title: "Scores are a range not a ranking",
    body: "An 8 and a 9 tell you something. The difference between two 8s tells you nothing. Read the review, not just the number.",
  },
  {
    title: "I review the game I played",
    body: "Bugs at launch count. Day one patches I had access to also count. If a later patch changed something significant I will say so.",
  },
  {
    title: "Ignore the crowd",
    body: "I do not adjust scores to match others. If I disliked a beloved game I will tell you exactly why and you can disagree with me.",
  },
  {
    title: "Genre over hype",
    body: "A great RPG and a great FPS are not competing for the same score. I judge against the best in that genre not against each other.",
  },
];

export default function Guidelines() {
  return (
    <div data-testid="guidelines-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-xs tracking-[0.25em] uppercase text-sky-700 mb-6 shadow-sm">
          <Snowflake className="w-3 h-3" /> Methodology
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-900 max-w-3xl leading-[1.05]">
          How I score. What the tiers actually mean.
        </h1>
        <p className="mt-6 text-lg text-slate-500 max-w-2xl">
          A score tells you how good the game is. The tier tells you whether I
          think you should play it.
        </p>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-testid="tier-table"
      >
        <div className="grid gap-4">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-200 hover:shadow-sm transition"
            >
              <div className="col-span-2 md:col-span-1">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${t.color} grid place-items-center font-display text-2xl font-bold`}
                >
                  {t.tier}
                </div>
              </div>
              <div className="col-span-10 md:col-span-3">
                <div className="font-display text-xl text-slate-900">
                  {t.label}
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 text-slate-600 leading-relaxed">
                {t.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">
          House rules
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight max-w-2xl">
          Five things I never compromise on.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <div
              key={i}
              data-testid={`principle-${i}`}
              className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-sky-200 transition relative overflow-hidden"
            >
              <div className="font-display text-6xl text-sky-100 absolute top-2 right-4 select-none">
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <h3 className="font-display text-xl text-slate-900 mb-3 relative">
                {p.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm relative">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="border-t border-slate-200 pt-12">
          <p className="font-display italic text-xl lg:text-2xl text-slate-700 leading-relaxed">
            "The score gets you in the door. The review tells you if you should
            stay."
          </p>
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mt-4">
            — the only rule that matters
          </p>
        </div>
      </section>
    </div>
  );
}
