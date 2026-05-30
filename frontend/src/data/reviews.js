// Static constants and helpers used across the UI.
// Review *data* now lives in MongoDB and is fetched via /api/reviews.

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

export function scoreToTier(score) {
  if (score >= 9.5) return "S";
  if (score >= 9.0) return "A";
  if (score >= 8.0) return "B";
  if (score >= 7.0) return "C";
  if (score >= 5.5) return "D";
  return "F";
}
