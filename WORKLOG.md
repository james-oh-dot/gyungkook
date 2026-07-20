# WORKLOG — Hero motion / icons / assets (handoff)

## 2026-07-20 — 게시판 상세 이전/다음 스크롤 버그 수정 (스티키 기준점)

> Branch: `claude/o-boinida-98drdm` (merged PR #69 이후 최신 main에서 재시작)
> 파일: `src/hooks/useScrollToLocalTabs.ts` 만 변경.

### 증상 (사용자 리포트)
게시판 상세에서 **이전/다음 게시글 클릭 시 화면 스크롤 위치가 그대로** 유지됨.
기대: 새 게시글의 **본문 상단이 sticky 로컬탭 바로 아래**에 오도록 점프.

### 근본 원인 (Playwright로 재현·확정)
`useScrollToLocalTabs`가 `document.getElementById(LOCAL_TABS_ANCHOR_ID)`로
얻은 요소에 `el.scrollIntoView()`를 호출했는데, 그 요소는 로컬탭 `<nav>`이고
**`position: sticky; top: var(--gnb-bar-h)`**. 스크롤이 내려간 상태에선 이
nav가 이미 `top:100px`에 **stuck** 되어 있어, 브라우저는 "이미 뷰포트
시작에 보임"으로 판단 → `scrollIntoView`가 **완전 no-op**.

진단 수치 (수정 전, 1440px):
```
클릭 전:  scrollY=1358  tabsTop=100(stuck)  bodyTop=-397
클릭 후:  scrollY=1358  tabsTop=100          bodyTop=-397   ← 안 움직임
수동 el.scrollIntoView(sticky nav): 700 → 700 (no-op 재현)
비-sticky sentinel 기준 window.scrollTo: 700 → 628 (정상)
```
> 참고: 이 버그는 prev/next 뿐 아니라 **list→detail / 목록으로 / 탭클릭**
> 모든 board 스크롤에 있었음 (전부 같은 sticky nav를 대상으로 했기 때문).
> prev/next에서 가장 눈에 띄었을 뿐.

### 해결
sticky 요소가 아니라 **비-sticky 기준점**을 측정해 `window.scrollTo`로 계산:
- 탭형 보드 → `.local-tabs__sentinel` (nav 바로 앞 1px 마커, non-sticky)
- 사회공헌(탭 없음) → `#subpage-local-tabs` 앵커 div (non-sticky)
- `targetY = window.scrollY + anchor.rect.top − gnbH`, `Math.max(0, …)` 클램프,
  `behavior: 'smooth'`. 새 라우트 콘텐츠 레이아웃을 위해 double rAF 유지.

### 검증 (Playwright, vite preview)
- 데스크톱 1440 + 모바일 390(gnbH 82) 모두 PASS.
- 언론보도/컬럼미디어/사회공헌 각각: list→detail & prev/next에서 탭이
  GNB 밑(±3px)에 고정되고 본문 상단이 뷰포트 상단 근처에 노출.
- 회귀 확인: **list 페이지 GNB 진입 시 scrollY=0** (sub-visual 유지) — 정상.

---

## 2026-07-20 — 구조 리팩터 4종 (board 통합 / strict / reveal 훅 / a11y)

> Branch: `claude/o-boinida-98drdm`
> Audience: Codex / Cursor / future agents. **UI 픽셀·모션 변경 없음** — 순수 구조 개선.
> 검증: `npm run build` ✅ / `npm run lint` ✅ / Playwright 스모크 27개 전부 PASS (아래).

### 1. 게시판(board) 모듈 통합 — `BoardModule`

**문제 (근거):** 언론보도·컬럼미디어·사회공헌 세 게시판이 접두사만 다른
병렬 API를 3벌 유지하고 있었다:

| columnMedia | pressCoverage | socialContribution |
|---|---|---|
| `findPost` | `findPressPost` | `findSocialPost` |
| `adjacentPosts` | `adjacentPressPosts` | `adjacentSocialPosts` |
| `tabListPath` | `pressTabListPath` | `socialListPath` |
| `postDetailPath` | `pressPostDetailPath` | `socialPostDetailPath` |

상세 페이지 3개(`PostDetailPage` / `PressCoverageDetailPage` /
`SocialContributionDetailPage`)는 데이터 함수 이름만 다른 **동일 로직**
(param 검증 → find → adjacent → `PostDetail`)이었고, 탭형 레이아웃 2개
(`ColumnMediaLayout` ≈ `PressCoverageLayout`)도 클래스명만 다른 판박이였다.
CMS 연동 시 세 곳을 동시에 고쳐야 하는 구조.

**해결:**
- `src/data/board.ts` — `BoardPageMeta` / `BoardModule` 타입 +
  `createBoardModule()` 팩토리 추가. `isTab`/`postsByTab`/`findPost`/
  `adjacent`/`listPath`/`detailPath`를 한 계약으로 생성.
  `hasTabSegment: false` → 사회공헌처럼 탭 세그먼트 없는 단일 보드
  (`basePath/:postId`).
- 각 데이터 파일은 `*_BOARD` 모듈 export (`COLUMN_MEDIA_BOARD` /
  `PRESS_COVERAGE_BOARD` / `SOCIAL_CONTRIBUTION_BOARD`). 구 래퍼 함수 전부 삭제.
- `src/pages/BoardDetailPage.tsx` (신규) — 제네릭 상세 라우트.
  상세 페이지 3개 파일 **삭제**, `App.tsx`에서
  `<BoardDetailPage board={…_BOARD} />`로 주입.
- `src/pages/BoardTabsLayout.tsx` (신규) — 제네릭 탭형 셸
  (SubVisual + LocalTabs + Outlet). `ColumnMediaLayout` /
  `PressCoverageLayout`은 CSS import + Figma naming만 소유한 얇은 래퍼로 축소.
  CSS import는 정적이라 제네릭에서 조건부 불가 → 래퍼가 담당 (의도적).
- `PRESS_COVERAGE_POSTS`는 `Record<tab, posts[]>` → **flat 배열**로 변경
  (모듈이 `tab` 필드로 필터). CMS 응답을 flat list로 받는 형태와도 정합.

**유지된 것 (회귀 없음 확인):**
- URL 스킴 전부 동일 (`/press/coverage/:tab/:postId` 등) — SEO/딥링크 불변.
- `PostDetail` / `PostListCard` / `PressGridCard` / `SocialGridCard` /
  `LocalTabs` / `SubVisual` 컴포넌트 무변경.
- 잘못된 tab/postId → 리스트로 redirect 동작 동일.
- 사회공헌 레이아웃(anchor + showChip=false + intro)은 구조가 달라
  `BoardTabsLayout`을 쓰지 **않는다** — 그대로 둠.

**새 게시판 추가 절차 (이제):** 데이터 파일에서 `createBoardModule()` →
`App.tsx` 라우트에 `BoardTabsLayout`(탭형이면) + `BoardDetailPage` 주입 → 끝.

### 2. TypeScript `strict: true`

- `tsconfig.app.json` + `tsconfig.node.json`에 `"strict": true` 추가.
- **결과: 기존 코드 오류 0** — 이미 strict-호환으로 작성돼 있었고,
  안전망만 공짜로 확보. 앞으로 null 부주의가 컴파일 타임에 잡힌다.
- 이 과정에서 제네릭 페이지들은 non-null 단언(`!`) 대신 명시적 가드
  (`if (!tabDef) return …`)를 사용하도록 작성함.

### 3. `useDoubleRafReveal` 훅 — CharReveal/LineReveal 공통화

**문제:** 두 컴포넌트가 "double rAF 후 `is-active`" 타이밍 로직을 글자
그대로 중복. 이 로직은 AGENTS.md의 **blocking QA 계약**(“Char/line reveals
must actually animate”)이라, 한쪽만 수정되다 깨지는 사고 위험이 있었다.

**해결:** `src/hooks/useDoubleRafReveal.ts`로 추출. 계약 두 가지를 훅
주석에 박제:
1. 마운트 프레임에 `is-active`를 붙이면 CSS transition 스킵 → double rAF 필수.
2. deps는 원시 `contentKey`만 (hero rAF `setProgress` 리렌더가 배열
   identity를 매 프레임 갈아끼우면 리빌이 opacity 0에 갇힘 —
   2026-07-17 회귀 사례).

`CharReveal`의 공백 → NBSP(`' '`) 치환 동작 그대로 유지.

### 4. Hero gage 접근성 모순 해소

`.hero__gage-bar`가 `aria-hidden="true"` + `role="progressbar"` +
`aria-value*`를 동시에 갖고 있었다. hidden 노드는 role을 노출하지 않으므로
progressbar 선언이 무의미했고, 매 프레임 % 갱신은 노출됐다면 오히려 소음.
슬라이드 위치는 버튼 aria-label이 전달하므로 **장식으로 정리**
(role/aria-value* 제거, `aria-hidden` 유지). 시각 동작 무변경.

### 검증 (Playwright, vite preview :4173)

- **보드 스모크 15개 PASS**: 세 게시판 각각 리스트 렌더 → 상세 진입 →
  다음/이전 내비 → 목록으로 복귀 + 잘못된 tab/postId redirect 3종.
- **Hero QA 12개 PASS** (AGENTS.md blocking bar): char/line 리빌
  `is-active` + opacity 1, 게이지 scaleX 진행/클릭 시 즉시 리셋,
  next/prev 즉시 전환, 리빌 재시작, 활성 슬라이드 정확히 1개,
  썸 호버 시 `.is-preview` 고스트 없음 / 배경 피크 없음.
- 콘솔 JS 에러 없음 (외부 폰트 CDN 차단은 CI 샌드박스 환경 문제로 무관).

### 파일 요약

| 변경 | 파일 |
|---|---|
| 신규 | `src/pages/BoardDetailPage.tsx`, `src/pages/BoardTabsLayout.tsx`, `src/hooks/useDoubleRafReveal.ts` |
| 삭제 | `src/pages/PostDetailPage.tsx`, `src/pages/PressCoverageDetailPage.tsx`, `src/pages/SocialContributionDetailPage.tsx` |
| 재작성 | `src/data/board.ts`(+팩토리), 레이아웃/리스트 페이지 5개, `CharReveal`/`LineReveal` |
| 수정 | `App.tsx`(라우트 주입), 데이터 3파일(모듈 export), `Hero.tsx`(gage a11y), tsconfig 2개(strict) |

---

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

Hover swipe thumbnail:
  - pauses timer only
  - scales thumbnail image ONLY (never peeks next slide onto .hero__bg)
  - leave resumes from paused elapsed
```

### Reveal timing (soft, sequential)

- Main title chars: ~30ms step, line offset, ease-out expo-ish curves.
- Copy lines: ~160ms between lines, each line starts with larger Y offset (`22 + i*12` px) → parallax feel.
- BG crossfade ~1.05s opacity / ~1.35s scale — soft, not snappy. Inactive slides stay `visibility: hidden`.

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

## QA checklist (manual) — blocking

- [ ] Slide 01: eaves image; maincopy chars cascade; copy lines parallax in
- [ ] Slide 02: **jewel** image; Rebuild copy
- [ ] Gage fills smoothly over ~10s; at end advances; image Ken Burns zooms slowly over those 10s
- [ ] Click next: gage → 0 instantly; image + copy switch immediately; reveals restart
- [ ] Click prev: same
- [ ] Click swipe preview: advances; gage resets
- [ ] **Hover thumbnail: ONLY thumb image scales; full hero background does NOT show next slide** (critical)
- [ ] Desktop / tablet / mobile: hero copy never covered by swipe; long labels wrap (no clipped English)
- [ ] Arrows visible (white chevrons), not X boxes
- [ ] Section icons (notice link, office, awards, text buttons) render
- [ ] Responsive: thumb morphs softly via `--hero-thumb-scale` / size transitions
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

## 2026-07-18 — Classic dark hero preserved as separate page

Client still comparing two art directions. Current default = teal rebuild; previous dark hero restored as MPA page:

| URL | Entry | Hero |
|---|---|---|
| `/` (`index.html`) | `src/main.tsx` → `App` | Teal `Hero` (AI-hero-change) |
| `/classic.html` | `src/main-classic.tsx` → `AppClassic` | Dark `HeroClassic` |

- Assets: `public/assets/classic/hero-0{1..5}.jpg` (+ next thumbs) restored from pre-rebuild commit
- Data: `src/data/slidesClassic.ts`
- Floating compare control: `VersionSwitch` on both pages (`A · Teal` / `B · Dark`)
- Vite `build.rollupOptions.input` includes both HTML entries (GitHub Pages deploys both)

Live after merge: `https://james-oh-dot.github.io/gyungkook/` and `…/classic.html`

---

## 2026-07-18 — Hero full rebuild from Figma `AI-hero-change`

### Source
Figma file `AI_dev` canvas `AI-hero-change` (`22:10492`) → `hero_1`…`hero_5`.

### Structure (replaces old black / right-panel hero)
| Layer | Spec |
|---|---|
| Stage | Solid `#58bdc2` |
| Visual | Per-slide centered subject (`statue` / `jewel` / `cubes` / `birds` / `campus`) |
| `hero_copy` | Description (Pretendard 24) **above** maincopy |
| `hero_maincopy` | Large Nanum Myeongjo English word + Korean title (side-by-side) |
| `hero_swipe` | White-border thumb + **white** meta card (`02 REBUILD`) + gage |

### Motion (unchanged contract)
- 10s Ken Burns on active visual (`--hero-zoom`)
- Desc = `LineReveal`; word + title = `CharReveal`
- Gage `scaleX(progress)`; instant `jumpTo` on controls
- Thumb hover: thumb image scale only — **never** full-stage next peek

### Assets
- `public/assets/hero-0{1..5}.jpg` + `hero-0{1..5}-next.jpg` from Figma MCP
- Transparent PNG fills composited onto `#58bdc2` before JPEG (avoids black boxes)

---

## 2026-07-17 — Hero responsive QA + hover regression (critical)

### Bugs fixed
1. **Critical:** Thumbnail hover applied `.is-preview` on next `.hero__bg-slide` (opacity ~0.42 over full hero). Removed entirely. Hover may only scale `.hero__swipe-thumb img`. Timer pause on hover remains.
2. Copy overlapped by absolute `hero__swipe` — added `--hero-swipe-reserve` bottom padding; mid-width right padding keeps left column clear; long labels wrap.
3. Inactive slides now `visibility: hidden` when opacity 0 (no ghost stacks).
4. Responsive thumb morph via `--hero-thumb-scale` + size transitions.
5. **LineReveal never activated:** hero `setProgress` re-renders every frame; `lines={[…]}` new array ref reset the reveal effect. Fixed with stable `contentKey = lines.join('\n')` dependency (this made `VALUE` / desc appear invisible — opacity stuck at 0).

### Docs
- `AGENTS.md` → **Hero QA quality bar** section (blocking rules).
- This checklist updated (hover preview of full BG is forbidden).

### Automated QA (Playwright)
Viewports 1440 / 1280 / 1024 / 390: no copy↔swipe overlap; no `.is-preview`; no ghost inactive slides on thumb hover; labels/desc `is-active` + opacity 1.
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
