# 법무법인 경국 (GYUNGKOOK) 홈페이지

법무법인 경국 공식 홈페이지. Figma 디자인(`AI_dev` 파일)을 Desktop / Tablet(768) / Mobile(390) 반응형으로 퍼블리싱한 React SPA입니다.

- **Live**: https://james-oh-dot.github.io/gyungkook/
- **Figma**: `AI_dev` 파일 — `HOME` / `HOME_TABLET_768_RESPONSIVE_AUTO` / `HOME_MOBILE_390_RESPONSIVE_AUTO` 및 서브페이지 프레임
- **AI 에이전트(Claude/Cursor) 작업 규칙**: [`AGENTS.md`](./AGENTS.md) — 컴포넌트별 하드룰, 회귀 방지 노트
- **작업 이력**: [`WORKLOG.md`](./WORKLOG.md) — 기능별 구현 배경 · 검증 로그

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript, Vite 8 (rolldown) |
| 라우팅 | React Router 7 (`BrowserRouter`) |
| 스타일 | 순수 CSS (Tailwind 미사용), CSS 변수 기반 디자인 토큰 |
| 데이터 | 정적 mock 데이터 (`src/data/*.ts`) — 실 서비스 전환 시 API 연동 대상 |
| 배포 | GitHub Actions → GitHub Pages, `main` 푸시 시 자동 배포 |
| 린트 | oxlint |

백엔드/CMS 없이 정적 데이터로 동작하는 프런트엔드 단독 프로젝트입니다. `src/data/` 아래 각 파일의 TypeScript 타입이 곧 예상 API 응답 스키마 역할을 합니다.

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입체크 + 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 로컬 프리뷰 (`http://localhost:4173`) |
| `npm run lint` | oxlint |

빌드는 `GITHUB_PAGES=true` 환경변수 여부로 base 경로를 전환합니다(로컬 `/`, GitHub Pages `/gyungkook/`). 자세한 내용은 `vite.config.ts` 참고.

## 프로젝트 구조

```
src/
  App.tsx / AppClassic.tsx   라우터 진입점 (App = 메인 SPA, AppClassic = classic.html 대체 시안)
  layouts/                   페이지 공통 셸 (SiteLayout = GNB + Outlet + Footer)
  pages/                     라우트별 페이지 컴포넌트
  components/                GNB, Footer, Hero, 검색 오버레이 등 공유 UI
    sections/                홈 화면 섹션 (Notice/About/Practice/Awards 등)
    sub/                     서브페이지 공유 조각 (SubVisual, LocalTabs 등)
  data/                      정적 mock 데이터 — 페이지별 콘텐츠 + 타입 정의
  hooks/                     스크롤 리빌, 미디어쿼리 등 공통 훅
  styles/                    전역 CSS 변수 · 리셋
public/assets/                이미지 · 아이콘 (progressive blur-up 쌍 포함)
```

## 정보 구조 (IA) / 라우트 맵

GNB 5개 대메뉴 기준 전체 라우트입니다. `src/data/nav.ts`가 GNB/드로어 메뉴 구조의 단일 소스입니다.

```
/                                   홈

법무법인경국
  /about/intro                      법인소개
  /about/greeting                   대표인사말
  /about/lawyers                    변호사 · 자문단 (목록)
  /about/lawyers/:lawyerId          변호사 · 자문단 (프로필)
  /about/gallery                    경국인갤러리
  /about/history                    연혁 · 수상 · 인증
  /about/location                   오시는길

재개발 · 보상업무
  /practice/renewal                 정비사업
  /practice/public                  공익사업

기타업무
  /other/misc                       기타업무 (부동산/가사/민형사/행정/기업 탭)
  /other/cases                      업무사례

활동 · 보도
  /press/coverage/:tab              언론보도 (tv | release)
  /press/coverage/:tab/:postId        └ 상세
  /press/column-media/:tab          컬럼 · 미디어 (column | publication | media)
  /press/column-media/:tab/:postId    └ 상세
  /press/social                     사회공헌
  /press/social/:postId               └ 상세

소식 · 공지
  /news/notice                      소식공지
  /news/notice/:postId                └ 상세
  /news/cases                       판례뉴스
  /news/cases/:postId                 └ 상세
  /news/careers                     인재영입
  /news/careers/jobs                  └ 채용공고 목록
  /news/careers/jobs/:postId            └ 상세
  /news/consult                     상담신청
```

게시판형 페이지(언론보도/컬럼미디어/사회공헌/소식공지/판례뉴스/인재영입)는 공통 레이아웃 + `PostDetail` 컴포넌트를 재사용합니다.

## 핵심 인터랙션

- 히어로 5슬라이드, 10초 자동 전환 + 게이지, 프레임 고정 상태에서 이미지만 Ken Burns 확대
- GNB: 스크롤 시 리퀴드 글라스, 호버 시에만 화이트 전환, 배경 밝기에 따른 자동 텍스트 대비
- 사이트 검색 오버레이: 전체 페이지 콘텐츠 풀텍스트 검색
- 태블릿/모바일 좌측 플로팅 퀵 네비게이션 (오시는길/카톡문의/무료법률상담 등)
- 서브페이지 로컬 탭: 스크롤 모드(섹션 스크롤 스파이) / 라우트 모드 두 패턴
- 이미지 progressive blur-up 2단 로딩 (프리뷰 → 고화질)

세부 구현 규칙과 회귀 이력은 [`AGENTS.md`](./AGENTS.md) / [`WORKLOG.md`](./WORKLOG.md)를 참고하세요.
