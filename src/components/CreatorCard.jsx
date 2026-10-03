import { useMemo, useState } from "react";
import { Gamepad2, Star, CalendarDays, Sparkles } from "lucide-react";
import { creator } from "../data/creator";
import { useCardTilt } from "../hooks/useCardTilt";
import modelImg from "../assets/model.png";
import { getYearFromDate } from "../lib/year";

const reviewYear = (review) => {
  const fromDate = getYearFromDate(review.date);
  if (fromDate) return fromDate;
  const d = review.created_at ? new Date(review.created_at) : null;
  return d && !Number.isNaN(d.getTime()) ? d.getFullYear() : null;
};

function useCardStats(reviews, loading) {
  return useMemo(() => {
    if (loading) return null;
    const scores = reviews.map((r) => parseFloat(r.rating)).filter((n) => !Number.isNaN(n));
    const year = new Date().getFullYear();
    const latest = [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    return {
      total: reviews.length,
      average: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "N/A",
      thisYear: reviews.filter((r) => reviewYear(r) === year).length,
      year,
      latest,
    };
  }, [reviews, loading]);
}

function StatRow({ Icon, name, text, value }) {
  return (
    <div className="creator-move">
      <span className="creator-cost" aria-hidden="true"><Icon /></span>
      <div className="min-w-0">
        <div className="creator-move-name">{name}</div>
        <p className="creator-move-text truncate">{text}</p>
      </div>
      <span className="creator-dmg">{value}</span>
    </div>
  );
}

export function CreatorCard({ reviews = [], loading = false, className = "" }) {
  const tilt = useCardTilt(28);
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  const year = new Date().getFullYear();
  const stats = useCardStats(reviews, loading);
  const wait = "…";

  const frontStats = (
    <>
      <StatRow Icon={Gamepad2} name="Games Reviewed" text="Every game is finished before it's reviewed." value={stats ? stats.total : wait} />
      <StatRow Icon={Star} name="Average Score" text="Across every review, scored 1 to 10." value={stats ? stats.average : wait} />
    </>
  );

  const backStats = (
    <>
      <StatRow Icon={CalendarDays} name={`Reviews in ${year}`} text="Games finished and reviewed this year." value={stats ? stats.thisYear : wait} />
      <StatRow Icon={Sparkles} name="Latest Review" text={stats?.latest?.title || "Nothing yet."} value={stats?.latest?.rating || wait} />
    </>
  );

  const setLine = (
    <div className="pc-setline">
      <span>{creator.name}</span>
      <span>©{year}</span>
      <span className="pc-rarity" title="Secret rare">★★</span>
    </div>
  );

  const body = (layer, side = "front") => (
    <>
      <div className="pc-head">
        <span className="pc-title creator-name">{creator.name}</span>
      </div>

      <div className="pc-art creator-art">
        {layer === "face" && <img src={modelImg} alt="" />}
        {layer === "face" && <span className="pc-foil" />}
      </div>

      <p className="creator-strip">Game reviewer and streamer.</p>

      <div className="creator-moves">{side === "back" ? backStats : frontStats}</div>

      <div className="pc-stats">
        <div className="pc-stat"><span className="pc-stat-label">Dislikes</span><span className="pc-stat-value">Gacha</span></div>
        <div className="pc-stat"><span className="pc-stat-label">Ignores</span><span className="pc-stat-value">Hype</span></div>
        <div className="pc-stat"><span className="pc-stat-label">Gives up</span><span className="pc-stat-value">Never</span></div>
      </div>

      {setLine}
    </>
  );

  return (
    <div
      className={`pc-wrap pc-lg creator-card ${className}`}
      style={{ "--tier-color": "var(--leaf)" }}
      {...tilt}
    >
      <div
        className={`creator-flipper${flipped ? " is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipped ? `Flip ${creator.name}'s card back` : `Flip ${creator.name}'s card to the full-art side`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="profile-card pc-lg creator-side" aria-hidden={flipped}>
          <div className="pc-face" aria-hidden="true">
            {body("face")}
            <span className="pc-glare" />
          </div>
          <div className="pc-info">{body("info")}</div>
        </div>

        <div className="profile-card pc-lg creator-side creator-back is-fullart" aria-hidden={!flipped}>
          <div className="pc-face" aria-hidden="true">
            <img className="pc-fullart creator-fullart" src={modelImg} alt="" />
            <span className="pc-foil" />
            <span className="pc-glare" />
          </div>
          <div className="pc-info">{body("info", "back")}</div>
        </div>
      </div>
    </div>
  );
}
