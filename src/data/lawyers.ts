/**
 * ============================================================================
 * 법무법인 경국 > 변호사 · 자문단 (sub-01-03) — content
 * ============================================================================
 *
 * Entry directory: Figma `SUB_법무법인경국_변호사자문단` (105:1229) →
 * `/about/lawyers` (변호사단 cards + 자문단 cards).
 * Profile detail: `SUB_…_공대호` (89:2963) + tablet/mobile →
 * `/about/lawyers/:lawyerId` (route-mode local tabs).
 *
 * Directory card portraits (`*-card`) + profile hero portraits (no `-card`):
 *   public/assets/lawyers/{id}-card.jpg  — directory cards (3×)
 *   public/assets/lawyers/{id}.png       — profile hero / sub-visual (3×)
 *   public/assets/lawyers/gongdaeho.png  — 공대호 hero cutout (kept)
 *   public/assets/lawyers/arrow-default.svg + arrow-hover.svg — shared card arrows
 *   (upload typo `parkhyuyoung` is normalized to route id `parkhyoyoung`)
 *
 *
 * 공대호's 11 of 13 certificate/appointment/award images (2026-07-21) were
 * extracted directly from the Figma node tree via `get_screenshot`
 * (`enableBase64Response`) — MCP tool traffic isn't subject to this session's
 * curl/egress block on figma.com, unlike `download_assets`' short-lived URLs.
 * See node IDs 89:3357/3360 (인증서), 89:3374/3377/3380/3384/3387/3390 (위촉),
 * 89:3411/3414/3417 (수상) in file `iijQYSn6QBUMArHdBUSqKr`. The remaining 2
 * appointments (서울시사회복지협의회봉사단 / 대한법률봉사회회장) reuse OTHER
 * items' images in the Figma source itself (identical asset refs — designer
 * placeholder, not a real cert scan) — left as captioned placeholder frames
 * on purpose; do not wire a duplicate/wrong image to them.
 */

import { progressiveAsset } from '../utils/progressiveImage'

const LAWYERS_VISUAL = progressiveAsset('assets/sub/sub-01-03')
const GONGDAEHO_PHOTO = progressiveAsset('assets/lawyers/gongdaeho')

/** 공대호 인증서/위촉/수상 real photos (Figma node screenshots). */
const cert = (stem: string) => progressiveAsset(`assets/lawyers/${stem}`).src

export const LAWYERS_PAGE = {
  parentLabel: '법무법인경국',
  /** GNB label + SubVisual title — middle-dot form matches Figma 105:1229 */
  title: '변호사 · 자문단',
  /** Figma sub-01-03 — progressive WebP pair (GNB hover visual) */
  visual: LAWYERS_VISUAL.src,
  visualPreview: LAWYERS_VISUAL.preview,
  basePath: '/about/lawyers',
} as const

const GONGDAEHO_CARD = progressiveAsset('assets/lawyers/gongdaeho-card')
const PARKHYOYOUNG_CARD = progressiveAsset('assets/lawyers/parkhyoyoung-card')
const GONGSEONGJUN_CARD = progressiveAsset('assets/lawyers/gongseongjun-card')
const SINJIHO_CARD = progressiveAsset('assets/lawyers/sinjiho-card')
/** Profile hero / lawyer-page portrait (no `-card`) */
const PARKHYOYOUNG_PHOTO = progressiveAsset('assets/lawyers/parkhyoyoung')
const GONGSEONGJUN_PHOTO = progressiveAsset('assets/lawyers/gongseongjun')
const SINJIHO_PHOTO = progressiveAsset('assets/lawyers/sinjiho')

/** Directory-card highlight lines (Figma 105:1229 Achievement Cards). */
export type LawyerCard = {
  id: string
  name: string
  title: string
  highlights: string[]
  photo: string
  photoPreview?: string
  /** SPA profile route — all 변호사단 cards navigate here */
  href: string
}

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
    { label: '재개발·재건축', image: cert('gongdaeho-cert-redevelopment') },
    { label: '행정법', image: cert('gongdaeho-cert-admin') },
  ],
  appointments: [
    { label: 'LH 정비사업 자문위원', image: cert('gongdaeho-apt-lh') },
    { label: '서울시 인권지킴이단 변호사', image: cert('gongdaeho-apt-seoul-human-rights') },
    { label: '대한중앙의료봉사회 자문위원', image: cert('gongdaeho-apt-medical-volunteer') },
    { label: '한국청소년육성회 법률자문위촉', image: cert('gongdaeho-apt-youth-legal') },
    { label: '북한인권 특별위원회 위원', image: cert('gongdaeho-apt-nk-human-rights') },
    { label: '법무부 마을 변호사', image: cert('gongdaeho-apt-village-lawyer') },
    { label: '서울시사회복지협의회봉사단' },
    { label: '대한법률봉사회회장' },
  ],
  awards: [
    { label: '서울시 인권지킴이단', image: cert('gongdaeho-award-human-rights') },
    { label: '서울관악경찰서장 표창', image: cert('gongdaeho-award-police') },
    { label: '2025 한국브랜드만족지수 1위', image: cert('gongdaeho-award-brand-index') },
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
  {
    ...placeholderLawyer(
      'parkhyoyoung',
      '박효영',
      PARKHYOYOUNG_PHOTO.src,
    ),
    photoPreview: PARKHYOYOUNG_PHOTO.preview,
    intro: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
  },
  {
    ...placeholderLawyer(
      'gongseongjun',
      '공성준',
      GONGSEONGJUN_PHOTO.src,
    ),
    photoPreview: GONGSEONGJUN_PHOTO.preview,
    intro: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
  },
  {
    ...placeholderLawyer('sinjiho', '신지호', SINJIHO_PHOTO.src),
    photoPreview: SINJIHO_PHOTO.preview,
    intro: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
  },
]

/**
 * Directory grid order (Figma 105:1256) — 박효영 → 공대호 → 공성준 → 신지호.
 * Profile tabs keep `LAWYERS` order (공대호 first as default detail).
 */
export const LAWYER_CARDS: LawyerCard[] = [
  {
    id: 'parkhyoyoung',
    name: '박효영',
    title: '변호사',
    highlights: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
    photo: PARKHYOYOUNG_CARD.src,
    photoPreview: PARKHYOYOUNG_CARD.preview,
    href: lawyerPath('parkhyoyoung'),
  },
  {
    id: 'gongdaeho',
    name: '공대호',
    title: '변호사',
    highlights: GONG_DAEHO.intro,
    photo: GONGDAEHO_CARD.src,
    photoPreview: GONGDAEHO_CARD.preview,
    href: lawyerPath('gongdaeho'),
  },
  {
    id: 'gongseongjun',
    name: '공성준',
    title: '변호사',
    highlights: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
    photo: GONGSEONGJUN_CARD.src,
    photoPreview: GONGSEONGJUN_CARD.preview,
    href: lawyerPath('gongseongjun'),
  },
  {
    id: 'sinjiho',
    name: '신지호',
    title: '변호사',
    highlights: [
      'LH 정비사업 자문위원',
      '감정평가사 자격보유, 법원감정인 경력',
      '대한변호사협회 재개발·재건축, 행정전문변호사',
      '대한법률봉사회 회장',
    ],
    photo: SINJIHO_CARD.src,
    photoPreview: SINJIHO_CARD.preview,
    href: lawyerPath('sinjiho'),
  },
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
