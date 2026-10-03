import { Gamepad2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

export function Cover({ data, loading, years, selectedYear, onSelectYear }) {
  return (
    <section className="relative">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        <div className="flex justify-center mb-8">
          <Select value={String(selectedYear)} onValueChange={(v) => onSelectYear(parseInt(v, 10))}>
            <SelectTrigger
              data-testid="yig-year-filter"
              className="w-32 h-9 bg-bone border-hairline text-void text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-bone border-hairline text-void">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="wordmark text-void leading-none text-[5rem] sm:text-[7rem] lg:text-[9rem]">
          {data.year}
        </div>

        {loading ? (
          <Skeleton className="mx-auto mt-6 h-8 w-56" />
        ) : (
          <p className="mt-6 text-xl sm:text-2xl text-void/90 font-semibold">
            {data.totalReviews} {data.totalReviews === 1 ? "game" : "games"} finished in {data.year}.
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-ash text-sm">
          <Gamepad2 className="w-4 h-4" />
          <span>Scroll for the full recap</span>
        </div>
      </div>
    </section>
  );
}
