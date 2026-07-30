/**
 * Shared board types for list + detail subpages
 * (컬럼미디어, 언론보도, 사회공헌, …).
 *
 * Detail UI: `PostDetail` (Figma SUB_게시글_상세_*).
 *
 * ## BoardModule — single abstraction for every board (2026-07 refactor)
 *
 * 배경/근거: 언론보도·컬럼미디어·사회공헌 세 게시판이 접두사만 다른
 * 병렬 API(findXxx / adjacentXxx / xxxPath)를 각자 정의하고, 상세 페이지 3개가
 * 같은 로직(param 검증 → find → adjacent → PostDetail)을 3벌 복제하고
 * 있었다. CMS 연동 시 세 곳을 동시에 고쳐야 하는 유지보수 부담을 없애기
 * 위해 데이터 접근을 `BoardModule` 하나로 통일했다.
 *
 * - 각 데이터 파일은 `createBoardModule()`로 모듈 인스턴스를 export.
 * - 페이지 계층은 `BoardDetailPage` / `BoardTabsLayout` 제네릭 컴포넌트가
 *   모듈을 주입받아 동작한다 (`src/pages/BoardDetailPage.tsx` 참고).
 * - CMS 전환 시: `posts` 배열 소스만 API 결과로 교체하면 된다.
 *   URL 스킴(`basePath/:tab/:postId`)은 SEO를 위해 유지할 것.
 */

export type BoardTabDef = {
  id: string
  label: string
  /** Chip on list / detail cards */
  chip: string
}

export type BoardPost = {
  id: string
  /** Tab key (URL segment) */
  tab: string
  title: string
  summary: string
  source?: string
  author?: string
  publishedAt: string
  views: number
  thumbnail: string
  detailImage?: string
  body: string[]
  /** 채용공고 전용 — 직무 / 직책 / 고용형태 (list card `info` row) */
  jobMeta?: string[]
  /** 채용공고 전용 — 마감 표기 (e.g. "2026.06.29 23:59 까지") */
  deadline?: string
  /** 채용공고 전용 — 마감 D-day 배지 (e.g. "D-10") */
  dday?: string
}

export type BoardAdjacent = {
  prev?: BoardPost
  next?: BoardPost
}

/** SubVisual + routing metadata every board page carries. */
export type BoardPageMeta = {
  parentLabel: string
  title: string
  visual: string
  visualPreview: string
  /** Route prefix (React Router path, no Vite base) */
  basePath: string
}

/**
 * Uniform data-access surface for one board.
 * All tab arguments are plain strings — validate with `isTab` at the
 * route boundary (generic pages do this), then trust downstream calls.
 */
export type BoardModule = {
  page: BoardPageMeta
  tabs: BoardTabDef[]
  /**
   * `true`  → URLs are `basePath/:tab(/:postId)` (언론보도, 컬럼미디어)
   * `false` → single board, URLs are `basePath(/:postId)` (사회공헌)
   */
  hasTabSegment: boolean
  /** First tab id — redirect target + implicit tab for single boards. */
  defaultTab: string
  isTab(value: string | undefined): boolean
  postsByTab(tab: string): BoardPost[]
  findPost(tab: string, postId: string): BoardPost | undefined
  adjacent(tab: string, postId: string): BoardAdjacent
  listPath(tab: string): string
  /** Signature matches `PostDetail`'s `detailPath` prop. */
  detailPath(tab: string, postId: string): string
}

export function adjacentInList(
  list: BoardPost[],
  postId: string,
): BoardAdjacent {
  const index = list.findIndex((p) => p.id === postId)
  if (index < 0) return {}
  return {
    // Figma labels: 다음 = newer/previous in list (index-1), 이전 = older (index+1)
    next: index > 0 ? list[index - 1] : undefined,
    prev: index < list.length - 1 ? list[index + 1] : undefined,
  }
}

type CreateBoardModuleConfig = {
  page: BoardPageMeta
  tabs: BoardTabDef[]
  /** Flat mock list — every post carries its `tab` key. Swap for API later. */
  posts: BoardPost[]
  /** Default `true`. Set `false` for single boards (no tab URL segment). */
  hasTabSegment?: boolean
}

/**
 * Build a `BoardModule` from static mock data.
 * Keeps list order as the adjacency order (Figma prev/next contract).
 */
export function createBoardModule(config: CreateBoardModuleConfig): BoardModule {
  const { page, tabs, posts, hasTabSegment = true } = config
  const defaultTab = tabs[0]!.id

  const postsByTab = (tab: string) => posts.filter((p) => p.tab === tab)

  return {
    page,
    tabs,
    hasTabSegment,
    defaultTab,
    isTab: (value) => value != null && tabs.some((t) => t.id === value),
    postsByTab,
    findPost: (tab, postId) =>
      posts.find((p) => p.tab === tab && p.id === postId),
    adjacent: (tab, postId) => adjacentInList(postsByTab(tab), postId),
    listPath: (tab) =>
      hasTabSegment ? `${page.basePath}/${tab}` : page.basePath,
    detailPath: (tab, postId) =>
      hasTabSegment
        ? `${page.basePath}/${tab}/${postId}`
        : `${page.basePath}/${postId}`,
  }
}
