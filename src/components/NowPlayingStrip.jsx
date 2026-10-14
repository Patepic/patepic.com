const coverSrc = (url) => (!url ? null : url.startsWith("http") ? url : `https://${url}`);

export function NowPlayingStrip({ game }) {
  const cover = coverSrc(game.cover_url);
  const live = game.source === "twitch";

  return (
    <div className="np-strip" data-testid="now-playing-strip">
      <p className="np-pill">
        <span className="np-dot" aria-hidden="true" />
        {live ? "Live now" : "Now playing"}
      </p>
      <div className="np-body">
        {cover && <img src={cover} alt="" loading="lazy" className="np-cover" />}
        <div className="min-w-0">
          <h2 className="wordmark text-2xl sm:text-3xl text-charcoal-brown">{game.title}</h2>
          {game.platform && <p className="mt-2 text-sm font-bold text-charcoal-brown/75">{game.platform}</p>}
          {game.note && <p className="mt-2 max-w-[32ch] text-sm sm:text-base leading-relaxed text-pretty text-charcoal-brown">{game.note}</p>}
        </div>
      </div>
    </div>
  );
}
