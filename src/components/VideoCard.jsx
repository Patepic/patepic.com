import { Play } from "lucide-react";
import { useCardTilt } from "../hooks/useCardTilt";
import { Blossom } from "./ui/decor";

const NEW_DAYS = 7;

const thumbFallback = (fallbackUrl) => (e) => {
  const img = e.currentTarget;
  if (!fallbackUrl || img.src === fallbackUrl) return;
  if (e.type === "error" || img.naturalWidth === 120) img.src = fallbackUrl;
};

const uploadDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;
};

const isNew = (iso) => {
  const t = Date.parse(iso || "");
  return !Number.isNaN(t) && Date.now() - t < NEW_DAYS * 86400000;
};

function VideoCardFace({ video, size = "sm", testId, className = "" }) {
  const tilt = useCardTilt(size === "lg" ? 12 : 22);
  const date = uploadDate(video.publishedAt);
  const fallback = thumbFallback(video.thumbnailFallback);
  const lg = size === "lg";
  const src = lg ? video.thumbnail : video.thumbnailSmall || video.thumbnail;

  return (
    <div
      className={`pc-wrap phc-wrap phc-video${lg ? " phc-video-lg" : ""} ${className}`}
      data-tier="video"
      style={{ "--tier-color": "var(--color-pink-soft)" }}
      {...tilt}
    >
      <a href={video.url} target="_blank" rel="noopener noreferrer" data-testid={testId} className="photo-card group">
        <span className="phc-tab-wrap" aria-hidden="true">
          <span className="phc-tab"><Play className="phc-tab-play" fill="currentColor" /></span>
        </span>
        <Blossom detailed className="phc-blossom phc-b1 text-mango-yellow" />
        <Blossom detailed className="phc-blossom phc-b2 text-pink-dusty" />

        <div className="phc-photo">
          <div className="phc-window">
            <img src={src} onLoad={fallback} onError={fallback} alt="" loading="eager" fetchPriority={lg ? "high" : "low"} decoding="async" />
            <span className="video-play" aria-hidden="true"><Play fill="currentColor" /></span>
            {isNew(video.publishedAt) && <span className="video-new">New</span>}
          </div>
        </div>

        <div className="phc-caption">
          <p className="phc-title">{video.title}</p>
          <p className="video-date">{date ? `Uploaded ${date}` : "On YouTube"}</p>
        </div>
      </a>
    </div>
  );
}

export function VideoCard({ video }) {
  return <VideoCardFace video={video} testId={`video-card-${video.id}`} />;
}

export function HeroVideo({ video, className = "" }) {
  return (
    <VideoCardFace video={video} size="lg" testId={`hero-video-${video.id}`} className={className} />
  );
}
