const API = "https://api.patepic.com/api";
const SITE = "https://patepic.com";
const REVIEW_PATH = /^\/reviews\/([^/]+)\/?$/;

const STATIC_PAGES = ["/", "/reviews", "/tier-list", "/awards", "/year-in-gaming", "/guidelines", "/about", "/contact"];

const xmlEscape = (value) => String(value).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

async function sitemap() {
  let reviews = [];
  try {
    const res = await fetch(`${API}/reviews`, { cf: { cacheTtl: 3600 } });
    if (res.ok) reviews = await res.json();
  } catch {
    reviews = [];
  }
  const urls = [
    ...STATIC_PAGES.map((path) => `  <url><loc>${SITE}${path}</loc></url>`),
    ...reviews
      .filter((r) => r.slug)
      .map((r) => {
        const lastmod = (r.updated_at || r.created_at || "").slice(0, 10);
        return `  <url><loc>${SITE}/reviews/${xmlEscape(encodeURIComponent(r.slug))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
      }),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

const setContent = (value) => ({ element: (el) => el.setAttribute("content", value) });

async function withReviewMeta(request, env, slug) {
  const page = await env.ASSETS.fetch(request);
  if (!page.ok || !(page.headers.get("content-type") || "").includes("text/html")) return page;

  let review;
  try {
    const res = await fetch(`${API}/reviews/${encodeURIComponent(slug)}`, { cf: { cacheTtl: 300 } });
    if (!res.ok) return page;
    review = await res.json();
  } catch {
    return page;
  }

  const url = `${SITE}/reviews/${review.slug}`;
  const title = `${review.title} review${review.rating ? ` · ${review.rating}/10` : ""} | Patepic`;
  const description = review.summary || `Patepic's review of ${review.title}.`;
  const image = `${API}/og/${encodeURIComponent(review.slug)}.png?v=${encodeURIComponent(review.updated_at || "")}`;

  return new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(title) })
    .on('link[rel="canonical"]', { element: (el) => el.setAttribute("href", url) })
    .on('meta[name="description"]', setContent(description))
    .on('meta[property="og:type"]', setContent("article"))
    .on('meta[property="og:title"]', setContent(title))
    .on('meta[property="og:description"]', setContent(description))
    .on('meta[property="og:url"]', setContent(url))
    .on('meta[property="og:image"]', {
      element: (el) => {
        el.setAttribute("content", image);
        el.after('<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />', { html: true });
      },
    })
    .on('meta[name="twitter:card"]', setContent("summary_large_image"))
    .on('meta[name="twitter:title"]', setContent(title))
    .on('meta[name="twitter:description"]', setContent(description))
    .on('meta[name="twitter:image"]', setContent(image))
    .transform(page);
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (request.method === "GET" && pathname === "/sitemap.xml") return sitemap();
    const match = pathname.match(REVIEW_PATH);
    if (request.method === "GET" && match) return withReviewMeta(request, env, decodeURIComponent(match[1]));
    return env.ASSETS.fetch(request);
  },
};
