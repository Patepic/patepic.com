import { api, fetchReviews, errorMessage } from "@/lib/api";

export { fetchReviews, errorMessage };

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("patepic_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const adminCreateReview = async (payload) => {
  const { data } = await api.post("/admin/reviews", payload);
  return data;
};

export const adminUpdateReview = async (slug, payload) => {
  const { data } = await api.put(`/admin/reviews/${slug}`, payload);
  return data;
};

export const adminDeleteReview = async (slug) => {
  const { data } = await api.delete(`/admin/reviews/${slug}`);
  return data;
};

export const adminUploadImage = async (file, onProgress) => {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/admin/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total)
        onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data;
};

export const adminDiscardUpload = async (url) => {
  const { data } = await api.delete("/admin/upload", { params: { url } });
  return data;
};

export const adminGetNowPlaying = async () => {
  const { data } = await api.get("/admin/now-playing");
  return data || null;
};

export const adminSetNowPlaying = async (payload) => {
  const { data } = await api.put("/admin/now-playing", payload);
  return data;
};

export const adminClearNowPlaying = async () => {
  const { data } = await api.delete("/admin/now-playing");
  return data;
};
