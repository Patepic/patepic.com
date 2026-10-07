import { useMemo } from "react";
import { getYearFromDate, defaultYearInGamingYear } from "../../lib/year";

function seriesOf(review) {
  const listed = Array.isArray(review?.series) ? review.series : [];
  return [...new Set(listed.map((name) => String(name || "").trim()).filter(Boolean))];
}

function isReviewFromYear(review, year) {
  return getYearFromDate(review?.date) === year;
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

export function useYearInGamingData(reviews, year = defaultYearInGamingYear()) {
  return useMemo(() => {
    const yearReviews = (reviews || []).filter((r) => isReviewFromYear(r, year));

    if (yearReviews.length === 0) {
      return {
        reviews: [],
        year,
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
      };
    }

    const totalReviews = yearReviews.length;
    const scores = yearReviews.map((r) => parseFloat(r.rating) || 0);
    const averageScore = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    const gamesPlayed = totalReviews;
    const gamesFinished = totalReviews;

    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const highestScorers = yearReviews.filter(
      (r) => parseFloat(r.rating) === highestScore
    );
    const highestRated = highestScorers.find((r) => r.isFeatured) || highestScorers[0] || null;

    const lowestRated = yearReviews.find(
      (r) => parseFloat(r.rating) === lowestScore
    ) || null;

    const goty = yearReviews.find((r) => r.isFeatured) || highestRated;

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

    const seriesGroups = {};
    yearReviews.forEach((r) => {
      seriesOf(r).forEach((series) => {
        if (!seriesGroups[series]) seriesGroups[series] = [];
        seriesGroups[series].push(r);
      });
    });
    const seriesMarathons = Object.entries(seriesGroups)
      .filter(([, games]) => games.length >= 5)
      .map(([series, games]) => ({
        series,
        games: games.sort((a, b) => parseReviewDate(a) - parseReviewDate(b)),
        count: games.length,
      }))
      .sort((a, b) => b.count - a.count);

    const franchiseEntries = Object.entries(seriesGroups).sort(
      (a, b) => b[1].length - a[1].length
    );
    const mostReviewedFranchise = franchiseEntries[0]?.[0] || null;

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

    const completionPercentage = totalReviews
      ? Math.round((gamesFinished / totalReviews) * 100)
      : 0;

    const sortedByDate = [...yearReviews].sort(
      (a, b) => parseReviewDate(a) - parseReviewDate(b)
    );
    const oldestGame = sortedByDate[0] || null;
    const newestGame = sortedByDate[sortedByDate.length - 1] || null;

    const avgScore = averageScore;
    const biggestSurprise = yearReviews
      .filter((r) => parseFloat(r.rating) > avgScore + 1.5)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0] || null;
    const biggestDisappointment = yearReviews
      .filter((r) => parseFloat(r.rating) < avgScore - 1.5 && parseFloat(r.rating) > 0)
      .sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))[0] || null;

    return {
      reviews: yearReviews,
      year,
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
  }, [reviews, year]);
}
