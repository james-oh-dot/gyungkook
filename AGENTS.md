# AGENTS.md

## Cursor Cloud specific instructions

### Product
법무법인 경국 홈페이지 퍼블리싱 (Vite + React + TypeScript). Figma 소스: `AI_dev` 파일의 `HOME` / tablet / mobile 프레임.

### Commands
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Lint: `npm run lint` (oxlint)
- Build: `npm run build`

### Non-obvious notes
- Styling is plain CSS (no Tailwind). Design tokens live in `src/styles/global.css`.
- Hero carousel timing is `HERO_DURATION_MS = 10000` in `src/data/slides.ts`.
- Scroll reveal + light parallax are wired in `src/hooks/useScrollReveal.ts` via `[data-reveal]` and `--parallax-y`.
- Figma MCP asset URLs expire (~7 days); committed binaries under `public/assets/` are the source of truth.
- PR creation may require collaborator permission on the GitHub repo.
