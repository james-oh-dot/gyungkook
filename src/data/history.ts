import { progressiveAsset, type ProgressiveSrc } from '../utils/progressiveImage'

const HISTORY_VISUAL = progressiveAsset('assets/sub/sub-01-05')

const certificate = (name: string): ProgressiveSrc =>
  progressiveAsset(`assets/lawyers/${name}`)

export const HISTORY_PAGE = {
  parentLabel: '법무법인경국',
  title: '연혁 · 수상 · 인증',
  visual: HISTORY_VISUAL.src,
  visualPreview: HISTORY_VISUAL.preview,
} as const

export const HISTORY_TABS = [
  { id: 'history', label: '연혁' },
  { id: 'awards', label: '수상' },
  { id: 'certifications', label: '위촉 · 인증' },
] as const

export type HistoryTabId = (typeof HISTORY_TABS)[number]['id']

export const HISTORY_INTRO = [
  '법무법인경국은 15년이상 경력을 지닌 재개발·재건축 전문 대표변호사와',
  '수용보상 전문변호사, 공학석사, 감정평가사, 법원감정인 경력을 갖춘 변호사 등',
  '사람 중심의 가치를 추구하는 신념을 지닌 전문가들이 합심하여 출발하게 된 전문로펌입니다.',
]

export const HISTORY_TIMELINE = [
  {
    year: '2026',
    side: 'left' as const,
    items: [
      'AI 대응팀 구축',
      '서울 경기 주요 사업구역 정비사업 자문 다수 진행중',
      '분야별 전문센터 구축',
      '관악경찰서장 표창',
    ],
  },
  {
    year: '2025',
    side: 'right' as const,
    items: [
      '한국경제신문_한국브랜드만족지수1위 수상',
      '대한법률봉사회 회장 취임(대표변호사)',
      '한국청소년육성회 자문위원 위촉',
      '행정 · 민사 · 형사 센터 구축',
      '상속 · 이혼 · 가사 센터 구축',
      '공익사업 전담센터 구축',
      '정비사업 전담센터 구축',
      '수용보상 전문변호사 영입',
      '감정평가사 자격 변호사 영입',
      '법원감정인 경력 변호사 영입',
      '경찰 경력 전문위원 영입',
      '정비사업 경력 전문위원 영입',
      '노무사 · 세무사 · 법무사 자문위원 영입',
      '15년 이상경력 재개발 전문 대표변호사 경국 설립 (LH한국토지주택공사 정비사업자문위원)',
    ],
  },
] as const

export type HistoryImageItem = {
  label: string
  image: ProgressiveSrc
  /** Figma's square brand-mark export sits inside a white portrait card. */
  fit?: 'cover' | 'contain'
}

export const HISTORY_AWARDS: HistoryImageItem[] = [
  { label: '서울시 인권지킴이단', image: certificate('gongdaeho-award-human-rights') },
  { label: '서울관악경찰서장 표창', image: certificate('gongdaeho-award-police') },
  { label: '2025 한국브랜드만족지수 1위', image: certificate('gongdaeho-award-brand-index'), fit: 'contain' },
]

export const HISTORY_CERTIFICATIONS: HistoryImageItem[] = [
  { label: 'LH 정비사업 자문위원', image: certificate('gongdaeho-apt-lh') },
  { label: '서울시 인권지킴이단 변호사', image: certificate('gongdaeho-apt-seoul-human-rights') },
  { label: '대한중앙의료봉사회 자문위원', image: certificate('gongdaeho-apt-medical-volunteer') },
  { label: '한국청소년육성회 법률자문위촉', image: certificate('gongdaeho-apt-youth-legal') },
  { label: '북한인권 특별위원회 위원', image: certificate('gongdaeho-apt-nk-human-rights') },
  { label: '법무부 마을 변호사', image: certificate('gongdaeho-apt-village-lawyer') },
  // The source design deliberately reuses the first two scans for these captions.
  { label: '서울시사회복지협의회봉사단', image: certificate('gongdaeho-apt-lh') },
  { label: '대한법률봉사회회장', image: certificate('gongdaeho-apt-seoul-human-rights') },
  { label: '재개발·재건축', image: certificate('gongdaeho-cert-redevelopment') },
  { label: '행정법', image: certificate('gongdaeho-cert-admin') },
]
