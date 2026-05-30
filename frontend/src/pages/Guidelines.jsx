import { Snowflake } from "lucide-react";

const tiers = [
  { range: "9.5 – 10.0", tier: "S", label: "Hall of fame", color: "from-sky-500 to-blue-600 text-white", desc: "Genre-defining. I'll be replaying this in five years." },
  { range: "9.0 – 9.4",  tier: "A", label: "Essential",   color: "from-blue-400 to-indigo-500 text-white", desc: "Buy it. Tell your friends. Don't wait for a sale." },
  { range: "8.0 – 8.9",  tier: "B", label: "Strongly recommend", color: "from-emerald-400 to-emerald-600 text-white", desc: "Excellent within its lane. A few rough edges but worth your time." },
  { range: "7.0 – 7.9",  tier: "C", label: "Worth a look", color: "from-amber-300 to-amber-500 text-slate-900", desc: "Has real merit but real flaws. Wait for a discount if you're picky." },
  { range: "5.5 – 6.9",  tier: "D", label: "Conditional",  color: "from-orange-400 to-orange-600 text-white", desc: "Only if you love the genre or the studio. Otherwise — skip." },
  { range: "0.0 – 5.4",  tier: "F", label: "Avoid",        color: "from-rose-500 to-rose-700 text-white", desc: "Broken, cynical, or simply not finished. Your time is better spent elsewhere." },
];

const principles = [
  { title: "I finish the game", body: "Every review is based on a credits-rolling playthrough. For open-ended games, I commit a defined number of hours and I disclose it." },
  { title: "Scores are categorical, not surgical", body: "An 8.4 and an 8.6 are functionally the same. The tier matters more than the decimal." },
  { title: "I review the game I played", body: "Bugs at launch count. Day-one patches I had access to also count. I'll note if a later patch changed my opinion." },
  { title: "Context over consensus", body: "I don't adjust my score to match Metacritic. If I bounced off a beloved game, I'll tell you exactly why." },
  { title: "Genre over hype", body: "A great walking sim and a great looter shooter aren't competing. I score against the best of that genre." },
];

export default function Guidelines() {
  return (
    <div data-testid="guidelines-page">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-xs tracking-[0.25em] uppercase text-sky-700 mb-6 shadow-sm">
          <Snowflake className="w-3 h-3" /> Methodology
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-900 max-w-3xl leading-[1.05]">
          How I score, and what those scores actually mean.
        </h1>
        <p className="mt-6 text-lg text-slate-500 max-w-2xl">
          A score should tell you something. Here are the rules I hold myself to so the number on the badge isn't just decoration.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="tier-table">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-6">The 0–10 scale</p>
        <div className="grid gap-4">
          {tiers.map((t) => (
            <div key={t.tier} className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-200 hover:shadow-sm transition">
              <div className="col-span-2 md:col-span-1">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${t.color} grid place-items-center font-display text-2xl font-bold`}>
                  {t.tier}
                </div>
              </div>
              <div className="col-span-10 md:col-span-3">
                <div className="text-xs tracking-[0.2em] uppercase text-sky-700 mb-1">{t.range}</div>
                <div className="font-display text-xl text-slate-900">{t.label}</div>
              </div>
              <div className="col-span-12 md:col-span-8 text-slate-600 leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mb-4">House rules</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight max-w-2xl">
          Five things I never compromise on.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <div key={i} data-testid={`principle-${i}`} className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-sky-200 transition relative overflow-hidden">
              <div className="font-display text-6xl text-sky-100 absolute top-2 right-4 select-none">
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <h3 className="font-display text-xl text-slate-900 mb-3 relative">{p.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm relative">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="border-t border-slate-200 pt-12">
          <p className="font-display italic text-xl lg:text-2xl text-slate-700 leading-relaxed">
            "If a number can't tell you whether to buy a game, the review wasn't worth writing."
          </p>
          <p className="text-xs tracking-[0.25em] uppercase text-sky-700 mt-4">— the only manifesto here</p>
        </div>
      </section>
    </div>
  );
}
