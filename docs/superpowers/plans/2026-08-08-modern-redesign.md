# Modern Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace patepic.com's retro/pixel-art visual language (Press Start 2P + VT323, forced-square corners, hard offset shadows, scanline/dither textures, sticker frames) with a modern editorial style, using Inter and the existing color palette unchanged.

**Architecture:** Bottom-up rollout. Fix shared tokens and CSS custom classes first (Tasks 1–2) so the majority of the visual change happens automatically, with zero JSX edits, everywhere those tokens/classes are used. Task 3 is a single mechanical, project-wide find/replace pass (text-ink color, border weight, label tracking) — safe because every substitution is a 1:1 string rename with no ambiguity. Tasks 4–12 restyle the UI primitives, layout shell, and shared card component that everything else depends on. Tasks 13+ verify each page/section against the new system and handle the handful of bespoke, non-mechanical items each one has (documented per task).

**Tech Stack:** React 19, Vite, Tailwind CSS v3.4 (JIT), Radix UI primitives, class-variance-authority, lucide-react icons.

## Global Constraints

- No new colors. Only these hex values may appear: `#2e7058` (pixel-forest), `#7fbcbf` (pixel-teal), `#a8e6cf` (pixel-mint), `#f7a1c4` (pixel-pink), `#ffdde6` (pixel-blush), `#181411`/`#121212` (pixel-black — reconcile to `#181411`, see Task 1), `#f7f4ef`/`#fff5f8` (pixel-white — reconcile to `#f7f4ef`, see Task 1), `#c1272d` (pre-existing destructive/error-state red, already hardcoded in `tailwind.config.js` `colors.destructive` before this redesign — not a named `pixel-*` token but kept as-is, confirmed with the user during Task 1 review), `#1f4d3d` and `#f07eae` (pre-existing darker hover-shade variants of pixel-forest/pixel-pink, already defined as `--pixel-forest-dark`/`--pixel-pink-dark` in the original `src/index.css` before this redesign — kept as-is, adjudicated during Task 2 review). Muted/reduced-emphasis text should use an opacity variant of an approved color (e.g. `rgba(24, 20, 17, 0.65)` for muted ink), never a new literal hex — this is how `--ink-muted` was corrected during Task 2's fix round after the reviewer caught a newly-invented `#4a4038`.
- Typeface: Inter everywhere (headings, body, UI, scores). No second display font.
- Radius scale: `6px` (sm/DEFAULT/md), `10px` (lg/xl/2xl — the "card" radius), `16px` (3xl — large panels/hero art), `9999px` (full — true pills/avatars only).
- Borders: 1px hairline, low-opacity black tint (`border-pixel-black/10`) as the default; no 2–4px solid-black borders anywhere.
- Shadows: soft, blurred elevation shadows only; no hard offset "pixel" shadows; no press-down button animation.
- Body/heading text color: `pixel-black` (`text-pixel-black`), not `pixel-forest`. `pixel-forest`/`pixel-pink` reserved for interactive elements (buttons, links, accents) and backgrounds.
- Default page/section background leans white (`pixel-white`); `pixel-blush`/`pixel-mint` are section-level tints, not the default canvas.
- Spacing rhythm: standard sections use `py-16 md:py-24`; hero/lead sections use `py-20 md:py-28`; card padding is `p-6` (rounded to the nearest existing `p-4`/`p-5` where a card is small/dense, e.g. `ReviewListing`); grid/card gaps use `gap-6`, tight inline clusters (buttons, tags) use `gap-3`. Container pattern (`max-w-{4xl–7xl} mx-auto px-4 sm:px-6 lg:px-8`) is already consistent site-wide — do not change it.
- Remove entirely: CRT scanline overlay, pixel-dither texture, stepped pixel-corners, hexagon/diamond geometric decorations, sticker rotation, marker-highlight background fill, blinking sparkles, glassmorphism (backdrop-blur/glow-blob) treatment in Year in Gaming.
- After every task: run `npm run build` and confirm it exits 0 before committing. This is a static Vite/Tailwind build with no test suite in this repo — the build is the correctness gate for markup/config validity; visual correctness is confirmed via the Playwright checks specified per task.
- Reference spec: `docs/superpowers/specs/2026-08-08-modern-redesign-design.md`.

---

## Task 1: Tailwind config — fonts, radius, shadows, palette reconciliation

**Files:**
- Modify: `tailwind.config.js` (full file, 71 lines)
- Modify: `index.html:8-11` (font `<link>` tags)

**Interfaces:**
- Produces: `font-sans`/`font-display` Tailwind utilities both resolving to Inter (consumed by every component that currently uses `font-display`, `.display-hero`, `.display-heading` — no call-site changes needed).
- Produces: `rounded-{sm,md,lg,xl,2xl,3xl,full}` resolving to the new 6/6/10/10/10/16/9999 scale (consumed by ~30 existing `rounded-*` occurrences across pages — no call-site changes needed).
- Produces: `shadow-{pixel-sm,pixel,pixel-lg,pixel-pink}` resolving to soft elevation shadows instead of hard offsets (consumed by `About.jsx:109`, `Home.jsx:99,108,168,178`, `Contact.jsx:156`, `ReviewDetail.jsx:76` — no call-site changes needed).
- Produces: `pixel-black` = `#181411` (single source of truth; Task 2 must not redefine a different hex for this in CSS vars).

- [ ] **Step 1: Replace `tailwind.config.js` in full**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '6px',
      DEFAULT: '6px',
      md: '6px',
      lg: '10px',
      xl: '10px',
      '2xl': '10px',
      '3xl': '16px',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        display: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'pixel-forest': '#2e7058',
        'pixel-teal': '#7fbcbf',
        'pixel-mint': '#a8e6cf',
        'pixel-pink': '#f7a1c4',
        'pixel-blush': '#ffdde6',
        'pixel-black': '#181411',
        'pixel-white': '#f7f4ef',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: '#2e7058', foreground: '#ffdde6' },
        secondary: { DEFAULT: '#ffdde6', foreground: '#2e7058' },
        muted: { DEFAULT: '#a8e6cf', foreground: '#2e7058' },
        accent: { DEFAULT: '#f7a1c4', foreground: '#181411' },
        destructive: { DEFAULT: '#c1272d', foreground: '#ffdde6' },
        border: '#7fbcbf',
        input: '#7fbcbf',
        ring: '#f7a1c4',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
      },
      boxShadow: {
        'pixel-sm': '0 1px 2px 0 rgba(24, 20, 17, 0.06)',
        pixel: '0 6px 20px -6px rgba(24, 20, 17, 0.18)',
        'pixel-lg': '0 16px 40px -12px rgba(24, 20, 17, 0.22)',
        'pixel-pink': '0 6px 20px -6px rgba(24, 20, 17, 0.18)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
```

Note: the `blink` keyframe/animation is removed — it only backed `SparkleField` (deleted in Task 7) and the Navbar "Live" dot (restyled to a static/pulsing-via-opacity-transition dot in Task 9, not a hard blink).

- [ ] **Step 2: Swap the font `<link>` tags in `index.html`**

Replace lines 8-11:
```html
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <!-- Inter: single typeface for headings, body, and UI. -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0. (Tailwind will regenerate utility classes against the new config; no runtime behavior depends on this step beyond compilation.)

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js index.html
git commit -m "Swap retro fonts for Inter, restore radius scale, soften shadows"
```

---

## Task 2: `src/index.css` — rewrite custom classes, remove retro textures, define semantic color vars

**Files:**
- Modify: `src/index.css` (full file, 308 lines)

**Interfaces:**
- Produces: `--background`/`--foreground`/`--card`/`--card-foreground`/`--popover`/`--popover-foreground` CSS vars (consumed by `tailwind.config.js` Task 1, and by `select.jsx`'s `bg-popover`/`text-popover-foreground` classes — this fixes the previously-broken/undefined tokens).
- Produces: `.pill`, `.pill-ember`, `.pill-gold`, `.pill-outline`, `.pill-live`, `.panel-framed`, `.sticker-frame`, `.display-hero`, `.display-heading`, `.accent-serif`, `.magazine-rule`, `.hl`, `.back-to-top` — same class names as before, new modern visual treatment, zero JSX call-site changes required anywhere these are used.
- Removes: `.ground-texture::before`, `.pixel-corners`, `.geo-diamond`, `.geo-hexagon`, `.geo-triangle`, `body::after` (scanline), `.label-chip`, `.sepia-soft`, `.animate-reveal`/`.delay-*` (unused after Task 7 removes `SparkleField`/reveal-based entrance animation — confirm via grep in Step 1 before deleting; keep if any other call site depends on them).

- [ ] **Step 1: Grep for usages that must survive the rewrite**

Run: `grep -rn "label-chip\|sepia-soft\|animate-reveal\|delay-[1-6]" src/`
Expected: note every hit. `label-chip` and `sepia-soft` are expected to have zero hits outside `index.css` itself (dead code, confirmed in the design spec's research) — delete them. If `animate-reveal`/`delay-N` have hits (Home.jsx uses `animate-reveal delay-4` per the stat card at `Home.jsx:108`), keep those keyframes/classes as-is; they're a plain fade/slide-in, not a retro effect.

- [ ] **Step 2: Replace `src/index.css` in full**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f7f4ef;
  color: #181411;
}

::selection {
  background: #f7a1c4;
  color: #181411;
}

/* ---------------------------------------------------------------
   Palette tokens
   --------------------------------------------------------------- */
:root {
  --pixel-forest: #2e7058;
  --pixel-forest-dark: #1f4d3d;
  --pixel-teal: #7fbcbf;
  --pixel-mint: #a8e6cf;
  --pixel-pink: #f7a1c4;
  --pixel-pink-dark: #f07eae;
  --pixel-blush: #ffdde6;
  --pixel-black: #181411;
  --pixel-white: #f7f4ef;
  --ink: #181411;
  --ink-muted: #4a4038;

  /* shadcn-primitive semantic tokens — HSL triplets (no hsl() wrapper),
     converted from the hex palette above so bg-background/text-foreground/
     bg-card/bg-popover resolve instead of being undefined. */
  --background: 38 30% 95%;       /* pixel-white page canvas */
  --foreground: 24 18% 8%;        /* pixel-black ink */
  --card: 0 0% 100%;              /* pure white card surface */
  --card-foreground: 24 18% 8%;
  --popover: 0 0% 100%;
  --popover-foreground: 24 18% 8%;
}

/* Raster images that should keep hard pixel edges instead of smooth
   upscaling blur when displayed above their native resolution. */
.pixelated { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }

/* ---------------------------------------------------------------
   Buttons — 1px border, soft elevation shadow on hover only,
   no press-down animation.
   --------------------------------------------------------------- */
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.pill-ember {
  background: var(--pixel-forest);
  color: var(--pixel-white);
}
.pill-ember:hover { background: var(--pixel-forest-dark); box-shadow: 0 6px 20px -6px rgba(24, 20, 17, 0.25); }

.pill-gold {
  background: var(--pixel-pink);
  color: var(--pixel-black);
}
.pill-gold:hover { background: var(--pixel-pink-dark); box-shadow: 0 6px 20px -6px rgba(24, 20, 17, 0.2); }

.pill-outline {
  background: transparent;
  color: var(--pixel-forest);
  border-color: rgba(24, 20, 17, 0.14);
}
.pill-outline:hover { background: rgba(46, 112, 88, 0.06); border-color: rgba(24, 20, 17, 0.22); }

.pill-live {
  background: rgba(247, 161, 196, 0.16);
  color: var(--pixel-forest);
  border-color: rgba(24, 20, 17, 0.1);
}
.pill-live:hover { background: rgba(247, 161, 196, 0.26); }

/* ---------------------------------------------------------------
   Display type — Inter, heavier weights, tight tracking. Class
   names kept so `.display-hero`/`.display-heading` call sites
   across pages need no edits.
   --------------------------------------------------------------- */
.display-hero {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.display-heading {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

/* Small eyebrow line above a heading. */
.accent-serif {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Inline emphasis inside body copy — weight only, no highlight fill
   (the marker-highlight effect is removed per the design spec). */
.hl {
  font-weight: 700;
  color: inherit;
}

/* White reading surface — hairline border, soft shadow, no inset
   double-border. */
.panel-framed {
  background: var(--pixel-white);
  border: 1px solid rgba(24, 20, 17, 0.08);
  box-shadow: 0 1px 2px 0 rgba(24, 20, 17, 0.04);
}

/* Thumbnail frame — hairline border, no rotation, subtle hover lift
   via opacity rather than a hard offset-shadow lift. */
.sticker-frame {
  border: 1px solid rgba(24, 20, 17, 0.08);
  transition: opacity 0.15s ease;
}
.sticker-frame:hover { opacity: 0.92; }

/* ---------------------------------------------------------------
   Section eyebrow — plain small-caps label, no flanking rule lines.
   --------------------------------------------------------------- */
.magazine-rule {
  display: flex;
  align-items: center;
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

@keyframes reveal-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-reveal {
  animation: reveal-up 0.5s ease both;
}
.delay-1 { animation-delay: 0.05s; }
.delay-2 { animation-delay: 0.1s; }
.delay-3 { animation-delay: 0.15s; }
.delay-4 { animation-delay: 0.2s; }
.delay-5 { animation-delay: 0.25s; }
.delay-6 { animation-delay: 0.3s; }

/* Floating back-to-top button. */
.back-to-top {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 40;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: var(--pixel-forest);
  color: var(--pixel-white);
  box-shadow: 0 6px 20px -6px rgba(24, 20, 17, 0.3);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.2s ease, background-color 0.2s ease;
}
.back-to-top.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.back-to-top:hover {
  background: var(--pixel-forest-dark);
}

*:focus-visible {
  outline: 2px solid var(--pixel-pink);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

If Step 1 found live usages of `label-chip`/`sepia-soft`, keep those specific class definitions (copy them from the current file into the new one unchanged) rather than dropping them.

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "Modernize shared CSS classes, remove retro textures and scanline overlay"
```

---

## Task 3: Project-wide mechanical text/class substitutions

This is one task because every substitution below is an unambiguous 1:1 string rename — not a design judgment call. Ambiguous or structural changes are handled per-page in Tasks 13+.

**Files:**
- Modify: all files under `src/pages/**/*.jsx` and `src/components/**/*.jsx` (except files already fully rewritten in Tasks 4–12 — run this task **before** Tasks 4–12 so those tasks start from already-normalized source, or **skip** files already rewritten by the time this runs; either order is safe since the substitutions are idempotent no-ops on already-clean text)

**Interfaces:**
- Consumes: nothing new — pure text substitution.
- Produces: no `text-pixel-forest`, no `border-2 border-pixel-black`/`border-3`/`border-4 border-pixel-black`, no `border-b-4 border-pixel-black`/`border-t-4 border-pixel-black`, no `ground-texture` class, and normalized `tracking-[0.06em]` on label/eyebrow text, anywhere in `src/`.

- [ ] **Step 1: Confirm current occurrence counts (baseline)**

Run:
```bash
grep -rc "text-pixel-forest" src/ | awk -F: '{sum+=$2} END {print sum}'
grep -rn "border-2 border-pixel-black\|border-3 border-pixel-black\|border-4 border-pixel-black\|border-b-4 border-pixel-black\|border-t-4 border-pixel-black" src/ | wc -l
grep -rn "ground-texture" src/ | wc -l
```
Expected: non-zero counts (this confirms the greps in the design-research phase — roughly 100+, 20+, 6 respectively). Record the numbers to compare against Step 3.

- [ ] **Step 2: Run the substitutions**

Apply these exact replacements across every `.jsx` file in `src/pages/` and `src/components/` (use your editor's project-wide find/replace, or the equivalent PowerShell loop below — do NOT use a shell tool that isn't available in this environment; adapt syntax as needed):

| Find (exact substring) | Replace with |
|---|---|
| `text-pixel-forest` | `text-pixel-black` |
| `border-4 border-pixel-black` | `border border-pixel-black/10` |
| `border-2 border-pixel-black` | `border border-pixel-black/10` |
| `border-b-4 border-pixel-black` | `border-b border-pixel-black/10` |
| `border-t-4 border-pixel-black` | `border-t border-pixel-black/10` |
| ` ground-texture` (leading space, to avoid leaving a double space) | `` (remove) |
| `tracking-[0.1em]` | `tracking-[0.06em]` |
| `tracking-[0.12em]` | `tracking-[0.06em]` |
| `tracking-[0.15em]` | `tracking-[0.06em]` |
| `tracking-[0.18em]` | `tracking-[0.06em]` |
| `tracking-[0.2em]` | `tracking-[0.06em]` |
| `tracking-[0.22em]` | `tracking-[0.06em]` |
| `tracking-[0.25em]` | `tracking-[0.06em]` |
| `tracking-[0.28em]` | `tracking-[0.06em]` |
| `tracking-[0.35em]` | `tracking-[0.06em]` |

Example PowerShell (run from repo root; review `git diff` after, don't blind-trust):
```powershell
$files = Get-ChildItem -Recurse -Include *.jsx -Path src/pages, src/components
$pairs = @(
  @("text-pixel-forest", "text-pixel-black"),
  @("border-4 border-pixel-black", "border border-pixel-black/10"),
  @("border-2 border-pixel-black", "border border-pixel-black/10"),
  @("border-b-4 border-pixel-black", "border-b border-pixel-black/10"),
  @("border-t-4 border-pixel-black", "border-t border-pixel-black/10"),
  @(" ground-texture", ""),
  @("tracking-[0.1em]", "tracking-[0.06em]"),
  @("tracking-[0.12em]", "tracking-[0.06em]"),
  @("tracking-[0.15em]", "tracking-[0.06em]"),
  @("tracking-[0.18em]", "tracking-[0.06em]"),
  @("tracking-[0.2em]", "tracking-[0.06em]"),
  @("tracking-[0.22em]", "tracking-[0.06em]"),
  @("tracking-[0.25em]", "tracking-[0.06em]"),
  @("tracking-[0.28em]", "tracking-[0.06em]"),
  @("tracking-[0.35em]", "tracking-[0.06em]")
)
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  foreach ($p in $pairs) {
    $content = $content.Replace($p[0], $p[1])
  }
  Set-Content $f.FullName -Value $content -NoNewline
}
```

Note the replacement order matters for the border rules: `border-4`/`border-b-4`/`border-t-4` must run before the plain `border-2` line since none of these substrings overlap, but keep the order above to be safe.

- [ ] **Step 3: Confirm the substitutions landed and nothing else broke**

Run:
```bash
grep -rn "text-pixel-forest" src/
grep -rn "border-2 border-pixel-black\|border-3 border-pixel-black\|border-4 border-pixel-black" src/
grep -rn "ground-texture" src/
```
Expected: zero results for all three.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Normalize ink color, border weight, and label tracking across all pages"
```

---

## Task 4: `button.jsx` — variants and sizes matching the new system

**Files:**
- Modify: `src/components/ui/button.jsx` (full file, 52 lines)

**Interfaces:**
- Produces: `Button`/`buttonVariants` with variants `default` (forest fill), `accent` (pink fill — new), `outline`, `secondary`, `ghost`, `destructive`, `link`; sizes `xs` (new, 28px), `sm` (32px), `default` (36-40px), `lg` (44-48px), `icon`.
- Consumed by: `AlertDialogAction`/`AlertDialogCancel` (unchanged usage), and available for any new/rewritten call sites in later tasks.

- [ ] **Step 1: Replace `src/components/ui/button.jsx` in full**

```jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-pixel-forest text-pixel-white hover:bg-[#1f4d3d]",
        accent: "bg-pixel-pink text-pixel-black hover:bg-[#f07eae]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-pixel-black/10 text-pixel-forest hover:bg-pixel-forest/[0.06]",
        secondary: "bg-pixel-blush text-pixel-forest hover:bg-pixel-blush/70",
        ghost: "text-pixel-black hover:bg-pixel-black/[0.05]",
        link: "text-pixel-forest underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-md",
        sm: "h-8 px-3.5 text-xs rounded-md",
        default: "h-10 px-5",
        lg: "h-12 px-7",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.jsx
git commit -m "Restyle Button primitive: soft fills, no press animation, new size scale"
```

---

## Task 5: `input.jsx`, `textarea.jsx`, `select.jsx` — hairline borders, standard radius

**Files:**
- Modify: `src/components/ui/input.jsx` (full file, 21 lines)
- Modify: `src/components/ui/textarea.jsx` (full file, 20 lines)
- Modify: `src/components/ui/select.jsx:17-19` (SelectTrigger className only)

**Interfaces:**
- Produces: `Input`/`Textarea`/`SelectTrigger` with `border` (1px) instead of `border-2`, `rounded-lg` (10px) instead of the shadcn-default `rounded-md`/unset. Pages that override radius with `rounded-full` in their `className` prop still win (Tailwind-merge applies the last class) — those overrides are addressed explicitly in Tasks 14/19/21.

- [ ] **Step 1: Replace `src/components/ui/input.jsx` in full**

```jsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-transparent px-3.5 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
```

- [ ] **Step 2: Replace `src/components/ui/textarea.jsx` in full**

```jsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3.5 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
```

- [ ] **Step 3: Edit `src/components/ui/select.jsx` line 17-19 (SelectTrigger)**

Change:
```jsx
        "flex h-9 w-full items-center justify-between whitespace-nowrap border-2 border-input bg-transparent px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
```
to:
```jsx
        "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-3.5 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/input.jsx src/components/ui/textarea.jsx src/components/ui/select.jsx
git commit -m "Give form primitives hairline borders and standard radius"
```

---

## Task 6: `slider.jsx` — confirm no change needed beyond the global radius fix

**Files:**
- Modify: `src/components/ui/slider.jsx:15` (border width only)

**Interfaces:**
- No new interfaces; this task only downgrades the track border from 1px solid teal (already thin, fine) — actually no change needed there. Only the thumb's `border-2 border-pixel-black` needs the same hairline treatment as every other primitive for consistency.

- [ ] **Step 1: Edit `src/components/ui/slider.jsx` line 18**

Change:
```jsx
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-pixel-black bg-pixel-pink shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pixel-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
```
to:
```jsx
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-pixel-black/15 bg-pixel-pink shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pixel-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/slider.jsx
git commit -m "Give slider thumb a hairline border to match other primitives"
```

---

## Task 7: `decor.jsx` — restyle, remove sticker rotation and sparkle blink

**Files:**
- Modify: `src/components/ui/decor.jsx` (full file, 105 lines)
- Modify: `src/pages/Home.jsx:60` (remove `rotate` prop from `StickerBadge` call)
- Modify: `src/pages/Contact.jsx:76` (remove `rotate` prop from `StickerBadge` call)
- Modify: any remaining `<SparkleField` usage — grep first (Step 1)

**Interfaces:**
- Produces: `SocialRow`, `SectionTitle`, `PillHeading`, `Kicker`, `StickerBadge` (no `rotate` prop), `BackToTop` — same export names/signatures except `StickerBadge` drops the `rotate` prop.
- Removes: `SparkleField` export entirely.

- [ ] **Step 1: Find all `SparkleField` usages**

Run: `grep -rn "SparkleField" src/`
Expected: the export in `decor.jsx` plus zero or more call sites. Note every call site file:line — they must be deleted in Step 3.

- [ ] **Step 2: Replace `src/components/ui/decor.jsx` in full**

```jsx
import { useEffect, useState } from "react";
import { Twitch, Youtube, Mail, ArrowUp } from "lucide-react";
import { creator } from "../../data/creator";

/** Row of square icon-badge social buttons. */
export const SocialRow = ({ className = "", size = "w-10 h-10" }) => {
  const items = [
    { href: creator.twitch.url, label: "Twitch", Icon: Twitch },
    { href: creator.youtube.url, label: "YouTube", Icon: Youtube },
    { href: "mailto:contact@patepic.com", label: "Email", Icon: Mail },
  ];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          data-testid={`social-${label.toLowerCase()}`}
          className={`${size} rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal grid place-items-center transition-colors`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
};

/** Large bold section title, centred like the reference sections. */
export const SectionTitle = ({ children, className = "", as: Tag = "h2" }) => (
  <Tag className={`display-heading text-3xl sm:text-4xl lg:text-5xl text-pixel-black ${className}`}>
    {children}
  </Tag>
);

/** Forest pill used as a sub-heading. */
export const PillHeading = ({ children, className = "" }) => (
  <div
    className={`pill pill-ember display-heading text-base sm:text-lg px-6 py-2 rounded-lg ${className}`}
  >
    {children}
  </div>
);

/**
 * Small eyebrow line above a big headline, e.g.
 * <Kicker>Hello, I'm</Kicker><h1 className="display-hero">Patepic.</h1>
 */
export const Kicker = ({ children, className = "", tone = "text-pixel-forest" }) => (
  <p className={`accent-serif text-sm sm:text-base ${tone} ${className}`}>{children}</p>
);

/** Square icon badge — small decorative touch, no image assets, no rotation. */
export const StickerBadge = ({ icon: Icon, className = "" }) => (
  <div
    aria-hidden="true"
    className={`sticker-frame w-14 h-14 rounded-full bg-pixel-forest text-pixel-pink grid place-items-center ${className}`}
  >
    <Icon className="w-6 h-6" />
  </div>
);

/** Floating back-to-top button, shown once the page has scrolled a bit. */
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
```

Note `StickerBadge`'s `icon` prop no longer defaults to `Sparkle` (the default was only ever meaningful alongside the sparkle-themed decorative language being removed) — every call site must pass an explicit `icon`. Confirm via Step 1's earlier survey that both current call sites (`Home.jsx:60` with `Feather`, `Contact.jsx:76` with `Mail`) already do.

- [ ] **Step 3: Remove any `SparkleField` call sites found in Step 1**

For each file:line found, delete the `<SparkleField ... />` JSX element (it renders nothing but decorative absolutely-positioned icons — safe to delete the line/self-closing tag with no other cleanup needed).

- [ ] **Step 4: Remove the `rotate` prop from the two `StickerBadge` call sites**

In `src/pages/Home.jsx:60`, change:
```jsx
<StickerBadge icon={Feather} rotate="rotate-3" className="w-20 h-20 lg:w-24 lg:h-24" />
```
to:
```jsx
<StickerBadge icon={Feather} className="w-20 h-20 lg:w-24 lg:h-24" />
```

In `src/pages/Contact.jsx:76`, change:
```jsx
<StickerBadge icon={Mail} rotate="-rotate-6" className="mx-auto mb-4" />
```
to:
```jsx
<StickerBadge icon={Mail} className="mx-auto mb-4" />
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: exits 0. If it fails with an undefined `SparkleField` import error, you missed a call site from Step 1 — find and remove it.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/decor.jsx src/pages/Home.jsx src/pages/Contact.jsx
git commit -m "Remove sticker rotation and sparkle-blink decoration from decor primitives"
```

---

## Task 8: `skeleton.jsx` — hairline borders on loading-state cards

**Files:**
- Modify: `src/components/ui/skeleton.jsx:23,48,61,87,91` (5 occurrences of `border-2 border-pixel-black`)

**Interfaces:**
- No signature changes — `Skeleton`, `SkeletonText`, `SkeletonImage`, `SkeletonReviewListing`, `HomeDataSkeleton`, `ReviewsDataSkeleton`, `SkeletonTierCards`, `TierListDataSkeleton`, `ReviewDetailDataSkeleton` all keep their existing exports and props.

- [ ] **Step 1: Replace all 5 occurrences of `border-2 border-pixel-black` with `border border-pixel-black/10` in `src/components/ui/skeleton.jsx`**

(Note: Task 3's global substitution runs against `src/pages/` and `src/components/`, which includes this file — if Task 3 already ran, this task is a no-op verification. If running Tasks out of order, apply the substitution here directly.)

Lines to check (line numbers may have shifted if Task 3 already ran and changed line lengths — search for the literal string instead):
- Line 23 (`SkeletonReviewListing` wrapper)
- Line 48 (`SkeletonTierCards` item wrapper)
- Line 61 (`TierListDataSkeleton` tier row wrapper)
- Line 87 and 91 (`ReviewDetailDataSkeleton` pros/cons wrappers)

- [ ] **Step 2: Verify**

Run: `grep -n "border-2 border-pixel-black" src/components/ui/skeleton.jsx`
Expected: zero results.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/skeleton.jsx
git commit -m "Give skeleton loading cards hairline borders"
```
(Skip this commit if Task 3 already committed this exact change — check `git diff` is empty first.)

---

## Task 9: `Navbar.jsx` — hairline chrome border, softened live indicator

**Files:**
- Modify: `src/components/layout/Navbar.jsx` (full file, 129 lines)

**Interfaces:**
- No prop/export signature changes — `Navbar` remains a zero-prop component.
- Depends on: `.pill`/`.pill-live` (Task 2), `text-pixel-black` (already correct here, no Task 3 change needed since Navbar never used `text-pixel-forest`).

- [ ] **Step 1: Replace `src/components/layout/Navbar.jsx` in full**

```jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { creator } from "../../data/creator";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/year-in-gaming/2026", label: "Year in Gaming" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function useTwitchLive(handle) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    if (!handle) return;
    const check = async () => {
      try {
        const tokenRes = await fetch(
          `https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&client_secret=${import.meta.env.VITE_TWITCH_SECRET_KEY}&grant_type=client_credentials`,
          { method: "POST" }
        );
        const { access_token } = await tokenRes.json();
        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${handle}`,
          { headers: { "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID, Authorization: `Bearer ${access_token}` } }
        );
        const { data } = await streamRes.json();
        const stream = data[0] ?? null;
        setLive({ isLive: !!stream, title: stream?.title ?? "", game: stream?.game_name ?? "", viewers: stream?.viewer_count ?? 0 });
      } catch { setLive({ isLive: false }); }
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [handle]);
  return live;
}

const navLink = ({ isActive }) =>
  `relative py-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
    isActive ? "text-pixel-black" : "text-pixel-black/60 hover:text-pixel-black"
  }`;

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const handle = creator.twitch?.handle ?? creator.twitch?.url?.split("/").pop();
  const live = useTwitchLive(handle);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pixel-mint/95 backdrop-blur-none border-b border-pixel-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
          <span className="display-heading text-xl text-pixel-black tracking-tight">
            {creator.name}<span className="text-pixel-pink">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLink}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-pixel-pink" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {live?.isLive && (
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer"
              className="pill pill-live h-8 px-3 rounded-full text-[0.75rem] uppercase tracking-[0.06em]">
              <span className="w-2 h-2 rounded-full bg-pixel-forest" /> Live
            </a>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/admin" className="pill pill-gold h-8 px-4 rounded-lg text-[0.7rem] uppercase tracking-[0.06em]">Admin</Link>
              <button onClick={logout} aria-label="Log out"
                className="w-8 h-8 grid place-items-center rounded-lg border border-pixel-black/10 text-pixel-black hover:bg-pixel-blush/60 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-pixel-black" aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-pixel-mint pt-20 px-6 overflow-y-auto">
          <div className="flex flex-col items-start gap-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} end={l.to === "/"}
                className={({ isActive }) =>
                  `pill h-11 px-6 rounded-lg text-sm uppercase tracking-[0.06em] w-full ${isActive ? "pill-gold" : "pill-outline"}`
                }>
                {l.label}
              </NavLink>
            ))}
          </div>
          {user && (
            <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-pixel-black/10">
              <Link to="/admin" onClick={() => setOpen(false)} className="pill pill-gold h-11 px-6 rounded-lg text-sm">Admin</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="pill pill-outline h-11 px-6 rounded-lg text-sm">Log out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
```

Two behavioral simplifications worth flagging: (1) the `scrolled` state/`onScroll` listener is dropped since it was only ever concatenated into a template literal that never actually varied the header's classes (`className={`... bg-pixel-mint border-b-4 border-pixel-black `}}` — the `scrolled` variable was unused in the output); removing dead state is in scope for a file already being fully rewritten. (2) the live-dot's `animate-blink` class is dropped since Task 1 removes the `blink` keyframe — the dot is now static, matching "no gimmicky blinking" from the retro-texture removal decision.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `http://localhost:5173/` with the Playwright browser tool, take a screenshot, and confirm: hairline (not thick) bottom border on the navbar, no visible blink on the live indicator if a stream happens to be live, Inter font rendering in the nav links and logo.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.jsx
git commit -m "Modernize Navbar: hairline border, remove dead scroll state and blink"
```

---

## Task 10: `Footer.jsx` — hairline chrome border

**Files:**
- Modify: `src/components/layout/Footer.jsx` (full file, 52 lines)

**Interfaces:**
- No prop/export changes.

- [ ] **Step 1: Replace `src/components/layout/Footer.jsx` in full**

```jsx
import { Link } from "react-router-dom";
import { Twitch, Youtube, Mail } from "lucide-react";
import { creator } from "../../data/creator";

const navLinks = [
  { to: "/reviews", label: "Reviews" },
  { to: "/tier-list", label: "Tier List" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Footer = () => {
  return (
    <footer className="relative mt-16 bg-pixel-mint border-t border-pixel-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="pill pill-outline h-7 px-3 rounded-md text-[0.7rem] uppercase tracking-[0.06em]">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={creator.twitch.url} target="_blank" rel="noopener noreferrer" data-testid="footer-twitch"
              aria-label="Twitch"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Twitch className="w-4 h-4" />
            </a>
            <a href={creator.youtube.url} target="_blank" rel="noopener noreferrer" data-testid="footer-youtube"
              aria-label="YouTube"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="mailto:contact@patepic.com" aria-label="Email"
              className="w-8 h-8 grid place-items-center rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pixel-black/10 flex flex-wrap items-center justify-between gap-2 text-sm text-pixel-black/60">
          <span>Copyright © {new Date().getFullYear()} {creator.name}</span>
          <span>{creator.tagline}</span>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.jsx
git commit -m "Modernize Footer: hairline borders"
```

---

## Task 11: `Layout.jsx` — page canvas leans white, not blush

**Files:**
- Modify: `src/components/layout/Layout.jsx:12`

**Interfaces:**
- No prop/export changes.

- [ ] **Step 1: Edit `src/components/layout/Layout.jsx` line 12**

Change:
```jsx
    <div className="relative min-h-screen flex flex-col bg-pixel-blush">
```
to:
```jsx
    <div className="relative min-h-screen flex flex-col bg-pixel-white">
```

This matches the `body` background already set to `#f7f4ef` in Task 2 — `pixel-blush` becomes a section-level tint applied explicitly where pages want it (several pages already set their own section backgrounds, e.g. `Guidelines.jsx:26`, `About.jsx:11`, `ReviewDetail.jsx` skeleton — those are addressed per-page in Tasks 13+ where relevant, not here).

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Layout.jsx
git commit -m "Default page canvas to pixel-white instead of pixel-blush"
```

---

## Task 12: `ReviewListing.jsx` — shared card used on Home and Reviews

**Files:**
- Modify: `src/components/ReviewListing.jsx` (full file, 53 lines)

**Interfaces:**
- No prop/export changes — `ReviewListing({ review })` and `coverUrl(review)` keep their existing signatures (both are imported by `src/pages/Home.jsx` and `src/pages/Reviews.jsx`, and `coverUrl` is imported elsewhere — grep to confirm no other consumer needs a different shape before changing exports, though this task doesn't change them).

- [ ] **Step 1: Replace `src/components/ReviewListing.jsx` in full**

```jsx
import { Link } from "react-router-dom";
import { ArrowUpRight, Gamepad2 } from "lucide-react";

export const coverUrl = (r) => {
  if (!r?.cover_url) return null;
  return r.cover_url.startsWith("http") ? r.cover_url : `https://${r.cover_url}`;
};

/** Bordered listing card: title, date, score badge, "Read" button. */
export function ReviewListing({ review }) {
  const cover = coverUrl(review);
  const genres = Array.isArray(review.genre) ? review.genre : review.genre ? [review.genre] : [];

  return (
    <div data-testid={`review-card-${review.slug}`}
      className="group relative rounded-lg border border-pixel-black/10 bg-pixel-mint p-4 sm:p-5 flex items-center gap-4 transition-colors">
      {cover && (
        <Link to={`/reviews/${review.slug}`} className="sticker-frame shrink-0 rounded-md overflow-hidden w-20 h-20 sm:w-24 sm:h-24 bg-pixel-mint">
          <img src={cover} alt={review.title} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <Link to={`/reviews/${review.slug}`} className="font-display font-bold text-base sm:text-xl text-pixel-black leading-normal block">
          {review.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-pixel-black/80">
          {review.platform && (
            <span className="w-5 h-5 rounded-full bg-pixel-white border border-pixel-black/10 text-pixel-black grid place-items-center shrink-0">
              <Gamepad2 className="w-3 h-3" />
            </span>
          )}
          {[review.date, review.platform].filter(Boolean).join(" · ")}
        </div>
        {genres.length > 0 && (
          <div className="mt-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-pixel-black/50">
            {genres.slice(0, 3).join(" / ")}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="hidden sm:grid place-items-center w-10 h-10 rounded-full bg-pixel-pink text-pixel-black font-display font-bold text-sm">
          {review.rating}
        </span>
        <Link to={`/reviews/${review.slug}`}
          className="pill pill-ember h-9 sm:h-10 px-4 sm:px-6 rounded-lg text-[0.75rem] uppercase tracking-[0.06em]">
          Read <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/reviews`, screenshot via Playwright, confirm: card has a hairline border (not thick black), thumbnail has no black frame/shadow, "Read" button is soft-filled with no hard offset shadow.

- [ ] **Step 4: Commit**

```bash
git add src/components/ReviewListing.jsx
git commit -m "Modernize ReviewListing card"
```

---

## Task 13: `Home.jsx` — hero/wordmark consolidation + verification

**Files:**
- Modify: `src/pages/Home.jsx` (full file — read current content first, since Tasks 3/7 may have already altered lines within it)

**Interfaces:**
- Consumes: `ReviewListing`, `coverUrl` (Task 12), `Kicker`/`StickerBadge`/`SectionTitle` (Task 7), `.pill`/`.panel-framed`/`.magazine-rule` (Task 2).
- No exported interface — this is a route leaf component.

- [ ] **Step 1: Read the current file**

Read `src/pages/Home.jsx` in full (it will already reflect Task 3's mechanical substitutions and Task 7's `StickerBadge` prop removal if those ran first).

- [ ] **Step 2: Consolidate the duplicate hero/wordmark sections**

The current file has two back-to-back identity sections: a hero (title + subtitle + CTA row, roughly lines 25-55) and a second centered "wordmark band" directly beneath it (roughly lines 58-68) that repeats the site name in large display type with a `StickerBadge`. Merge these into one hero section: keep the hero's H1, subtitle, and CTA row; fold the `StickerBadge` into the hero (e.g., positioned beside or above the H1) instead of repeating the wordmark in a second full-width band. Remove the now-redundant second section entirely.

Concretely: keep everything from the current hero through its CTA row. Where the second band currently renders `<div className="display-hero mt-5 text-4xl sm:text-5xl lg:text-6xl text-pixel-black tracking-tight">` with the repeated site name, delete that whole block, and move its `StickerBadge` (if present in that block) up next to the `Kicker` at the top of the hero instead.

- [ ] **Step 3: Verify remaining sections still reference valid classes/components**

Run: `grep -n "display-hero\|display-heading\|magazine-rule\|panel-framed\|StickerBadge\|Kicker" src/pages/Home.jsx`
Expected: all matches correspond to classes/components that still exist after Tasks 2/7 (they do — none were removed, only restyled).

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Visual check**

Run `npm run dev`, navigate to `/`, screenshot via Playwright. Confirm: one hero identity moment (not two), no hard black borders/shadows on stat cards, Inter typography throughout, generous whitespace between sections.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "Consolidate duplicate Home hero/wordmark sections, verify against new design system"
```

---

## Task 14: `Reviews.jsx` — verification + input radius fix

**Files:**
- Modify: `src/pages/Reviews.jsx:78,81,116,126` (remove `rounded-full` from Input/SelectTrigger `className` overrides)

**Interfaces:**
- Consumes: `Input`, `SelectTrigger` (Task 5), `Slider` (Task 6), `.panel-framed`/`.pill` (Task 2).

- [ ] **Step 1: Remove `rounded-full` from the four form-field overrides**

The search box and the three filter selects currently force `rounded-full` in their `className`, which overrides the primitive's new `rounded-lg` default (Task 5) via `tailwind-merge`. Per the design spec's radius rule ("full reserved for true pills/avatars only"), form fields should use the standard `rounded-lg` card radius, not a full pill shape.

At `src/pages/Reviews.jsx:78` (search Input), remove `rounded-full` from the className string (leave `pl-11 h-12 bg-pixel-white border-pixel-teal text-pixel-black placeholder:text-pixel-black/40` — note `text-pixel-forest`→`text-pixel-black` already applied by Task 3).

At `src/pages/Reviews.jsx:81,116,126` (three `SelectTrigger`s), remove `rounded-full` from each className string.

- [ ] **Step 2: Verify**

Run: `grep -n "rounded-full" src/pages/Reviews.jsx`
Expected: zero results (the file has no legitimate pill-shaped elements — verdict filter buttons use `.pill` class which handles its own radius via Task 2's CSS, not a `rounded-full` utility).

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/reviews`, screenshot via Playwright. Confirm: search/filter fields have standard card radius (not pill-shaped), filter panel has a hairline border and soft shadow (not thick black + hard offset), pagination/verdict buttons show no press-animation on click.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Reviews.jsx
git commit -m "Reviews: standard input radius instead of full pill, verify against new design system"
```

---

## Task 15: `ReviewDetail.jsx` — verification

**Files:**
- Modify: none expected beyond what Task 3 already covered — this task is a verification pass. If verification finds an issue, fix it here.

**Interfaces:**
- Consumes: `.panel-framed`/`.pill`/`.display-hero`/`.magazine-rule` (Task 2).

- [ ] **Step 1: Read the current file and confirm no leftover hard-border/shadow classes**

Run: `grep -n "border-4\|shadow-pixel\b\|border-2 border-pixel" src/pages/ReviewDetail.jsx`
Expected: zero results (Task 3 already downgraded `border-4 border-pixel-forest` — wait: `ReviewDetail.jsx:76` uses `border-4 border-pixel-forest` (forest, not black) for the cover-image frame, which Task 3's mechanical pass does **not** touch since it only matches `border-4 border-pixel-black`. Handle this explicitly here:

At `src/pages/ReviewDetail.jsx:76`, change:
```jsx
              <div className="relative overflow-hidden border-4 border-pixel-forest shadow-pixel">
```
to:
```jsx
              <div className="relative overflow-hidden rounded-xl border border-pixel-black/10 shadow-pixel">
```
(`shadow-pixel` already resolves to a soft shadow via Task 1 — no change needed there.)

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to any `/reviews/:slug` detail page, screenshot via Playwright. Confirm: cover image has a hairline border with soft shadow (not a thick green frame), body panel has hairline border, pros/cons cards have hairline borders, score readout uses Inter at heavy weight.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ReviewDetail.jsx
git commit -m "ReviewDetail: soften cover image frame, verify against new design system"
```

---

## Task 16: `TierList.jsx` — verification

**Files:**
- Modify: none expected beyond Task 3's coverage — verification pass.

**Interfaces:**
- Consumes: `.panel-framed`/`.sticker-frame`/`.display-heading` (Task 2).

- [ ] **Step 1: Confirm no leftover hard-border classes**

Run: `grep -n "border-4\|shadow-pixel\b" src/pages/TierList.jsx`
Expected: zero results (no `border-4` usage in this file per the design research; only `border-2 border-pixel-black` occurrences, all covered by Task 3).

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/tier-list`, screenshot via Playwright. Confirm: tier rows have hairline borders, review thumbnails in each tier have no rotation/hard shadow, tier labels render in Inter.

- [ ] **Step 4: Commit**

Only commit if Step 1 required a fix; otherwise this task produces no diff and can be skipped (note in the tracking checklist that it was verified, not skipped for other reasons).

---

## Task 17: `Guidelines.jsx` — verification

**Files:**
- Modify: none expected beyond Task 3's coverage — verification pass.

**Interfaces:**
- Consumes: `.panel-framed`/`.display-hero`/`.display-heading`/`.magazine-rule` (Task 2).

- [ ] **Step 1: Confirm no leftover hard-border classes**

Run: `grep -n "border-4\|shadow-pixel\b" src/pages/Guidelines.jsx`
Expected: zero results.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/guidelines`, screenshot via Playwright. Confirm: tier-explanation rows and principle cards have hairline borders, no dither-texture background visible, headings render in Inter at the new weight/tracking.

- [ ] **Step 4: Commit**

Only if Step 1 required a fix.

---

## Task 18: `About.jsx` — verification

**Files:**
- Modify: none expected beyond Task 3's coverage — verification pass.

**Interfaces:**
- Consumes: `.panel-framed`/`.magazine-rule`/`.hl`/`.pill` (Task 2).

- [ ] **Step 1: Confirm no leftover hard-border/shadow classes**

Run: `grep -n "border-4\|shadow-pixel-sm\|shadow-pixel\b" src/pages/About.jsx`
Expected: `About.jsx:109` will show `shadow-pixel-sm` — this resolves to a soft shadow automatically via Task 1, no edit needed. Confirm zero `border-4` matches.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/about`, screenshot via Playwright. Confirm: profile panel and "where to watch" cards have hairline borders and soft shadows, `.hl` inline emphasis reads as bold text (no pink highlight fill).

- [ ] **Step 4: Commit**

Only if Step 1 required a fix.

---

## Task 19: `Contact.jsx` — verification + input radius fix

**Files:**
- Modify: `src/pages/Contact.jsx:92,98,105,116` (remove `rounded-full`/`rounded-xl` overrides that fight the new primitive default)

**Interfaces:**
- Consumes: `Input`, `Textarea` (Task 5), `StickerBadge` (Task 7, already had its `rotate` prop removed there), `.pill`/`.panel-framed` (Task 2).

- [ ] **Step 1: Remove radius overrides on the four form fields**

At `src/pages/Contact.jsx:92,98,105` (name/email/subject `Input`s), remove `rounded-full` from each className string, leaving the background/border/placeholder classes intact.

At `src/pages/Contact.jsx:116` (message `Textarea`), remove `rounded-xl` from the className string (the `Textarea` primitive's own `rounded-lg` default, Task 5, now applies).

- [ ] **Step 2: Verify**

Run: `grep -n "rounded-full\|rounded-xl" src/pages/Contact.jsx`
Expected: zero results on form-field lines. (If other unrelated `rounded-xl`/`rounded-full` usages exist elsewhere in the file — e.g. on the channel-block icon squares — leave those; this step only concerns the four form fields.)

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/contact`, screenshot via Playwright. Confirm: form fields have standard card radius (not pill-shaped), submit button has no press-animation, `StickerBadge` icons render without rotation.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "Contact: standard input radius instead of full pill, verify against new design system"
```

---

## Task 20: `Admin.jsx` — verification

**Files:**
- Modify: none expected — this file already uses `text-slate-900` rather than the pixel palette for its main heading, and its retro-styling surface area is limited to `font-display` (auto-fixed via Task 1) and standard shadcn Dialog/AlertDialog chrome (auto-fixed via Task 2's CSS var fix + existing `rounded-md`/`shadow-md` classes, which already look reasonably modern once Task 1's radius scale applies). Verification pass only.

**Interfaces:**
- Consumes: `Dialog`, `AlertDialog`, `Select`, `Input`, `Textarea`, `Button` (all restyled in earlier tasks — Admin composes these, doesn't define its own retro classes).

- [ ] **Step 1: Confirm no leftover hard-border/shadow classes**

Run: `grep -n "border-4\|border-2 border-pixel\|shadow-pixel" src/pages/Admin.jsx`
Expected: zero results.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Log in as an admin user (or stub auth per whatever the project's existing dev workflow is — check `src/context/AuthContext.jsx` if unclear), navigate to `/admin`, screenshot via Playwright. Confirm: table/list rows, edit dialog, and delete confirmation all render with hairline borders and soft shadows, no leftover pixel-font headings.

- [ ] **Step 4: Commit**

Only if Step 1 required a fix.

---

## Task 21: `AdminLogin.jsx` — verification + input radius fix

**Files:**
- Modify: `src/pages/AdminLogin.jsx:51,58` (remove `rounded-full` overrides)

**Interfaces:**
- Consumes: `Input`, `Label`, `Button`/`.pill` (Task 5, Task 2).

- [ ] **Step 1: Remove `rounded-full` from the two Input overrides**

At `src/pages/AdminLogin.jsx:51,58` (email/password `Input`s), remove `rounded-full` from each className string.

- [ ] **Step 2: Verify**

Run: `grep -n "rounded-full" src/pages/AdminLogin.jsx`
Expected: zero results.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Visual check**

Run `npm run dev`, navigate to `/admin/login`, screenshot via Playwright. Confirm: form panel has hairline border and soft shadow, inputs have standard card radius, sign-in button has no press-animation.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AdminLogin.jsx
git commit -m "AdminLogin: standard input radius instead of full pill, verify against new design system"
```

---

## Task 22: `year-in-gaming/HeroSection.jsx` — remove glassmorphism, blur, glow, hexagon

**Files:**
- Modify: `src/components/year-in-gaming/HeroSection.jsx` (full file — read first, exact line numbers below are pre-Task-3 references)

**Interfaces:**
- No prop/export signature changes expected — read the file first to confirm its actual export shape before editing.

- [ ] **Step 1: Read the current file in full**

- [ ] **Step 2: Remove the glow-blob and hexagon decoration divs**

Delete these three lines (or their post-Task-3 equivalents — search by the distinctive class fragments if line numbers shifted):
```jsx
      <div className="absolute top-0 right-0 w-96 h-96 bg-pixel-mint/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pixel-mint/5 rounded-full blur-3xl" />
      <div className="absolute -top-24 -left-24 w-48 h-48 geo-hexagon opacity-[0.08] pointer-events-none bg-pixel-pink" />
```

- [ ] **Step 3: Remove `backdrop-blur-sm`/`backdrop-blur-md` and translucent-glass fills from the remaining elements**

Every element in this file using `bg-pixel-*/NN backdrop-blur-*` (frosted-glass chips/cards) should become a plain opaque or lightly-tinted surface with a hairline border instead — e.g. change:
```jsx
      className={`bg-pixel-blush/10 backdrop-blur-md border border-pixel-blush/10 rounded-2xl p-4 hover:bg-pixel-blush/15 transition-all duration-300 group ${className}`}
```
to:
```jsx
      className={`bg-pixel-white/10 border border-pixel-white/15 rounded-lg p-4 hover:bg-pixel-white/15 transition-colors duration-200 group ${className}`}
```
(keeping this section's dark hero background in mind — since the hero uses light text on a presumably dark/forest-tinted background, the stat cards stay a subtle light-on-dark tint but drop the blur; adjust exact opacity values by eye during the visual check in Step 5 if contrast looks off.)

Apply the same blur-removal to the eyebrow pill at the top of the hero (`bg-pixel-mint/20 border border-pixel-teal/30 ... backdrop-blur-sm`) — drop `backdrop-blur-sm`.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Visual check**

Run `npm run dev`, navigate to `/year-in-gaming/2026`, screenshot via Playwright. Confirm: no blurred glow blobs, no hexagon watermark, stat cards read as flat/opaque surfaces (not frosted glass), text stays legible against the hero background.

- [ ] **Step 6: Commit**

```bash
git add src/components/year-in-gaming/HeroSection.jsx
git commit -m "Year in Gaming hero: remove glow blobs, hexagon decoration, and glassmorphism"
```

---

## Task 23: Remaining `year-in-gaming/*.jsx` components — remove backdrop-blur chips, verify

**Files:**
- Modify: `src/components/year-in-gaming/YearRecap.jsx:81` (`backdrop-blur-sm` chip)
- Modify: `src/components/year-in-gaming/SeriesMarathon.jsx:81` (`backdrop-blur-sm` chip)
- Modify: `src/components/year-in-gaming/StatisticsSection.jsx`, `PersonalReflection.jsx`, `MonthlyTimeline.jsx` — verification only (no `backdrop-blur` found in the design research grep for these three; confirm in Step 1)

**Interfaces:**
- No signature changes.

- [ ] **Step 1: Confirm the full set of `backdrop-blur` usages across the directory**

Run: `grep -rn "backdrop-blur" src/components/year-in-gaming/`
Expected: hits in `YearRecap.jsx` and `SeriesMarathon.jsx` only (per the earlier survey). If `StatisticsSection.jsx`/`PersonalReflection.jsx`/`MonthlyTimeline.jsx` show hits, apply the same fix from Step 2 to those too.

- [ ] **Step 2: Remove `backdrop-blur-sm` from the two known chips**

At `src/components/year-in-gaming/YearRecap.jsx:81`, change:
```jsx
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pixel-blush/15 backdrop-blur-sm text-pixel-blush text-[0.75rem] sm:text-sm">
```
to:
```jsx
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pixel-blush/20 text-pixel-blush text-[0.75rem] sm:text-sm">
```

At `src/components/year-in-gaming/SeriesMarathon.jsx:81`, change:
```jsx
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pixel-blush/90 backdrop-blur-sm text-sm font-bold text-pixel-forest">
```
to:
```jsx
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pixel-blush text-sm font-bold text-pixel-black">
```
(raised opacity to fully opaque since blur was previously doing some of the work of making translucent text legible over a photo; also applies the `pixel-forest`→`pixel-black` ink rule since this is body-adjacent label text, not an interactive element — Task 3's global substitution won't have caught this one because the literal string includes `backdrop-blur-sm` in between, breaking the simple substring match; handle it explicitly here.)

- [ ] **Step 3: Verify**

Run: `grep -rn "backdrop-blur" src/components/year-in-gaming/`
Expected: zero results.

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Visual check**

Run `npm run dev`, navigate to `/year-in-gaming/2026`, scroll through all sections, screenshot via Playwright. Confirm: no frosted-glass chips anywhere in the flow, all text remains legible, borders are hairline throughout.

- [ ] **Step 5: Commit**

```bash
git add src/components/year-in-gaming/
git commit -m "Year in Gaming: remove remaining glassmorphic chips"
```

---

## Task 24: `YearInGaming2026.jsx` page wrapper — verification

**Files:**
- Modify: none expected — verification pass.

**Interfaces:**
- Consumes: all `year-in-gaming/*` components (Tasks 22–23), `.display-hero`/`font-display` (Task 1/2).

- [ ] **Step 1: Confirm no leftover hard-border/blur classes**

Run: `grep -n "backdrop-blur\|border-4\|geo-hexagon" src/pages/YearInGaming2026.jsx`
Expected: zero results.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Full end-to-end visual check**

Run `npm run dev`. Using the Playwright browser tool, navigate through every route in `links` from `Navbar.jsx` (`/`, `/reviews`, `/tier-list`, `/year-in-gaming/2026`, `/guidelines`, `/about`, `/contact`) plus one `/reviews/:slug` detail page, taking a screenshot at each. Do a final consistency pass across the screenshots: same font (Inter) everywhere, same border treatment (hairline, not thick black) everywhere, same radius scale, no scanline/dither texture, no press-down button animation, no glassmorphism.

- [ ] **Step 4: Normalize section spacing rhythm site-wide**

Per the Global Constraints spacing rule (`py-16 md:py-24` standard sections, `py-20 md:py-28` hero/lead sections, `gap-6` card grids, `gap-3` tight inline clusters), sweep every page for outlier vertical padding values that don't match either of those two pairs.

Run: `grep -rn "py-1[0-9]\|py-2[0-9]\|pb-2[0-9]\|pt-2[0-9]" src/pages/*.jsx src/components/year-in-gaming/*.jsx`

For each hit, classify the section as "standard" or "hero/lead" by eye (is it the page's opening identity moment, or a regular content section further down?) and edit its Tailwind classes to the matching pair from the rule above. Examples already in the codebase to normalize: `Guidelines.jsx:26` (`pb-24 lg:pb-32` → a hero/lead section, becomes part of `py-20 md:py-28` on its wrapper), `Reviews.jsx:61` and `MonthlyTimeline.jsx:70` (same `pb-24 lg:pb-32` pattern), `Home.jsx:71` (`pb-20 lg:pb-28` standard section → `py-16 md:py-24`). Also normalize `gap-2`/`gap-4` on button/tag rows to `gap-3` where they're a tight inline cluster (e.g. `Navbar.jsx` mobile menu actions, `Home.jsx` hero CTA row) — leave `gap-4`/`gap-6` alone where it's already spacing out card-grid items, that's the correct larger gap.

Run: `npm run build`
Expected: exits 0.

Re-run the Playwright screenshot pass from Step 3 and confirm vertical rhythm now reads consistently across pages (no page feels noticeably tighter or looser than its neighbors).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Normalize section spacing rhythm and gap sizes site-wide"
```
