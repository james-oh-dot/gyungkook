/**
 * 법무법인 경국 > 변호사 · 자문단 — 자문단 directory cards + drawer content.
 * No SPA routes — open as an in-page drawer / mobile bottom sheet.
 *
 * Portrait filenames (upload here, then run progressive pipeline):
 *   public/assets/advisors/{id}.jpg
 *   → generates {id}.webp + {id}.preview.webp
 */

import { progressiveAsset } from '../utils/progressiveImage'

export type Advisor = {
  id: string
  name: string
  title: string
  /** Card + drawer highlight lines */
  highlights: string[]
  photo: string
  photoPreview: string
}

const photo = (id: string) => progressiveAsset(`assets/advisors/${id}`)

/** Shared Figma placeholder bio until per-advisor copy lands. */
const PLACEHOLDER_HIGHLIGHTS = [
  'LH 정비사업 자문위원',
  '감정평가사 자격보유, 법원감정인 경력',
  '대한변호사협회 재개발·재건축, 행정전문변호사',
  '대한법률봉사회 회장',
] as const

function advisor(
  id: string,
  name: string,
  title: string,
  highlights: readonly string[] = PLACEHOLDER_HIGHLIGHTS,
): Advisor {
  const p = photo(id)
  return {
    id,
    name,
    title,
    highlights: [...highlights],
    photo: p.src,
    photoPreview: p.preview,
  }
}

/** Figma order (105:1310) — 이석우 / 윤규희 / 정현 / 조아라 / 백진기 */
export const ADVISORS: Advisor[] = [
  advisor('leeseokwoo', '이석우', '전문위원'),
  advisor('yoonkyuhee', '윤규희', '전문위원'),
  advisor('junghyun', '정현', '세무사'),
  advisor('joara', '조아라', '노무사'),
  advisor('baekjinki', '백진기', '법무사'),
]

export function findAdvisor(id: string | undefined): Advisor | undefined {
  return ADVISORS.find((a) => a.id === id)
}
