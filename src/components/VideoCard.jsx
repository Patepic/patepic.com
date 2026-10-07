import { Play } from "lucide-react";
import { useCardTilt } from "../hooks/useCardTilt";

const handleThumbLoad = (fallbackUrl) => (e) => {
  if (fallbackUrl && e.currentTarget.naturalWidth === 120) {
    e.currentTarget.src = fallbackUrl;
  }
};

const VIDEO_ART_STYLE = { aspectRatio: "16 / 9", boxSizing: "content-box" };

const uploadDate = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;
};

function VideoCardFace({ video, size = "sm", loading = "lazy", testId, className = "" }) {
  const tilt = useCardTilt(size === "lg" ? 12 : 22);
  const lg = size === "lg" ? " pc-lg" : "";
  const date = uploadDate(video.publishedAt);
  const body = (layer) => (
    <>
      <div className="pc-head">
        <span className="pc-stage" aria-hidden="true"><Play className="w-[0.7em] h-[0.7em]" fill="currentColor" /></span>
        <span className="pc-title">{video.title}</span>
      </div>
      <div className="pc-art" style={VIDEO_ART_STYLE}>
        {layer === "face" && (
          <img
            src={video.thumbnail}
            onLoad={handleThumbLoad(video.thumbnailFallback)}
            alt=""
            loading={loading}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="pc-setline">
        <span>{date ? `Uploaded ${date}` : "YouTube"}</span>
        <span className="pc-rarity" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" /></svg></span>
      </div>
    </>
  );
  return (
    <div className={`pc-wrap pc-video${lg} ${className}`} style={{ "--tier-color": "var(--color-mango-yellow)" }} {...tilt}>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={testId}
        className={`profile-card group${lg}`}
      >
        <div className="pc-face" aria-hidden="true">
          {body("face")}
          <span className="pc-glare" />
        </div>
        <div className="pc-info">{body("info")}</div>
      </a>
    </div>
  );
}

export function VideoCard({ video }) {
  return <VideoCardFace video={video} testId={`video-card-${video.id}`} />;
}

export function HeroVideo({ video, className = "" }) {
  return (
    <VideoCardFace video={video} size="lg" loading="eager" testId={`hero-video-${video.id}`} className={className} />
  );
}
