export const AWARDS_START_YEAR = 2026;

export const CURRENT_YEAR = new Date().getFullYear();

const CURRENT_MONTH = new Date().getMonth();

export function getYearFromDate(dateStr) {
  const m = String(dateStr || "").match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

export function buildYearRange(start = AWARDS_START_YEAR, end = CURRENT_YEAR) {
  const years = [];
  for (let y = end; y >= Math.min(start, end); y--) years.push(y);
  return years;
}

export function defaultAwardsYear() {
  const years = buildYearRange();
  const preferred = CURRENT_MONTH === 11 ? CURRENT_YEAR : CURRENT_YEAR - 1;
  return years.includes(preferred) ? preferred : years[0];
}

export function defaultYearInGamingYear() {
  const years = buildYearRange();
  return years.includes(CURRENT_YEAR) ? CURRENT_YEAR : years[0];
}
