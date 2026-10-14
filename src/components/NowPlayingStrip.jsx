const coverSrc = (url) => (!url ? null : url.startsWith("http") ? url : `https://${url}`);

export function NowPlayingStrip({ game }) {
  const cover = coverSrc(game.cover_url);

  return (
    <div className="panel-framed flex items-center gap-4 p-3 pr-5" data-testid="now-playing-strip">
      {cover && <img src={cover} alt="" loading="lazy" className="w-24 h-[4.5rem] object-cover rounded-lg shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{game.source === "twitch" ? "Playing live now" : "Now playing"}</p>
        <p className="wordmark text-xl sm:text-2xl text-charcoal-brown mt-1.5 line-clamp-2">{game.title}</p>
        <p className="text-xs sm:text-sm text-charcoal-brown/70 mt-1 truncate">
          {[game.platform, game.note].filter(Boolean).join(" · ")}
        </p>
      </div>
      <p className="hidden sm:block text-xs font-bold uppercase text-charcoal-brown/70 text-right shrink-0">Review once<br />I finish it</p>
    </div>
  );
}
