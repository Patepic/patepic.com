// Game reviews data — markdown-style content stored as strings.
// Add new reviews by appending an object to the `reviews` array.

export const PLATFORMS = ["PC", "PS5", "Xbox Series X|S", "Switch", "Mobile"];
export const GENRES = [
  "RPG",
  "Action",
  "Adventure",
  "Shooter",
  "Roguelike",
  "Simulation",
  "Indie",
  "Strategy",
];

// Score → tier mapping
export function scoreToTier(score) {
  if (score >= 9.5) return "S";
  if (score >= 9.0) return "A";
  if (score >= 8.0) return "B";
  if (score >= 7.0) return "C";
  if (score >= 5.5) return "D";
  return "F";
}

const placeholderCovers = {
  controller1: "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg",
  controller2: "https://images.pexels.com/photos/34592708/pexels-photo-34592708.jpeg",
  holo: "https://static.prod-images.emergentagent.com/jobs/92760775-486b-4dcb-9506-0ee67c0055c1/images/a8aa1bf7463707cb9207aefe82931e9bcd9f6ade955f4ff89fb2dadd637f6b0b.png",
};

export const reviews = [
  {
    slug: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    studio: "Larian Studios",
    year: 2023,
    platform: "PC",
    platforms: ["PC", "PS5", "Xbox Series X|S"],
    genre: "RPG",
    score: 9.8,
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    verdict:
      "A once-in-a-generation CRPG that respects your time, your choices, and your imagination.",
    pros: [
      "Staggering depth of player agency",
      "Performance-grade voice acting",
      "Turn-based combat that finally feels cinematic",
      "Co-op that actually works",
    ],
    cons: [
      "Act 3 performance dips on lower-end rigs",
      "UI can feel cluttered during long fights",
    ],
    body: `## A new high water mark for the genre\n\nLarian didn't just adapt 5th Edition D&D — they translated the joy of a great tabletop night into pixels. Every encounter feels authored, every NPC remembered, every dumb decision applauded with consequences.\n\n### Combat that breathes\nThe turn-based system is **patient with newcomers** but rewards system mastery. Surfaces, height, and verticality turn arenas into puzzles you solve with violence.\n\n### Companions worth caring about\nShadowheart, Karlach, Astarion — each has an arc that competes with the main plot. Their reactions to your choices are nuanced enough that you'll second-guess yourself constantly.\n\n> "The best Dungeon Master is the one who lets the players surprise themselves."\n\nBG3 lives that ethos for 100+ hours.`,
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    studio: "FromSoftware",
    year: 2022,
    platform: "PS5",
    platforms: ["PC", "PS5", "Xbox Series X|S"],
    genre: "Action",
    score: 9.6,
    cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
    verdict:
      "Open-world design reinvented through the lens of a studio that doesn't make tutorials.",
    pros: [
      "World density without map clutter",
      "Combat finally given room to breathe",
      "Genuinely surprising late-game vistas",
    ],
    cons: ["Late-game performance hitches", "Some legacy dungeons feel reused"],
    body: `## Welcome to the Lands Between\n\nFromSoftware's open-world experiment doesn't hold your hand. That's the point. Every reward is earned, every shortcut self-discovered, every boss a story you'll tell your friends.\n\n### Spectacle with substance\nThe game's silhouettes are unforgettable — Malenia, Radahn, the Erdtree itself. But the real magic is the *quiet* between fights, riding Torrent across foggy hills with no marker telling you where to go.`,
  },
  {
    slug: "tears-of-the-kingdom",
    title: "Tears of the Kingdom",
    studio: "Nintendo EPD",
    year: 2023,
    platform: "Switch",
    platforms: ["Switch"],
    genre: "Adventure",
    score: 9.5,
    cover: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=1600&q=80",
    verdict: "Breath of the Wild's playground, now with a physics engine you can break in half.",
    pros: ["Ultrahand turns the world into LEGO", "Sky islands feel genuinely new", "Best dungeon design in the series in 20 years"],
    cons: ["Performance hitches in the Depths", "Weapon durability remains divisive"],
    body: `## A toy box of impossible scale\n\nUltrahand isn't a gimmick — it's the **entire game**. Nintendo handed players a physics engine and a glue stick, then watched the internet build vehicles, war crimes, and dancing skeletons.`,
  },
  {
    slug: "hades-2",
    title: "Hades II",
    studio: "Supergiant Games",
    year: 2024,
    platform: "PC",
    platforms: ["PC"],
    genre: "Roguelike",
    score: 9.2,
    cover: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1600&q=80",
    verdict: "A sequel that refuses to coast. Bigger, weirder, witchier.",
    pros: ["Melinoë is instantly iconic", "Two distinct overworld paths", "Cast still has Supergiant magic"],
    cons: ["Early access pacing is uneven", "Some weapons outshine others"],
    body: `## Witchcraft, but make it speedrunnable\n\nSupergiant didn't reinvent the wheel — they just made it cast spells. Mana, omegas, hexes — the new systems layer beautifully onto the bones of the original.`,
  },
  {
    slug: "spider-man-2",
    title: "Marvel's Spider-Man 2",
    studio: "Insomniac Games",
    year: 2023,
    platform: "PS5",
    platforms: ["PS5"],
    genre: "Action",
    score: 8.9,
    cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80",
    verdict: "Two Spider-Men, one polished triple-A blockbuster. Predictably excellent.",
    pros: ["Web-wings are a revelation", "Venom presence looms thrillingly", "Character switching done right"],
    cons: ["Side activities feel familiar", "Story rushes its third act"],
    body: `## Webhead, evolved\n\nThe wings transform traversal from *fun* to *meditative*. You'll cancel fast travel for the joy of catching a thermal off Times Square.`,
  },
  {
    slug: "phantom-liberty",
    title: "Cyberpunk 2077: Phantom Liberty",
    studio: "CD Projekt Red",
    year: 2023,
    platform: "PC",
    platforms: ["PC", "PS5", "Xbox Series X|S"],
    genre: "RPG",
    score: 8.7,
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    verdict: "The expansion Cyberpunk always deserved. Idris Elba sells every line.",
    pros: ["Dogtown is a masterclass in vertical level design", "Spy-thriller tone lands", "Idris Elba"],
    cons: ["Requires a beefy GPU for path tracing", "Endings will leave you hollow"],
    body: `## Redemption arc, completed\n\nCDPR didn't fix Cyberpunk by adding more — they fixed it by curating. Phantom Liberty is **smaller, sharper, and meaner** than the base game.`,
  },
  {
    slug: "stardew-valley",
    title: "Stardew Valley",
    studio: "ConcernedApe",
    year: 2016,
    platform: "Switch",
    platforms: ["PC", "Switch", "PS5", "Xbox Series X|S", "Mobile"],
    genre: "Simulation",
    score: 9.7,
    cover: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=1600&q=80",
    verdict: "A solo dev built the coziest game on Earth. Then kept updating it. Forever.",
    pros: ["Endlessly approachable", "Genuine emotional anchors", "Free updates that put AAA studios to shame"],
    cons: ["Late-game can feel directionless", "Marriage UI is still a bit clunky"],
    body: `## A farm, a town, a quiet revolution\n\nStardew is the rare game that **respects your bedtime**. You came for the turnips. You stayed for Linus.`,
  },
  {
    slug: "starfield",
    title: "Starfield",
    studio: "Bethesda",
    year: 2023,
    platform: "Xbox Series X|S",
    platforms: ["PC", "Xbox Series X|S"],
    genre: "RPG",
    score: 7.2,
    cover: placeholderCovers.controller1,
    verdict: "A thousand planets, a hundred good ideas, and one tired engine holding it back.",
    pros: ["Ship building is a sandbox", "Some quest lines genuinely shine", "Constellation faction is great"],
    cons: ["Loading screens, loading screens, loading screens", "Procedural worlds feel hollow", "Aged dialogue tech"],
    body: `## The galaxy is big. Sometimes too big.\n\nThere's a wonderful game inside Starfield — it's just buried under fast-travel menus and procedural sameness. The faction quests sing, but the cosmic awe leaks out somewhere between cutscene and load screen.`,
  },
];

export function getReviewBySlug(slug) {
  return reviews.find((r) => r.slug === slug);
}
