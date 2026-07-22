import { ABOUT_INTRO_PAGE } from './aboutIntro'
import { CASE_STUDIES_PAGE } from './caseStudies'
import { COLUMN_MEDIA_PAGE } from './columnMedia'
import { GALLERY_PAGE } from './gallery'
import { GREETING_PAGE } from './greeting'
import { LAWYERS_PAGE } from './lawyers'
import { NEWS_NOTICE_PAGE } from './newsNotice'
import {
  PLACEHOLDER_PAGES,
  PLACEHOLDER_VISUAL_SRC,
} from './placeholderPages'
import { PRESS_COVERAGE_PAGE } from './pressCoverage'
import { PUBLIC_PROJECT_PAGE } from './publicProject'
import { RENEWAL_PAGE } from './renewal'
import { SOCIAL_CONTRIBUTION_PAGE } from './socialContribution'

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

/** Shared placeholder until per-page sub-visuals are wired (sub-01-01). */
export const GNB_SUB_VISUAL_PLACEHOLDER = PLACEHOLDER_VISUAL_SRC

/** Figma sub-01-01 — 법무법인경국 > 법인소개 */
export const GNB_SUB_VISUAL_ABOUT_INTRO = ABOUT_INTRO_PAGE.visual

/** Figma sub-01-02 — 법무법인경국 > 대표인사말 */
export const GNB_SUB_VISUAL_ABOUT_GREETING = GREETING_PAGE.visual

/** Figma sub-01-03 — 법무법인경국 > 변호사자문단 */
export const GNB_SUB_VISUAL_ABOUT_LAWYERS = LAWYERS_PAGE.visual

/** Figma sub-01-04 — 법무법인경국 > 경국인갤러리 */
export const GNB_SUB_VISUAL_ABOUT_GALLERY = GALLERY_PAGE.visual

/** Figma sub-01-05 — 법무법인경국 > 연혁수상인증 */
export const GNB_SUB_VISUAL_ABOUT_HISTORY =
  PLACEHOLDER_PAGES['about-history'].visual ?? PLACEHOLDER_VISUAL_SRC

/** Figma sub-01-06 — 법무법인경국 > 오시는길 */
export const GNB_SUB_VISUAL_ABOUT_LOCATION =
  PLACEHOLDER_PAGES['about-location'].visual ?? PLACEHOLDER_VISUAL_SRC

/** Figma sub-02-01 — 재개발·보상업무 > 정비사업 */
export const GNB_SUB_VISUAL_RENEWAL = RENEWAL_PAGE.visual

/** Figma sub-02-02 — 재개발·보상업무 > 공익사업 */
export const GNB_SUB_VISUAL_PUBLIC = PUBLIC_PROJECT_PAGE.visual

/** Figma sub-04-01 — 활동·보도 > 업무사례 */
export const GNB_SUB_VISUAL_PRESS_CASES = CASE_STUDIES_PAGE.visual

/** Figma sub-04-02 — 활동·보도 > 언론보도 */
export const GNB_SUB_VISUAL_PRESS_MEDIA = PRESS_COVERAGE_PAGE.visual

/** Figma sub-04-03 — 활동·보도 > 컬럼미디어 */
export const GNB_SUB_VISUAL_PRESS_COLUMN = COLUMN_MEDIA_PAGE.visual

/** Figma sub-04-04 — 활동·보도 > 사회공헌 */
export const GNB_SUB_VISUAL_PRESS_SOCIAL = SOCIAL_CONTRIBUTION_PAGE.visual

/** Figma sub-05-01 — 소식·공지 (one visual for the whole section) */
export const GNB_SUB_VISUAL_NEWS = NEWS_NOTICE_PAGE.visual

/**
 * Match the current SPA pathname to a drawer parent + sub item.
 * Home (`/`) → null (all accordion sections stay collapsed).
 * Subpages → longest matching SPA child href (incl. local-tab siblings
 * like `/press/coverage/tv` ↔ `/press/coverage/newspaper`).
 */
export function findActiveDrawerNav(
  pathname: string,
): { parentId: string; subId: string } | null {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return null

  let best: { parentId: string; subId: string; score: number } | null = null

  for (const item of NAV_ITEMS) {
    for (const sub of item.children) {
      if (!sub.href.startsWith('/')) continue
      const score = navHrefMatchScore(path, sub.href)
      if (score <= 0) continue
      if (!best || score > best.score) {
        best = { parentId: item.id, subId: sub.id, score }
      }
    }
  }

  return best ? { parentId: best.parentId, subId: best.subId } : null
}

function navHrefMatchScore(pathname: string, href: string): number {
  const target = href.replace(/\/+$/, '') || '/'
  if (pathname === target) return 10_000 + target.length
  if (pathname.startsWith(`${target}/`)) return 5_000 + target.length
  /* Local tabs under the same section prefix (drop last segment). */
  const parent = target.replace(/\/[^/]+$/, '')
  if (parent.length > 1 && (pathname === parent || pathname.startsWith(`${parent}/`))) {
    return parent.length
  }
  return 0
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'about',
    label: '법무법인경국',
    href: '/about/intro',
    children: [
      {
        id: 'about-intro',
        label: '법인소개',
        href: '/about/intro',
        visual: GNB_SUB_VISUAL_ABOUT_INTRO,
      },
      {
        id: 'about-greeting',
        label: '대표인사말',
        href: '/about/greeting',
        visual: GNB_SUB_VISUAL_ABOUT_GREETING,
      },
      {
        id: 'about-lawyers',
        label: '변호사자문단',
        href: '/about/lawyers',
        visual: GNB_SUB_VISUAL_ABOUT_LAWYERS,
      },
      {
        id: 'about-gallery',
        label: '경국인갤러리',
        href: '/about/gallery',
        visual: GNB_SUB_VISUAL_ABOUT_GALLERY,
      },
      {
        id: 'about-history',
        label: '연혁수상인증',
        href: '/about/history',
        visual: GNB_SUB_VISUAL_ABOUT_HISTORY,
      },
      {
        id: 'about-location',
        label: '오시는길',
        href: '/about/location',
        visual: GNB_SUB_VISUAL_ABOUT_LOCATION,
      },
    ],
  },
  {
    id: 'redev',
    label: '재개발 · 보상업무',
    href: '/practice/renewal',
    children: [
      {
        id: 'redev-renewal',
        label: '정비사업',
        href: '/practice/renewal',
        visual: GNB_SUB_VISUAL_RENEWAL,
      },
      {
        id: 'redev-public',
        label: '공익사업',
        href: '/practice/public',
        visual: GNB_SUB_VISUAL_PUBLIC,
      },
    ],
  },
  {
    id: 'other',
    label: '기타업무',
    href: '/other/misc',
    children: [
      {
        id: 'other-misc',
        label: '기타업무',
        href: '/other/misc',
        visual: GNB_SUB_VISUAL_PLACEHOLDER,
      },
      {
        id: 'other-realestate',
        label: '부동산',
        href: '/other/realestate',
        visual: GNB_SUB_VISUAL_PLACEHOLDER,
      },
    ],
  },
  {
    id: 'press',
    label: '활동 · 보도',
    href: '/press/cases',
    children: [
      {
        id: 'press-cases',
        label: '업무사례',
        href: '/press/cases',
        visual: GNB_SUB_VISUAL_PRESS_CASES,
      },
      {
        id: 'press-media',
        label: '언론보도',
        href: '/press/coverage/tv',
        visual: GNB_SUB_VISUAL_PRESS_MEDIA,
      },
      {
        id: 'press-column',
        label: '컬럼미디어',
        href: '/press/column-media/column',
        visual: GNB_SUB_VISUAL_PRESS_COLUMN,
      },
      {
        id: 'press-social',
        label: '사회공헌',
        href: '/press/social',
        visual: GNB_SUB_VISUAL_PRESS_SOCIAL,
      },
    ],
  },
  {
    id: 'news',
    label: '소식 · 공지',
    href: '/news/notice',
    children: [
      {
        id: 'news-notice',
        label: '소식공지',
        href: '/news/notice',
        visual: GNB_SUB_VISUAL_NEWS,
      },
      {
        id: 'news-cases',
        label: '판례뉴스',
        href: '/news/cases',
        visual: GNB_SUB_VISUAL_NEWS,
      },
      {
        id: 'news-careers',
        label: '인재영입',
        href: '/news/careers',
        visual: GNB_SUB_VISUAL_NEWS,
      },
      {
        id: 'news-consult',
        label: '상담신청',
        href: '/news/consult',
        visual: GNB_SUB_VISUAL_NEWS,
      },
    ],
  },
]
