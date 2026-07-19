/**
 * ============================================================================
 * 정비사업 (재개발 · 보상업무 > 정비사업 / Figma sub-02-01)
 * ============================================================================
 *
 * Frames (AI_dev / AI-subpage-02):
 * - SUB_재개발보상업무_정비사업 (`68:11987`)
 * - hero_type2 (`68:11989`) — no parent chip
 * - Local tabs scroll within page (not route-based)
 *
 * Backend notes:
 * - Replace mock section bodies / track-record cards with CMS/API.
 * - Track record: `initialVisible` / `total` drive “실적 더보기” paging (+15).
 */

import { progressiveAsset } from '../utils/progressiveImage'

const RENEWAL_VISUAL = progressiveAsset('assets/sub/sub-02-01')

export const RENEWAL_PAGE = {
  parentLabel: '재개발 · 보상업무',
  title: '정비사업',
  /** Figma layer sub-02-01 — progressive WebP pair */
  visual: RENEWAL_VISUAL.src,
  visualPreview: RENEWAL_VISUAL.preview,
  basePath: '/practice/renewal',
} as const

export type RenewalTabId =
  | 'overview'
  | 'eviction'
  | 'sale'
  | 'expropriation'
  | 'transfer'
  | 'levy'
  | 'publicLand'
  | 'advisory'
  | 'trackRecord'

export type RenewalTabDef = {
  id: RenewalTabId
  label: string
}

export const RENEWAL_TABS: RenewalTabDef[] = [
  { id: 'overview', label: '정비사업' },
  { id: 'eviction', label: '명도 ·가처분' },
  { id: 'sale', label: '매도청구' },
  { id: 'expropriation', label: '수용재결' },
  { id: 'transfer', label: '이전고시.등기' },
  { id: 'levy', label: '원인자부담금' },
  { id: 'publicLand', label: '국공유지' },
  { id: 'advisory', label: '기타법률자문' },
  { id: 'trackRecord', label: '정비사업실적' },
]

export type LawCard = {
  badge: string
  title: string
  quote: string
  body: string[]
}

export type TypeCard = {
  title: string
  body: string
}

export type CompareRow = {
  label: string
  redevelopment: string
  reconstruction: string
}

export type ProcedureStep =
  | { kind: 'step'; number: number; label: string }
  | { kind: 'highlight'; label: string; note: string }

export type WorkBlock = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type WorkSection = {
  enLabel: string
  title: string
  /** Optional subtitle under title (e.g. 수용재결) */
  titleNote?: string
  blocks: WorkBlock[]
  /** Extra note cards (원인자부담금 / 국공유지) */
  notes?: string[]
  /** Teal emphasis strip inside a note */
  emphasis?: string
}

export type LevyWorkGroup = {
  title: string
  items: string[]
}

export type AdvisoryService = {
  no: number
  title: string
  items: string[]
}

export type TrackResult = {
  id: string
  category: string
  result: string
}

/** Overview — TAB_정비사업 */
export const RENEWAL_OVERVIEW = {
  enLabel: 'Urban Refurbishment Project',
  title: '정비사업',
  laws: [
    {
      badge: '관련법령',
      title: '도시 및 주거환경정비법  제1조(목적)',
      quote:
        '“이 법은 도시기능의 회복이 필요하거나 주거환경이 불량한 지역을 계획적으로 정비하고 노후ㆍ불량건축물을 효율적으로 개량하기 위하여 필요한 사항을 규정함으로써 도시환경을 개선하고 주거생활의 질을 높이는 데 이바지함을 목적으로 한다.”',
      body: [
        '정비사업은 낡고 비효율적인 도시 공간을 새롭게 정비해 주거·상업·업무 환경을 개선하는 도시계획 사업입니다.',
        '「도시 및 주거환경정비법」에 근거하며, 주로 오래된 주거지나 상권 밀집지역에서 진행됩니다.',
        '주요 목적은 ▲노후 건물 철거 및 현대식 건축물 건립 ▲도로·공원 등 기반시설 확충 ▲도시 경관 개선 ▲주민 생활환경 향상입니다.',
      ],
    },
    {
      badge: '관련법령',
      title: '도시 및 주거환경정비법  제2조',
      quote:
        '“정비사업”이란 이 법에서 정한 절차에 따라 도시기능을 회복하기 위하여 정비구역에서 정비기반시설을 정비하거나 주택 등 건축물을 개량 또는 건설하는 다음 각 목의 사업을 말한다.',
      body: [
        '종전의 정비사업은 주거환경개선사업, 주택재개발사업, 도시환경정비사업, 가로주택정비사업의 4가지 큰 줄기와 더불어 주거환경관리사업, 주택재건축사업을 포함하여 6가지 유형이 있었으나, 2018년 2월 「도시 및 주거환경정비법」이 전부 개정되면서 재개발 정비사업 유형은 1) 주거환경개선사업 2) 재개발 3) 재건축의 세가지 큰 틀로 단순화 되었습니다.',
        '가로주택정비사업, 역세권/정비형 재개발, 빈집정비사업 등의 개념도 재개발의 영역에서 다루어 지고 있습니다.',
      ],
    },
  ] as LawCard[],
  types: [
    {
      title: '주거환경개선사업',
      body: '도시저소득 주민이 집단거주하는 지역으로서 정비기반시설이 극히 열악하고 노후 · 불량건축물이 과도하게 밀집한 지역의 주거환경을 개선하거나 단독주택 · 다세대주택이 밀집한 지역에서 정비기반시설과 공동이용시설 확충을 통하여 주거환경을 보전 · 정비 · 개량하기 위한 사업',
    },
    {
      title: '재개발',
      body: '정비기반시설이 열악하고 노후 · 불량건축물이 밀집한 지역에서 주거환경을 개선하거나 상업지역 · 공업지역 등에서 도시기능 회복, 상권활성화 등을 위해 도시환경을 개선하기 위한 사업',
    },
    {
      title: '재건축',
      body: '정비기반시설은 양호하나 노후 · 불량건축물에 해당하는 공동주택이 밀집한 지역에서 주거환경을 개선하기 위한 사업',
    },
  ] as TypeCard[],
  compare: {
    title: '재개발 vs 재건축',
    lead: '‘재건축’은 재개발과 혼용되어 사용되지만 통상 재개발보다는 규모가 작고 하위 개념으로 이해 되며, 적용 대상, 추진 이유, 법적 요건, 절차 등에서 차이가 있습니다. 재개발은 정비기반시설 전체, 쉽게 말해 구역 자체를 새로 정비하지만 재건축은 기반시설에는 큰 변동이 없이 노후한 공동주택을 안전진단을 거쳐 새로 짓는 형태입니다.',
    columns: ['재개발', '재건축'] as const,
    rows: [
      {
        label: '개념',
        redevelopment: '노후·불량 주거지나 상업지 전체를 정비하여 주거·생활환경 개선',
        reconstruction: '노후·불량 공동주택(아파트 등)을 헐고 새로 짓는 사업',
      },
      {
        label: '대상 지역',
        redevelopment: '주거·상업·공업지역 등 전반(도로·상하수도 등 기반시설 열악)',
        reconstruction: '주로 공동주택 단지(아파트·연립·다세대)',
      },
      {
        label: '법적 근거',
        redevelopment: '도시 및 주거환경정비법',
        reconstruction: '도시 및 주거환경정비법',
      },
      {
        label: '추진 이유',
        redevelopment:
          '건물 노후도 + 기반시설 부족\n무허가 건물 밀집\n도로·상하수도 등 도시 인프라 낙후',
        reconstruction:
          '건물 노후화(안전진단 D등급 이하)\n구조적 안전성 저하\n주거 성능 향상 필요',
      },
      {
        label: '주체',
        redevelopment: '조합(토지+건물 소유자), 지자체',
        reconstruction: '조합(집합건물 소유자)',
      },
      {
        label: '기반시설 정비',
        redevelopment: '필수(도로, 상하수도, 공원 등 함께 조성)',
        reconstruction: '해당 단지 내부 기반시설 위주',
      },
      {
        label: '보상',
        redevelopment: '토지·건물·영업 보상, 세입자 대책 포함',
        reconstruction: '세입자 보상은 제한적(소유자 중심)',
      },
      {
        label: '일반분양 비율',
        redevelopment: '높음(사업비 조달을 위해 일반분양 많이 함)',
        reconstruction: '상대적으로 낮음',
      },
      {
        label: '기간',
        redevelopment: '통상 8~15년(절차 복잡)',
        reconstruction: '평균 7~12년(안전진단·동의율 관건)',
      },
    ] as CompareRow[],
  },
  procedure: {
    title: '재개발 · 재건축의 절차',
    lead: [
      '정비사업 업무는 단순히 소송만을 의미하는 것이 아니라,',
      '추진위원회 단계부터 청산까지 사업 전 과정에서 발생하는 법률업무를 포함합니다.',
    ],
    steps: [
      { kind: 'step', number: 1, label: '도시 및 주거환경정비 기본계획 수립' },
      { kind: 'step', number: 2, label: '정비계획수립 및 정비구역 지정' },
      { kind: 'step', number: 3, label: '시행자 지정' },
      {
        kind: 'highlight',
        label: '안전진단',
        note: '재건축의 경우 ‘안전진단’절차가 추가됩니다',
      },
      { kind: 'step', number: 4, label: '사업시행 인가' },
      { kind: 'step', number: 5, label: '분양신청' },
      { kind: 'step', number: 6, label: '관리처분계획 인가' },
      { kind: 'step', number: 7, label: '착공' },
      { kind: 'step', number: 8, label: '준공 및 입주' },
      { kind: 'step', number: 9, label: '이전 고시' },
      { kind: 'step', number: 10, label: '청산' },
    ] as ProcedureStep[],
  },
} as const

export const RENEWAL_EVICTION: WorkSection = {
  enLabel: 'Preliminary Injunction for Eviction',
  title: '명도(인도) ·가처분',
  blocks: [
    {
      title: '개요',
      paragraphs: [
        '정비사업은 관리처분계획 인가와 이전고시 이후에도 일부 점유자의 퇴거 거부, 불법 점유, 공사 방해 등으로 인해 사업 일정이 지연되는 사례가 빈번하게 발생합니다.',
        '특히 사업 지연은 조합원의 금융비용 증가와 사업비 상승으로 직결되는 만큼, 신속하고 적법한 법적 대응이 무엇보다 중요합니다.',
        '법무법인 경국은 재개발·재건축 등 정비사업 전 과정에서 발생하는 명도 및 가처분 사건에 대하여 풍부한 경험과 전문성을 바탕으로 종합적인 법률 서비스를 제공합니다.',
      ],
    },
    {
      title: '업무',
      bullets: [
        '조합원 및 세입자에 대한 명도 협의 및 법률 자문',
        '건물인도(명도) 소송 수행',
        '점유이전금지가처분 신청 및 집행',
        '공사방해금지가처분 신청',
        '출입방해·업무방해 등 사업방해 행위 대응',
        '강제집행 및 집행절차 자문',
        '사업 지연 최소화를 위한 분쟁 예방 및 대응 전략 수립',
      ],
    },
  ],
}

export const RENEWAL_SALE: WorkSection = {
  enLabel: 'Right to Demand Sale',
  title: '매도청구',
  blocks: [
    {
      title: '개요',
      paragraphs: [
        '재개발·재건축 등 정비사업은 사업구역 내 토지등소유자의 협력이 필수적이지만, 일부 소유자의 미동의 또는 협의 지연으로 인해 사업 전체가 장기간 정체되는 경우가 발생합니다.',
        '「도시 및 주거환경정비법」은 일정한 요건을 충족한 경우 사업시행자 또는 조합이 미동의 소유자를 상대로 소유권 이전을 구하는 매도청구권을 행사할 수 있도록 규정하고 있습니다.',
        '매도청구는 단순한 소송 절차가 아니라, 조합설립인가·사업시행계획인가 등 사업 단계별 요건 검토와 함께 적법한 최고 절차, 협의 과정, 감정평가 및 매매대금 산정 등이 종합적으로 검토되어야 하는 전문 분야입니다.',
      ],
    },
    {
      title: '업무',
      bullets: [
        '매도청구 대상자 및 행사요건 검토',
        '매도청구 전 최고 및 협의 절차 자문',
        '매도청구 소송 제기 및 수행',
        '감정평가 및 매매대금 산정 관련 법률 검토',
        '점유 이전 및 명도 절차 대응',
        '항소 및 상고심 대응',
        '사업 지연 최소화를 위한 종합 법률 자문',
      ],
    },
  ],
}

export const RENEWAL_EXPROPRIATION: WorkSection = {
  enLabel: 'Adjudication on Expropriation',
  title: '수용재결',
  titleNote: '(시행자 수탁업무)',
  blocks: [
    {
      title: '개요',
      paragraphs: [
        '공익사업의 원활한 추진을 위해 협의에 의한 취득이 이루어지지 않는 경우, 사업시행자는 토지수용위원회의 재결을 통해 토지 및 물건에 대한 권리를 취득할 수 있습니다.',
        '수용재결은 단순한 보상절차가 아니라 사업의 계속성과 일정, 금융비용 및 전체 사업성에 직접적인 영향을 미치는 중요한 법적 절차입니다. 재결신청 과정에서 절차상 하자나 보상금 산정 오류가 발생할 경우 사업 지연 및 추가 비용 부담으로 이어질 수 있으므로 전문적인 법률 검토와 대응이 필요합니다.',
      ],
    },
    {
      title: '업무',
      bullets: [
        '협의취득 단계에서의 법률 자문 및 전략 수립',
        '수용재결 신청 및 관련 서류 검토',
        '토지수용위원회 재결 절차 대응',
        '보상금 산정 및 감정평가 관련 법률 검토',
        '이의재결 및 행정소송 대응',
        '명도 및 인도 절차 지원',
        '사업 지연 방지를 위한 분쟁 예방 및 해결',
      ],
    },
  ],
}

export const RENEWAL_TRANSFER: WorkSection = {
  enLabel: 'Registration following the Public Notice of Transfer',
  title: '이전고시.등기',
  blocks: [
    {
      title: '정비사업 과정에서 발생하는 법무 업무',
      paragraphs: [
        '정비사업 시행 과정에서 발생하는 각종 법률적 쟁점에 대하여 관련 법령 및 판례를 검토하고, 조합의 사업 진행에 필요한 법률 검토, 의견서 작성, 행정기관 대응 등 제반 법무 업무를 수행하여, 조합이 안심하고 사업추진에 전념할 수 있도록 든든한 동반자 역할을 할 것입니다.',
      ],
    },
    {
      title: '조합 및 조합원 관련 각종 등기 업무',
      paragraphs: [
        '정비사업 추진 과정에서 발생하는 조합 및 조합원 관련 각종 등기 절차에 대하여 등기 서류 검토, 신청서 작성, 등기 신청 및 관련 업무를 수행하여 등기 절차가 적법하고 신속하게 진행될 수 있도록 지원합니다.',
      ],
    },
    {
      title: '도시정비법에 따른 이전고시 및 보존등기 업무',
      paragraphs: [
        '「도시 및 주거환경정비법」에 따른 이전고시 절차 전반을 검토하고, 이전고시 이후 필요한 소유권보존등기 등 관련 등기 업무를 수행하여 정비사업의 권리관계 정리가 적법하게 이루어질 수 있도록 지원합니다.',
      ],
    },
  ],
}

export const RENEWAL_LEVY = {
  enLabel: "Developer's Proportionate Share of Infrastructure Costs",
  title: '원인자부담금',
  overview: {
    title: '개요',
    paragraphs: [
      '재개발·재건축 등 정비사업 과정에서는 다양한 공공부담금과 조세가 발생하며, 사업 규모에 따라 수십억 원 이상의 비용이 추가로 발생하는 사례도 적지 않습니다. 그러나 관련 법령과 행정해석, 판례 등을 면밀히 검토할 경우 상당 부분의 부담금이 감면되거나 환급될 가능성이 있음에도 불구하고, 이에 대한 체계적인 검토가 이루어지지 않아 조합이 불필요한 비용을 부담하는 경우가 빈번합니다.',
      '당 법무법인은 정비사업 및 조세 분야에 대한 전문성을 바탕으로 조합이 부담하게 되는 각종 부담금 및 조세의 적정성 여부를 검토하고, 법령상 감면·환급 가능성을 분석하여 조합의 재정 부담을 최소화하는 업무를 수행합니다.',
      '아래 목록과 같이 조합이 납부하였거나 납부 예정인 각종 부담금 및 공공기여금, 조세 등에 대한 법적 근거와 산정 기준의 적정성을 종합적으로 검토합니다. 이 과정에서 관련 법령, 시행령 및 시행규칙, 행정지침, 유권해석, 판례 등을 체계적으로 분석하여 과다 부과 여부 또는 감면 적용 가능 여부를 포착해 정밀한 분석으로 감면의 결과를 도출할 예정입니다.',
    ],
  },
  workTitle: '업무',
  workGroups: [
    {
      title: '기반시설보조금 및 각종 부담금 감면 관련',
      items: [
        '전기시설원인자부담금',
        '통신선로원인자부담금',
        '상하수도시설 원인자부담금',
        '광역교통시설원인자부담금',
        '도시가스원인자부담금',
        '학교용지부담금',
        '종합부동산세, 보존등기취득세, 토지취득세',
        '법인세, 부가세 등 각종 세금',
        '기타 모든 원인자부담금의 감액 및 분담금(세금)',
      ],
    },
    {
      title: '건설사업정산 관련',
      items: [
        '허가, 사용승인 도면 기준 미시공, 변경시공, 부실시공 등에 대한 적출성과 손해배상액 산출',
        '설계변경으로 인한 공사비 부당 청구부분 및 감액부분의 적출 및 반환 청구금액 산출',
        '민법 및 건설산업기본법, 공동주택관리법, 집합건물법상의 적출 및 보수금액 산정',
        '공사비 증액에 따른 세부 증가 수량 산출 및 검토',
        '시공사간에 정산 협의 및 소송 업무',
        '부실 자재 사용 적출 및 부당 이득금 산출',
        '건설사업정산을 위한 조합의 정비사업비추산액의 검증 및 환급 항목 검토',
        '준공, 이전고시, 해산, 청산의 조합 업무 진행시 행정 자문 및 법률 지원',
        '시공사간에 정산 협의 및 소송 업무',
        '시공사, 보증사간 하자관련 협의 및 보증금, 손해배상금 청구소송 업무',
      ],
    },
  ] as LevyWorkGroup[],
  notes: [
    '부담금 감면 및 환급 가능 항목이 도출되면 이를 바탕으로 행정기관과의 협의 및 정식 이의제기 절차를 진행합니다. 필요할 경우 의견서 제출, 행정심판, 행정소송 등 법적 절차를 통해 조합의 권리를 적극적으로 보호합니다.',
    '조합의 사업 진행 단계에 따라 사전 검토 및 사후 환급 검토를 병행합니다. 이미 납부된 부담금의 경우 환급 가능 여부를 검토하고, 향후 발생할 부담금에 대해서는 사전에 감면 적용이 가능하도록 전략을 수립하여 조합의 재정적 손실을 최소화합니다.',
  ],
  emphasis:
    '조합이 부담하는 각종 공공부담금 및 조세의 적정성을 확보하고, 불필요한 비용 지출을 최소화함으로써 조합원 전체의 경제적 이익을 보호하는 데 기여',
} as const

export const RENEWAL_PUBLIC_LAND: WorkSection = {
  enLabel: 'Gratuitous Transfer of State or Public Land',
  title: '국공유지 무상양도',
  blocks: [
    {
      title: '개요',
      paragraphs: [
        '정비사업 구역 내에는 도로, 구거, 공원, 녹지 등 국가 또는 지방자치단체가 소유한 국·공유지가 포함되어 있는 경우가 많습니다.',
        '「도시 및 주거환경정비법」에 따라 사업시행자가 새롭게 설치한 정비기반시설이 국가 또는 지방자치단체에 귀속되는 경우, 기존에 용도가 폐지되는 국·공유지는 일정한 범위 내에서 사업시행자에게 무상으로 양도될 수 있습니다.',
        '국공유지 무상양도는 사업비 절감과 조합원 분담금 감소에 직접적인 영향을 미치는 중요한 절차이지만, 사업시행계획 수립 단계부터 대상 토지의 검토, 관리청 협의, 귀속 범위 산정 등 전문적인 법률 검토가 필요합니다.',
      ],
    },
    {
      title: '업무',
      bullets: [
        '국·공유지 현황 및 권리관계 검토',
        '무상양도 대상 여부 및 범위 분석',
        '관리청 협의 및 의견 조율',
        '사업시행계획상 귀속·양도 관련 법률 검토',
        '유상매입 대상 국공유지 검토 및 매수 절차 지원',
        '무상양도 제외 또는 축소 처분에 대한 법적 대응',
        '행정심판·행정소송 등 분쟁 대응',
      ],
    },
  ],
  notes: [
    '비사업에서 국공유지 무상양도는 단순한 행정절차가 아니라 사업 수익성과 조합원의 부담을 좌우하는 핵심 요소입니다. 풍부한 정비사업 경험을 바탕으로 사업시행자의 권익을 보호하고 최적의 결과를 도출합니다.',
  ],
}

export const RENEWAL_ADVISORY = {
  enLabel: 'Other Legal Advisory Services',
  title: '기타 법률자문',
  intro:
    '법무법인에서 진행하는 정비사업 업무는 단순히 소송만을 의미하는 것이 아니라, 추진위원회 단계부터 청산까지 사업 전 과정에서 발생하는 법률업무를 포함하는 것입니다. 법무법인 경국은 단체의 설립에서부터 청산에 이르기까지, 다양한 케이스의 민사·형사·행정·가사·세무 등 다양한 분야의 경험을 갖추고 고객이 당면한 사안을 가장 빠르게 진단하고 조력합니다.',
  /** Figma highlight under intro (same copy as 국공유지 note in source) */
  note: '비사업에서 국공유지 무상양도는 단순한 행정절차가 아니라 사업 수익성과 조합원의 부담을 좌우하는 핵심 요소입니다. 풍부한 정비사업 경험을 바탕으로 사업시행자의 권익을 보호하고 최적의 결과를 도출합니다.',
  services: [
    {
      no: 1,
      title: '추진위원회·조합 설립',
      items: [
        '추진위원회 설립 자문',
        '조합설립동의서 검토',
        '조합설립인가 자문',
        '정관 제정 및 개정',
        '창립총회·조합총회 자문',
      ],
    },
    {
      no: 2,
      title: '사업시행 및 인허가',
      items: [
        '사업시행계획 수립 자문',
        '사업시행계획인가 관련 자문',
        '각종 행정처분 대응',
        '인허가 관련 행정심판·행정소송',
      ],
    },
    {
      no: 3,
      title: '조합 운영 및 분쟁',
      items: [
        '조합 임원 법률자문',
        '총회·대의원회 운영 자문',
        '임원 해임 및 직무집행정지',
        '조합 내부 분쟁 대응',
        '정보공개 관련 분쟁',
      ],
    },
    {
      no: 4,
      title: '시공사·협력업체 관련',
      items: [
        '시공사 선정 절차 자문',
        '공사도급계약 검토',
        '설계·정비사업전문관리업자 계약 검토',
        '공사비 증액 분쟁 대응',
        '협력업체 계약 분쟁',
      ],
    },
    {
      no: 5,
      title: '관리처분 및 분양',
      items: [
        '관리처분계획 수립 자문',
        '분양신청 관련 분쟁',
        '현금청산자 대응',
        '조합원 자격 분쟁',
        '분양계약 관련 분쟁',
      ],
    },
    {
      no: 6,
      title: '형사·감사 대응',
      items: [
        '조합 임원 형사사건 대응',
        '업무상배임·횡령 사건',
        '입찰비리 사건',
        '감사 및 수사 대응',
      ],
    },
    {
      no: 7,
      title: '준공 및 청산',
      items: [
        '이전고시 관련 자문',
        '보존등기 및 소유권 정리',
        '청산금 분쟁',
        '조합 해산 및 청산절차',
      ],
    },
  ] as AdvisoryService[],
} as const

const TRACK_SAMPLE = {
  category: '재개발 · 재건축',
  result: '4천만원청구 전부 인용',
} as const

export const RENEWAL_TRACK_RECORD = {
  enLabel: 'STRENGTH',
  titleLines: ['법무법인 경국의', '정비사업 전문 서비스'],
  intro: [
    '정비사업은 단순히 건물을 허물고 새로 짓는 과정이 아닙니다. 수년, 길게는 10년 이상 걸리는 장기 프로젝트로서, 수많은 이해관계자와 복잡한 법률 절차가 얽혀 있으며, 그중에서도 조합이 가장 어려움을 겪는 단계는 바로 기존 건물의 인도, 세입자·점유자와의 분쟁 해결, 사업 지연 요소 제거, 제반 사항에 관한 정확한 법적 검토 및 리스크 최소화 가 쟁점입니다. 이 단계에서 적절하고 신속한 법률 대응이 없으면, 사업은 기한을 넘기고 비용은 눈덩이처럼 불어날 수 있습니다. 저희는 그동안 흔히 알려진 재개발로펌들과는 비교할 수 없는 다량의 숨은 실적으로 보유하고 있으며, 수많은 구역에 자문해 온 실무 경험에 입각하여 조합의 고민을 누구보다 깊이 이해하고 있습니다. 특히 집단 인도 절차, 점유이전금지 가처분, 명도소송 분야에서 다수의 성공 사례를 보유하고 있습니다.',
    '정비사업의 어느 단계에 있건, 어느 입장에 있건 경국은 모든 케이스를 처리해 본 경험이 있기 때문에 가장 유리하고 현명한 해결책을 제시해 드릴 수 있으며, 특화된 전담팀이 고도로 전산화 된 시스템을 활용하여 우편발송, 대상물 DB정리 및 집계, 시기별 업무보고, 현장 시찰, 모든 법적 프로세스를 가장 빠른 속도와 저렴한 비용으로 처리해 드립니다.',
  ],
  quotes: [
    '법무법인 경국은\n정비사업의 본질이 결국 시간과 비용의 싸움이라는 점을\n누구보다 잘 이해하고 있습니다.',
    '사업의 신속한 추진과 불필요한 분쟁 및 비용의 최소화를 위하여\n각 단계별 최적의 전략을 수립하고,\n법률적 위험을 사전에 차단하는 데 최선을 다하겠습니다.',
    '조합설립부터 사업시행, 관리처분, 이전고시, 청산에 이르기까지\n단순한 소송대리인을 넘어, 성공적인 사업 완수를 함께하는\n든든한 동반자로 끝까지 함께하겠습니다.',
  ],
  resultsLabel: 'STRENGTH',
  resultsTitle: '정비사업 실적',
  initialVisible: 15,
  total: 47,
  pageSize: 15,
  results: Array.from({ length: 47 }, (_, i) => ({
    id: `renewal-result-${i + 1}`,
    ...TRACK_SAMPLE,
  })) as TrackResult[],
} as const

export function isRenewalTab(value: string | undefined): value is RenewalTabId {
  return RENEWAL_TABS.some((t) => t.id === value)
}
