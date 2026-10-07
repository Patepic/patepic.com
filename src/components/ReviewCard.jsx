import { Link } from "react-router-dom";
import { NO_FLAWS, getTier, getTierColor, getRarity } from "../lib/tier";
import { getYearFromDate } from "../lib/year";
import { useCardTilt } from "../hooks/useCardTilt";
import { RarityMark } from "./RarityMark";
import { CardTitle } from "./CardTitle";
import { PlatformIcon } from "./PlatformIcon";

export const coverUrl = (review) => {
  if (!review?.cover_url) return null;
  return review.cover_url.startsWith("http") ? review.cover_url : `https://${review.cover_url}`;
};

const cardYear = (review) => {
  const fromDate = getYearFromDate(review?.date);
  if (fromDate) return fromDate;
  const d = review?.created_at ? new Date(review.created_at) : null;
  return d && !Number.isNaN(d.getTime()) ? d.getFullYear() : null;
};

export function ReviewCardFace({ review, size = "sm", showRibbon = true, as: Tag = Link, ...rest }) {
  const tilt = useCardTilt(size === "lg" ? 18 : 26);
  const cover = coverUrl(review);
  const tier = getTier(review.rating, review);
  const tierColor = getTierColor(tier);
  const rarity = getRarity(tier);
  const genres = Array.isArray(review.genre) ? review.genre.filter(Boolean) : review.genre ? [review.genre] : [];
  const genre = genres.join(", ");
  const flavor = [
    review.platform && `Platform: ${review.platform}`,
    genre && `${genres.length > 1 ? "Genres" : "Genre"}: ${genre}`,
  ].filter(Boolean).join(", ");
  const strengths = Array.isArray(review.pros) ? review.pros.length : 0;
  const weaknesses = Array.isArray(review.cons) ? review.cons.filter((con) => con !== NO_FLAWS).length : 0;
  const lg = size === "lg" ? " pc-lg" : "";
  const fullArt = rarity.fullArt && cover;
  const wrapClass = [
    "pc-wrap",
    lg.trim(),
    `rarity-${rarity.tone}`,
    fullArt && "is-fullart",
    rarity.gold && "is-hyper",
  ].filter(Boolean).join(" ");

  const body = (layer) => (
    <>
      <div className="pc-head">
        {showRibbon && (
          <span className="pc-stage" title={review.platform}><PlatformIcon platform={review.platform} /></span>
        )}
        <span className="pc-score"><span className="pc-score-fill">{review.rating}</span></span>
        <CardTitle>{review.title}</CardTitle>
      </div>

      <div className="pc-art">
        {layer === "face" && (cover ? (
          <img src={cover} alt="" loading={size === "lg" ? "eager" : "lazy"} />
        ) : (
          <div className="card-back absolute inset-0" />
        ))}
        {layer === "face" && rarity.foil === "art" && <span className="pc-foil" />}
      </div>

      <div className="pc-strip">
        {flavor && <p className="pc-flavor">{flavor}</p>}
      </div>

      <div className="pc-text">
        {review.summary && <p className="pc-verdict">{review.summary}</p>}
      </div>

      <div className="pc-stats">
        <div className="pc-stat">
          <span className="pc-stat-label">Strengths</span>
          <span className="pc-stat-value is-count">{strengths}</span>
        </div>
        <div className="pc-stat">
          <span className="pc-stat-label">Weaknesses</span>
          <span className="pc-stat-value is-count">{weaknesses}</span>
        </div>
      </div>

      <div className="pc-setline">
        <span>{cardYear(review) ? `©${cardYear(review)}` : ""}</span>
        <RarityMark symbol={rarity.symbol} count={rarity.stars} />
      </div>
    </>
  );

  return (
    <div className={wrapClass} data-tier={tier} style={{ "--tier-color": tierColor }} {...tilt}>
      <Tag className={`profile-card group${lg}`} {...rest}>
        <div className="pc-face" aria-hidden="true">
          {fullArt && <img className="pc-fullart" src={cover} alt="" loading={size === "lg" ? "eager" : "lazy"} />}
          {body("face")}
          {rarity.foil === "card" && <span className="pc-foil" />}
          {rarity.foil && <span className="pc-glare" />}
        </div>
        <div className="pc-info">{body("info")}</div>
      </Tag>
    </div>
  );
}

export function ReviewCard({ review, size = "sm", showRibbon = true }) {
  return (
    <ReviewCardFace
      review={review}
      size={size}
      showRibbon={showRibbon}
      to={`/reviews/${review.slug}`}
      data-testid={`review-card-${review.slug}`}
    />
  );
}
