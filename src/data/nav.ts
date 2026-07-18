import { COLUMN_MEDIA_PAGE } from './columnMedia'
import { asset } from '../utils/asset'

export type NavSubItem = {
  id: string
  label: string
  /**
   * Nav target:
   * - `#section` → home section (resolved via `resolveNavHref`)
   * - `/path` → SPA route (no base prefix; React Router + GH Pages)
   */
  href: string
  /** Fullmenu / drawer sub-visual — per-page asset when available */
  visual: string
}

export type NavItem = {
  id: string
  label: string
  href: string
  children: NavSubItem[]
}

/** Shared placeholder until per-page sub-visuals are wired. */
export const GNB_SUB_VISUAL_PLACEHOLDER = asset('assets/gnb-sub-visual.png')

/** Figma sub-04-03 — 활동·보도 > 컬럼미디어 */
export const GNB_SUB_VISUAL_PRESS_COLUMN = COLUMN_MEDIA_PAGE.visual

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'about',
    label: '법무법인경국',
    href: '#about',
    children: [
      { id: 'about-intro', label: '법인소개', href: '#about', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'about-greeting', label: '대표인사말', href: '#about', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'about-lawyers', label: '변호사자문단', href: '#professionals', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'about-gallery', label: '경국인갤러리', href: '#professionals', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'about-history', label: '연혁수상인증', href: '#awards', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'about-location', label: '오시는길', href: '#office', visual: GNB_SUB_VISUAL_PLACEHOLDER },
    ],
  },
  {
    id: 'redev',
    label: '재개발 · 보상업무',
    href: '#practice',
    children: [
      { id: 'redev-renewal', label: '정비사업', href: '#practice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'redev-public', label: '공익사업', href: '#practice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
    ],
  },
  {
    id: 'other',
    label: '기타업무',
    href: '#practice',
    children: [
      { id: 'other-misc', label: '기타업무', href: '#practice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'other-realestate', label: '부동산', href: '#practice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
    ],
  },
  {
    id: 'press',
    label: '활동 · 보도',
    href: '#press',
    children: [
      { id: 'press-cases', label: '업무사례', href: '#achievements', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'press-media', label: '언론보도', href: '#press', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      {
        id: 'press-column',
        label: '컬럼미디어',
        href: '/press/column-media/column',
        visual: GNB_SUB_VISUAL_PRESS_COLUMN,
      },
      { id: 'press-social', label: '사회공헌', href: '#social', visual: GNB_SUB_VISUAL_PLACEHOLDER },
    ],
  },
  {
    id: 'news',
    label: '소식 · 공지',
    href: '#notice',
    children: [
      { id: 'news-notice', label: '소식공지', href: '#notice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'news-cases', label: '판례뉴스', href: '#notice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'news-careers', label: '인재영입', href: '#notice', visual: GNB_SUB_VISUAL_PLACEHOLDER },
      { id: 'news-consult', label: '상담신청', href: '#office', visual: GNB_SUB_VISUAL_PLACEHOLDER },
    ],
  },
]
