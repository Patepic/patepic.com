import { Link } from "react-router-dom";
import { getTier, getTierColor, getTierLabel, getRarity } from "../lib/tier";
import { getYearFromDate } from "../lib/year";
import { useCardTilt } from "../hooks/useCardTilt";

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
  const lg = size === "lg" ? " pc-lg" : "";
  const fullArt = rarity.fullArt && cover;
  const wrapClass = [
    "pc-wrap",
    lg.trim(),
    `rarity-${rarity.tone}`,
    fullArt && "is-fullart",
    rarity.gold && "is-hyper",
  ].filter(Boolean).join(" ");
  const stars = rarity.symbol.repeat(rarity.stars);

  const body = (layer) => (
    <>
      <div className="pc-head">
        {showRibbon && (
          <span className="pc-stage" title={getTierLabel(tier)}>{tier}</span>
        )}
        <span className="pc-title">{review.title}</span>
      </div>

      <div className="pc-art">
        {layer === "face" && (cover ? (
          <img src={cover} alt="" loading={size === "lg" ? "eager" : "lazy"} />
        ) : (
          <div className="card-back absolute inset-0" />
        ))}
        {layer === "face" && rarity.foil === "art" && <span className="pc-foil" />}
        {layer === "info" && <div className="pc-score"><span className="pc-score-fill">{review.rating}</span></div>}
      </div>

      <div className="pc-text">
        {review.summary && <p className="pc-verdict">&ldquo;{review.summary}&rdquo;</p>}
      </div>

      {(review.platform || genre) && (
        <div className="pc-stats">
          {review.platform && (
            <div className="pc-stat">
              <span className="pc-stat-label">Platform</span>
              <span className="pc-stat-value">{review.platform}</span>
            </div>
          )}
          {genre && (
            <div className="pc-stat">
              <span className="pc-stat-label">{genres.length > 1 ? "Genres" : "Genre"}</span>
              <span className="pc-stat-value">{genre}</span>
            </div>
          )}
        </div>
      )}

      <div className="pc-setline">
        <span>{getTierLabel(tier)}</span>
        <span>{cardYear(review) ? `©${cardYear(review)}` : ""}</span>
        <span className="pc-rarity" aria-hidden="true">{stars}</span>
      </div>
    </>
  );

  return (
    <div className={wrapClass} data-tier={tier} style={{ "--tier-color": tierColor }} {...tilt}>
      <Tag className={`profile-card group${lg}`} {...rest}>
        <div className="pc-face" aria-hidden="true">
          {fullArt && <img className="pc-fullart" src={cover} alt="" loading={size === "lg" ? "eager" : "lazy"} />}
          {body("face")}
          {rarity.texture && <span className={`pc-texture is-${rarity.texture}`} />}
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
