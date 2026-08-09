import { useMemo } from "react";

/**
 * Extracts the series/franchise name from a review title.
 * Handles patterns like "Game Name: Subtitle", "Game Name - Subtitle", etc.
 */
function extractSeries(title) {
  if (!title) return null;
  const cleaned = title.replace(/™|®|©/g, "").trim();
  
  const colonMatch = cleaned.match(/^([^:]+?)(?:\s*:|\s*–|\s*—|\s*-\s)/);
  if (colonMatch) return colonMatch[1].trim();
  
  const numberMatch = cleaned.match(/^(.+?)\s+#\d/);
  if (numberMatch) return numberMatch[1].trim();
  
  const endNumberMatch = cleaned.match(/^(.+?)\s+\d+$/);
  if (endNumberMatch) return endNumberMatch[1].trim();
  
  const theMatch = cleaned.match(/^(.+?),\s*The(?:\s|$)/i);
  if (theMatch) return theMatch[1].trim();
  
  return null;
}

/**
 * Determines if a review's date falls within 2026.
 * Uses the review's `date` field exclusively.
 */
function isReviewFrom2026(review) {
  if (!review?.date) return false;
  return review.date.includes("2026");
}

function parseReviewDate(review) {
  if (!review?.date) return new Date(0);
  const d = new Date(review.date);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function getReviewMonth(review) {
  const d = parseReviewDate(review);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Calculates all statistics for the Year in Gaming 2026 page.
 */
export function useYearInGamingData(reviews) {
  return useMemo(() => {
    const yearReviews = reviews.filter(isReviewFrom2026);
    
    if (yearReviews.length === 0) {
      return {
        reviews: [],
        totalReviews: 0,
        gamesPlayed: 0,
        gamesFinished: 0,
        averageScore: 0,
        highestRated: null,
        lowestRated: null,
        favoritePlatform: null,
        mostPlayedGenre: null,
        gameOfTheYear: null,
        mostReviewedFranchise: null,
        totalGenresPlayed: 0,
        totalPlatformsPlayed: 0,
        completionPercentage: 0,
        oldestGame: null,
        newestGame: null,
        biggestSurprise: null,
        biggestDisappointment: null,
        seriesMarathons: [],
        monthlyGames: {},
        genreCounts: {},
        platformCounts: {},
        hasData: false,
      };
    }

    // ── Basic Stats ──
    const totalReviews = yearReviews.length;
    const scores = yearReviews.map((r) => parseFloat(r.rating) || 0);
    const averageScore = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // ── Games Played / Finished (all reviews = finished games) ──
    const gamesPlayed = totalReviews;
    const gamesFinished = totalReviews; // every review is a finished game

    // ── Highest / Lowest Rated ──
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    // Find all games with the highest score. If multiple, use isFeatured or first chronologically
    const highestScorers = yearReviews.filter(
      (r) => parseFloat(r.rating) === highestScore
    );
    const highestRated = highestScorers.find((r) => r.isFeatured) || highestScorers[0] || null;
    
    const lowestRated = yearReviews.find(
      (r) => parseFloat(r.rating) === lowestScore
    ) || null;

    // ── Game of the Year ──
    // If GOTY is also the highest score, they should match
    const goty = yearReviews.find((r) => r.isFeatured) || highestRated;

    // ── Platform Stats ──
    const platformCounts = {};
    yearReviews.forEach((r) => {
      if (r.platform) {
        platformCounts[r.platform] = (platformCounts[r.platform] || 0) + 1;
      }
    });
    const platformEntries = Object.entries(platformCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const favoritePlatform = platformEntries[0]?.[0] || null;
    const totalPlatformsPlayed = platformEntries.length;

    // ── Genre Stats ──
    const genreCounts = {};
    yearReviews.forEach((r) => {
      const genres = Array.isArray(r.genre)
        ? r.genre
        : r.genre
        ? r.genre.split(",").map((g) => g.trim())
        : [];
      genres.forEach((g) => {
        if (g) genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const genreEntries = Object.entries(genreCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const mostPlayedGenre = genreEntries[0]?.[0] || null;
    const totalGenresPlayed = genreEntries.length;

    // ── Series / Franchise Detection ──
    const seriesGroups = {};
    yearReviews.forEach((r) => {
      const series = extractSeries(r.title);
      if (series) {
        if (!seriesGroups[series]) seriesGroups[series] = [];
        seriesGroups[series].push(r);
      }
    });
    const seriesMarathons = Object.entries(seriesGroups)
      .filter(([, games]) => games.length >= 5)
      .map(([series, games]) => ({
        series,
        games: games.sort(
          (a, b) => parseReviewDate(a) - parseReviewDate(b)
        ),
        count: games.length,
      }))
      .sort((a, b) => b.count - a.count);

    const franchiseEntries = Object.entries(seriesGroups).sort(
      (a, b) => b[1].length - a[1].length
    );
    const mostReviewedFranchise = franchiseEntries[0]?.[0] || null;

    // ── Monthly Grouping ──
    const monthlyGroups = {};
    yearReviews.forEach((r) => {
      const month = getReviewMonth(r);
      if (!monthlyGroups[month]) monthlyGroups[month] = [];
      monthlyGroups[month].push(r);
    });
    const sortedMonths = Object.keys(monthlyGroups).sort();
    const monthlyGames = {};
    sortedMonths.forEach((month) => {
      const [year, monthNum] = month.split("-");
      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString("en-US", { month: "long" });
      monthlyGames[month] = {
        monthName,
        year: parseInt(year),
        monthNum: parseInt(monthNum),
        games: monthlyGroups[month].sort(
          (a, b) => parseReviewDate(a) - parseReviewDate(b)
        ),
      };
    });

    // ── Completion Percentage ──
    const completionPercentage = totalReviews
      ? Math.round((gamesFinished / totalReviews) * 100)
      : 0;

    // ── Oldest / Newest Game (by review date) ──
    const sortedByDate = [...yearReviews].sort(
      (a, b) => parseReviewDate(a) - parseReviewDate(b)
    );
    const oldestGame = sortedByDate[0] || null;
    const newestGame = sortedByDate[sortedByDate.length - 1] || null;

    // ── Biggest Surprise / Disappointment ──
    const avgScore = averageScore;
    const biggestSurprise = yearReviews
      .filter((r) => parseFloat(r.rating) > avgScore + 1.5)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0] || null;
    const biggestDisappointment = yearReviews
      .filter((r) => parseFloat(r.rating) < avgScore - 1.5 && parseFloat(r.rating) > 0)
      .sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))[0] || null;

    return {
      reviews: yearReviews,
      totalReviews,
      gamesPlayed,
      gamesFinished,
      averageScore: Math.round(averageScore * 10) / 10,
      highestRated,
      lowestRated,
      favoritePlatform,
      mostPlayedGenre,
      gameOfTheYear: goty,
      mostReviewedFranchise,
      totalGenresPlayed,
      totalPlatformsPlayed,
      completionPercentage,
      oldestGame,
      newestGame,
      biggestSurprise,
      biggestDisappointment,
      seriesMarathons,
      monthlyGames,
      genreCounts,
      platformCounts,
      genreEntries,
      platformEntries,
      hasData: true,
    };
  }, [reviews]);
}