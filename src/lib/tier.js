export const TIERS = ["★", "S+", "S", "A", "B", "C", "D", "F"];

const TIER_COLOR = {
  "★": "#DE5A94",
  "S+": "#A08FDD",
  "S": "#6FB1E0",
  "A": "#6CC4A1",
  "B": "#A9CF73",
  "C": "#EDD36B",
  "D": "#F29A5C",
  "F": "#E46A6A",
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

export const NO_FLAWS = "Hard to point to any real flaws";

export const getTier = (rating, { recommended, cons, isFeatured } = {}) => {
  if (isFeatured) return "★";
  const score = parseFloat(rating);
  const flawCount = Array.isArray(cons) ? cons.length : 0;
  const hasNoFlaws = Array.isArray(cons) && cons.includes(NO_FLAWS);
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
  "F":  { stars: 1, symbol: "✕", tone: "black" },
  "D":  { stars: 1, symbol: "◆", tone: "black" },
  "C":  { stars: 1, symbol: "★", tone: "black", foil: "art" },
  "B":  { stars: 2, symbol: "★", tone: "black", foil: "art" },
  "A":  { stars: 2, symbol: "★", tone: "silver", foil: "card", fullArt: true },
  "S":  { stars: 1, symbol: "★", tone: "gold", foil: "card", fullArt: true },
  "S+": { stars: 2, symbol: "★", tone: "gold", foil: "card", fullArt: true },
  "★":  { stars: 3, symbol: "★", tone: "gold", foil: "card", fullArt: true, gold: true },
};

export const getRarity = (tier) => RARITY[tier] || RARITY.F;

const proCount = (review) => (Array.isArray(review?.pros) ? review.pros.length : 0);

const conCount = (review) => {
  const cons = review?.cons;
  if (!Array.isArray(cons)) return 0;
  if (cons.includes(NO_FLAWS)) return 0;
  return cons.length;
};

const reviewScore = (review) => parseFloat(review?.rating) || 0;

const reviewTimestamp = (review) =>
  new Date(review?.date || review?.created_at || 0).getTime();

/** Higher pros, fewer cons, higher score, then newer date. */
export const compareReviewsByStanding = (a, b) => {
  const byPros = proCount(b) - proCount(a);
  if (byPros !== 0) return byPros;

  const byCons = conCount(a) - conCount(b);
  if (byCons !== 0) return byCons;

  const byScore = reviewScore(b) - reviewScore(a);
  if (byScore !== 0) return byScore;

  return reviewTimestamp(b) - reviewTimestamp(a);
};

/** Tier list order: tier first, then standing within the tier. */
export const compareReviewsByRank = (a, b) => {
  const byTier = TIERS.indexOf(getTier(a.rating, a)) - TIERS.indexOf(getTier(b.rating, b));
  if (byTier !== 0) return byTier;
  return compareReviewsByStanding(a, b);
};

export const sortReviewsByStanding = (reviews) =>
  [...reviews].sort(compareReviewsByStanding);
