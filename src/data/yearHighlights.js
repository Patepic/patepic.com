export const YEAR_HIGHLIGHTS = {
  2026: {
    moments: "",
    changed: "",
    surprises: "",
    disappointments: "",
    nextYear: "",
  },
};

export const getYearHighlights = (year) => YEAR_HIGHLIGHTS[year] || {};

export const hasYearHighlights = (year) =>
  Object.values(getYearHighlights(year)).some((text) => String(text || "").trim());
