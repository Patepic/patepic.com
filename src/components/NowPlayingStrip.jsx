const coverSrc = (url) => (!url ? null : url.startsWith("http") ? url : `https://${url}`);

export function NowPlayingStrip({ game }) {
  const cover = coverSrc(game.cover_url);
  const live = game.source === "twitch";

  return (
    <div className="np-strip" data-testid="now-playing-strip">
      <div className="np-body">
        <div className="np-media">
          {cover && <img src={cover} alt="" loading="lazy" className="np-cover" />}
          <p className="np-pill">
            <span className="np-dot" aria-hidden="true" />
            {live ? "Live now" : "Now playing"}
          </p>
        </div>
        <div className="min-w-0">
          <h2 className="wordmark text-2xl sm:text-3xl text-charcoal-brown">{game.title}</h2>
          {game.platform && <p className="mt-2 text-sm font-bold text-charcoal-brown/75">{game.platform}</p>}
          {game.note && <p className="mt-2 max-w-[32ch] text-sm sm:text-base leading-relaxed text-pretty text-charcoal-brown">{game.note}</p>}
          {game.imageCredit && (
            <p className="np-credit">
              Image by{" "}
              {/^https?:\/\//i.test(game.imageCreditUrl || "") ? (
                <a href={game.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold text-charcoal-brown underline decoration-pink decoration-2 underline-offset-2">{game.imageCredit}</a>
              ) : game.imageCredit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
