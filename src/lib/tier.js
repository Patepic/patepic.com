export const TIERS = ["★", "S+", "S", "A", "B", "C", "D", "F"];

const TIER_COLOR = {
  "★": "#F4C542",
  "S+": "#FF6F61",
  "S": "#FFA24C",
  "A": "#9BD66A",
  "B": "#4FC7B3",
  "C": "#6BA3F2",
  "D": "#A58BF2",
  "F": "#9CA5B4",
};

const TIER_META = {
  "★": "Favorite",
  "S+": "Masterpiece",
  "S": "Elite",
  "A": "Excellent",
  "B": "Great",
  "C": "Above Average",
  "D": "Below Average",
  "F": "Avoid",
};

export const getTierLabel = (tier) => TIER_META[tier] || "";

export const getTier = (rating, { recommended, cons, isFeatured } = {}) => {
  if (isFeatured) return "★";
  const score = parseFloat(rating);
  const flawCount = Array.isArray(cons) ? cons.length : 0;
  const hasNoFlaws = Array.isArray(cons) && cons.includes("Hard to point to any real flaws");
  if (score <= 3 || recommended === "no") return "F";
  if (score <= 5) return "D";
  if (score <= 6) return "C";
  if (score === 7) return flawCount <= 2 ? "B" : "C";
  if (score === 8) return flawCount <= 2 ? "A" : "B";
  if (score === 9) { if (hasNoFlaws) return "S+"; return flawCount <= 2 ? "S" : "A"; }
  if (score === 10) return hasNoFlaws ? "S+" : "S";
  return "C";
};

export const getTierColor = (tier) => TIER_COLOR[tier] || TIER_COLOR.A;

const RARITY = {
  "F":  { stars: 1, symbol: "●", tone: "black" },
  "D":  { stars: 1, symbol: "◆", tone: "black" },
  "C":  { stars: 1, symbol: "★", tone: "black", foil: "art" },
  "B":  { stars: 2, symbol: "★", tone: "black", foil: "art" },
  "A":  { stars: 2, symbol: "★", tone: "silver", foil: "card", fullArt: true, texture: "light" },
  "S":  { stars: 1, symbol: "★", tone: "gold", foil: "card", fullArt: true, texture: "light" },
  "S+": { stars: 2, symbol: "★", tone: "gold", foil: "card", fullArt: true, texture: "heavy" },
  "★":  { stars: 3, symbol: "★", tone: "gold", foil: "card", fullArt: true, texture: "light", gold: true },
};

export const getRarity = (tier) => RARITY[tier] || RARITY.F;
