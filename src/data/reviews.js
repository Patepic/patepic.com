import { fetchReviews } from "../lib/api";

export async function getPlatforms() {
  const reviews = await fetchReviews();
  const list = Array.isArray(reviews) ? reviews : reviews?.items ?? [];
  return [...new Set(list.map((r) => r.platform).filter(Boolean))].sort();
}

export async function getGenres() {
  const reviews = await fetchReviews();
  const list = Array.isArray(reviews) ? reviews : reviews?.items ?? [];
  return [...new Set(list.map((r) => r.genre).filter(Boolean))].sort();
}

export function scoreToTier(score) {
  if (score >= 9.5) return "S";
  if (score >= 9.0) return "A";
  if (score >= 8.0) return "B";
  if (score >= 7.0) return "C";
  if (score >= 5.5) return "D";
  return "F";
}
