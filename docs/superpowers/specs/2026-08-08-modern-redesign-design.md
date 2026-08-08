# Modern Redesign — Design Spec

**Date:** 2026-08-08
**Status:** Approved by user, ready for implementation planning

## Context

Patepic.com (game review/critique site, general gamers) currently uses a deliberate
retro/8-bit pixel-art visual language: `Press Start 2P` (headings) + `VT323` (body),
a global `border-radius: 0` override, thick solid-black borders, hard offset "pixel"
shadows with a press-down button animation, a CRT scanline overlay, a pixel-dither
background texture, rotated "sticker" photo frames, and geometric hexagon/diamond
decorations.

Goal: redesign to a modern, considered visual style — without reading as generic
"AI-generated SaaS" (no default gradients, no purple/blue SaaS palette, no
cookie-cutter rounded-cards-with-shadows-everywhere, no default-Tailwind vibe).

## Non-goals

- **No new brand colors.** The existing palette (`pixel-forest`, `pixel-teal`,
  `pixel-mint`, `pixel-pink`, `pixel-blush`, `pixel-black`, `pixel-white`) is kept
  exactly as-is, hex-for-hex. Only *how* it's used changes (contrast, hierarchy,
  whitespace) — no new hues introduced.
- Not a content/IA rewrite. Page structure and copy stay the same except where noted
  explicitly below (Home page consolidation).
- Not a rebuild of the data layer, routing, or admin functionality — visual/styling
  layer only.

## Foundations

### Typography

Replace `Press Start 2P` + `VT323` with **Inter** (variable font, weights
400/500/600/700/800) for everything — headings, body, UI chrome, and score/rating
numerals. One family, differentiated by weight and size rather than by swapping
fonts.

Type scale (mobile → desktop):

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Hero / display | 40px → 56px | 800 | -0.02em | Page heroes only |
| H1 | 32px → 40px | 700 | -0.01em | Page titles |
| H2 | 24px → 28px | 600 | normal | Section titles |
| H3 | 18px → 20px | 600 | normal | Card/subsection titles |
| Body large (lede) | 18px | 400 | normal | Intro paragraphs, line-height 1.6 |
| Body | 16px | 400 | normal | Default copy, line-height 1.6 |
| Small / meta | 14px | 500 | normal | Dates, tags, captions |
| Label / eyebrow | 12px | 600 | 0.06em uppercase | Replaces current 0.2–0.35em tracking |

Scores/ratings: Inter at weight 800, `font-variant-numeric: tabular-nums`, sized up
relative to context (32–40px in a badge). No second/display typeface.

Side effect: neither retro font shipped a bold master, so existing `font-bold` on
body text was browser-faked. Inter has real weights — this is fixed for free.

### Spacing

- Keep the existing container pattern as-is: `max-w-{4xl–7xl} mx-auto px-4 sm:px-6
  lg:px-8`.
- Standardize section vertical rhythm: `py-16 md:py-24` (standard sections),
  `py-20 md:py-28` (hero/lead sections) — replacing hand-set per-page values.
- Standardize card padding to `p-6` (currently ranges `p-3`–`py-16` across similar
  card types).
- Two gap sizes: `gap-6` for card/content grids, `gap-3` for tight inline clusters
  (buttons, tags) — replacing the current interchangeable `gap-2`/`gap-3`/`gap-4`/`gap-6`.

### Color usage

No new hex values. Two concrete changes to *usage*:

1. **Body/heading text color moves from `pixel-forest` (saturated green) to
   `pixel-black`** (near-black, already in the palette, currently only used for
   borders). `pixel-forest` and `pixel-pink` are reserved for links, buttons, and
   accents. Rationale: readable near-neutral text with saturated color reserved for
   interactive/emphasis elements is the modern-editorial default; this is a usage
   change, not a new color.
2. **Backgrounds lean white/off-white by default** (`pixel-white`), with
   `pixel-blush`/`pixel-mint` reserved for section-level tinting rather than being
   the default page wash — more whitespace, less uniform pink background.

Bug fix folded in: `bg-background`/`text-foreground`/`bg-card`/`bg-popover` Tailwind
classes currently resolve to nothing because their backing CSS variables
(`--background`, `--foreground`, etc.) are never defined, despite being referenced
by `tailwind.config.js` and consumed by some shadcn primitives (Select, Dialog).
Define real values for these, mapped onto the existing palette per the rules above.

### Borders, shadows, radius

- **Borders:** 1px hairline, soft-tinted (not solid black), used sparingly — many
  cards rely on background/whitespace contrast instead of a border at all.
- **Shadows:** remove hard offset "pixel" shadows and the press-down button
  animation entirely. One soft shadow token, reserved for genuinely elevated
  surfaces (dropdowns, modals, popovers) — not applied to ordinary cards.
- **Radius:** `6px` (inputs, small chips/tags), `10px` (cards, buttons), `16px`
  (large image panels/hero art), `full` (true pills and avatars only). Replaces the
  global `borderRadius: 0` override in `tailwind.config.js`.

### Removed retro elements

Removed entirely, no modern replacement: CRT scanline overlay (`body::after`),
pixel-dither background texture (`.ground-texture`), stepped "pixel corners"
(`.pixel-corners` — currently dead/unused CSS, confirmed safe to delete), hexagon/
diamond geometric decorations (`.geo-hexagon`, `.geo-diamond`, `.geo-triangle`),
marker-highlight inline text style (`.hl`).

`StickerBadge` and `SparkleField` (rotated-sticker photo frames, blinking-sparkle
effect in `src/components/ui/decor.jsx`) are retro-specific effects with no direct
modern equivalent — replaced per-use with plain, restrained equivalents (e.g. a
simple bordered/radius'd icon badge with no rotation or blink animation) rather than
restyled 1:1.

## Component rollout plan

Bottom-up ordering so nothing is restyled twice.

**Phase 1 — Foundation files**
`tailwind.config.js` (fonts, radius scale, type/spacing tokens, remove pixel shadow
tokens), `src/index.css` / `src/App.css` (font import, define `--background` etc.
CSS vars, remove scanline/dither/pixel-corner/geo-shape/sticker-frame/`.hl`/press-
animation CSS), `index.html` (swap font `<link>` tags).

**Phase 2 — UI primitives** (`src/components/ui/`)
`button.jsx` (becomes the real button, replacing the bespoke `.pill` classes used
ad hoc across pages), `input.jsx`, `select.jsx`, `textarea.jsx`, `slider.jsx`
(restyle so pages stop needing per-instance overrides), `decor.jsx`
(`SectionTitle`/`Kicker`/`PillHeading` restyled to new type scale; `StickerBadge`/
`SparkleField` replaced per above), `skeleton.jsx` (restyle to match new card
shapes, no behavior change).

**Phase 3 — Layout shell**
`Navbar.jsx`, `Footer.jsx`, `Layout.jsx` — locked early since every page depends on
them.

**Phase 4 — Shared content component**
`ReviewListing.jsx` — used on both Home and Reviews; fixed once.

**Phase 5 — Pages, in traffic/priority order**
1. `Home.jsx` — **includes consolidating the redundant hero + centered-wordmark-band
   sections** (`Home.jsx:25-55` and `:58-68`) into one hero. This is a layout/scope
   change beyond pure restyling, approved as part of this pass.
2. `Reviews.jsx`
3. `ReviewDetail.jsx`
4. `TierList.jsx`
5. `Guidelines.jsx`
6. `About.jsx`
7. `Contact.jsx`

**Phase 6 — Admin surfaces**
`Admin.jsx`, `AdminLogin.jsx` — same system, lower visual priority/scrutiny.

**Phase 7 — Year in Gaming**
`src/components/year-in-gaming/*`, `YearInGaming2026.jsx` — reworked to match the
new system (removing the existing blur/glow/gradient/glassmorphic treatment),
built last against final locked tokens.

## Subjective calls made (flagged for awareness)

- Body/heading text recolored from `pixel-forest` to `pixel-black` — approved.
- Corner radius: small consistent scale (6/10/16/full) rather than sharp-corners-
  kept — approved.
- Borders/shadows: mostly borderless with soft elevation shadow, no press
  animation — approved.
- All retro texture effects (scanline, dither, stickers, geo-shapes, highlight)
  removed rather than partially kept — approved.
- Year in Gaming reworked to match rather than left out of scope — approved.
- Scores stay in Inter (heavier weight) rather than getting a second display
  typeface — approved.
- Home page hero/wordmark-band duplication folded into the Phase 5 pass as a
  layout consolidation, not pure restyling — approved as part of this spec (see
  Phase 5).
- `StickerBadge`/`SparkleField` get plain restrained replacements rather than a
  literal restyle, since the effects themselves (rotation, blink) are retro-coded
  with no modern equivalent — decided by default in this spec; flagged here in case
  the user wants a different treatment when Phase 2 is reviewed.

## Out of scope

- No changes to data/routing/auth logic.
- No new colors added to the palette.
- Dark mode: `darkMode: ["class"]` is configured but unused (no toggle, no `dark:`
  usage anywhere) — left as unused scaffolding, not implemented as part of this
  redesign.
