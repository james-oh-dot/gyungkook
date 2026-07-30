/**
 * ============================================================================
 * 재개발 · 보상업무 > 공익사업 (sub-02-02) — content
 * ============================================================================
 *
 * Figma frame: `SUB_재개발보상업무_공익사업` (node 80:1908), one-scroll page with
 * scroll-mode local tabs (click → scroll to section), mirroring 정비사업(renewal).
 *
 * Local tabs (Section / Bread order):
 *   공익사업 / 공익사업실적 / 보상업무 / 절차 · 유의할 점 / 보상업무실적
 *
 * ⚠️ English eyebrows (enLabel): the Figma labels were copy-paste leftovers
 * (공익사업·보상업무 = "Urban Refurbishment Project", 절차 = "Preliminary
 * Injunction for Eviction"). Replaced here with proper legal-glossary English
 * per section title (see each enLabel).
 *
 * sub-02-02 hero: real photo provided directly by the user (figma.com exports
 * remain egress-blocked; the design's own export was never retrievable).
 */

import { progressiveAsset } from '../utils/progressiveImage'
import {
  COMPENSATION_PERFORMANCE_RECORDS,
  PUBLIC_PERFORMANCE_RECORDS,
} from './performanceRecords'

const PUBLIC_VISUAL = progressiveAsset('assets/sub/sub-02-02')

export const PUBLIC_PROJECT_PAGE = {
  parentLabel: '재개발 · 보상업무',
  title: '공익사업',
  /** Figma layer sub-02-02 — progressive WebP pair */
  visual: PUBLIC_VISUAL.src,
  visualPreview: PUBLIC_VISUAL.preview,
  basePath: '/practice/public',
} as const

export type PublicTabId =
  | 'overview'
  | 'record1'
  | 'compensation'
  | 'procedure'
  | 'record2'

export type PublicTabDef = {
  id: PublicTabId
  label: string
}

export const PUBLIC_TABS: PublicTabDef[] = [
  { id: 'overview', label: '공익사업' },
  { id: 'record1', label: '공익사업실적' },
  { id: 'compensation', label: '보상업무' },
  { id: 'procedure', label: '절차 · 유의할 점' },
  { id: 'record2', label: '보상업무실적' },
]

/* —— shared shapes —— */
export type WorkBlock = {
  title: string
  bullets: string[]
}

export type ResultCard = {
  id: string
  category: string
  result: string
}

export type ResultSection = {
  enLabel: string
  titleLines: string[]
  results: ResultCard[]
  total: number
  initialVisible: number
  pageSize: number
}

/* —— 1. 공익사업 (overview) —— */
export const PUBLIC_OVERVIEW = {
  enLabel: 'Public Works Project',
  title: '공익사업',
  intro: [
    '도로, 철도, 산업단지, 택지개발, 공공주택지구 조성 등 공익사업의 시행 과정에서는 토지수용, 영업보상, 이주대책, 생활보상 등 다양한 법률 문제가 발생합니다.',
    '공익사업은 「공익사업을 위한 토지 등의 취득 및 보상에 관한 법률」에 따라 진행되며, 사업의 원활한 추진과 적정한 손실보상을 위해서는 시행자대리 또는 피수용자 어떤 입장에 있는지에 따라 각각 전문적인 법률 검토와 체계적인 대응이 필수적입니다.',
  ],
  quotes: [
    '공익사업은 단순한 보상금 산정의 문제가 아니라\n공익과 사익의 균형을 이루는 과정입니다.',
    '법무법인 경국은\n사업의 안정적인 추진과 정당한 권리 보호라는\n두 가지 가치를 동시에 실현할 수 있도록\n최선의 해결책을 제시하겠습니다.',
  ],
  blocks: [
    {
      title: '공익사업 주요 업무',
      bullets: [
        '사업인정 및 실시계획인가 관련 법률자문',
        '토지·물건조서 작성 및 보상절차 자문',
        '협의취득 및 보상협의 지원',
        '수용재결·이의재결 절차 수행',
        '토지수용위원회 대응',
        '보상금 산정 및 감정평가 검토',
        '영업손실·농업손실·주거이전비 등 손실보상 검토',
        '명도 및 행정대집행 관련 자문',
        '공탁 및 소유권 이전 절차',
        '보상금 증감액 소송 대응',
        '사업구역 내 권리관계 정리',
        '원인자부담금 및 각종 부담금 분쟁',
        '사업시행 과정에서 발생하는 민·형사 분쟁 대응',
      ],
    },
    {
      title: '주요 대상 사업',
      bullets: [
        '택지개발사업',
        '도시개발사업',
        '산업단지개발사업',
        '도로·철도·항만 사업',
        '공공주택사업',
        '공공재개발·공공재건축 사업',
        '각종 도시계획시설사업',
      ],
    },
  ] satisfies WorkBlock[],
}

/* —— 2. 공익사업 (시행자대리) 실적 (record1) —— */
export const PUBLIC_RECORD_1: ResultSection = {
  enLabel: 'Public Works Track Record',
  titleLines: ['공익사업', '(시행자대리) 실적'],
  results: PUBLIC_PERFORMANCE_RECORDS,
  total: PUBLIC_PERFORMANCE_RECORDS.length,
  initialVisible: 15,
  pageSize: 15,
}

/* —— 3. 보상업무 (compensation) —— */
export const PUBLIC_COMPENSATION = {
  enLabel: 'Loss Compensation',
  title: '보상업무',
  intro: [
    '도로, 철도, 산업단지, 공공주택지구, 도시개발사업 등 공익사업의 시행 과정에서 토지와 건물, 영업권 등 개인의 재산권은 공익을 위하여 제한되거나 수용될 수 있습니다.',
    '그러나 헌법은 공공필요에 의한 재산권의 수용·사용 또는 제한에 대하여 반드시 정당한 보상이 이루어져야 한다고 규정하고 있으며, 이는 단순한 금전적 보상을 넘어 생활기반과 영업기회의 실질적인 회복을 포함하는 개념입니다.',
    '법무법인 경국은 토지소유자, 영업자, 임차인 등 피수용자의 입장에서 처리한 보상업무에 있어서도 풍부한 경험과 노하우를 보유하고 있어, 보상절차 전반에 걸쳐 의뢰인의 권익을 보호하고 정당한 보상이 실현될 수 있도록 최선을 다하고 있습니다.',
  ],
  block: {
    title: '주요 업무',
    bullets: [
      '협의보상 및 보상금 산정 검토',
      '수용재결 및 이의재결 사건 수행',
      '보상금 증액 소송',
      '영업손실보상 및 휴업보상',
      '이전비 및 이사비 보상',
      '잔여지 보상 및 공사손실 보상',
      '이주대책 및 생활대책 대상자 관련 분쟁',
      '농업손실 및 영농보상',
      '토지수용 관련 행정소송 및 헌법소원 검토',
    ],
  } satisfies WorkBlock,
  quotes: [
    '공익사업은 공공의 이익을 위한 사업이지만,\n그 과정에서 특정 개인에게\n일방적인 희생이 강요되어서는 안 됩니다.',
    '법무법인 경국은\n협의 단계부터 수용재결, 이의재결, 행정소송에 이르기까지\n전 과정에서 의뢰인의 정당한 권리를 지키고,\n실질적인 보상과 권리회복을 이루기 위한\n든든한 동반자가 되겠습니다.',
  ],
  strengths: {
    eyebrow: '역할 및 경쟁력',
    titleTeal: '변호사 겸 감정평가사의',
    titleBlack: '강점',
    summary:
      '일반 변호사가 아닌 "변호사 겸 감정평가사"의 결합된 전문성으로 면밀한 분석 가능',
    cards: [
      {
        no: '01',
        title: '사건 분석',
        desc: '일반 변호사가 아닌 변호사 겸 감정평가사를 통한 면밀한 분석',
        benefit: '담당변호사 동일, 전문성 높음',
      },
      {
        no: '02',
        title: '감정평가 입회',
        desc: '담당변호사가 감정평가사로서 직접 분석한 사건이므로, 입회 시 감정평가사에게 의견서를 설명하기 매우 유리',
        benefit: '상황대처능력 높음',
      },
      {
        no: '03',
        title: '평가내용에 대한 법리적용',
        desc: '의견서에 대한 완벽한 법리적용',
        benefit: '변호사 겸 감정평가사로서',
      },
      {
        no: '04',
        title: '소송 변론',
        desc: '감정평가 분석과 변론을 담당변호사가 직접 수행',
        benefit: '업무의 질이 매우 우수하고 판사를 설득하기 유리',
      },
    ],
  },
}

/* —— 4. 절차 · 유의할 점 (procedure) —— */
/**
 * Figma `TAB_절차 · 유의할 점_개선` / `손실보상절차` (92:1746):
 * two side-by-side vertical columns of step cards — NOT a flowchart.
 * Desktop + tablet = 2 columns; mobile (≤767) = stacked full-width.
 */
export type ProcedureBullet =
  | string
  | {
      /** Text before the red emphasis */
      before?: string
      /** Red (#E53935) span — e.g. 불복 / '이의유보' */
      emphasis: string
      after?: string
    }

export type ProcedureStep = {
  title: string
  /** Inline subtitle next to the title (e.g. 지방/중앙토지수용위원회) */
  subtitle?: string
  bullets: ProcedureBullet[]
  /** ※ caution note under the bullets (may include red emphasis) */
  note?: ProcedureBullet
  /**
   * Side annotation shown after this step (재개발 step 4 only:
   * 명도소송 / 이주대책).
   */
  sideNote?: string[]
}

export type ProcedureColumn = {
  heading: string
  steps: ProcedureStep[]
}

export type RightsGroup = {
  label: string
  items: string[]
  caution?: string
}
export type RightsCard = {
  title: string
  subtitle?: string
  items?: string[]
  caution?: string
  groups?: RightsGroup[]
}

const NOTE_OBJECTION: ProcedureBullet = {
  before: '',
  emphasis: "'이의유보'",
  after: ' 후 보상금 전액 수령',
}

export const PUBLIC_PROCEDURE = {
  enLabel: 'Procedure & Key Points',
  title: '절차 · 유의할 점',
  flows: [
    {
      heading: '손실보상절차 [공익사업]',
      steps: [
        {
          title: '보상준비',
          bullets: [
            '주민대책위원회 구성 및 참여',
            '보상대상 기초조사',
            '토지/물건조서 작성',
            '사업인정고지 확인',
          ],
        },
        {
          title: '보상계획공고',
          bullets: [
            '토지/물건조서 확인 및 이의신청',
            '보상협의회 설치 및 운영',
            '감정평가사 주민추천',
            '사업인정고지 확인',
          ],
        },
        {
          title: '협의요청',
          bullets: [
            '협의감정평가금액 확인',
            { before: '협의 및 ', emphasis: '불복', after: ' 결정' },
          ],
          note: '보상금 수령시 불복절차 불가능',
        },
        {
          title: '수용재결',
          subtitle: '지방/중앙토지수용위원회',
          bullets: [
            '의견서 제출 및 감정평가',
            '소유권 이전/보상금 지급 및 공탁',
            '잔여지 매수(수용) 청구',
          ],
          note: NOTE_OBJECTION,
        },
        {
          title: '이의재결',
          subtitle: '중앙토지수용위원회',
          bullets: [
            '의견서 제출 및 감정평가',
            '소유권 이전/보상금 지급 및 공탁',
            '잔여지 매수(수용) 청구',
          ],
          note: NOTE_OBJECTION,
        },
        {
          title: '행정소송',
          bullets: ['손실보상금 소송진행', '추가 보상금 지급 및 사건종결'],
        },
      ],
    },
    {
      heading: '손실보상절차 [재개발]',
      steps: [
        {
          title: '보상준비',
          bullets: [
            '주민대책위원회 구성 및 참여',
            '보상대상 기초조사',
            '토지/물건조서 작성',
            '조속재결 청구',
          ],
        },
        {
          title: '보상계획공고',
          bullets: [
            '토지/물건조서 확인 및 이의신청',
            '보상협의회 설치 및 운영',
            '감정평가사 주민추천',
          ],
        },
        {
          title: '협의요청',
          bullets: [
            '협의감정평가금액 확인',
            { before: '협의 및 ', emphasis: '불복', after: ' 결정' },
          ],
          note: '보상금 수령시 불복절차 불가능',
        },
        {
          title: '수용재결',
          subtitle: '지방토지수용위원회',
          bullets: [
            '의견서 제출 및 감정평가',
            '소유권 이전/보상금 지급 및 공탁',
            '잔여지 매수(수용) 청구, 지연가산금 청구',
          ],
          note: NOTE_OBJECTION,
          sideNote: ['명도소송(부동산인도) 대응', '이주대책 소송제기'],
        },
        {
          title: '이의재결',
          subtitle: '중앙토지수용위원회',
          bullets: ['의견서 제출 및 감정평가', '추가 보상금 지급 및 공탁'],
          note: NOTE_OBJECTION,
        },
        {
          title: '행정소송',
          bullets: ['손실보상금 소송진행', '추가 보상금 지급 및 사건종결'],
        },
      ],
    },
  ] satisfies ProcedureColumn[],
  rights: {
    heading: '반드시 확인해야 할 권리',
    cards: [
      {
        title: '토지',
        subtitle: '평가기준',
        items: [
          '공시지가기준보상',
          '현황기준평가',
          '개발이익배제원칙',
          '객관적상황기준평가',
          '나지상정평가',
        ],
      },
      {
        title: '지장물',
        subtitle: '평가기준',
        items: ['원칙: 이전비 보상', '예외: 취득비(가격)보상'],
        caution: '이전비가 취득비를 초과하거나 이전이 불가능한 경우',
      },
      {
        title: '영업손실 보상 등',
        groups: [
          {
            label: '종류',
            items: [
              '휴업보상(최대4개월, 예외2년 이내의 실제 휴업기간)',
              '폐업보상(배후지 2/3이상 상실의 경우 등)',
            ],
            caution: '농업인의 경우 영농손실보상, 축산업의 경우 축산보상',
          },
          {
            label: '요건',
            items: [
              '사업인정고시일등 전부터(시간적요건)',
              '적법한 장소(장소적요건)',
              '인적 물적 시설을 갖추고(시설적요건)',
              '계속적으로 행하고 있는 영업(계속성요건)',
              '적법한 영업(행정적요건)',
            ],
          },
        ],
      },
    ] satisfies RightsCard[],
  },
}

/* —— 5. 공익사업 (보상업무) 실적 (record2) —— */
export const PUBLIC_RECORD_2: ResultSection = {
  enLabel: 'Compensation Track Record',
  titleLines: ['공익사업', '(보상업무)실적'],
  results: COMPENSATION_PERFORMANCE_RECORDS,
  total: COMPENSATION_PERFORMANCE_RECORDS.length,
  initialVisible: 15,
  pageSize: 15,
}
