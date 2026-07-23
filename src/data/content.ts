import { progressiveAsset, type ProgressiveSrc } from '../utils/progressiveImage'

export type ContentImage = ProgressiveSrc

export const notices = [
  {
    title: '홈페이지 개편 안내 및 상담 채널 확대',
    desc: '법무법인 경국의 새로운 홈페이지와 상담 접근성을 높이기 위한 온라인 채널을 순차적으로 확대합니다.',
    date: '2023.10.10',
    image: progressiveAsset('assets/notice-1'),
  },
  {
    title: '재개발·재건축 주요 판례 업데이트',
    desc: '정비사업과 보상 분쟁에서 실무상 참고할 만한 최근 판례와 쟁점을 정리했습니다.',
    date: '2023.10.10',
    image: progressiveAsset('assets/notice-2'),
  },
  {
    title: '서초 법조타워 상담 예약 안내',
    desc: '서초역 인근 법조타워 방문 상담과 네이버 예약, SMS 약도 전송 기능을 안내드립니다.',
    date: '2023.10.10',
    image: progressiveAsset('assets/notice-3'),
  },
]

export const practices = [
  {
    no: '01',
    title: '정비사업',
    image: progressiveAsset('assets/practice-1'),
    featured: true,
  },
  {
    no: '02',
    title: '공익사업',
    image: progressiveAsset('assets/practice-2'),
    featured: false,
  },
  {
    no: '03',
    title: '기타 분야별 업무',
    image: progressiveAsset('assets/practice-3'),
    featured: false,
  },
]

export const achievements = [
  {
    title: '정비사업',
    subtitle: '재개발·재건축·가로주택정비사업·소규모재건축 등',
    body: [
      '정비사업은 조합설립부터 사업시행인가, 관리처분계획, 수용·보상, 이전고시 및 청산에 이르기까지 복잡한 법률관계가 수반되는 전문 분야입니다.',
      '법무법인 경국은 재개발·재건축·가로주택정비사업 등 다양한 정비사업 현장에서 축적한 경험을 바탕으로',
      '사업주체의 설립-운영-해산 전 과정을 아우를 수 있는 경험과 실력을 갖추고 있으며',
      '조합, 시행자 및 이해관계인을 위한 종합적인 법률서비스를 제공하고 있습니다.',
    ],
    cta: '정비사업 실적 보기',
    to: '/practice/renewal#trackRecord',
    image: progressiveAsset('assets/achieve-1'),
    align: 'right' as const,
  },
  {
    title: '공익사업',
    subtitle: '토지수용·손실보상·택지개발·도시개발·산업단지·도로·철도 등',
    body: [
      '공익사업은 택지개발, 도시개발, 산업단지 조성 등 공공의 필요에 따라 추진되는 대규모 개발사업으로 토지취득, 보상, 각 종 행정절차가 수반됩니다.',
      '당 법무법인은 수용·보상, 이주대책, 사업인정, 재결 및 관련 소송에 이르기까지 공익사업 전반에 대한 풍부한 수행 경험을 보유하고 있습니다.',
      '특히 사업시행자·공공기관을 대상으로 토지취득 협의, 수용재결, 보상금 분쟁, 행정소송 등 공익사업 전반에 대한 법률자문과 소송업무를 지원하고 있어, 사업의 원할한 추진과 분쟁 예방을 위한 탁월한 선택이 될 것입니다.',
    ],
    cta: '공익사업 실적 보기',
    to: '/practice/public#record1',
    image: progressiveAsset('assets/achieve-2'),
    align: 'left' as const,
  },
  {
    title: '기타 분야별 업무 사례',
    subtitle: '유류분반환 방어 (피고 대리)',
    badge: '상속',
    body: [
      '보조참가인을 포함시키지 않았을 때에는 피고2의 유류분초과비율은 약 62%이나, 포함시켰을 때에는 39%로 급감. 상속포기자와 유증자의 지위를 정확하게 이해함으로써 그만큼 의뢰인으로 하여금 적은 유류분을 반환토톡 한 사례',
    ],
    cta: '업무 사례 보기',
    image: progressiveAsset('assets/achieve-3'),
    align: 'right' as const,
  },
]

export const professionals = [
  {
    role: '변호사',
    name: '박효영',
    tags: ['재개발/재건축 전문', '수용보상 전문'],
    headline: '전문 · 집중',
    bio: [
      '정비사업과 수용보상 현장에서',
      '의뢰인의 권익을 끝까지 지키며',
      '실무형 해법을 제시합니다.',
    ],
    image: progressiveAsset('assets/profile-1'),
    imagePosition: '50% 18%',
  },
  {
    role: '대표변호사',
    name: '공대호',
    tags: ['재개발/재건축 전문', '행정법 전문', '법원감정인', '감정평가사'],
    headline: '실력 · 신뢰',
    bio: [
      '1천 세대 이상 규모의 사건을 직접 수행하며',
      '초기 상담부터 최종 해결까지',
      '전략적으로 대응합니다.',
    ],
    image: progressiveAsset('assets/profile-2'),
    imagePosition: '50% 15%',
  },
  {
    role: '변호사',
    name: '공성준',
    tags: ['재개발/재건축 전문', '감정평가사', '공인중개사', '공학석사'],
    headline: '분석 · 실행',
    bio: [
      '감정평가와 법률을 아우르는 시각으로',
      '사업 리스크를 정확히 읽고',
      '실행 가능한 전략을 설계합니다.',
    ],
    image: progressiveAsset('assets/profile-3'),
    imagePosition: '50% 12%',
  },
  {
    role: '변호사',
    name: '신지호',
    tags: ['재개발/재건축 전문'],
    headline: '소통 · 동행',
    bio: [
      '복잡한 이해관계를 정리하고',
      '의뢰인과 한 방향으로 움직이며',
      '끝까지 함께합니다.',
    ],
    image: progressiveAsset('assets/profile-4'),
    imagePosition: '50% 16%',
  },
]

export const pressItems = [
  {
    chip: 'TV방송',
    title: '[MBC] 생방송 오늘의 아침',
    desc: '전월세 신고 안하면 과태료 100만원 편',
    image: progressiveAsset('assets/press-1'),
  },
  {
    chip: '컬럼',
    title: '분양대상자',
    desc: '법무법인 경국의 정비사업 100문 100답',
    image: progressiveAsset('assets/press-2'),
  },
  {
    chip: 'TV방송',
    title: '[KBS1] 제보자들',
    desc: '쫒겨나는 주민들',
    image: progressiveAsset('assets/press-3'),
  },
  {
    chip: '컬럼',
    title: '보상금 산정의 핵심',
    desc: '정비사업 보상 실무에서 놓치기 쉬운 쟁점',
    image: progressiveAsset('assets/press-2'),
  },
  {
    chip: 'TV방송',
    title: '[방송] 재개발 현장 리포트',
    desc: '주민과 함께 만드는 정비사업의 해법',
    image: progressiveAsset('assets/press-1'),
  },
]

export const awards = [
  {
    title: '2025 한경비즈니스 브랜드대상',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '철거현장 인권지킴이단',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '관악경찰서장 표창',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '정비사업지원기구 전문가 자문위원회',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '북한인권 특별위원회 위원',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '전문분야 등록증서 - 행정법',
    image: progressiveAsset('assets/award-hover'),
  },
  {
    title: '한국청소년육성회 법률자문위촉',
    image: progressiveAsset('assets/award-hover'),
  },
]

/** Full-bleed / standalone home section photos (not card lists). */
export const HOME_ABOUT_IMAGE = progressiveAsset('assets/about')
export const HOME_PROFESSIONALS_BG = progressiveAsset('assets/professionals-bg')
export const HOME_SOCIAL_BG = progressiveAsset('assets/social-bg')
export const HOME_OFFICE_MAP = progressiveAsset('assets/office-map')
