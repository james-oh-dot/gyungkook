/**
 * ============================================================================
 * 법무법인 경국 > 변호사자문단 (sub-01-03) — content
 * ============================================================================
 *
 * Figma frames: `SUB_법무법인경국_변호사자문단_공대호` (89:2963) + _TABLET / _MOBILE.
 * Route-mode local tabs: each tab is a different lawyer's profile page
 * (`/about/lawyers/:lawyerId`). Only 공대호 has full content from Figma; the
 * others are placeholders until their designs arrive.
 *
 * ⚠️ Still pending: 박효영/공성준/신지호 profile content + all three portraits
 * reuse home-page profile stock photos. 공대호's certificate/appointment/award
 * images (13 items) render as captioned placeholder frames — real exports not
 * yet provided. The sub-01-03 hero and 공대호's portrait are real photos
 * (provided directly by the user, figma.com exports remain egress-blocked).
 */

import { progressiveAsset } from '../utils/progressiveImage'
import { asset } from '../utils/asset'

const LAWYERS_VISUAL = progressiveAsset('assets/sub/sub-01-03')
const GONGDAEHO_PHOTO = progressiveAsset('assets/lawyers/gongdaeho')

export const LAWYERS_PAGE = {
  parentLabel: '법무법인경국',
  title: '변호사자문단',
  /** Figma sub-01-03 — progressive WebP pair */
  visual: LAWYERS_VISUAL.src,
  visualPreview: LAWYERS_VISUAL.preview,
  basePath: '/about/lawyers',
} as const

/** Captioned image tile (certificate / appointment / award). */
export type CertItem = {
  label: string
  /** Optional real image; falls back to a captioned placeholder frame. */
  image?: string
}

export type Lawyer = {
  id: string
  /** Local-tab label, e.g. 공대호변호사 */
  tabLabel: string
  name: string
  title: string
  phone?: string
  fax?: string
  email?: string
  /** Hero description lines under the contact row */
  intro: string[]
  /** Hero portrait (full-quality WebP) */
  photo: string
  /** Tiny blur-up preview for `photo`; omitted for stock placeholder photos */
  photoPreview?: string
  practiceAreas: string[]
  specialties: string[]
  education: string[]
  /** Two balanced columns of 경력 · 활동 bullets */
  careers: string[][]
  books: string[]
  lectures: string[]
  renewalResults: string[]
  publicResults: string[]
  certificates: CertItem[]
  appointments: CertItem[]
  awards: CertItem[]
}

const GONG_DAEHO: Lawyer = {
  id: 'gongdaeho',
  tabLabel: '공대호변호사',
  name: '공대호',
  title: '변호사',
  phone: 'T.02-598-0350',
  fax: 'F.02-598-0370',
  email: 'E.ceo@gyunggook.com',
  intro: [
    'LH 정비사업 자문위원',
    '감정평가사 자격보유, 법원감정인 경력',
    '대한변호사협회 재개발·재건축, 행정전문변호사',
    '대한법률봉사회 회장',
  ],
  photo: GONGDAEHO_PHOTO.src,
  photoPreview: GONGDAEHO_PHOTO.preview,
  practiceAreas: [
    '재개발·재건축',
    '행정',
    '부동산',
    '수용보상',
    '상속',
    '기업법무 (스타트업)',
  ],
  specialties: [
    '대한변호사협회 재개발·재건축 전문변호사',
    '대한변호사협회 행정법 전문변호사',
  ],
  education: ['포항고등학교', '서울시립대학교 도시행정학'],
  careers: [
    [
      '감정평가사(19기)',
      '서울중앙지방법원 경매감정인',
      '동인감정평가법인 감정평가사',
      '전) 법무법인 영진',
      '전) 한국감정원 공적평가처',
      '전) 대화감정평가법인',
      '전) 삼일감정평가사학원 감정평가 실무전임 강사',
      '하우패스 감정평가및보상법규 교수',
      '대한변협 북한이탈주민지원 소위원회 간사',
      'SBS궁금한이야기, KBS제보자들 다수 출연',
    ],
    [
      '대한중앙의료봉사회 자문',
      '한국청소년육성회 법률자문',
      '서울시-서울지방변호사회 인권지킴이단 변호사',
      '대한변호사협회 북한인권특별위원회 위원',
      '서울시 표창',
      '서울 관악경찰서상 감사장',
      '대한법률봉사회 회장',
      'LH 토지주택공사 자문',
      '대한변호사협회 재개발재건축, 행정 전문변호사',
    ],
  ],
  books: [
    '정석 감정평가 실무',
    '매일하는 감정평가실무',
    'PLUS 감정평가 및 보상법규',
    '보상수탁이야기',
    '공익사업과 정비사업에서의 건물인도',
  ],
  lectures: [
    '하우패스 감정평가 및 보상법규 전임교수',
    '농어촌공사 농지은행사업 전문가 양성교육 강의(국토계획법, 부동산 기초이론)',
    '한국주택정비사업조합협회 감정평가를 둘러싼 분쟁과 소송사례 강의',
  ],
  renewalResults: [
    '서울 잠실5단지아파트 주택재건축정비사업',
    '서울 방배6구역 주택재건축정비사업',
    '서울 용답동주택재개발사업',
    '서울 개봉5구역 주택재건축정비사업',
    '서울 세운6-2-24구역도시환경정비사업',
    '서울 도곡동547-1일원 가로주택정비사업',
    '서울 역삼목화연립가로주택정비사업',
    '용인8구역재개발정비사업',
    '인천 용현3구역가로주택정비사업',
    '대전 선화재정비촉진구역주택재개발정비사업',
    '인천 숭의3구역주택재개발정비사업',
    '울산B-04구역재개발정비사업',
    '부산 부전역소규모재개발사업',
  ],
  publicResults: [
    '서울 신길5동지역주택사업',
    '광명시흥 공공주택지구 사업',
    '이지 일반산업단지',
    '이천-오산간 고속도로사업',
    '대성 유성 복합터미널 조성사업',
    '아산탕정일반산업단지 조성사업',
    '대구국가산업단지조성사업',
    '창원 오창지구',
    '부천 역곡지구',
    '경산 지식산업단지개발사업',
    '창원 안골일반산업단지 조성사업',
    '화성동탄2 택지개발사업',
    '창원 대상공원사업',
  ],
  certificates: [
    { label: '재개발·재건축' },
    { label: '행정법' },
  ],
  appointments: [
    { label: 'LH 정비사업 자문위원' },
    { label: '서울시 인권지킴이단 변호사' },
    { label: '대한중앙의료봉사회 자문위원' },
    { label: '한국청소년육성회 법률자문위촉' },
    { label: '북한인권 특별위원회 위원' },
    { label: '법무부 마을 변호사' },
    { label: '서울시사회복지협의회봉사단' },
    { label: '대한법률봉사회회장' },
  ],
  awards: [
    { label: '서울시 인권지킴이단' },
    { label: '서울관악경찰서장 표창' },
    { label: '2025 한국브랜드만족지수 1위' },
  ],
}

/** Placeholder lawyers — tabs route here but content is pending design. */
function placeholderLawyer(
  id: string,
  name: string,
  photo: string,
): Lawyer {
  return {
    id,
    tabLabel: `${name}변호사`,
    name,
    title: '변호사',
    intro: ['프로필 준비 중입니다.'],
    photo,
    practiceAreas: [],
    specialties: [],
    education: [],
    careers: [[], []],
    books: [],
    lectures: [],
    renewalResults: [],
    publicResults: [],
    certificates: [],
    appointments: [],
    awards: [],
  }
}

export const LAWYERS: Lawyer[] = [
  GONG_DAEHO,
  placeholderLawyer('parkhyoyoung', '박효영', asset('assets/profile2.png')),
  placeholderLawyer('gongseongjun', '공성준', asset('assets/profile3.png')),
  placeholderLawyer('sinjiho', '신지호', asset('assets/profile4.png')),
]

export const DEFAULT_LAWYER_ID = LAWYERS[0]!.id

export function findLawyer(id: string | undefined): Lawyer | undefined {
  return LAWYERS.find((l) => l.id === id)
}

export function lawyerPath(id: string): string {
  return `${LAWYERS_PAGE.basePath}/${id}`
}

/** prev/next lawyer (wraps) for the arrow buttons. */
export function adjacentLawyers(id: string): { prev: Lawyer; next: Lawyer } {
  const i = LAWYERS.findIndex((l) => l.id === id)
  const total = LAWYERS.length
  return {
    prev: LAWYERS[(i - 1 + total) % total]!,
    next: LAWYERS[(i + 1) % total]!,
  }
}
