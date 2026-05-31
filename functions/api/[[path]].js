const DEFAULT_BACKEND_URL = "https://api.patepic.com";

const normalizeBackendUrl = (value) => value.replace(/\/+$/, "");

export async function onRequest({ request, env, params }) {
  const backendUrl = normalizeBackendUrl(env.BACKEND_URL || DEFAULT_BACKEND_URL);
  const path = Array.isArray(params.path) ? params.path.join("/") : params.path || "";
  const requestUrl = new URL(request.url);
  const upstreamUrl = `${backendUrl}/api/${path}${requestUrl.search}`;

  const upstreamRequest = new Request(upstreamUrl, request);
  upstreamRequest.headers.delete("host");

  return fetch(upstreamRequest);
}
