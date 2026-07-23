/**
 * ============================================================================
 * Site-wide full-text search index
 * ============================================================================
 *
 * 배경/근거: 기존 검색은 `NAV_ITEMS`(메뉴 라벨)만 인덱싱해 "재개발"처럼 메뉴에
 * 없는 본문 키워드는 찾지 못했다. 사용자 요구 — "등록된 모든 문구에서 찾고,
 * 한 페이지에 여러 번 등장하면 그 갯수도 표기".
 *
 * 설계:
 * - 페이지(라우트/앵커) 1개 = 검색 문서(`SearchDoc`) 1개. 게시판 글은 상세
 *   페이지가 곧 문서다(글마다 1개).
 * - 각 문서의 `text`는 해당 데이터 모듈의 **모든 콘텐츠 문자열을 재귀 수집**해
 *   만든다(자산 경로·id·라우트는 제외). 데이터 파일에 문구가 추가되면 별도
 *   작업 없이 인덱스에 자동 반영된다 — 필드 하드코딩(drift) 방지.
 * - 검색 시 질의어의 페이지 내 **등장 횟수**를 세어 결과에 표기한다.
 *
 * 유지보수: 새 페이지를 추가하면 아래 `ROUTE_DOCS` / 게시판 목록에 한 줄
 * 추가한다. 데이터 export 이름이 바뀌면 컴파일 에러로 즉시 드러난다.
 */

import { ABOUT_INTRO_ABOUT, ABOUT_INTRO_PARTNERS, ABOUT_INTRO_PHILOSOPHY, ABOUT_INTRO_STRENGTH, ABOUT_INTRO_TABS } from './aboutIntro'
import type { BoardModule } from './board'
import { CAREERS_CONTACT, CAREERS_INTRO, CAREERS_VALUES, JOBS_BOARD } from './careers'
import { CASE_NEWS_BOARD } from './caseNews'
import { CASE_STUDIES } from './caseStudies'
import { COLUMN_MEDIA_BOARD } from './columnMedia'
import { achievements, awards, notices, practices, pressItems, professionals } from './content'
import { GALLERY_PROMISE, GALLERY_PYRAMID, GALLERY_QUOTE, GALLERY_TABS } from './gallery'
import { GREETING_PAGE } from './greeting'
import { ADVISORS } from './advisors'
import { LAWYERS, LAWYERS_PAGE, lawyerPath } from './lawyers'
import { NAV_ITEMS } from './nav'
import { NEWS_NOTICE_BOARD } from './newsNotice'
import { PRESS_COVERAGE_BOARD } from './pressCoverage'
import { PUBLIC_COMPENSATION, PUBLIC_OVERVIEW, PUBLIC_PROCEDURE, PUBLIC_RECORD_1, PUBLIC_RECORD_2, PUBLIC_TABS } from './publicProject'
import { RENEWAL_ADVISORY, RENEWAL_EVICTION, RENEWAL_EXPROPRIATION, RENEWAL_LEVY, RENEWAL_OVERVIEW, RENEWAL_PUBLIC_LAND, RENEWAL_SALE, RENEWAL_TABS, RENEWAL_TRACK_RECORD, RENEWAL_TRANSFER } from './renewal'
import { SOCIAL_CONTRIBUTION_BOARD } from './socialContribution'

export type SearchDoc = {
  id: string
  /** Result heading (page / post title). */
  title: string
  /** Nav href convention: `/route` or `#home-anchor`. */
  href: string
  /** Breadcrumb chips (대메뉴 / 서브메뉴 / …). */
  depth: string[]
  /** Lowercased haystack of every content string on the page. */
  text: string
}

export type SearchResult = SearchDoc & {
  /** How many times the query appears on this page. */
  count: number
  /** Query matched the title (ranks first). */
  titleHit: boolean
}

/* ------------------------------------------------------------------ */
/* String harvesting                                                   */
/* ------------------------------------------------------------------ */

/** Skip asset paths, URLs, anchors, mail/tel — never real page copy. */
const ASSET_RE = /(?:^[/#]|^https?:|^mailto:|^tel:|assets\/|\.(?:svg|png|jpe?g|webp|gif|avif|mp4))/i
/** Skip pure numbers / punctuation (e.g. list `no` = "01", "·"). */
const NON_TEXT_RE = /^[\s\d.,·:/\-–—()[\]]+$/
/** Keys whose values are assets / ids / routes, not searchable copy. */
const SKIP_KEYS = new Set([
  'id', 'tab', 'basePath', 'href', 'visual', 'visualPreview', 'visualKey',
  'icon', 'src', 'preview', 'image', 'imagePreview', 'thumbnail', 'detailImage',
  'photo', 'photoPreview', 'signature', 'portrait', 'portraitPreview', 'mark',
  'quoteMark', 'ciLogo', 'seal', 'sealPreview', 'logo', 'logos', 'poster', 'map',
])

function collect(value: unknown, out: string[]): void {
  if (value == null) return
  if (typeof value === 'string') {
    const s = value.trim()
    if (!s || ASSET_RE.test(s) || NON_TEXT_RE.test(s)) return
    out.push(s)
    return
  }
  if (Array.isArray(value)) {
    for (const v of value) collect(v, out)
    return
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(k)) continue
      collect(v, out)
    }
  }
  // numbers / booleans / functions → ignored
}

/** Concatenate all content strings from the given objects, lowercased. */
function harvest(...objs: unknown[]): string {
  const out: string[] = []
  for (const o of objs) collect(o, out)
  // Join with '\n' so matches never span field boundaries.
  return out.join('\n').toLowerCase()
}

/* ------------------------------------------------------------------ */
/* Doc builders                                                        */
/* ------------------------------------------------------------------ */

const ABOUT = '법무법인경국'
const REDEV = '재개발 · 보상업무'
const PRESS = '활동 · 보도'
const NEWS = '소식 · 공지'
const HOME = '홈'

function doc(
  id: string,
  title: string,
  href: string,
  depth: string[],
  ...content: unknown[]
): SearchDoc {
  return { id, title, href, depth, text: harvest(title, ...content) }
}

/** One doc per post in a board (each detail page is its own page). */
function boardDocs(board: BoardModule, parent: string): SearchDoc[] {
  const out: SearchDoc[] = []
  for (const tab of board.tabs) {
    for (const post of board.postsByTab(tab.id)) {
      const depth = board.hasTabSegment
        ? [parent, board.page.title, tab.label]
        : [parent, board.page.title]
      out.push(
        doc(
          `${board.page.basePath}/${tab.id}/${post.id}`,
          post.title,
          board.detailPath(tab.id, post.id),
          depth,
          post,
        ),
      )
    }
  }
  return out
}

/* Content pages (route → all section copy). */
const ROUTE_DOCS: SearchDoc[] = [
  doc('about-intro', '법인소개', '/about/intro', [ABOUT, '법인소개'],
    ABOUT_INTRO_TABS, ABOUT_INTRO_ABOUT, ABOUT_INTRO_PHILOSOPHY, ABOUT_INTRO_STRENGTH, ABOUT_INTRO_PARTNERS),
  doc('about-greeting', '대표 인사말', '/about/greeting', [ABOUT, '대표인사말'], GREETING_PAGE),
  doc('about-gallery', '경국인 · 갤러리', '/about/gallery', [ABOUT, '경국인갤러리'],
    GALLERY_TABS, GALLERY_PYRAMID, GALLERY_QUOTE, GALLERY_PROMISE),
  doc('practice-renewal', '정비사업', '/practice/renewal', [REDEV, '정비사업'],
    RENEWAL_TABS, RENEWAL_OVERVIEW, RENEWAL_EVICTION, RENEWAL_SALE, RENEWAL_EXPROPRIATION,
    RENEWAL_TRANSFER, RENEWAL_LEVY, RENEWAL_PUBLIC_LAND, RENEWAL_ADVISORY, RENEWAL_TRACK_RECORD),
  doc('practice-public', '공익사업', '/practice/public', [REDEV, '공익사업'],
    PUBLIC_TABS, PUBLIC_OVERVIEW, PUBLIC_RECORD_1, PUBLIC_COMPENSATION, PUBLIC_PROCEDURE, PUBLIC_RECORD_2),
  doc('press-cases', '업무사례', '/press/cases', [REDEV, '업무사례'], CASE_STUDIES),
  doc('news-careers', '인재영입', '/news/careers', [NEWS, '인재영입'],
    CAREERS_INTRO, CAREERS_VALUES, CAREERS_CONTACT),
]

/* 변호사 · 자문단 — entry + one doc per lawyer profile. */
const LAWYER_DOCS: SearchDoc[] = [
  doc(
    'about-lawyers',
    LAWYERS_PAGE.title,
    LAWYERS_PAGE.basePath,
    [ABOUT, LAWYERS_PAGE.title, '변호사단', '자문단'],
    LAWYERS_PAGE,
    LAWYERS,
    ADVISORS,
  ),
  ...LAWYERS.map((l) =>
    doc(
      `lawyer-${l.id}`,
      `${l.name} ${l.title}`,
      lawyerPath(l.id),
      [ABOUT, LAWYERS_PAGE.title, l.name],
      l,
    ),
  ),
]

/* Home sections (unique copy that isn't on a dedicated subpage). */
const HOME_DOCS: SearchDoc[] = [
  doc('home-notice', '소식 · 공지', '#notice', [HOME, '소식 · 공지'], notices),
  doc('home-practice', '업무분야', '#practice', [HOME, '업무분야'], practices),
  doc('home-achievements', '주요 실적', '#achievements', [HOME, '주요실적'], achievements),
  doc('home-professionals', '구성원', '#professionals', [HOME, '구성원'], professionals),
  doc('home-press', '활동 · 보도', '#press', [HOME, '활동 · 보도'], pressItems),
  doc('home-awards', '인증 · 수상', '#awards', [HOME, '인증 · 수상'], awards),
]

/* Board posts. */
const BOARD_DOCS: SearchDoc[] = [
  ...boardDocs(PRESS_COVERAGE_BOARD, PRESS),
  ...boardDocs(COLUMN_MEDIA_BOARD, PRESS),
  ...boardDocs(SOCIAL_CONTRIBUTION_BOARD, PRESS),
  ...boardDocs(NEWS_NOTICE_BOARD, NEWS),
  ...boardDocs(CASE_NEWS_BOARD, NEWS),
  ...boardDocs(JOBS_BOARD, NEWS),
]

/* Remaining nav destinations (placeholders, list/section entries) so every
   menu item stays findable — skip hrefs already covered above. */
function navDocs(covered: Set<string>): SearchDoc[] {
  const out: SearchDoc[] = []
  for (const item of NAV_ITEMS) {
    for (const sub of item.children) {
      if (covered.has(sub.href)) continue
      covered.add(sub.href)
      out.push(doc(`nav-${sub.id}`, sub.label, sub.href, [item.label, sub.label]))
    }
  }
  return out
}

const EXPLICIT_DOCS = [...ROUTE_DOCS, ...LAWYER_DOCS, ...HOME_DOCS, ...BOARD_DOCS]
const COVERED = new Set(EXPLICIT_DOCS.map((d) => d.href))

export const SEARCH_DOCS: SearchDoc[] = [...EXPLICIT_DOCS, ...navDocs(COVERED)]

/* ------------------------------------------------------------------ */
/* Query                                                               */
/* ------------------------------------------------------------------ */

function countOccurrences(haystack: string, needle: string): number {
  let count = 0
  let idx = haystack.indexOf(needle)
  while (idx !== -1) {
    count += 1
    idx = haystack.indexOf(needle, idx + needle.length)
  }
  return count
}

/** Full-text search: pages containing `query`, ranked, with hit counts. */
export function searchDocs(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: SearchResult[] = []
  for (const d of SEARCH_DOCS) {
    const count = countOccurrences(d.text, q)
    if (count === 0) continue
    results.push({ ...d, count, titleHit: d.title.toLowerCase().includes(q) })
  }
  results.sort((a, b) => {
    if (a.titleHit !== b.titleHit) return a.titleHit ? -1 : 1
    if (b.count !== a.count) return b.count - a.count
    return a.title.length - b.title.length
  })
  return results
}
