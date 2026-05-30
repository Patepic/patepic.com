# Frostbyte — Game Review Blog (PRD)

## Original Problem Statement
Build a game review style blog site with:
1. Landing page with review stats and recent reviews
2. About page
3. Reviews page with search bar and filters (platform, genre, etc.)
4. Review guidelines explaining scoring methodology
5. Tier list page
6. Contact form page

Theme: icy blues. Originally requested Astro.js → user agreed to React (Astro unsupported on Emergent).

## Architecture
- **Frontend**: React (CRA) + React Router + Tailwind + Shadcn UI + Framer Motion + lucide-react + react-markdown
- **Backend**: FastAPI single endpoint `/api/contact` using **Resend** (currently in DEV MODE with placeholder API key)
- **No database**: All review content lives in `/app/frontend/src/data/reviews.js` as JS objects with markdown body strings

## User Choices
- Stack: React (no Astro), no DB, markdown-style content in JS data file
- Theme: icy blues (Cinematic Frost archetype, deep navy + cyan accents)
- Fonts: **Fraunces** (display) + **Inter** (body)
- Contact form: Resend integration (placeholder API key — user will replace later)
- 8 seeded sample reviews included

## What's Been Implemented (2026-12)
- Landing page with bento stats (total reviews, avg score, top platform, gold standard) + featured recent reviews grid
- Reviews listing with full-text search, platform/genre checkboxes, score range slider, sort select
- Review detail page with floating glowing score badge, pros/cons cards, markdown body, related-by-genre recs
- Tier list page (S/A/B/C/D/F) with auto-grouping by score
- Guidelines page with 6-tier scoring breakdown + 5 house-rule principles
- About page with bio + photo
- Contact page with validated form + Resend backend (dev-mode safe)
- Navbar (mobile responsive) + Footer with social links
- Sonner toast notifications for form feedback
- 100% backend + frontend test coverage on iteration_1

## Files of Reference
- `backend/server.py` — `/api/health`, `/api/contact`
- `frontend/src/data/reviews.js` — review data + `scoreToTier()`
- `frontend/src/pages/*` — Home, About, Reviews, ReviewDetail, Guidelines, TierList, Contact
- `frontend/src/components/layout/*` — Navbar, Footer, Layout
- `frontend/src/components/ReviewCard.jsx`

## Backlog / Next Tasks
- **P1**: Plug in real Resend API key + verified domain in `backend/.env`
- **P2**: Add RSS / sitemap for SEO
- **P2**: Newsletter signup (Resend Audiences)
- **P3**: Convert reviews from JS file → real `.md` files with frontmatter (needs CRA loader config or migration to Vite)
- **P3**: Add cover image upload helper or use proper game key art
- **P3**: Reading-time estimate on review cards
