import { useEffect, useState } from "react";
import { fetchRecentVideos } from "../lib/api";

export function useRecentVideos() {
  const [latest, setLatest] = useState(null);
  const [recent, setRecent] = useState([]);
  const [channelUrl, setChannelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchRecentVideos()
      .then((data) => {
        if (!mounted) return;
        setLatest(data?.latest ?? null);
        setRecent(Array.isArray(data?.recent) ? data.recent : []);
        setChannelUrl(data?.channelUrl ?? null);
      })
      .catch(() => {
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { latest, recent, channelUrl, loading };
}
