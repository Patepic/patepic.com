# Patepic — Game Review Blog (PRD)

## Original Problem Statement
Build a game review blog for Patepic, a VTuber + game reviewer. Pages: Landing (stats + recent), About (lore + avatar slot), Reviews (search + filters), Review Guidelines, Tier List, Contact form. Stack: React (Astro unsupported). Theme: icy frost-light, wintery, soft pale blues. Reviews stored in MongoDB. Images on Cloudflare R2. Resend for contact emails. JWT admin for /admin CRUD.

## Architecture
- **Frontend**: React + Tailwind + Shadcn UI + react-markdown + axios. AuthContext + ProtectedRoute. Light icy theme (#f4f8fc base, slate text, sky-700 accents). Fraunces (display) + Inter (body).
- **Backend**: FastAPI single module `server.py` + `auth.py` (bcrypt/JWT) + `storage.py` (R2 via boto3). MongoDB (motor) for reviews + users. Resend for email. Cloudflare R2 (S3-compatible) for cover images.
- **Auth**: Single admin seeded on startup from `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars. Bearer token in `localStorage` (`patepic_token`).

## User Choices
- React + Tailwind + Shadcn (no Astro, supported stack)
- Light icy theme, pale blues, NOT cyan-heavy
- Fraunces + Inter typography
- VTuber brand: "Patepic", live on Twitch (placeholder URL until user replaces)
- Admin: patrickcoulter01@gmail.com / password
- Real Resend key in `.env`
- Real Cloudflare R2 bucket `review-images`

## What's Been Implemented
### MVP (2026-12, iteration_1)
- 7 public pages (Home, About, Reviews, Review Detail, Guidelines, Tier List, Contact)
- Static review data in `/app/frontend/src/data/reviews.js`
- Contact form via Resend (dev-mode placeholder)
- VTuber touches (LIVE badge, lore on About, channel stats)

### Major upgrade (2026-12, iteration_2)
- **Light theme** — full repaint to icy frost-light with snow noise overlay
- **MongoDB-backed reviews** — frontend pulls from `/api/reviews` (collection seeded by `seed_reviews.py`)
- **Cloudflare R2 image hosting** — admin uploads covers via `/api/admin/upload`
- **Resend live** — real API key, sends to patrickcoulter01@gmail.com
- **JWT admin auth** — `/admin/login` + protected `/admin` dashboard with full review CRUD
- **Admin dashboard** — table of reviews, create/edit (Dialog), delete (AlertDialog), inline R2 upload + upload-progress
- 100% backend (17/17) + 100% frontend test pass

## Files of Reference
- `backend/server.py` — public + auth + admin endpoints
- `backend/auth.py` — bcrypt + JWT + `require_admin`
- `backend/storage.py` — R2 upload/delete via boto3
- `backend/seed_reviews.py` — idempotent migration of 8 sample reviews
- `frontend/src/lib/api.js` — axios + helpers
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Admin.jsx` — dashboard + editor dialog
- `frontend/src/pages/AdminLogin.jsx`
- `frontend/src/index.css` — light theme CSS variables

## Backlog
- **P1**: Verify a sender domain in Resend so emails deliver beyond verified addresses
- **P2**: Migrate FastAPI `on_event` → lifespan handler (deprecation note)
- **P2**: Tighten CORS — explicit origins instead of `*`
- **P2**: Allow admin update to clear optional string fields (verdict / cover_url)
- **P3**: Brute-force protection on `/api/auth/login` (5-fail lockout)
- **P3**: Admin: drag-and-drop multi-cover, image cropping, markdown live preview
- **P3**: RSS feed + sitemap for SEO
- **P3**: Newsletter signup via Resend Audiences
