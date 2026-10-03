import { Hourglass } from "lucide-react";
import { useCardTilt } from "../hooks/useCardTilt";

const coverSrc = (url) => (!url ? null : url.startsWith("http") ? url : `https://${url}`);

export function NowPlayingCard({ game }) {
  const tilt = useCardTilt(26);
  const cover = coverSrc(game.cover_url);

  const body = (layer) => (
    <>
      <div className="pc-head">
        <span className="pc-stage" title="In progress"><Hourglass className="w-[1.1em] h-[1.1em]" /></span>
        <span className="pc-title">{game.title}</span>
      </div>

      <div className="pc-art">
        {layer === "face" && (cover ? <img src={cover} alt="" loading="lazy" /> : <div className="card-back absolute inset-0" />)}
        {layer === "info" && <div className="pc-score"><span className="pc-score-fill">?</span></div>}
      </div>

      <div className="pc-text">
        <p className="pc-verdict">Currently playing{game.note ? ` · ${game.note}` : ""}. Review coming once it's finished.</p>
      </div>

      {game.platform && (
        <div className="pc-stats">
          <div className="pc-stat">
            <span className="pc-stat-label">Platform</span>
            <span className="pc-stat-value">{game.platform}</span>
          </div>
        </div>
      )}

      <div className="pc-setline">
        <span>In progress</span>
        <span>{game.source === "twitch" ? "Live" : ""}</span>
      </div>
    </>
  );

  return (
    <div className="pc-wrap pc-now-playing" style={{ "--tier-color": "#D6CCBF" }} {...tilt}>
      <div className="profile-card" data-testid="now-playing-card">
        <div className="pc-face" aria-hidden="true">{body("face")}</div>
        <div className="pc-info">{body("info")}</div>
      </div>
    </div>
  );
}
