/**
 * ============================================================================
 * 소식 · 공지 > 판례뉴스 (sub-05-01) — mock board content
 * ============================================================================
 *
 * Figma: SUB_소식공지_판례뉴스_DESKTOP (99:5779). Single board, no local tabs.
 * List = full-width cards (category chip + title / 3-line body / 출처 / date · 조회).
 * Detail = shared `PostDetail`. Sub visual = sub-05-01. Swap posts for API later.
 */

import type { BoardPost, BoardTabDef } from './board'
import { createBoardModule } from './board'
import { progressiveAsset } from '../utils/progressiveImage'

const VISUAL = progressiveAsset('assets/sub/sub-05-01')
const IMG = [
  progressiveAsset('assets/press-1').src,
  progressiveAsset('assets/press-3').src,
]

export const CASE_NEWS_TABS: BoardTabDef[] = [
  { id: 'cases', label: '판례뉴스', chip: '판례뉴스' },
]

export const CASE_NEWS_PAGE = {
  parentLabel: '소식 · 공지',
  title: '판례뉴스',
  visual: VISUAL.src,
  visualPreview: VISUAL.preview,
  basePath: '/news/cases',
} as const

type Seed = {
  category: string
  title: string
  summary: string
  source: string
  body: string[]
  date: string
  views: number
}

const SEEDS: Seed[] = [
  {
    category: '재개발·재건축',
    title: '대법원 “관리처분계획 총회 의결 정족수 미달 시 무효”',
    summary:
      '대법원이 관리처분계획 수립을 위한 조합 총회에서 법정 의결 정족수를 충족하지 못한 경우 해당 계획은 무효라고 판단했습니다. 이번 판결은 정비사업 조합 운영의 절차적 정당성을 다시 한 번 강조한 것으로, 실무상 총회 소집·의결 과정의 엄격한 관리가 요구됩니다.',
    source: '출처 : 법률신문',
    body: [
      '대법원은 관리처분계획 수립을 위한 조합 총회에서 도시정비법이 정한 의결 정족수를 충족하지 못한 경우, 그 관리처분계획은 무효라고 판단하였습니다.',
      '재판부는 관리처분계획이 조합원의 재산권에 중대한 영향을 미치는 처분인 만큼, 총회 의결의 절차적 정당성이 엄격히 요구된다고 보았습니다.',
      '이번 판결에 따라 정비사업 조합은 총회 소집·의결 과정의 정족수 관리에 한층 주의를 기울일 필요가 있습니다.',
    ],
    date: '2026.06.29 10:16',
    views: 120,
  },
  {
    category: '수용보상',
    title: '헌재 “영업손실 보상 산정 기준, 합헌” 결정',
    summary:
      '헌법재판소가 공익사업으로 인한 영업손실 보상액 산정 기준을 규정한 토지보상법 시행규칙 조항에 대해 합헌 결정을 내렸습니다. 영업보상의 범위와 산정 방식을 둘러싼 실무상 논란에 일정한 기준을 제시한 판단으로 평가됩니다.',
    source: '출처 : 뉴스1',
    body: [
      '헌법재판소는 공익사업 시행에 따른 영업손실 보상액 산정 기준을 정한 토지보상법 시행규칙 조항이 재산권을 침해하지 않는다며 합헌으로 결정하였습니다.',
      '재판부는 보상 기준의 명확성과 예측가능성을 고려할 때 입법 재량의 범위를 벗어나지 않는다고 판단하였습니다.',
    ],
    date: '2026.06.21 13:40',
    views: 88,
  },
  {
    category: '행정',
    title: '서울행정법원 “정비구역 지정 해제 처분 취소” 판결',
    summary:
      '서울행정법원이 정비구역 지정 해제 처분에 절차적 하자가 있다며 이를 취소하는 판결을 선고했습니다. 주민 의견 수렴 절차의 실질적 이행 여부가 쟁점이 되었습니다.',
    source: '출처 : 법률신문',
    body: [
      '서울행정법원은 정비구역 지정 해제 처분 과정에서 주민 의견 수렴 절차가 실질적으로 이행되지 않았다며 처분을 취소하였습니다.',
      '재판부는 형식적인 공람·공고만으로는 절차적 정당성을 인정하기 어렵다고 보았습니다.',
    ],
    date: '2026.06.14 09:05',
    views: 143,
  },
  {
    category: '재개발·재건축',
    title: '대법원 “현금청산자 지연이자, 청산금 지급일부터 기산”',
    summary:
      '대법원이 정비사업 현금청산 대상자에게 지급하는 청산금의 지연이자는 청산금 지급 의무가 발생한 날부터 기산해야 한다고 판단했습니다. 현금청산 실무에 직접적인 영향을 미칠 것으로 보입니다.',
    source: '출처 : 연합뉴스',
    body: [
      '대법원은 정비사업 현금청산 대상자에 대한 청산금 지연이자의 기산점을 청산금 지급 의무 발생일로 보아야 한다고 판단하였습니다.',
      '이번 판결은 현금청산 협의 및 소송 실무에서 지연이자 산정의 기준을 명확히 한 것으로 평가됩니다.',
    ],
    date: '2026.06.05 17:22',
    views: 176,
  },
]

function buildPosts(): BoardPost[] {
  return SEEDS.map((s, i) => ({
    id: `case-${i + 1}`,
    tab: 'cases',
    title: s.title,
    summary: s.summary,
    source: s.source,
    publishedAt: s.date,
    views: s.views,
    thumbnail: IMG[i % IMG.length]!,
    detailImage: IMG[i % IMG.length]!,
    body: s.body,
    // category chip label lives on the post (per-post, unlike the single tab chip)
    author: s.category,
  }))
}

export const CASE_NEWS_BOARD = createBoardModule({
  page: CASE_NEWS_PAGE,
  tabs: CASE_NEWS_TABS,
  posts: buildPosts(),
  hasTabSegment: false,
})
