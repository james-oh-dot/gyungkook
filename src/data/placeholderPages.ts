/**
 * Stub subpages — routes exist so GNB can navigate before real content ships.
 * Default sub visual = sub-01-01; Menu-1 stubs that already have dedicated
 * photos (연혁수상인증 / 오시는길) override via `visual` / `visualPreview`.
 */

import { progressiveAsset } from '../utils/progressiveImage'

const PLACEHOLDER_VISUAL = progressiveAsset('assets/sub/sub-01-01')
const HISTORY_VISUAL = progressiveAsset('assets/sub/sub-01-05')
const LOCATION_VISUAL = progressiveAsset('assets/sub/sub-01-06')

export type PlaceholderPageDef = {
  /** SPA path (leading slash, no base) */
  path: string
  parentLabel: string
  title: string
  /** Figma hero_type2 pages omit the parent chip */
  showChip: boolean
  /** Progressive full WebP (defaults to shared sub-01-01) */
  visual?: string
  /** Progressive preview WebP */
  visualPreview?: string
  /** SubVisual `visualKey` / debug label */
  visualKey?: string
}

export const PLACEHOLDER_VISUAL_SRC = PLACEHOLDER_VISUAL.src
export const PLACEHOLDER_VISUAL_PREVIEW = PLACEHOLDER_VISUAL.preview

/**
 * All menu items that do not yet have a real page implementation.
 * Keys match `NavSubItem.id` in `nav.ts`.
 */
export const PLACEHOLDER_PAGES: Record<string, PlaceholderPageDef> = {
  'about-history': {
    path: '/about/history',
    parentLabel: '법무법인경국',
    title: '연혁수상인증',
    showChip: true,
    visual: HISTORY_VISUAL.src,
    visualPreview: HISTORY_VISUAL.preview,
    visualKey: 'sub-01-05',
  },
  'about-location': {
    path: '/about/location',
    parentLabel: '법무법인경국',
    title: '오시는길',
    showChip: true,
    visual: LOCATION_VISUAL.src,
    visualPreview: LOCATION_VISUAL.preview,
    visualKey: 'sub-01-06',
  },
  'other-misc': {
    path: '/other/misc',
    parentLabel: '기타업무',
    title: '기타업무',
    showChip: true,
  },
  'other-realestate': {
    path: '/other/realestate',
    parentLabel: '기타업무',
    title: '부동산',
    showChip: true,
  },
  'news-notice': {
    path: '/news/notice',
    parentLabel: '소식 · 공지',
    title: '소식공지',
    showChip: true,
  },
  'news-cases': {
    path: '/news/cases',
    parentLabel: '소식 · 공지',
    title: '판례뉴스',
    showChip: true,
  },
  'news-careers': {
    path: '/news/careers',
    parentLabel: '소식 · 공지',
    title: '인재영입',
    showChip: true,
  },
  /* news-consult 는 실페이지(ConsultPage)로 대체되어 placeholder 불필요 */
}

export const PLACEHOLDER_PAGE_LIST = Object.values(PLACEHOLDER_PAGES)
