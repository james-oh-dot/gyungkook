# WORKLOG — Hero motion / icons / assets (handoff)

> Audience: Codex / Claude Code / future Cursor agents continuing this repo.
> Branch: `cursor/hero-motion-icons-129f`
> Date: 2026-07-17
> Live site: https://james-oh-dot.github.io/gyungkook/

---

## Goal (user request — must match)

1. **`hero_maincopy`**: character-by-character sequential reveal (index + title lines).
2. **`hero_copy`**: **line-by-line parallax** entrance (label + description lines). **Not** char-by-char.
3. **`swipe_gage`**: fills over **10s** (`HERO_DURATION_MS`). On prev/next/preview click → **gage resets to 0 immediately** and **all slide elements switch instantly** (do not wait for 10s).
4. **Hero slide 02**: must use the **jewel/diamond** image (not architecture / person).
5. **Icons/arrows**: no broken “X box” images — use real `.svg` files.
6. Visual language: **premium + sharp/rectangular**; interactions: **soft / smooth** (impeccable + brand notes).
7. Document thoroughly for handoff (this file).

---

## Root cause notes (important)

### Broken icons (X boxes)
- Files under `public/assets/icon-*.png` were **SVG XML saved with a `.png` extension**.
- Browsers request `image/png`, fail to decode → broken image icon.
- **Fix**: ship clean `public/assets/icon-*.svg`, point all `asset('assets/icon-…')` calls to `.svg`, **delete** the fake `.png` icons.
- Hero arrows: SVG stroke is already **white**. Do **not** apply `filter: invert(1)` (that made arrows black-on-black).

### Wrong slide 02 image
- Figma `hero_type1` / `02rebuild` main fill historically pointed at a **modern architecture** photo (metal panels).
- User explicitly wants **jewel**. Correct asset is the jewel used as the “02 Rebuild” **preview** on `hero_concept` (`swipe` thumb).
- Current mapping:
  - `hero-01.jpg` → traditional Korean eaves / dancheong (VALUE)
  - `hero-02.jpg` → **teal jewel on dark** (REBUILD) ✅
  - `hero-01-next.jpg` → jewel thumb (preview of slide 02)

### Hero copy animation was wrong
- Previously `hero_copy` also used `CharReveal` (char stagger).
- Now uses `LineReveal` (`src/components/LineReveal.tsx`) with per-line `--line-parallax` Y offset + staggered delay.

### Gage jank
- Do **not** animate gage with CSS `width` + transition while also driving progress via rAF (double interpolation → rubber-band feel).
- Drive with `transform: scaleX(progress)` and `transition: none`. On `jumpTo`, `setProgress(0)` instantly.

---

## Key files

| Path | Role |
|------|------|
| `src/components/Hero.tsx` | Carousel state, 10s timer, instant `jumpTo`, wires reveals |
| `src/components/Hero.css` | Soft premium motion, gage, reduced-motion |
| `src/components/CharReveal.tsx` | Char-by-char for `hero_maincopy` |
| `src/components/LineReveal.tsx` | Line parallax for `hero_copy` |
| `src/data/slides.ts` | Slide copy + image paths + `HERO_DURATION_MS = 10000` |
| `src/utils/asset.ts` | Prefixes Vite `BASE_URL` (GitHub Pages `/gyungkook/`) |
| `public/assets/hero-0{1..5}.jpg` | Slide backgrounds |
| `public/assets/icon-*.svg` | UI icons (source of truth) |
| `.cursor/skills/impeccable/` | UI craft skill (also mirrored under `.claude` / `.agents`) |

---

## Behavior contract (do not regress)

```
Timer: rAF loop → progress = elapsed / 10000
At progress >= 1 → jumpTo(index + 1)

jumpTo(n):
  - index = n (wrapped)
  - progress = 0          // gage snaps to empty
  - animKey++             // remount content → re-run reveals
  - restart startRef
  - clear pause / preview hover

Buttons (prev / next / swipe preview click):
  - call jumpTo immediately (no wait)

Hover swipe preview:
  - pauses timer; shows next bg at reduced opacity (preview)
  - leave resumes from paused elapsed
```

### Reveal timing (soft, sequential)

- Main title chars: ~26ms step, line offset, ease-out expo-ish curves.
- Copy lines: ~150ms between lines, each line starts with larger Y offset (`22 + i*12` px) → parallax feel.
- BG crossfade ~1.15s opacity / ~1.55s scale — soft, not snappy.

---

## Impeccable / brand constraints applied

- Motion: ease-out quart/expo curves; no bounce/elastic.
- Prefer `transform` / `opacity` / light `filter` blur — avoid layout animation for gage.
- `prefers-reduced-motion: reduce` → instant show, no blur/transform choreography.
- Sharp rect UI (no rounded hero chrome); soft interaction feedback on buttons (opacity / 1px lift / active scale).

Optional later: `/impeccable init` to create `PRODUCT.md` / `DESIGN.md` (not blocking this scoped fix).

---

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint
npm run build
# Pages production base:
GITHUB_PAGES=true npm run build
```

---

## QA checklist (manual)

- [ ] Slide 01: eaves image; maincopy chars cascade; copy lines parallax in
- [ ] Slide 02: **jewel** image; Rebuild copy
- [ ] Gage fills smoothly over ~10s; at end advances
- [ ] Click next: gage → 0 instantly; image + copy switch immediately; reveals restart
- [ ] Click prev: same
- [ ] Click swipe preview: advances; gage resets
- [ ] Hover preview: timer pauses; next bg peeks; leave resumes
- [ ] Arrows visible (white chevrons), not X boxes
- [ ] Section icons (notice link, office, awards, text buttons) render
- [ ] Mobile / tablet: swipe stack, copy column, no overflow
- [ ] No rubber-banding / stutter on gage or text

---

## Known follow-ups

- Re-verify slides 03–05 against Figma `hero_type1` variants if art direction drifts.
- `nextImage` fields in `slides.ts` are legacy; Hero uses `nextSlide.image` — can remove `nextImage` later.
- GitHub Pages deploy: merge to `main`; workflow uses `GITHUB_PAGES=true`. Confirm live `/gyungkook/` after merge.
- Agent PR creation may still need repo collaborator rights — push branch + open PR manually if tool fails.

---

## Change summary (this branch)

- Rewrote hero motion: CharReveal maincopy + LineReveal copy + scaleX gage.
- Replaced slide 01/02 assets (architecture eaves + jewel).
- Replaced all icons with real SVGs; removed broken SVG-as-PNG files.
- Fixed PNG-bytes saved as `.jpg` for `hero-02-next` / `hero-03`.
- Fixed slide skip bug: `jumpTo` 180ms debounce + `alive` flag on rAF cleanup (Strict Mode / stacked pointer / auto-advance race).
- Preload all hero images on mount to avoid black flash on first visit to a slide.
- Added this WORKLOG + AGENTS.md cloud notes update.

### QA notes (local)
- Stale Vite on :5173 (old session) caused false “black slide 02 / broken icons” — kill old `vite-dev` before testing.
- After restart on :5173: slide 02 jewel ✅, icons ✅.
- Playwright headless confirms sequential nav `01→02→03→04→05→01` and gage reset (`scaleX≈0` after click).
- Swipe meta must use `slide.nextLabel` + `nextSlide.index` (not `nextSlide.nextLabel`).

---

## 2026-07-17 — Section interactions (Professionals / Press / Awards)

### Figma naming caveat (critical)
| Frame name in Figma | Actual content implemented |
|---|---|
| `Home Section / 실적` (`21:1931`) | **Professionals** default cards |
| `Home Section / 실적_hover …` (`21:2035`) | **Professionals** hover: dim + full copy / siblings blur + opacity 0.4 |
| `Home Section / OFFICE` (`1:7480`) | **Press (활동·보도)** horizontal `list_swipe` + gage (not the map Office) |
| `Section` (`1:7516`) | **Awards** + `호버시imgs` mouse-follow |

Real map Office remains `1:7571` / `OfficeSection` (unchanged).

### Behavior shipped
1. **Professionals** (`ProfessionalsSection`)
   - Hovered card: veil `rgba(14,24,24,0.8)` + hover copy (headline/bio/tags) soft fade/slide in
   - Sibling cards: image blur ~6px + default text opacity 0.4
2. **Press** (`PressSection`) — Figma “OFFICE” swipe list
   - Full-bleed horizontal track (`press-breakout`), starts padded to `--page-pad` (title align), scrolls across viewport
   - Max 5 items (`pressItems.slice(0,5)`)
   - `useScrollGage`: bottom gage thickens to **20px** on hover/scroll; thumb draggable / mirrors scroll
3. **Awards** (`AwardsSection`)
   - Default active index **2** (3rd list)
   - `호버시imgs` fades in and follows pointer **inside the section** only
   - Image keyed by list; currently all map to `award-hover.jpg` until per-item assets arrive

### Key files
- `src/components/sections/HomeSections.tsx`
- `src/hooks/useScrollGage.ts`
- `src/data/content.ts` (professionals headline/bio; awards objects; 5 press items)
- `src/styles/global.css`

### Follow-ups
- Replace awards per-item images when provided
- Optional: apply same hover language to Achievements white-card rows if design wants parity (separate from misnamed Figma frames)
