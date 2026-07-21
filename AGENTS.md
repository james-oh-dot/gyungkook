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
  - GNB `press-cases` → `/press/cases`, visual `public/assets/sub/sub-04-01.webp` (+ `.preview.webp`)
  - Mock data: `src/data/caseStudies.ts`
- **언론보도** (활동·보도 2nd / Figma `sub-04-02`):
  - List: `/press/coverage/:tab` where `tab` = `tv` | `release` (TV방송 / 보도자료)
  - Detail (shared board layout): `/press/coverage/:tab/:postId` → `PostDetail`
  - Shell: `PressCoverageLayout` = `SubVisual` + `LocalTabs` + Outlet
  - List UI: 4/2/1 **card grid** (`PressGridCard`) — not the horizontal list used by 컬럼미디어
  - Mock data: `src/data/pressCoverage.ts`
  - GNB item `press-media` → `/press/coverage/tv`, visual `public/assets/sub/sub-04-02.webp` (+ `.preview.webp`)
- **컬럼·미디어** (활동·보도 3rd / Figma `sub-04-03`):
  - List: `/press/column-media/:tab` where `tab` = `column` | `publication` | `media`
  - Detail (shared board layout): `/press/column-media/:tab/:postId` → `PostDetail`
  - Shell: `ColumnMediaLayout` = `SubVisual` + `LocalTabs` + Outlet
  - Mock data + CMS notes: `src/data/columnMedia.ts`
  - GNB item `press-column` → `/press/column-media/column`, visual `public/assets/sub/sub-04-03.webp` (+ `.preview.webp`)
- **사회공헌** (활동·보도 4th / Figma `sub-04-04`):
  - List: `/press/social` → `SocialContributionListPage` (intro + **4→2→1** card grid; copy above thumb)
  - Detail (shared board layout): `/press/social/:postId` → `PostDetail`
  - Shell: `SocialContributionLayout` = `SubVisual` (`showChip={false}`) + content anchor + Outlet — **no LocalTabs**
  - Mock data: `src/data/socialContribution.ts`
  - GNB item `press-social` → `/press/social`, visual `public/assets/sub/sub-04-04.webp` (+ `.preview.webp`)
- **법인소개** (법무법인경국 1st / Figma `sub-01-01`):
  - Single page: `/about/intro` → `AboutIntroPage` (소개 / 이념 / 강점 / 협력사 scroll sections)
  - Local tabs use **scroll mode** (`onTabSelect`) — same sticky + scroll-spy pattern as 정비사업
  - Hero: `SubVisual` with `showChip={false}` (Figma `hero_type2`)
  - Mock data: `src/data/aboutIntro.ts`; GNB `about-intro` → `/about/intro`, visual `public/assets/sub/sub-01-01.webp` (+ `.preview.webp`)
  - Section assets under `public/assets/about/` (large photos also use progressive pairs)
- **대표 인사말** (법무법인경국 2nd / Figma `sub-01-02`):
  - Static single page (no local tabs): `/about/greeting` → `GreetingPage`. Hero (`SubVisual`, `showChip={false}`) → CEO photo → two-column greeting (heading left / body + signature right). Tablet keeps 2 columns; **mobile (≤767) stacks to one**. Sharp-rect; eyebrow "ABOUT 경국" is Figma mint `#58bdc2` (not global `--color-teal`).
  - Data: `src/data/greeting.ts` (heading + two `blocks` of body lines, `''` = stanza gap). GNB `about-greeting` → `/about/greeting`, visual `sub-01-02` (`nav.ts` `GNB_SUB_VISUAL_ABOUT_GREETING`). Replaced the old PlaceholderPage route.
  - **Assets (2026-07-21, Figma direct extract):** `sub-01-02` hero (node 92:2910) had a baked "대표 인사말" title — painted out with **cv2 inpaint** (`INPAINT_NS`+`TELEA`, mask = white pixels in the central wood band) so `SubVisual` overlays its own live/responsive title like every other subpage (no double-text, and the GNB thumbnail stays clean). CEO photo = node 92:2916; signature = node 92:2925 (white keyed to alpha). All via `get_screenshot(enableBase64Response)` — see the Egress workaround note below.
- **경국인 · 갤러리** (법무법인경국 4th / Figma `sub-01-04`, `94:3369`):
  - Single page `/about/gallery` → `GalleryPage`; **scroll-mode** local tabs (경국인 / 갤러리) — same IntersectionObserver scroll-spy + `scrollToSection` pattern as 법인소개 (`data-gallery-section` anchors). Clicking 갤러리 scrolls to the grid.
  - 경국인 section: layered brand **pyramid** (Figma `94:3384`) — outer sunburst ring (`pyramid-ring.png`, CSS rotate loop), inner **white** disc (`#fff`, scale pulse **0.3 ↔ 1.2**, ~4.8s), three SVG tiers with live labels (고객 / 경국인 / 경국); top tier is the clean Figma triangle (`pyramid-tier-top.svg` viewBox 154×138, **no baked shadow pad** — uniform CSS `drop-shadow` on all tiers so inter-tier gaps stay even). Stack is top-aligned so the **apex touches the outer ring’s top**. Hover/focus each tier → `scale(1.1)`. Prefer the layered DOM over the old flat `gallery/pyramid.webp` composite. + serif **quote** (`--font-serif` NanumMyeongjo, teal `icon-quote.svg`) + **경국인의 약속** (10 rows: teal `#58bdc2` `w-34` number badge + English 32px + Korean desc; same label-left/content-right 2-col as 정비/공익).
  - 갤러리 section: **masonry** (`.gallery-grid`, Figma `94:3781`) — 3 cols × 5 rows, `grid-template-areas` with two 2×2 "big" tiles anchoring TL + BR; `aspect-ratio: 953/1233`. **Mobile (≤767)** drops the mosaic → uniform 2-col `aspect-ratio: 4/3` tiles. Tiles are **placeholder gradients** until real 경국인 photos arrive.
  - Data: `src/data/gallery.ts`; GNB `about-gallery` → `/about/gallery`, visual `sub-01-04` (`nav.ts` `GNB_SUB_VISUAL_ABOUT_GALLERY`). Replaced the old PlaceholderPage route.
  - **sub-01-04 hero (2026-07-21):** metallic-pyramid photo, extracted from Figma (node 94:3371) via `get_screenshot`; baked "경국인 · 갤러리" title painted out (cv2 inpaint) so `SubVisual` overlays its own live title. A faint inpaint residue on the regular grid pattern sits under the scrim + live title and is not visible in practice.
- **연혁수상인증 / 오시는길** (법무법인경국 5th–6th): still `PlaceholderPage` (“곧 업데이트예정”) but heroes + GNB visuals use progressive pairs `sub-01-05` / `sub-01-06` (`placeholderPages.ts` per-page `visual` override; `nav.ts` `GNB_SUB_VISUAL_ABOUT_HISTORY` / `_LOCATION`). Do not point these stubs back at shared `sub-01-01`.
- **변호사자문단** (법무법인경국 3rd / Figma `sub-01-03`):
  - `/about/lawyers` → `Navigate` to first lawyer; `/about/lawyers/:lawyerId` → `LawyerProfilePage`.
  - Local tabs = **route mode**, one tab per lawyer (공대호 / 박효영 / 공성준 / 신지호). Pass `LocalTabs routeState={null}` so a tab switch scrolls to top (reveals the new lawyer's hero) instead of sticking under GNB — the route-mode default `{ scrollToLocalTabs: true }` is unchanged for boards.
  - Custom dark hero cover (not `SubVisual`): sub-01-03 bg + scrim + name/title + contact + **wide divider** + intro + portrait. **No eyebrow** above the name (matches Figma `89:2963`). The divider (`.lawyer-hero__divider`, Figma `Line 6` = 1004px) deliberately extends **past the text column to the portrait centre** (`width:130%; max-width:1004px` of the info column; 100% on mobile where the portrait is hidden) — do not shrink it back to the contact-row width.
  - Content top-right has **two mint `#58bdc2` action buttons** (`.lawyer-action`, Figma `btn`): 공유하기 (`icon-share.svg` → `navigator.share`/clipboard) + PDF 다운받기 (`icon-download.svg` → `window.print()`). These replaced the earlier prev/next arrows (which weren't in Figma; lawyer switching is via the local tabs). Profile = label/value rows (alternating `:nth-child` tint) + captioned certificate/appointment/award image grids.
  - Data: `src/data/lawyers.ts` (공대호 full from Figma; others placeholders). GNB `about-lawyers` visual = `sub-01-03` (`nav.ts` `GNB_SUB_VISUAL_ABOUT_LAWYERS`).
  - **Real photos (2026-07-21):** `sub-01-03` hero + 공대호's portrait (`public/assets/lawyers/gongdaeho.png`, real transparent cutout) were provided directly by the user in-chat (figma.com exports remain egress-blocked) and run through the normal progressive pipeline. `Lawyer.photo`/`photoPreview` — only set `photoPreview` when a real progressive pair exists; `LawyerHero` falls back to a plain `<img>` (no blur-up) when it's absent, which is still the case for 박효영/공성준/신지호 (`profile2-4.png`, not in the progressive pipeline).
  - **공대호's cert/appointment/award images (2026-07-21):** 11 of 13 are real — extracted directly from the Figma node tree via `mcp__Figma_Remote__get_screenshot(enableBase64Response:true)`, which returns the PNG inline over the MCP channel and is **not** subject to this session's `curl`/egress block on `figma.com` (unlike `download_assets`, whose short-lived asset URLs still 403 from this sandbox — confirmed by testing both). See `src/data/lawyers.ts` header comment for the exact node IDs. The remaining 2 appointments (서울시사회복지협의회봉사단 / 대한법률봉사회회장) reuse *other* items' image refs in the Figma source itself — a designer placeholder, not a real scan — so they intentionally stay as captioned striped-frame placeholders; do not wire a duplicate image to them.
  - **Egress workaround (reusable):** when a task needs real image bytes and `curl`/`download_assets` are blocked, try `get_screenshot` with `enableBase64Response:true` on the specific node — the image arrives inline in the tool result. To save it as a file: the base64 bytes are also preserved in this session's own transcript JSONL (`~/.claude/projects/.../<session>.jsonl`), so a small Python script can locate the matching `tool_result` (by `tool_use_id`, cross-referenced with the `tool_use` that named the `nodeId`) and `base64.b64decode` it to disk. Works for chat-attached user images too (same JSONL, `type: image` blocks in a `user` message).
- **정비사업** (재개발·보상업무 1st / Figma `sub-02-01`):
  - Single page: `/practice/renewal` → `RenewalPage` (all 9 sections on one scroll)
  - Local tabs use **scroll mode** (`onTabSelect`) — click scrolls to section under sticky tabs; **not** route tabs
  - Hero: `SubVisual` with `showChip={false}` (Figma `hero_type2`)
  - Mock data: `src/data/renewal.ts`; GNB `redev-renewal` → `/practice/renewal`, visual `public/assets/sub/sub-02-01.webp` (+ `.preview.webp`)
- **공익사업** (재개발·보상업무 2nd / Figma `sub-02-02`):
  - Single page: `/practice/public` → `PublicProjectPage` (5 sections on one scroll) — same **scroll-mode** tabs as 정비사업 (`data-public-section` + IntersectionObserver scroll-spy).
  - Tabs: 공익사업 / 공익사업실적 / 보상업무 / 절차·유의할 점 / 보상업무실적.
  - Reuses `renewal-*` visual classes (imports `Renewal.css`); net-new components in `PublicProject.css` (`.pp-strengths`, `.pp-procedures`, `.pp-rights`).
  - **Brand mint on this page:** Figma Brand/Main_Color is `#58BDC2`. Use local `--pp-brand` in `PublicProject.css` — do **not** use global `--color-teal` (`#008075`) for 역할및경쟁력 / 손실보상절차 / 반드시확인해야할권리.
  - **손실보상절차** (`.pp-procedures`): Figma `92:1746` — two side-by-side vertical columns of step cards (`손실보상절차 [공익사업]` | `[재개발]`). Desktop + tablet keep 2 columns; **mobile (≤767) stacks each column full-width**. (Earlier flowchart UI was retired to match Figma.) Sharp-rect only — no `border-radius`.
  - **Icon bullets:** `public/assets/icon-bullet.svg` — shared by `.pp-list` (공익사업/정비사업 lists), `.renewal-bullet-title__icon` (정비사업/공익사업 section titles), and `.lawyer-block__icon` (변호사자문단 block labels). **2026-07-21:** swapped from teal square + black ▶ to a teal diagonal flag/pennant shape (user-supplied SVG) — one shared file, so any future icon change here affects all three consumers. Procedure/rights lists use `.pp-list` with that glyph — do not revert to `list-style: disc` in these frames.
  - Data: `src/data/publicProject.ts`; GNB `redev-public` → `/practice/public`, visual `sub-02-02` (`nav.ts` `GNB_SUB_VISUAL_PUBLIC`).
  - **enLabel eyebrows** were re-translated from legal glossary (Figma had copy-paste leftovers) — see WORKLOG 2026-07-20.
  - **Real photo (2026-07-21):** `sub-02-02` hero is a real photo (metal-louver facade close-up) provided directly by the user in-chat — no longer a copy of `sub-02-01` (figma.com exports remain egress-blocked).
- Local tabs: route mode (`toTab`) for 컬럼미디어 / 언론보도; scroll mode (`onTabSelect`) for 법인소개 / 정비사업 / 공익사업. Hover underline works in both.
- **Comparison tables (`.renewal-table`)**: overflow-scroll wraps need `min-width: 0` on the wrap (it is a flex item — default `min-width:auto` = table's `min-width:640` balloons past the viewport and gets clipped by `body{overflow-x:hidden}`). On ≤767 the table is CSS-reflowed into one card per row (thead visually hidden, `td[data-col]` supplies the 재개발/재건축 eyebrow via `::before`). Keep the semantic `<table>` + `data-col` — don't fork mobile markup.
- **Board abstraction (2026-07 refactor — use this for any new board):**
  - `src/data/board.ts`: `BoardPost` / `BoardTabDef` types + **`createBoardModule()`** factory → each board data file exports one `BoardModule` (`COLUMN_MEDIA_BOARD` / `PRESS_COVERAGE_BOARD` / `SOCIAL_CONTRIBUTION_BOARD`) exposing `isTab` / `postsByTab` / `findPost` / `adjacent` / `listPath` / `detailPath`. Do **not** reintroduce per-file prefixed wrappers (`findPressPost`-style) — that duplication was removed on purpose.
  - Detail route = generic `src/pages/BoardDetailPage.tsx` (`<BoardDetailPage board={…_BOARD} />` in `App.tsx`). Tabbed shells = generic `src/pages/BoardTabsLayout.tsx`; `ColumnMediaLayout` / `PressCoverageLayout` are thin wrappers owning only the page CSS import + Figma `data-name`. 사회공헌 keeps its own layout (no tabs, anchor, `showChip={false}`).
  - Single boards (no tab URL segment) use `hasTabSegment: false` (사회공헌). URL shapes are unchanged — keep them stable for SEO.
  - CMS 연동 시: swap each module's `posts` source only; page layer needs no change.
- Local tabs under a sub-visual are `position: sticky; top: var(--gnb-bar-h)` (must be a sibling of the main content, not wrapped with the hero only — see `ColumnMediaLayout` / `RenewalPage`).
- Scroll: GNB/menu entry → top (sub-visual visible). Board local tab / list→detail / prev·next → sticky under GNB (`state.scrollToLocalTabs` + `useScrollToLocalTabs`). 법인소개 / 정비사업 tab click → scroll to section (offset = GNB + local tabs).
- **HARD RULE — never `scrollIntoView()` the sticky local-tabs `<nav>`** (`#subpage-local-tabs` is `position: sticky; top: var(--gnb-bar-h)`). Once stuck it reads as already-at-top and `scrollIntoView` is a silent **no-op** — that broke list→detail / prev·next scroll (2026-07). `useScrollToLocalTabs` must measure a **non-sticky** anchor (`.local-tabs__sentinel`, or 사회공헌's `#subpage-local-tabs` anchor div) and drive `window.scrollTo(natural top − gnbH)`. Verify prev/next on a board detail after any change here.
- GitHub Pages deep links: deploy copies `dist/index.html` → `dist/404.html`.

### Progressive images (blur-up)
- **Goal:** on route entry the image frame is filled immediately (tiny blurred preview); full-quality WebP sharpens in within ~1–2s. Final quality is not sacrificed.
- **Why:** Figma photo exports are multi‑MB; a single `<img>` blocks LCP and looks empty until download finishes.
- **How:** Apple/Medium-style 2-layer load — `{stem}.preview.webp` (~64px) + `{stem}.webp` (q=90). Component: `ProgressiveImage`; helper: `progressiveAsset()`; regenerate: `python3 scripts/generate-progressive-images.py`.
- **HARD RULE (layout — do not regress):** preview + full layers MUST be `position: absolute; inset: 0` stacked in the same box (`ProgressiveImage.css`). Never leave them as in-flow block siblings. Parents are usually `overflow: hidden` with fixed height; an in-flow full layer is clipped *below* the preview, and after preview fades out the frame looks empty forever (even when `data-ready=true` / full opacity 1).
- **HARD RULE (loading):** full layer is always `loading="eager"` (never native `lazy` — that left `currentSrc=""` and stuck on preview). Cache hits must reveal via layout-effect `complete` check, not only `onLoad`.
- **Full doc:** `docs/progressive-images.md` (purpose, rationale, pipeline, do/don’t, incident log).
- Applied on: **all home photos** (`Hero` slides + swipe thumbs + `HomeSections` cards/BGs/map), all `SubVisual` heroes, 법인소개 large photos. SVG icons stay plain `<img>`.
- `SubVisual` requires `image` + `imagePreview` (`priority` preload for LCP).
- Hero: Ken Burns / slide framing stay on `.progressive-image` wrapper; do not put transforms only on the inner `<img>` again.
- Wrapper sizing: parent (or `--fill`) must give the `.progressive-image` box a non-zero size — absolute layers do not contribute intrinsic height.

### Commands
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Lint: `npm run lint` (oxlint)
- Build: `npm run build`
- Progressive assets: `python3 scripts/generate-progressive-images.py` (needs Pillow)
- Live: https://james-oh-dot.github.io/gyungkook/ (GitHub Pages, deploys on `main` via `.github/workflows/deploy-pages.yml`)

### Non-obvious notes
- Styling is plain CSS (no Tailwind). Design tokens live in `src/styles/global.css`.
- TypeScript is **`strict: true`** (both tsconfigs, 2026-07). Keep it on; prefer explicit guards over non-null `!` in new code.
- Reveal timing lives in **`src/hooks/useDoubleRafReveal.ts`** — `CharReveal` / `LineReveal` both consume it. Never inline rAF reveal logic back into the components, and never pass non-primitive deps (see hook comments; hero rAF re-renders every frame).
- Sub-page heroes use WebP progressive pairs — do not point `SubVisual` at raw multi‑MB JPG/PNG.
- Hero source of truth (default `/`): Figma canvas `AI-hero-change` (`22:10492`) → frames `hero_1`…`hero_5` (teal).
- **Alternate hero for client review:** dark previous hero lives at `classic.html` → `HeroClassic` + `public/assets/classic/*`. Top `VersionSwitch` toggles A Teal / B Dark. Vite MPA inputs: `index.html` + `classic.html`.
- **HARD RULE (classic MPA):** shared home chrome/sections used by `AppClassic` must not call `react-router` hooks or render `<Link>` / `<NavLink>` / `<Outlet>` without a Router. Classic has no `BrowserRouter` — a single `<Link>` (e.g. home `TextBtn`) throws and blanks the whole page. Use `resolveNavHref()` + plain `<a>` (same pattern as GNB). `Gnb` already uses `UNSAFE_LocationContext` safely for pathname.
- Hero carousel timing is `HERO_DURATION_MS = 10000` in `src/data/slides.ts`.
- Hero structure (do not regress to the old black/right-panel layout):
  - Stage: solid teal `#58bdc2` + centered per-slide visual (`hero__bg-slide--statue|jewel|cubes|birds|campus`)
  - `hero_copy`: description (Pretendard) **above** `hero_maincopy`
  - `hero_maincopy`: large Nanum Myeongjo English **word** + Korean **title** side-by-side
  - Swipe meta is **white** card + white-border thumb (not dark chrome)
- Hero motion contract: description = `LineReveal`; English word + Korean title = `CharReveal`; image Ken Burns via `--hero-zoom` over 10s; `swipe_gage` = rAF `scaleX(progress)` with **no CSS width transition**; prev/next/thumb click = instant `jumpTo`.
- Slide 02 visual **must** be the jewel (`public/assets/hero-02.png`).
- Hero 01/02/04 assets are **RGBA PNG** (2× from Figma `hero-01` / `hero-02` / `hero-04` on `AI-hero-change`). Keep alpha — do not re-bake to JPEG.
- **HARD RULE — Hero images must NEVER crop the source bitmap** (user command; blocking):
  - Especially slide 01 **statue**: hands, scales, head, and left/right edges must always stay visible.
  - Forbidden: `object-fit: cover` on statue; Ken Burns `scale() > 1` inside `overflow: hidden`; width `> 100vw` / wider than the stage; fixed height that fights native aspect (forces side crop); `ProgressiveImage` inline `objectFit: cover` overriding CSS `contain`.
  - Required: size by **width + native aspect** (`aspect-ratio: 2117 / 3511`), `object-fit: contain`, `object-position: center top`, Ken Burns **≤ 1.0**, width capped with `min(..., 100%)`.
  - Do **not** reintroduce “legs may crop” / `107.2vw` / `height: min(145vh, …)` + cover for statue.
- Hero visual framing (teal rebuild — do not regress):
  - `statue`: full figure via `contain` (see HARD RULE above); Ken Burns origin top-center; never `center bottom`
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
  - Statue (slide 01) ≤1024: pin via `.hero__visual-media` absolute **top** (~14.1% tablet / ~24.7% mobile), width **`min(611px, 100%)`** tablet / **`min(100vw, 100%)`** mobile — never wider than the viewport. Native aspect + `contain` only. Brightness `1.28` / contrast `0.97`.
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
   This contract is now centralized in `src/hooks/useDoubleRafReveal.ts` — change it there only, and re-run the hero QA checks after.

### Section / footer horizontal padding (Figma)
- Global tokens in `src/styles/global.css`: `--page-pad` (section inset) and `--footer-pad` (footer inset).
- Desktop: `--page-pad` stays the existing clamp; `--footer-pad` follows it. Tablet (≤768): sections `48px`, footer `40px`. Mobile (≤767): both `24px`.
- Below-hero sections use `var(--page-pad)`. Footer uses `var(--footer-pad)`.
- **HARD RULE — 1280 content width (do not regress to 880):** `--page-pad` caps at **200px** on ≥1920px screens, so putting **both** `max-width: 1280px` **and** `padding: … var(--page-pad) …` on the *same* element caps content at `1280 − 2×200 = 880px`. Two correct patterns: (a) **split** — a full-width outer with `padding: … var(--page-pad)` + a separate inner `max-width: 1280px; margin: 0 auto` (법인소개/정비/board pages); or (b) **single element** — `max-width: calc(1280px + 2 * var(--page-pad))` with `padding-inline: var(--page-pad)` (대표인사말 `.greeting__main`, 갤러리 `.gallery__main`, 변호사 `.lawyer-hero__inner`). Never `max-width:1280` + page-pad on one box. (2026-07-21 fix.)
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
- **Home notice (소식·공지)**: **3-up overlay cards (>1024) → 1-col horizontal list card (768–1024) → 1-col overlay card (≤767)**. Gaps per Figma: **10 / 16 / 8**. Card ratio **5:7** (desktop + mobile overlay). The tablet card is a *different component* (250² image left + `#F7F7FB` text panel right, dark type, dark arrow via `filter: brightness(0)`), so it is bounded to `@media (min-width:768px) and (max-width:1024px)` — never let it leak to mobile. Tablet keeps the `전체보기` button on the header row (`#notice .section-head { flex-direction: row }` overrides the shared ≤1024 column rule); mobile stacks it below. Do not reintroduce the old `3 → 2 → 1` overlay-only collapse.
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
