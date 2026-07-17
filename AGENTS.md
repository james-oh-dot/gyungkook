# AGENTS.md

## Cursor Cloud specific instructions

### Product
법무법인 경국 홈페이지 퍼블리싱 (Vite + React + TypeScript). Figma 소스: `AI_dev` 파일의 `HOME` / tablet / mobile 프레임.

### Commands
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Lint: `npm run lint` (oxlint)
- Build: `npm run build`
- Live: https://james-oh-dot.github.io/gyungkook/ (GitHub Pages, deploys on `main` via `.github/workflows/deploy-pages.yml`)

### Non-obvious notes
- Styling is plain CSS (no Tailwind). Design tokens live in `src/styles/global.css`.
- Hero carousel timing is `HERO_DURATION_MS = 10000` in `src/data/slides.ts`.
- Hero motion contract (do not regress): `hero_maincopy` = `CharReveal` (char-by-char); `hero_copy` = `LineReveal` (line parallax, not chars); `swipe_gage` = rAF `scaleX(progress)` with **no CSS width transition**; prev/next/preview click must `jumpTo` immediately (gage → 0, remount via `animKey`).
- Slide 02 background **must** be the jewel (`public/assets/hero-02.jpg`). Do not re-pull the architecture fill from Figma `02rebuild` without checking with design — user override.
- Icons are **`.svg` only** under `public/assets/`. Never reintroduce SVG XML saved as `.png` (causes broken-image X boxes). Hero arrows are already white — do not `filter: invert(1)`.
- Scroll reveal + light parallax: `src/hooks/useScrollReveal.ts` via `[data-reveal]` and `--parallax-y`.
- Public asset URLs must go through `asset()` in `src/utils/asset.ts` so GitHub Pages `base` (`/gyungkook/`) works.
- Production Pages builds set `GITHUB_PAGES=true` (see workflow). Local `npm run dev` uses `base: '/'`.
- Figma MCP asset URLs expire (~7 days); committed binaries under `public/assets/` are the source of truth.
- UI craft skill: `.cursor/skills/impeccable/` (also `.claude/skills`, `.agents/skills`). Brand: premium + sharp rect; interactions soft. See `WORKLOG.md` for full handoff.
- PR creation may require collaborator permission on the GitHub repo.
- **User rule:** If the agent cannot create/merge the PR itself, always end the turn with a direct link the user can open (e.g. `https://github.com/james-oh-dot/gyungkook/pull/new/<branch>` or the existing PR URL). Do not assume merge happened.
