import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import { useYearInGamingData } from "../components/year-in-gaming/useYearInGamingData";
import { Cover } from "../components/year-in-gaming/Cover";
import { GameOfTheYear } from "../components/year-in-gaming/GameOfTheYear";
import { ByTheNumbers } from "../components/year-in-gaming/ByTheNumbers";
import { TheJourney } from "../components/year-in-gaming/TheJourney";
import { Achievements } from "../components/year-in-gaming/Achievements";
import { ClosingCard } from "../components/year-in-gaming/ClosingCard";
import { buildYearRange, CURRENT_YEAR } from "../lib/year";
import { usePageTitle } from "../hooks/usePageTitle";
import { hasYearHighlights } from "../data/yearHighlights";

export default function YearInGaming() {
  const { year: yearParam } = useParams();
  const years = useMemo(() => buildYearRange(), []);
  const [selectedYear, setSelectedYear] = useState(() => {
    const fromUrl = yearParam ? parseInt(yearParam, 10) : NaN;
    if (!Number.isNaN(fromUrl) && years.includes(fromUrl)) return fromUrl;
    return years.includes(CURRENT_YEAR) ? CURRENT_YEAR : years[0];
  });
  const { reviews, loading, error } = useReviews();
  const data = useYearInGamingData(reviews, selectedYear);

  usePageTitle(`Year in Gaming ${selectedYear}`);

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="max-w-md text-center">
          <p className="eyebrow justify-center">Data unavailable</p>
          <h1 className="display-hero mt-3 text-3xl text-charcoal-brown">Could not load reviews</h1>
          <p className="mt-3 text-sm text-charcoal-brown/90">Check the API connection and database, then refresh.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Cover data={data} loading years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        <GameOfTheYear data={data} loading />
        <ByTheNumbers data={data} loading />
      </div>
    );
  }

  if (!data.hasData) {
    return (
      <div className="min-h-screen">
        <Cover data={data} years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        <div className="min-h-[50vh] grid place-items-center px-4 pb-20">
          <div className="max-w-md text-center">
            <h1 className="display-hero mt-3 text-3xl text-charcoal-brown tracking-tight">No {selectedYear} reviews yet</h1>
            <p className="mt-4 text-charcoal-brown/85 leading-relaxed">
              Nothing dated {selectedYear} has been published yet. Reviews with a{" "}
              {selectedYear} date will automatically appear here as they're published.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-charcoal-brown/85">
              <Gamepad2 className="w-5 h-5 text-charcoal-brown" />
              <span className="text-sm">Check back soon for the story of {selectedYear}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Cover data={data} years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
      <GameOfTheYear data={data} />
      <ByTheNumbers data={data} />
      <TheJourney data={data} />
      <Achievements year={data.year} />
      {hasYearHighlights(data.year) && <ClosingCard year={data.year} />}
    </div>
  );
}
