# AGENTS.md

## Cursor Cloud specific instructions

### Product
법무법인 경국 홈페이지 퍼블리싱 (Vite + React + TypeScript). Figma 소스: `AI_dev` 파일의 `HOME` / tablet / mobile 프레임.

### GNB (site nav)
- Component: `src/components/Gnb.tsx` + `src/data/nav.ts`. Mounted in `App.tsx` / `AppClassic.tsx`.
- Desktop (>1024): hover top item → Fullmenu; spring **sharp-rect** indicator on `.gnb__nav-list`; submenu hover swaps left `sub-visual` (shared placeholder `public/assets/gnb-sub-visual.png` until per-page assets land — keep `visual` field on each sub item).
- Compact (≤1024): hamburger opens **left drawer** (accordion + scrim + Esc + focus trap). Do not use mega-menu hover on touch widths.
- Over-hero = transparent/white type; solid/open = white bar + dark type. Section anchors use `id` on home sections (`#about`, `#notice`, …).
- Brand chrome: **no border-radius** on GNB buttons / indicator / glass actions (sharp rect). Call/Search icons: white over hero (`brightness(0) invert(1)`); on solid/open white bar use `brightness(0)` so they match dark label type. Keep transitions on all GNB interactions (premium baseline).
- Site search: `SearchOverlay` from GNB 검색하기 — white 80% dim, 48px brand-underline input, results list with left depth chips; index from `NAV_ITEMS`.

### Commands
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Lint: `npm run lint` (oxlint)
- Build: `npm run build`
- Live: https://james-oh-dot.github.io/gyungkook/ (GitHub Pages, deploys on `main` via `.github/workflows/deploy-pages.yml`)

### Non-obvious notes
- Styling is plain CSS (no Tailwind). Design tokens live in `src/styles/global.css`.
- Hero source of truth (default `/`): Figma canvas `AI-hero-change` (`22:10492`) → frames `hero_1`…`hero_5` (teal).
- **Alternate hero for client review:** dark previous hero lives at `classic.html` → `HeroClassic` + `public/assets/classic/*`. Top `VersionSwitch` toggles A Teal / B Dark. Vite MPA inputs: `index.html` + `classic.html`.
- Hero carousel timing is `HERO_DURATION_MS = 10000` in `src/data/slides.ts`.
- Hero structure (do not regress to the old black/right-panel layout):
  - Stage: solid teal `#58bdc2` + centered per-slide visual (`hero__bg-slide--statue|jewel|cubes|birds|campus`)
  - `hero_copy`: description (Pretendard) **above** `hero_maincopy`
  - `hero_maincopy`: large Nanum Myeongjo English **word** + Korean **title** side-by-side
  - Swipe meta is **white** card + white-border thumb (not dark chrome)
- Hero motion contract: description = `LineReveal`; English word + Korean title = `CharReveal`; image Ken Burns via `--hero-zoom` over 10s; `swipe_gage` = rAF `scaleX(progress)` with **no CSS width transition**; prev/next/thumb click = instant `jumpTo`.
- Slide 02 visual **must** be the jewel (`public/assets/hero-02.png`).
- Hero 01/02/04 assets are **RGBA PNG** (2× from Figma `hero-01` / `hero-02` / `hero-04` on `AI-hero-change`). Keep alpha — do not re-bake to JPEG.
- Hero visual framing (teal rebuild — do not regress):
  - `statue`: `object-position: center top` + Ken Burns origin near head/scales — never `center bottom` (clips raised arm)
  - `jewel`: centered `object-fit: contain` on near-square 2× PNG
  - `birds`: `scaleX(-1)` (large lamp on **right**), bottom-anchored, keep pigeons; reduced-motion must keep the flip
- `hero__title` shadow: Figma DROP_SHADOW → CSS `filter: drop-shadow(...)` on `.hero__title` (not `text-shadow`). Inherited `text-shadow` on CharReveal glyphs gets clipped into hard frames.
- CharReveal / LineReveal `filter: blur` clips paint to the border box — keep top (+ side) padding with compensating negative margins on reveal items and `.hero__title-line` (overflow mask). Do not remove that padding or Hangul / ExtraBold serif tops get sliced.
- Slide 04 `Communicate` uses `.hero__copy-scale.is-compact` (`--hero-copy-scale-compact`) so the long word never overflows the viewport.
- Hero responsive source: Figma `AI-hero-change` → `HOME_DESKTOP2` / `HOME_TABLET2` / `HOME_MOBILE2`
  - `hero_copy`: desktop artboard type (24 / 240 / 72, gap 40, maincopy row). Tablet keeps that structure via `--hero-copy-scale` (`zoom`; **literal** media steps — `zoom` rejects `calc()`). Mobile stacks maincopy (12 / 60 / 18).
  - `hero_swipe` + `swipe_gage`: always `right: 0; bottom: 0` at every breakpoint; scale with `--hero-swipe-scale`. Never full-bleed / never stack thumb above meta on mobile.
  - `hero__swipe-preview` ≈ 80% of Figma thumb/meta via layout vars (`--hero-thumb-w` / `--hero-swipe-meta-*`), not `transform`/`zoom` on the meta text (keeps type crisp).
- Icons are **`.svg` only** under `public/assets/`. Never reintroduce SVG XML saved as `.png` (causes broken-image X boxes). Hero arrows are already white — do not `filter: invert(1)`.
- Scroll reveal + light parallax: `src/hooks/useScrollReveal.ts` via `[data-reveal]` and `--parallax-y`.
- Public asset URLs must go through `asset()` in `src/utils/asset.ts` so GitHub Pages `base` (`/gyungkook/`) works.
- Production Pages builds set `GITHUB_PAGES=true` (see workflow). Local `npm run dev` uses `base: '/'`.
- Figma MCP asset URLs expire (~7 days); committed binaries under `public/assets/` are the source of truth.
- UI craft skill: `.cursor/skills/impeccable/` (also `.claude/skills`, `.agents/skills`). Brand: premium + sharp rect; interactions soft. See `WORKLOG.md` for full handoff.
- PR creation may require collaborator permission on the GitHub repo.
- **User rule:** If the agent cannot create/merge the PR itself, always end the turn with a direct link the user can open (e.g. `https://github.com/james-oh-dot/gyungkook/pull/new/<branch>` or the existing PR URL). Do not assume merge happened.
- Figma frame names can be misleading: `실적` / `실적_hover` frames (`21:1931`, `21:2035`) are **Professionals** hover UX; Figma `Home Section / OFFICE` (`1:7480`) is the **Press** swipe list + gage. Real map Office is a separate frame/component.
- Press gage: `useScrollGage` — thickens to 20px on hover/scroll; do not reintroduce native scrollbars on `.press-track`.
- Awards `호버시imgs`: follows pointer inside `.awards-section` only; per-item images are stubs (`award-hover.jpg`) until design provides mappings.

### Hero QA quality bar (do not regress — critical)

These failures are treated as **blocking bugs**. Never ship a hero change without checking them at **desktop (≥1280)**, **tablet (~768–1024)**, and **mobile (~390)**:

1. **No full-hero next-slide peek on thumbnail hover**  
   Swipe/thumbnail hover may only scale the **thumbnail image** (`.hero__swipe-thumb img`).  
   **Forbidden:** `.is-preview`, opacity fade-in of the next slide on `.hero__bg`, or any “ghost” of the next slide over the main hero. Timer pause on hover is OK; background preview is **not**.

2. **Copy must never be covered by swipe**  
   `.hero__content` bottom padding uses `--hero-swipe-reserve`. Mid widths keep left copy clear of the bottom-right swipe. Labels must wrap (not `nowrap` + `overflow: hidden` clipping long English labels).

3. **Only one active background slide**  
   Inactive `.hero__bg-slide` stay `opacity: 0` + `visibility: hidden`. Do not stack semi-transparent inactive slides.

4. **Responsive morph stays soft**  
   Thumb size/layout changes use CSS transitions + `--hero-thumb-scale` — no hard jumps.

5. **Char/line reveals must actually animate**  
   `CharReveal` / `LineReveal` need double-rAF before `is-active` (mounting with `is-active` already on skips CSS transitions).  
   **Never** put unstable array/object identities in reveal `useEffect` deps — hero `setProgress` re-renders every frame. Use a string content key (`lines.join('\\n')`) for `LineReveal`.
