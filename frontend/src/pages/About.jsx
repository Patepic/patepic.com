import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Headphones, Snowflake } from "lucide-react";

const aboutImg =
  "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/da8bde4ec5a30380a4b792bf5d066036073fa49b2c523228a5cf15443fd2d585.png";

export default function About() {
  return (
    <div data-testid="about-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-500 mb-4">
            About the writer
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-slate-50 leading-[1.05]">
            One player. <br />
            <em className="text-cyan-300 not-italic">Full playthroughs.</em> <br />
            Cold takes.
          </h1>

          <div className="mt-10 space-y-6 text-slate-300 leading-relaxed text-base lg:text-lg">
            <p>
              Frostbyte started as a Notes app habit — finish a game, write down what worked, what didn't, what I wish more designers would steal. Eight years and a few hundred credits later, it's a publication.
            </p>
            <p>
              I write the way I want game reviews to read: long-form, honest about my taste, and never scored until the credits actually roll. No previews disguised as verdicts. No 9.5s for studio access.
            </p>
            <p>
              I'm a generalist by design — I'll play your prestige RPG, your sweaty roguelike, and your seven-hour walking sim with the same energy. The score tells you how much I'd recommend it. The review tells you whether <em>you</em> should care.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Fact icon={<Snowflake className="w-4 h-4" />} label="Currently playing" value="Hades II" />
            <Fact icon={<Headphones className="w-4 h-4" />} label="Soundtrack of choice" value="NieR: Automata OST" />
            <Fact icon={<Coffee className="w-4 h-4" />} label="Fuel" value="Iced oat latte" />
          </div>

          <div className="mt-12 flex gap-3 flex-wrap">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-sm"
              data-testid="about-cta-reviews"
            >
              Read the reviews
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/5 text-slate-100 text-sm"
              data-testid="about-cta-contact"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 via-transparent to-blue-500/20 rounded-3xl blur-2xl" />
            <img
              src={aboutImg}
              alt="Gaming setup with mechanical keyboard"
              className="relative rounded-3xl border border-white/10 w-full object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Fact = ({ icon, label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
    <div className="flex items-center gap-2 text-cyan-500 text-[0.65rem] tracking-[0.2em] uppercase mb-2">
      {icon} {label}
    </div>
    <div className="font-display text-base text-slate-100 leading-snug">{value}</div>
  </div>
);
