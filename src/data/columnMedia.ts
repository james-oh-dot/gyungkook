/**
 * ============================================================================
 * 컬럼 · 미디어 (활동·보도 > 컬럼미디어) — mock content for publishing
 * ============================================================================
 *
 * Figma frames (AI_dev):
 * - List: SUB_활동보도_컬럼미디어_{컬럼|간행물|미디어}_{DESKTOP|TABLET|MOBILE}
 * - Detail (shared): SUB_게시글_상세_DESKTOP / SSUB_게시글_TABLET / SUB_게시글_MOBILE
 * - Sub visual: sub-04-03 (menu order 활동보도 = 04, 컬럼미디어 = 03)
 *
 * Backend / CMS integration notes:
 * - Replace COLUMN_MEDIA_POSTS with API results keyed by `tab` (+ pagination).
 * - `id` should become the CMS slug or numeric id; keep URL shape
 *   `/press/column-media/:tab/:postId` stable for SEO.
 * - Detail body (`bodyHtml` / paragraphs) will come from rich-text fields.
 * - `views` / `publishedAt` are display-only until analytics + CMS wire-up.
 * - Prev/next on detail should use list order within the same `tab`
 *   (or CMS “adjacent posts” if available).
 */

import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'

const COLUMN_MEDIA_VISUAL = progressiveAsset('assets/sub/sub-04-03')

/** Local tab keys — also used as URL segments. */
export type ColumnMediaTab = 'column' | 'publication' | 'media'

export type ColumnMediaTabDef = {
  id: ColumnMediaTab
  label: string
  /** Chip label on list/detail cards */
  chip: string
}

/**
 * Local menu under 컬럼·미디어.
 * Hover moves the underline indicator; click selects + routes to the tab list.
 */
export const COLUMN_MEDIA_TABS: ColumnMediaTabDef[] = [
  { id: 'column', label: '컬럼', chip: '컬럼' },
  { id: 'publication', label: '간행물', chip: '간행물' },
  { id: 'media', label: '미디어', chip: '미디어' },
]

export const COLUMN_MEDIA_PAGE = {
  parentLabel: '활동 · 보도',
  title: '컬럼 · 미디어',
  /** Figma layer name sub-04-03 — also used as GNB fullmenu visual for press-column */
  visual: COLUMN_MEDIA_VISUAL.src,
  visualPreview: COLUMN_MEDIA_VISUAL.preview,
  /** Route prefix (React Router, no base) */
  basePath: '/press/column-media',
} as const

export type ColumnMediaPost = {
  id: string
  tab: ColumnMediaTab
  title: string
  summary: string
  /** Optional source line (컬럼/미디어). Omit for 간행물. */
  source?: string
  /** Author or co-authors line */
  author: string
  publishedAt: string
  views: number
  thumbnail: string
  /** Detail hero / body image — falls back to thumbnail when absent */
  detailImage?: string
  /** Plain paragraphs for mock detail body (CMS → HTML later) */
  body: string[]
}

const BODY_COLUMN = [
  '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례, 그리고 조합의 관리처분계획에 의해 꽤 정교하게 정해진다. 분양대상 개념을 이해하면 “나는 토지만 있는데 아파트가 나오나?”, “상가를 갖고 있는데 아파트 신청이 가능한가?”, “도로로 쓰이는 땅도 분양대상인가?” 같은 질문의 답이 보다 명확해진다.',
  '먼저 분양대상자를 이야기하려면 정비사업의 절차를 큰 그림으로 잡아두는 편이 좋다. 정비사업에서 공동주택 분양은 대체로 사업시행인가 이후 ‘분양공고 및 분양신청’ 단계를 거치고, 분양신청 결과를 토대로 ‘관리처분계획’이 수립·인가되면서 구체화된다.',
  '도시 및 주거환경정비법은 사업시행자로 하여금 사업시행계획인가 고시 후 일정 기간 내 토지등소유자에게 ‘종전 토지·건축물의 명세와 가격, 분담금 추산액, 분양신청기간’ 등을 통지하고 공고하도록 정하고, 토지등소유자는 그 기간 내에 분양신청을 하도록 규정한다.',
  '다음으로 관리처분계획은 정비사업에서 사실상 “누가 무엇을 얼마에 받는지”를 결정하는 계획으로 볼 수 있다. 도시정비법은 관리처분계획에 분양설계, 분양대상자, 분양예정 대지·건축물의 추산액, 종전자산의 명세 및 가격, 조합원 분담규모 등을 포함하도록 규정하고 있다.',
]

const THUMB = {
  column: asset('assets/column-media/thumb-column.png'),
  publication: asset('assets/column-media/thumb-publication.png'),
  media: asset('assets/column-media/thumb-media.png'),
  detail: asset('assets/column-media/detail-hero.png'),
} as const

/** Mock posts — replace with API. Grouped visually by `tab`. */
export const COLUMN_MEDIA_POSTS: ColumnMediaPost[] = [
  {
    id: 'column-1',
    tab: 'column',
    title: '분양대상자',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례, 그리고 조합의 관리처분계획에 의해 꽤 정교하게 정해진다.',
    source: '출처 : 위클리한국주택경제신문(https://www.arunews.com)',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:16',
    views: 120,
    thumbnail: THUMB.column,
    detailImage: THUMB.detail,
    body: BODY_COLUMN,
  },
  {
    id: 'column-2',
    tab: 'column',
    title: '학교용지부담금',
    summary:
      '학교용지부담금은 개발사업으로 인해 학교용지 확보 또는 인근 학교의 증축 필요가 발생하는 경우 그 재원을 조달하기 위하여 개발사업자에게 부과되는 부담금을 의미한다.',
    source: '출처 : 위클리한국주택경제신문(https://www.arunews.com)',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:16',
    views: 120,
    thumbnail: THUMB.column,
    detailImage: THUMB.detail,
    body: BODY_COLUMN,
  },
  {
    id: 'column-3',
    tab: 'column',
    title: '상가 쪼개기',
    summary:
      '정비사업에서 말하는 ‘상가쪼개기’는 상가(복리시설) 1개를 여러 전유부분으로 나누거나 소유자를 인위적으로 늘려 분양권·의결권·동의자 수 등을 확대하려는 행위를 의미한다.',
    source: '출처 : 위클리한국주택경제신문(https://www.arunews.com)',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:16',
    views: 120,
    thumbnail: THUMB.column,
    detailImage: THUMB.detail,
    body: BODY_COLUMN,
  },
  {
    id: 'column-4',
    tab: 'column',
    title: '관리처분계획인가와 임차인의 사용수익 정지',
    summary:
      '재개발·재건축 같은 정비사업이 본격화되면 “조합이 인가를 받았다는데, 세입자는 언제까지 살 수 있나”, “임대인은 갱신을 거절할 수 있나”, “보상은 누가, 무엇을 해주나”가 한꺼번에 문제된다.',
    source: '출처 : 위클리한국주택경제신문(https://www.arunews.com)',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:16',
    views: 120,
    thumbnail: THUMB.column,
    detailImage: THUMB.detail,
    body: BODY_COLUMN,
  },
  {
    id: 'pub-1',
    tab: 'publication',
    title: '공익사업과 정비사업에서의 건물인도',
    summary:
      '간행물의 주요 요약 내용이 들어가거나 제작 취지 등이 3줄 정도 들어가면 좋을것 같습니다. 물론 마지막에는 말줄임표 처리되니 더 많은 내용이 들어가도 충분합니다.',
    author: '공대호, 박효영, 공성준 공저',
    publishedAt: '2026.06.29 10:16',
    views: 31,
    thumbnail: THUMB.publication,
    detailImage: THUMB.publication,
    body: BODY_COLUMN,
  },
  {
    id: 'pub-2',
    tab: 'publication',
    title: '보상수탁 이야기',
    summary:
      '간행물의 주요 요약 내용이 들어가거나 제작 취지 등이 3줄 정도 들어가면 좋을것 같습니다. 물론 마지막에는 말줄임표 처리되니 더 많은 내용이 들어가도 충분합니다.',
    author: '공대호, 박효영, 공성준 공저',
    publishedAt: '2026.06.29 10:16',
    views: 30,
    thumbnail: THUMB.publication,
    detailImage: THUMB.publication,
    body: BODY_COLUMN,
  },
  {
    id: 'media-1',
    tab: 'media',
    title:
      '[포항지진 다시묻다] 포항 지진피해, 입증 기준 완화 필요…문화관광 자산 활용 가능해',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례에 의해 정해진다.',
    source: '출처 : 아주경제',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:48',
    views: 120,
    thumbnail: THUMB.media,
    detailImage: THUMB.media,
    body: BODY_COLUMN,
  },
  {
    id: 'media-2',
    tab: 'media',
    title:
      '[포항지진 다시묻다] 포항 지진피해, 입증 기준 완화 필요…문화관광 자산 활용 가능해',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례에 의해 정해진다.',
    source: '출처 : 아주경제',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:48',
    views: 118,
    thumbnail: THUMB.media,
    detailImage: THUMB.media,
    body: BODY_COLUMN,
  },
  {
    id: 'media-3',
    tab: 'media',
    title:
      '[포항지진 다시묻다] 포항 지진피해, 입증 기준 완화 필요…문화관광 자산 활용 가능해',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례에 의해 정해진다.',
    source: '출처 : 아주경제',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:48',
    views: 110,
    thumbnail: THUMB.media,
    detailImage: THUMB.media,
    body: BODY_COLUMN,
  },
  {
    id: 'media-4',
    tab: 'media',
    title:
      '[포항지진 다시묻다] 포항 지진피해, 입증 기준 완화 필요…문화관광 자산 활용 가능해',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례에 의해 정해진다.',
    source: '출처 : 아주경제',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:48',
    views: 105,
    thumbnail: THUMB.media,
    detailImage: THUMB.media,
    body: BODY_COLUMN,
  },
  {
    id: 'media-5',
    tab: 'media',
    title:
      '[포항지진 다시묻다] 포항 지진피해, 입증 기준 완화 필요…문화관광 자산 활용 가능해',
    summary:
      '재개발·재건축을 다룬 뉴스나 주변 대화에서 “조합원이면 아파트 한 채는 당연히 받는다”는 말이 자주 나오지만, 실제 정비사업에서 공동주택을 ‘분양받을 수 있는 사람(분양대상자)’이 누구인지는 법령·시행령·지자체 조례에 의해 정해진다.',
    source: '출처 : 아주경제',
    author: '공대호 변호사',
    publishedAt: '2026.06.29 10:48',
    views: 98,
    thumbnail: THUMB.media,
    detailImage: THUMB.media,
    body: BODY_COLUMN,
  },
]

export function isColumnMediaTab(value: string | undefined): value is ColumnMediaTab {
  return value === 'column' || value === 'publication' || value === 'media'
}

export function postsByTab(tab: ColumnMediaTab): ColumnMediaPost[] {
  return COLUMN_MEDIA_POSTS.filter((p) => p.tab === tab)
}

export function findPost(tab: ColumnMediaTab, postId: string): ColumnMediaPost | undefined {
  return COLUMN_MEDIA_POSTS.find((p) => p.tab === tab && p.id === postId)
}

/** Adjacent posts within the same tab (list order). For CMS, prefer API adjacent. */
export function adjacentPosts(
  tab: ColumnMediaTab,
  postId: string,
): { prev?: ColumnMediaPost; next?: ColumnMediaPost } {
  const list = postsByTab(tab)
  const index = list.findIndex((p) => p.id === postId)
  if (index < 0) return {}
  return {
    // Figma labels: 다음 = newer/previous in list (index-1), 이전 = older (index+1)
    next: index > 0 ? list[index - 1] : undefined,
    prev: index < list.length - 1 ? list[index + 1] : undefined,
  }
}

export function tabListPath(tab: ColumnMediaTab): string {
  return `${COLUMN_MEDIA_PAGE.basePath}/${tab}`
}

export function postDetailPath(tab: string, postId: string): string {
  return `${COLUMN_MEDIA_PAGE.basePath}/${tab}/${postId}`
}
