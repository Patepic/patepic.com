import axios from "axios";

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const PRODUCTION_BACKEND_URL = "https://api.patepic.com";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const isLocalBackend = (value) => {
  if (!value) return false;
  try {
    return localHosts.has(new URL(value).hostname);
  } catch {
    return false;
  }
};

const getBackendUrl = () => {
  const runtimeUrl = window.__PATEPIC_CONFIG__?.BACKEND_URL?.trim();
  if (runtimeUrl) return trimTrailingSlash(runtimeUrl);

  const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  if (envUrl) return trimTrailingSlash(envUrl);

  const isLocalPage = localHosts.has(window.location.hostname);
  return isLocalPage ? "http://localhost:8000" : PRODUCTION_BACKEND_URL;
};

const BACKEND = getBackendUrl();
export const API_BASE = `${BACKEND}/api`;

export const api = axios.create({ baseURL: API_BASE });

export const fetchReviews = async (params = {}) => {
  const { data } = await api.get("/reviews", { params });
  return data;
};

export const fetchReview = async (slug) => {
  const { data } = await api.get(`/reviews/${slug}`);
  return data;
};

export const fetchRecentVideos = async () => {
  const { data } = await api.get("/youtube/recent");
  return data;
};

export const fetchNowPlaying = async () => {
  const { data } = await api.get("/now-playing");
  return data || null;
};

export const sendContact = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

export const errorMessage = (err) => {
  if (err?.code === "ERR_NETWORK") {
    return `Cannot reach the API at ${API_BASE}. Check the live backend URL and CORS settings.`;
  }
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (d && typeof d.msg === "string" ? d.msg : JSON.stringify(d)))
      .join(" ");
  }
  return String(detail);
};
