/**
 * ============================================================================
 * 소식 · 공지 > 상담신청 (sub-05-01) — 상담문의 페이지
 * ============================================================================
 *
 * Figma: SUB_소식공지_상담문의_DESKTOP (node 100:723), 콘텐츠 100:813.
 * 2단 구성: (좌) eyebrow + 타이틀 / (우) 리드 문구 + 카드(무료 법률 상담 연락처
 * + SNS 상담문의 다크 버튼). 서브비주얼은 소식·공지 공통 sub-05-01.
 */

import { progressiveAsset } from '../utils/progressiveImage'

const VISUAL = progressiveAsset('assets/sub/sub-05-01')

export const CONSULT_PAGE = {
  parentLabel: '소식 · 공지',
  title: '상담신청',
  visual: VISUAL.src,
  visualPreview: VISUAL.preview,
  basePath: '/news/consult',
} as const

/** 좌측 — eyebrow + 2줄 헤딩 (Figma 100:815). */
export const CONSULT_INTRO = {
  eyebrow: 'Request for consultation',
  heading: ['가장 편리한 방법으로', '상담을 신청해 주세요'],
  lead: [
    '1차적인 전화상담은 무료이며,',
    '전화로 간단히 사안을 말씀주시고',
    '필요한 경우 내방 예약을 잡아주시기 바랍니다.',
  ],
} as const

/** 무료 법률 상담 — 연락처 (Figma 100:826). */
export const CONSULT_CONTACT = {
  label: '무료 법률 상담',
  phone: '무료법률상담',
  email: 'psh@gyunggook.com',
} as const

/**
 * SNS 상담문의 — 다크 CTA 버튼 (Figma 100:843).
 * `href`는 실제 네이버/카카오 예약 링크로 교체 예정(플레이스홀더 '#').
 */
export const CONSULT_SNS = {
  label: 'SNS 상담문의',
  links: [
    { id: 'naver', text: '네이버 방문예약 바로 신청', icon: 'icon-naver.svg', href: '#' },
    { id: 'kakao', text: '카카오 방문예약 바로 신청', icon: 'icon-kakao.svg', href: '#' },
  ],
} as const
