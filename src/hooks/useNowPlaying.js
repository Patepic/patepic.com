import { useEffect, useState } from "react";
import { fetchNowPlaying } from "../lib/api";

export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchNowPlaying()
      .then((data) => { if (mounted) setNowPlaying(data?.title ? data : null); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return nowPlaying;
}
