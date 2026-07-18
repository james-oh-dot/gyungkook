# AGENTS.md

## Cursor Cloud specific instructions

### Product
법무법인 경국 홈페이지 퍼블리싱 (Vite + React + TypeScript). Figma 소스: `AI_dev` 파일의 `HOME` / tablet / mobile 프레임.

### Shared chrome (GNB + Footer)
- Every page mounts chrome via `src/layouts/SiteLayout.tsx` (`Gnb` + `<Outlet />` or children + `Footer`). Do not re-import GNB/Footer in page apps.
- GNB: `src/components/Gnb.tsx` + `src/data/nav.ts`. Footer: `src/components/Footer.tsx`.
- Nav `href` rules: `#section` = home anchor; `/path` = SPA route. Always resolve with `resolveNavHref()` from `src/utils/path.ts` (GitHub Pages `base`).
- Desktop (>1024): hover top item → Fullmenu; spring **sharp-rect** indicator on `.gnb__nav-list`; submenu hover swaps left `sub-visual` (`visual` on each sub item).
- Compact (≤1024): hamburger opens **left drawer** (accordion + scrim + Esc + focus trap). Do not use mega-menu hover on touch widths.
- Over-hero = transparent/white type; solid/open = white bar + dark type.
- Brand chrome: **no border-radius** on GNB buttons / indicator / glass actions (sharp rect). Call/Search icons: white over hero (`brightness(0) invert(1)`); on solid/open white bar use `brightness(0)`.
- Site search: `SearchOverlay` — index from `NAV_ITEMS`.

### Subpages (React Router on main SPA)
- Router lives in `src/App.tsx` (`BrowserRouter` + `basename` from `import.meta.env.BASE_URL`). `classic.html` stays a separate MPA entry without these routes.
- **업무사례** (활동·보도 1st / Figma `sub-04-01`):
  - `/press/cases` → `CaseStudiesPage` (4/2/1 col grid)
  - Hover: hovered card highlight + siblings dim (see `CaseStudies.css`)
  - GNB `press-cases` → `/press/cases`, visual `public/assets/sub/sub-04-01.jpg`
  - Mock data: `src/data/caseStudies.ts`
- **언론보도** (활동·보도 2nd / Figma `sub-04-02`):
  - List: `/press/coverage/:tab` where `tab` = `tv` | `release` (TV방송 / 보도자료)
  - Detail (shared board layout): `/press/coverage/:tab/:postId` → `PostDetail`
  - Shell: `PressCoverageLayout` = `SubVisual` + `LocalTabs` + Outlet
  - List UI: 4/2/1 **card grid** (`PressGridCard`) — not the horizontal list used by 컬럼미디어
  - Mock data: `src/data/pressCoverage.ts`
  - GNB item `press-media` → `/press/coverage/tv`, visual `public/assets/sub/sub-04-02.jpg`
- **컬럼·미디어** (활동·보도 3rd / Figma `sub-04-03`):
  - List: `/press/column-media/:tab` where `tab` = `column` | `publication` | `media`
  - Detail (shared board layout): `/press/column-media/:tab/:postId` → `PostDetail`
  - Shell: `ColumnMediaLayout` = `SubVisual` + `LocalTabs` + Outlet
  - Mock data + CMS notes: `src/data/columnMedia.ts`
  - GNB item `press-column` → `/press/column-media/column`, visual `public/assets/sub/sub-04-03.jpg`
- Local tabs (컬럼미디어 / 언론보도): hover moves underline indicator; click selects + routes.
- Shared board types: `src/data/board.ts` (`BoardPost` / `BoardTabDef`) — used by list cards + `PostDetail`.
- Local tabs under a sub-visual are `position: sticky; top: var(--gnb-bar-h)` (must be a sibling of the main content, not wrapped with the hero only — see `ColumnMediaLayout`).
- Scroll: GNB/menu entry → top (sub-visual visible). Local tab click, list→detail, detail prev/next → scroll to local tabs / sticky under GNB (`state.scrollToLocalTabs` + `useScrollToLocalTabs`).
- GitHub Pages deep links: deploy copies `dist/index.html` → `dist/404.html`.

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
- Slide 04 `Communicate` uses `.hero__copy-scale.is-compact` on **desktop only** (long word). On tablet/mobile (≤1024) compact scale is released (`--hero-copy-scale-compact` = same as normal / `1`) so type isn’t undersized.
- Slide 05 `campus`: on ≤1024 keep a **square** frame (`width` = `height`) + `object-fit: contain` — do not override only width (leaves short height + `cover` → top/bottom crop).
- Hero responsive source: Figma `AI-hero-change` → `HOME_DESKTOP2` / `HOME_TABLET2` / `HOME_MOBILE2`
  - `hero_copy`: desktop artboard type (24 / 240 / 72, gap 40, maincopy **row**) + `--hero-copy-scale` (`zoom`; **literal** media steps — `zoom` rejects `calc()`).
  - ≤768 (`HOME_TABLET2`): stacked maincopy, native **14 / 120 / 36**, pad-x 50; `hero__content` absolute at **top ≈ 49.7%** (Figma 497/1000) — not flex-end.
  - ≤767 (`HOME_MOBILE2`): stacked **12 / 60 / 18**, pad-x 24; copy **top ≈ 49.22%** (443/900).
  - Statue (slide 01) ≤1024: pin via `.hero__visual-media` absolute **top** from Figma (`15.7%` = 157/1000 tablet, `24.28%` = 218.5/900 mobile), width **611** / **107.2vw**, native aspect — no `translateY` guessing, never `object-fit: fill`. Brightness `1.28` / contrast `0.97`.
  - `hero_swipe` **desktop (>1024)**: flush `right: 0; bottom: 0` + gage/arrows; preview ~80% via layout vars (`--hero-thumb-w` / `--hero-swipe-meta-*`), not `transform`/`zoom` on meta text.
  - `hero_swipe` **tablet/mobile (≤1024)**: Figma inset **card** (24px BR) — white card, square thumb (138 / 100), 3-line meta (`02 Rebuild` / `nextSwipeTitle` / `01 / 05`), **hide gage**. Do not flush-right or scale the desktop anatomy down.
  - Each slide has `nextSwipeTitle` in `slides.ts` for the card subtitle line.
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

### Section / footer horizontal padding (Figma)
- Global tokens in `src/styles/global.css`: `--page-pad` (section inset) and `--footer-pad` (footer inset).
- Desktop: `--page-pad` stays the existing clamp; `--footer-pad` follows it. Tablet (≤768): sections `48px`, footer `40px`. Mobile (≤767): both `24px`.
- Below-hero sections use `var(--page-pad)`. Footer uses `var(--footer-pad)`.
- Achieve cards: on tablet/mobile reduce card own horizontal margin so it does not double-inset against `--page-pad`.

### Responsive system (desktop → tablet → mobile)

Figma artboards: `HOME_DESKTOP2` / `HOME_TABLET2` / `HOME_MOBILE2` (and matching `SUB_*` frames). Agents should treat this as the **default adaptation contract** when only a desktop frame is provided.

#### Breakpoint axes (two jobs)
| Axis | CSS | What changes |
|------|-----|----------------|
| **Chrome / columns** | `max-width: 1024px` | GNB fullmenu → drawer; multi-col grids often 4→2 or multi→1 |
| **Gutters / type step** | `max-width: 768px` (tablet) then `767px` (mobile) | `--page-pad` / `--footer-pad`, subpage vertical rhythm, smaller type |

Exact **768 vs 767**: at 768px use tablet gutters (48/40); at ≤767 use mobile (24/24) + `--gnb-bar-h: 82px`.

#### Gutters (always use tokens — do not hardcode L/R pad per page)
| Token | Desktop | ≤768 | ≤767 |
|-------|---------|------|------|
| `--page-pad` | `clamp(20px, 10.42vw, 200px)` | `48px` | `24px` |
| `--footer-pad` | follows page-pad | `40px` | `24px` |
| `--gnb-bar-h` | `100px` | `100px` | `82px` |

#### Grid defaults (subpage boards + home)
- **Subpage card boards** (업무사례, 언론보도, similar): **4 → 2 (≤1024) → 1 (≤767)**; content `max-width: 1280px` + `var(--page-pad)`.
- **Home notice**: 3 → 2 (≤1024) → 1 (≤767).
- **Home practice / professionals / about-style splits**: collapse to **1 column at ≤1024**.
- **Subpage main vertical pad** (shared boards): `140/160` → `80/120` (≤768) → `56/96` (≤767).

#### Type defaults
- UI font: Pretendard; hero English word: Nanum Myeongjo.
- **Display / hero**: hard Figma steps (desktop 24/240/72 → tablet 14/120/36 → mobile 12/60/18) — see Hero notes above.
- **Section titles**: prefer `clamp(...)` on desktop; don’t invent a third scale unless Figma specifies.
- **Card / board UI**: small steps only (e.g. title 18→16, list title 24→20→18); body/meta **14** usually stays; chips ~11.
- Tracking roughly `-0.025em` / Figma letter-spacing.

#### Desktop-only Figma → agent duty
When the user ships **desktop-only** designs, agents **should auto-apply** this contract (tokens, 4/2/1 or home grid collapses, type steps, GNB ≤1024 drawer) without waiting for tablet/mobile frames.

**Exceptions — ask or wait for a tablet/mobile frame (or an explicit note):**
- Layout that is **not** a simple column collapse (new IA, different component, sticky/side panels, unique swipe anatomy).
- Type that must **not** follow the half-step / 18→16 pattern (legal fine print, special display lockups).
- Breakpoints other than 1024 / 768 / 767.

Hero remains special-cased (see Hero responsive bullets); do not “generic 4/2/1” the hero.
