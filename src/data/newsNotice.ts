/**
 * ============================================================================
 * 소식 · 공지 > 소식공지 (sub-05-01) — mock board content
 * ============================================================================
 *
 * Figma: SUB_소식공지_소식공지_DESKTOP (99:5679). Single board, no local tabs.
 * List = 2-col cards (title / divider / 3-line body / date · 조회).
 * Detail = shared `PostDetail`. Sub visual = sub-05-01 (one visual for the whole
 * 소식·공지 section, per spec). Swap NOTICE_POSTS for a CMS/API later.
 */

import type { BoardPost, BoardTabDef } from './board'
import { createBoardModule } from './board'
import { progressiveAsset } from '../utils/progressiveImage'

const VISUAL = progressiveAsset('assets/sub/sub-05-01')
const IMG = [
  progressiveAsset('assets/notice-1').src,
  progressiveAsset('assets/notice-2').src,
  progressiveAsset('assets/notice-3').src,
]

export const NEWS_NOTICE_TABS: BoardTabDef[] = [
  { id: 'notice', label: '소식공지', chip: '소식공지' },
]

export const NEWS_NOTICE_PAGE = {
  parentLabel: '소식 · 공지',
  /** Figma hero shows the section title on the 소식공지 landing */
  title: '소식 · 공지',
  visual: VISUAL.src,
  visualPreview: VISUAL.preview,
  basePath: '/news/notice',
} as const

type Seed = { title: string; lines: string[]; body: string[]; date: string; views: number }

const SEEDS: Seed[] = [
  {
    title: '[법무법인경국 공대호변호사] 2026. 6. 22. 인재개발원 강의 성료',
    lines: [
      '한국농어촌공사 인재개발원 농지은행기획부',
      '농지은행사업 전문가 양성 강의',
      '공대호변호사 출강 성료',
    ],
    body: [
      '법무법인 경국 공대호 대표변호사가 한국농어촌공사 인재개발원 농지은행기획부의 초청으로 「농지은행사업 전문가 양성 과정」 강의에 출강하였습니다.',
      '이번 강의에서는 국토계획법과 부동산 기초이론을 중심으로, 농지은행사업 실무에서 자주 문제되는 감정평가·보상 쟁점을 사례와 함께 다루었습니다.',
      '경국은 앞으로도 축적된 실무 경험을 바탕으로 공공기관·전문가 대상 교육에 적극 참여하겠습니다.',
    ],
    date: '2026.06.29 10:16',
    views: 75,
  },
  {
    title: '[공대호변호사] 한국청소년육성회 법률자문위원 위촉',
    lines: [
      '경찰청 허가법인 한국청소년 육성회',
      '공대호 변호사',
      '법률자문위원(관악지구)으로 위촉되었습니다.',
    ],
    body: [
      '경찰청 허가법인 한국청소년육성회는 공대호 변호사를 관악지구 법률자문위원으로 위촉하였습니다.',
      '공대호 변호사는 청소년 보호 및 육성 활동과 관련한 법률 자문을 통해 지역 사회 공헌에 힘쓸 예정입니다.',
    ],
    date: '2026.06.29 10:16',
    views: 75,
  },
  {
    title: '[법무법인경국] 재개발·재건축 무료 법률상담 안내',
    lines: [
      '조합·추진위원회·조합원 대상',
      '정비사업 전 과정에 대한 무료 상담',
      '사전 예약제로 운영됩니다.',
    ],
    body: [
      '법무법인 경국은 재개발·재건축 정비사업과 관련한 무료 법률상담을 운영하고 있습니다.',
      '조합 설립부터 관리처분, 이전고시, 청산에 이르는 전 과정에 대해 감정평가사 자격을 보유한 전문 변호사가 직접 상담합니다.',
      '상담은 사전 예약제로 운영되며, 대표번호로 문의하시기 바랍니다.',
    ],
    date: '2026.06.24 14:02',
    views: 138,
  },
  {
    title: '[공지] 여름철 사무실 휴무 및 상담 일정 안내',
    lines: [
      '하계 휴가 기간 중 상담 운영 안내',
      '긴급 사안은 대표번호로 연락 바랍니다.',
      '이용에 참고 부탁드립니다.',
    ],
    body: [
      '하계 휴가 기간 동안 일부 상담 일정이 조정됩니다.',
      '긴급한 사안은 대표번호를 통해 접수해 주시면 담당 변호사가 순차적으로 연락드리겠습니다.',
    ],
    date: '2026.06.18 09:30',
    views: 96,
  },
  {
    title: '[법무법인경국] 수용보상 세미나 개최 결과 보고',
    lines: [
      '공익사업 토지수용 보상 실무 세미나',
      '보상금 증액 전략과 최신 판례 공유',
      '많은 관심 감사드립니다.',
    ],
    body: [
      '경국이 주최한 수용보상 실무 세미나가 성황리에 마무리되었습니다.',
      '보상금 증액 전략, 영업보상·이주대책의 쟁점, 최신 판례 동향을 실제 사례 중심으로 공유하였습니다.',
    ],
    date: '2026.06.11 16:45',
    views: 204,
  },
  {
    title: '[안내] 온라인 법률상담 시스템 오픈',
    lines: [
      '홈페이지를 통한 온라인 상담 접수',
      '방문 없이 1차 상담이 가능합니다.',
      '지금 바로 이용해 보세요.',
    ],
    body: [
      '방문 없이 온라인으로 1차 상담을 접수할 수 있는 시스템을 오픈하였습니다.',
      '상담 신청서를 작성해 주시면 담당 변호사가 검토 후 회신드립니다.',
    ],
    date: '2026.06.03 11:20',
    views: 312,
  },
]

function buildPosts(): BoardPost[] {
  return SEEDS.map((s, i) => ({
    id: `notice-${i + 1}`,
    tab: 'notice',
    title: s.title,
    summary: s.lines.join('\n'),
    publishedAt: s.date,
    views: s.views,
    thumbnail: IMG[i % IMG.length]!,
    detailImage: IMG[i % IMG.length]!,
    body: s.body,
  }))
}

export const NEWS_NOTICE_BOARD = createBoardModule({
  page: NEWS_NOTICE_PAGE,
  tabs: NEWS_NOTICE_TABS,
  posts: buildPosts(),
  hasTabSegment: false,
})
