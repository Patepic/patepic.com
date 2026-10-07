import { Hourglass } from "lucide-react";
import { useCardTilt } from "../hooks/useCardTilt";
import { CardTitle } from "./CardTitle";

const coverSrc = (url) => (!url ? null : url.startsWith("http") ? url : `https://${url}`);

export function NowPlayingCard({ game }) {
  const tilt = useCardTilt(26);
  const cover = coverSrc(game.cover_url);

  const body = (layer) => (
    <>
      <div className="pc-head">
        <span className="pc-stage" title="In progress"><Hourglass className="w-[1.1em] h-[1.1em]" /></span>
        <span className="pc-score"><span className="pc-score-fill">?</span></span>
        <CardTitle>{game.title}</CardTitle>
      </div>

      <div className="pc-art">
        {layer === "face" && (cover ? <img src={cover} alt="" loading="lazy" /> : <div className="card-back absolute inset-0" />)}
      </div>

      <div className="pc-strip">
        {game.platform && <p className="pc-flavor">Platform: {game.platform}</p>}
      </div>

      <div className="pc-text">
        <p className="pc-verdict">I'm currently playing this{game.note ? ` · ${game.note}` : ""}. Review coming once I finish it.</p>
      </div>

      <div className="pc-stats">
        <div className="pc-stat">
          <span className="pc-stat-label">Status</span>
          <span className="pc-stat-value">{game.source === "twitch" ? "Live" : "Playing"}</span>
        </div>
      </div>

      <div className="pc-setline">
        <span>©{new Date().getFullYear()}</span>
      </div>
    </>
  );

  return (
    <div className="pc-wrap pc-now-playing" style={{ "--tier-color": "var(--color-mango-yellow)" }} {...tilt}>
      <div className="profile-card" data-testid="now-playing-card">
        <div className="pc-face" aria-hidden="true">{body("face")}</div>
        <div className="pc-info">{body("info")}</div>
      </div>
    </div>
  );
}
