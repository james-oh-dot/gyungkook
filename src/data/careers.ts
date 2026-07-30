/**
 * ============================================================================
 * 소식 · 공지 > 인재영입 (sub-05-01) — info page + 채용공고 board
 * ============================================================================
 *
 * Figma: SUB_소식공지_인재영입_인재영입_DESKTOP (99:5915) + _채용공고 (99:6066).
 * Route-mode local tabs: 인재영입 (info) | 채용공고 (board).
 *   - 인재영입 (`/news/careers`): intro + 3 value cards + dark contact block.
 *   - 채용공고 (`/news/careers/jobs`): search/filter + job list → shared PostDetail.
 * Sub visual = sub-05-01 (one visual for the whole 소식·공지 section).
 */

import type { BoardPost, BoardTabDef } from './board'
import { createBoardModule } from './board'
import { asset } from '../utils/asset'
import { progressiveAsset } from '../utils/progressiveImage'

const VISUAL = progressiveAsset('assets/sub/sub-05-01')

/** LocalTabs (route mode) — 인재영입 / 채용공고. */
export const CAREERS_TABS: { id: string; label: string }[] = [
  { id: 'careers', label: '인재영입' },
  { id: 'jobs', label: '채용공고' },
]

export const CAREERS_PAGE = {
  parentLabel: '소식 · 공지',
  title: '인재영입',
  visual: VISUAL.src,
  visualPreview: VISUAL.preview,
  basePath: '/news/careers',
} as const

/** Centered intro paragraph (99:5941). */
export const CAREERS_INTRO = [
  '법무법인 경국 사명은 ‘밭갈 경’, ‘판세 국’ 이라는 의미를 품고 있습니다.',
  '첨단의 AI 활용으로 가장 빠르고 신속한 퍼포먼스를 추구하는 로펌이지만,',
  '경국의 출발점은 ‘사람’을 위해 묵묵히 긴 시간을 고민하고 고뇌하며',
  '기꺼이 희생할 수도 있는 ‘올바른 태도를 지닌 인성 추구’에 있습니다.',
  '스스로의 비전과 전문성을 지녔으면서도 따뜻한 가슴으로 상호 협력하며',
  '‘모두가 다니고 싶은 법인, 경국’ 을 함께 만들어 갈 인재를 모십니다.',
] as const

/** 3 value cards (99:5942) — Figma visual order 동행 / 공유 / 따뜻한 태도. */
export const CAREERS_VALUES = [
  {
    title: '동행',
    icon: asset('assets/icon-value-people.svg'),
    lines: ['혼자 뛰어가기 보다는', '함께 걸어 갈 수 있는 사람'],
  },
  {
    title: '공유',
    icon: asset('assets/icon-value-share.svg'),
    lines: ['상호간의 지식을 나누며', '함께 발전해 갈 수 있는 사람'],
  },
  {
    title: '따뜻한 태도',
    icon: asset('assets/icon-value-warmth.svg'),
    lines: ['기술이 대체할 수 없는 정성으로', '상대방의 고충에 귀 기울일 수 있는 사람'],
  },
] as const

/** Dark contact block (99:5975). */
export const CAREERS_CONTACT = {
  title: '수시지원',
  groups: [
    { label: '변호사 지원 담당', phone: '02-598-0350', mail: 'ceo@gyunggook.com' },
    { label: '사무원 지원 담당', phone: '02-598-0353', mail: 'support@gyunggook.com' },
  ],
} as const

/* ============================ 채용공고 board ============================ */

export const JOBS_TABS: BoardTabDef[] = [
  { id: 'jobs', label: '채용공고', chip: '채용공고' },
]

export const JOBS_PAGE = {
  parentLabel: '소식 · 공지',
  title: '인재영입',
  visual: VISUAL.src,
  visualPreview: VISUAL.preview,
  basePath: '/news/careers/jobs',
} as const

/** Search + filter labels (99:6086 — static UI; wire to API later). */
export const JOBS_FILTERS = {
  searchPlaceholder: '검색',
  selects: ['직군 (8)', '경력사항 (3)', '고용형태 (2)'],
} as const

type JobSeed = {
  title: string
  role: string
  position: string
  employment: string
  deadline: string
  dday: string
  body: string[]
}

const JOB_SEEDS: JobSeed[] = [
  {
    title: '재개발·재건축 전담 변호사 채용',
    role: '변호사',
    position: '팀원',
    employment: '정규직',
    deadline: '2026.06.29 23:59 까지',
    dday: 'D-10',
    body: [
      '법무법인 경국은 재개발·재건축 정비사업을 전담할 변호사를 채용합니다.',
      '[담당업무] 정비사업 조합 자문 및 소송 수행, 관리처분·현금청산 관련 사건 처리',
      '[자격요건] 변호사 자격 보유, 정비사업 실무 경험자 우대',
      '[근무지] 서울 서초구 서초대로 264, 15층 (법조타워)',
    ],
  },
  {
    title: '수용보상 담당 변호사 채용',
    role: '변호사',
    position: '팀원',
    employment: '정규직',
    deadline: '2026.06.29 23:59 까지',
    dday: 'D-10',
    body: [
      '공익사업 수용보상 사건을 담당할 변호사를 채용합니다.',
      '[담당업무] 토지수용·영업보상 관련 자문 및 행정소송 수행',
      '[자격요건] 변호사 자격 보유, 감정평가·보상 분야 관심자 우대',
    ],
  },
  {
    title: '송무 지원 사무원 채용',
    role: '사무원',
    position: '팀원',
    employment: '정규직',
    deadline: '2026.07.15 23:59 까지',
    dday: 'D-26',
    body: [
      '송무 업무를 지원할 사무원을 채용합니다.',
      '[담당업무] 소송 서류 작성 보조, 기일 관리, 고객 응대',
      '[자격요건] 법률사무소 근무 경험자 우대, 문서작성 능력 필수',
    ],
  },
  {
    title: '경영지원팀 회계 담당 채용',
    role: '경영지원',
    position: '팀원',
    employment: '계약직',
    deadline: '2026.07.03 23:59 까지',
    dday: 'D-14',
    body: [
      '경영지원팀에서 회계 업무를 담당할 인재를 채용합니다.',
      '[담당업무] 회계 전표 처리, 세무 자료 관리, 급여 지원',
      '[자격요건] 회계 실무 경험자, 관련 자격증 소지자 우대',
    ],
  },
]

function buildJobs(): BoardPost[] {
  return JOB_SEEDS.map((s, i) => ({
    id: `job-${i + 1}`,
    tab: 'jobs',
    title: s.title,
    summary: [s.role, s.position, s.employment].join(' · '),
    publishedAt: s.deadline,
    views: 0,
    thumbnail: '',
    body: s.body,
    jobMeta: [s.role, s.position, s.employment],
    deadline: s.deadline,
    dday: s.dday,
  }))
}

export const JOBS_BOARD = createBoardModule({
  page: JOBS_PAGE,
  tabs: JOBS_TABS,
  posts: buildJobs(),
  hasTabSegment: false,
})
