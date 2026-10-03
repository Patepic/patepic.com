import { useEffect, useState } from "react";

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const PRODUCTION_BACKEND_URL = "https://api.patepic.com";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const getBackendUrl = () => {
  const runtimeUrl = window.__PATEPIC_CONFIG__?.BACKEND_URL?.trim();
  if (runtimeUrl) return trimTrailingSlash(runtimeUrl);

  const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  if (envUrl) return trimTrailingSlash(envUrl);

  const isLocalPage = localHosts.has(window.location.hostname);
  return isLocalPage ? "http://localhost:8000" : PRODUCTION_BACKEND_URL;
};

const API_BASE = `${getBackendUrl()}/api`;

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          const list = Array.isArray(data)
            ? data
            : (data?.items ?? data?.reviews ?? []);
          setReviews(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { reviews, loading, error };
}
