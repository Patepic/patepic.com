import { Link } from "react-router-dom";
import { NO_FLAWS, getTier, getTierColor, getRarity } from "../lib/tier";
import { getYearFromDate } from "../lib/year";
import { useCardTilt } from "../hooks/useCardTilt";
import { RarityMark } from "./RarityMark";
import { PlatformIcon } from "./PlatformIcon";
import { Blossom } from "./ui/decor";

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
  const meta = [review.platform, genres.join(", ")].filter(Boolean).join(" · ");
  const strengths = Array.isArray(review.pros) ? review.pros.length : 0;
  const weaknesses = Array.isArray(review.cons) ? review.cons.filter((con) => con !== NO_FLAWS).length : 0;
  const year = cardYear(review);
  const fullArt = rarity.fullArt && cover;
  const wrapClass = [
    "pc-wrap",
    "phc-wrap",
    `rarity-${rarity.tone}`,
    fullArt && "is-top",
    rarity.gold && "is-hyper",
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapClass} data-tier={tier} style={{ "--tier-color": tierColor }} {...tilt}>
      <Tag className="photo-card group" {...rest}>
        {fullArt && (
          <span className="phc-bg" aria-hidden="true">
            <img src={cover} alt="" loading="lazy" />
            {rarity.foil && <span className="pc-foil" />}
            {rarity.foil && <span className="pc-glare" />}
          </span>
        )}
        {fullArt && <span className="phc-panel phc-panel-body" aria-hidden="true" />}
        <span className="phc-tab-wrap" aria-hidden="true"><span className="phc-tab">{review.rating}</span></span>
        <Blossom detailed className="phc-blossom phc-b1 text-mango-yellow" />
        <Blossom detailed className="phc-blossom phc-b2 text-pink-dusty" />

        <div className="phc-photo">
          <div className="phc-window">
            {cover && <img src={cover} alt="" loading={size === "lg" ? "eager" : "lazy"} />}
            {rarity.foil && !fullArt && <span className="pc-foil" />}
            {rarity.foil && !fullArt && <span className="pc-glare" />}
          </div>
          <Blossom detailed className="phc-blossom phc-b3 text-pink-soft" />
        </div>

        <div className="phc-caption">
          <p className="phc-title">{review.title}</p>
          {meta && (
            <p className="phc-meta">
              {showRibbon && review.platform && <PlatformIcon platform={review.platform} />}
              <span>{meta}</span>
            </p>
          )}
          {review.summary && <div className="phc-text"><p className="phc-verdict">{review.summary}</p></div>}
          <div className="phc-foot">
            <span>Strengths<span className="phc-count">{strengths}</span></span>
            <RarityMark symbol={rarity.symbol} count={rarity.stars} />
            <span>Weaknesses<span className="phc-count">{weaknesses}</span></span>
          </div>
          {year && <p className="phc-year">©{year}</p>}
        </div>
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
