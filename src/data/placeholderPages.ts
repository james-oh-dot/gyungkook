/**
 * Stub subpages — routes exist so GNB can navigate before real content ships.
 * Sub visual temporarily uses sub-01-01 (1번 비주얼) for every stub.
 */

import { progressiveAsset } from '../utils/progressiveImage'

const PLACEHOLDER_VISUAL = progressiveAsset('assets/sub/sub-01-01')

export type PlaceholderPageDef = {
  /** SPA path (leading slash, no base) */
  path: string
  parentLabel: string
  title: string
  /** Figma hero_type2 pages omit the parent chip */
  showChip: boolean
}

export const PLACEHOLDER_VISUAL_SRC = PLACEHOLDER_VISUAL.src
export const PLACEHOLDER_VISUAL_PREVIEW = PLACEHOLDER_VISUAL.preview

/**
 * All menu items that do not yet have a real page implementation.
 * Keys match `NavSubItem.id` in `nav.ts`.
 */
export const PLACEHOLDER_PAGES: Record<string, PlaceholderPageDef> = {
  'about-greeting': {
    path: '/about/greeting',
    parentLabel: '법무법인경국',
    title: '대표인사말',
    showChip: false,
  },
  'about-lawyers': {
    path: '/about/lawyers',
    parentLabel: '법무법인경국',
    title: '변호사자문단',
    showChip: false,
  },
  'about-gallery': {
    path: '/about/gallery',
    parentLabel: '법무법인경국',
    title: '경국인갤러리',
    showChip: false,
  },
  'about-history': {
    path: '/about/history',
    parentLabel: '법무법인경국',
    title: '연혁수상인증',
    showChip: false,
  },
  'about-location': {
    path: '/about/location',
    parentLabel: '법무법인경국',
    title: '오시는길',
    showChip: false,
  },
  'redev-public': {
    path: '/practice/public',
    parentLabel: '재개발 · 보상업무',
    title: '공익사업',
    showChip: false,
  },
  'other-misc': {
    path: '/other/misc',
    parentLabel: '기타업무',
    title: '기타업무',
    showChip: false,
  },
  'other-realestate': {
    path: '/other/realestate',
    parentLabel: '기타업무',
    title: '부동산',
    showChip: false,
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
  'news-consult': {
    path: '/news/consult',
    parentLabel: '소식 · 공지',
    title: '상담신청',
    showChip: true,
  },
}

export const PLACEHOLDER_PAGE_LIST = Object.values(PLACEHOLDER_PAGES)
