/**
 * ============================================================================
 * 업무사례 (활동·보도 > 업무사례 / Figma sub-04-01)
 * ============================================================================
 *
 * Frames:
 * - SUB_활동보도_업무사례_{DESKTOP|TABLET|MOBILE}
 * - Hover: 닿은 아이템만 하이라이트, 나머지 딤드
 *
 * Backend notes:
 * - Replace CASE_STUDIES with CMS/API list (category / result / detail).
 * - Cards are display-only for now; wire detail routes when the board detail
 *   for 업무사례 is designed (can reuse `PostDetail` if content matches).
 */

import { asset } from '../utils/asset'

export const CASE_STUDIES_PAGE = {
  parentLabel: '활동 · 보도',
  title: '업무사례',
  /** Figma layer sub-04-01 — also GNB fullmenu visual for press-cases */
  visual: asset('assets/sub/sub-04-01.jpg'),
  basePath: '/press/cases',
} as const

export type CaseStudy = {
  id: string
  /** e.g. 재개발 · 재건축 */
  category: string
  /** e.g. 피고 방어 성공 */
  result: string
  /** e.g. 4천만원청구 전부 인용 */
  detail: string
}

const SAMPLE: Omit<CaseStudy, 'id'> = {
  category: '재개발 · 재건축',
  result: '피고 방어 성공',
  detail: '4천만원청구 전부 인용',
}

/** Mock grid — 24 cells (6×4 desktop). Swap for API. */
export const CASE_STUDIES: CaseStudy[] = Array.from({ length: 24 }, (_, i) => {
  const variants: Omit<CaseStudy, 'id'>[] = [
    SAMPLE,
    {
      category: '재개발 · 재건축',
      result: '관리처분계획 인가',
      detail: '조합원 분담금 분쟁 승소',
    },
    {
      category: '공익사업 · 보상',
      result: '손실보상금 증액',
      detail: '수용재결 불복 인용',
    },
    {
      category: '기타 · 민사',
      result: '유류분반환 방어',
      detail: '청구금액 대폭 감축',
    },
  ]
  const v = variants[i % variants.length]
  return { id: `case-${i + 1}`, ...v }
})
