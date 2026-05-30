import React from "react";
import { Snowflake } from "lucide-react";

const guidelinesBg =
  "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/947753cc575b5490e2b8109aaaf77010fe992d706c51a121194faf770d497246.png";

const tiers = [
  { range: "9.5 – 10.0", tier: "S", label: "Hall of fame", color: "from-cyan-400 to-cyan-600", desc: "Genre-defining. I'll be replaying this in five years." },
  { range: "9.0 – 9.4", tier: "A", label: "Essential", color: "from-blue-400 to-blue-600", desc: "Buy it. Tell your friends. Don't wait for a sale." },
  { range: "8.0 – 8.9", tier: "B", label: "Strongly recommend", color: "from-emerald-400 to-emerald-600", desc: "Excellent within its lane. A few rough edges but worth your time." },
  { range: "7.0 – 7.9", tier: "C", label: "Worth a look", color: "from-amber-400 to-amber-600", desc: "Has real merit but real flaws. Wait for a discount if you're picky." },
  { range: "5.5 – 6.9", tier: "D", label: "Conditional", color: "from-orange-400 to-orange-600", desc: "Only if you love the genre or the studio. Otherwise — skip." },
  { range: "0.0 – 5.4", tier: "F", label: "Avoid", color: "from-red-500 to-red-700", desc: "Broken, cynical, or simply not finished. Your time is better spent elsewhere." },
];

const principles = [
  {
    title: "I finish the game",
    body: "Every review is based on a credits-rolling playthrough. For open-ended games (sims, roguelikes), I commit a defined number of hours — usually 30+ — and I disclose it.",
  },
  {
    title: "Scores are categorical, not surgical",
    body: "An 8.4 and an 8.6 are functionally the same. The tier matters more than the decimal. The decimals are there to break ties.",
  },
  {
    title: "I review the game I played",
    body: "Bugs at launch count. Day-one patches I had access to also count. I'll note if a later patch significantly changed my opinion.",
  },
  {
    title: "Context over consensus",
    body: "I don't adjust my score to match Metacritic. If I bounced off a beloved game, I'll tell you exactly why, then trust you to decide.",
  },
  {
    title: "Genre over hype",
    body: "A great walking sim and a great looter shooter aren't competing against each other. I score against the best of that genre, not the year's discourse.",
  },
];

export default function Guidelines() {
  return (
    <div data-testid="guidelines-page">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={guidelinesBg} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/85 to-slate-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs tracking-[0.25em] uppercase text-cyan-300 mb-6">
            <Snowflake className="w-3 h-3" /> Methodology
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-50 max-w-3xl leading-[1.05]">
            How I score, and what those scores actually mean.
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            A score should tell you something. Here are the rules I hold myself to so the number on the badge isn't just decoration.
          </p>
        </div>
      </section>

      {/* Tier table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8" data-testid="tier-table">
        <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-6">The 0–10 scale</p>
        <div className="grid gap-4">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className="grid grid-cols-12 gap-4 items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition"
            >
              <div className="col-span-2 md:col-span-1">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${t.color} grid place-items-center font-display text-slate-950 text-2xl font-bold`}>
                  {t.tier}
                </div>
              </div>
              <div className="col-span-10 md:col-span-3">
                <div className="text-xs tracking-[0.2em] uppercase text-cyan-500 mb-1">{t.range}</div>
                <div className="font-display text-xl text-slate-50">{t.label}</div>
              </div>
              <div className="col-span-12 md:col-span-8 text-slate-300 leading-relaxed">
                {t.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">House rules</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-50 tracking-tight max-w-2xl">
          Five things I never compromise on.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <div
              key={i}
              data-testid={`principle-${i}`}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-7 hover:border-cyan-500/30 transition relative overflow-hidden"
            >
              <div className="font-display text-6xl text-cyan-500/15 absolute top-2 right-4 select-none">
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <h3 className="font-display text-xl text-slate-50 mb-3 relative">{p.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm relative">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="border-t border-white/5 pt-12">
          <p className="font-display italic text-xl lg:text-2xl text-slate-300 leading-relaxed">
            "If a number can't tell you whether to buy a game, the review wasn't worth writing."
          </p>
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mt-4">— the only manifesto here</p>
        </div>
      </section>
    </div>
  );
}
