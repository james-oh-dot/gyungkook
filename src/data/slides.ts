import { asset } from '../utils/asset'

export type HeroSlide = {
  id: number
  index: string
  titleLines: string[]
  label: string
  description: string[]
  nextLabel: string
  image: string
  nextImage: string
}

/** Auto-advance + swipe_gage fill duration. Button jumps must reset immediately. */
export const HERO_DURATION_MS = 10000

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    index: '01',
    titleLines: ['오래된 가치', '그 소중함을 지켜갑니다'],
    label: 'VALUE',
    description: [
      '오랜 시간 강인하게 지켜온 가치, 거기에 영속성을 더할 수 있도록',
      '신중한 판단과 신속한 Performance를 수행합니다.',
    ],
    nextLabel: 'Rebuild',
    // Traditional Korean eaves / dancheong
    image: asset('assets/hero-01.jpg'),
    nextImage: asset('assets/hero-01-next.jpg'),
  },
  {
    id: 2,
    index: '02',
    titleLines: ['혁신', '값진 것을 더 귀하게'],
    label: 'REBUILD',
    description: [
      '재개발의 핵심은 가치 평가입니다.',
      '구성원 변호사 50% 이상 감정평가사 자격을 갖춘 전문성!',
      '고객 가치를 정확히 평가하여 최상으로 끌어올리고 있습니다',
    ],
    nextLabel: 'FAIR',
    // Jewel / diamond (user-required; do not replace with architecture fill)
    image: asset('assets/hero-02.jpg'),
    nextImage: asset('assets/hero-02-next.jpg'),
  },
  {
    id: 3,
    index: '03',
    titleLines: ['합리적인 보상,', '청산, 그리고 배상'],
    label: 'Fair Compensationand Damages',
    description: [
      'AI 역량 총동원 -',
      '막연한 추정이 아닌 정확한 분석을 통해 합리적인 결과를 확보합니다',
    ],
    nextLabel: 'Communicate',
    image: asset('assets/hero-03.jpg'),
    nextImage: asset('assets/hero-03-next.jpg'),
  },
  {
    id: 4,
    index: '04',
    titleLines: ['교감', '사람을 연결하다'],
    label: 'Communicate',
    description: [
      '원활한 소통으로 만드는 유연한 정보의 흐름,',
      '적극적인 접근과 경청으로 만들어가는 법무법인경국입니다',
    ],
    nextLabel: 'SPEED',
    image: asset('assets/hero-04.jpg'),
    nextImage: asset('assets/hero-04-next.jpg'),
  },
  {
    id: 5,
    index: '05',
    titleLines: ['접근성', '문턱은 낮추고,', '접근은 빠르게'],
    label: 'SPEED',
    description: [
      '법원, 검찰청, 등기국 등 주요법조기관 소재지에 위치',
      '온오프라인 빠른 대응이 가능한 경쟁력',
    ],
    nextLabel: 'VALUE',
    image: asset('assets/hero-05.jpg'),
    nextImage: asset('assets/hero-05-next.jpg'),
  },
]
