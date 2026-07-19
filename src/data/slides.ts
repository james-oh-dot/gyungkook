import { progressiveAsset } from '../utils/progressiveImage'
import { asset } from '../utils/asset'

export type HeroSlide = {
  id: number
  index: string
  /** Large English serif word in hero_maincopy (Value / Rebuild / …) */
  word: string
  /** Korean title lines beside the English word */
  titleLines: string[]
  /** Pretendard description above maincopy */
  description: string[]
  nextLabel: string
  /**
   * Tablet/mobile swipe card subtitle (line 2 under “02 Rebuild”).
   * Describes the next slide — Figma HOME_TABLET2 / HOME_MOBILE2 Hero Swipe.
   */
  nextSwipeTitle: string
  /** High-quality WebP (progressive full layer) */
  image: string
  /** Tiny blur-up preview WebP — paints immediately on entry */
  imagePreview: string
  nextImage: string
  /**
   * Per-slide visual layout modifier (framing lives in Hero.css):
   * - statue: FULL bitmap visible — contain only; never crop hands/sides
   * - jewel: viewport-centered subject (object-position ~62% Y)
   * - birds: scaleX(-1) + bottom-anchored; large lamp on right; pigeons visible
   */
  visual: 'statue' | 'jewel' | 'cubes' | 'birds' | 'campus'
  /** Optional edge fade for jewel-style assets */
  fadeEdges?: boolean
  wordSize?: 'lg' | 'md'
}

/** Auto-advance + swipe_gage fill duration. Button jumps must reset immediately. */
export const HERO_DURATION_MS = 10000

const HERO_01 = progressiveAsset('assets/hero-01')
const HERO_02 = progressiveAsset('assets/hero-02')
const HERO_03 = progressiveAsset('assets/hero-03')
const HERO_04 = progressiveAsset('assets/hero-04')
const HERO_05 = progressiveAsset('assets/hero-05')

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    index: '01',
    word: 'Value',
    titleLines: ['오래된 가치', '그 소중함을 지켜갑니다'],
    description: [
      '오랜 시간 강인하게 지켜온 가치, 거기에 영속성을 더할 수 있도록',
      '신중한 판단과 신속한 Performance를 수행합니다.',
    ],
    nextLabel: 'REBUILD',
    nextSwipeTitle: '가치를 다시 세우는 관점',
    image: HERO_01.src,
    imagePreview: HERO_01.preview,
    nextImage: asset('assets/hero-01-next.jpg'),
    visual: 'statue',
    wordSize: 'lg',
  },
  {
    id: 2,
    index: '02',
    word: 'Rebuild',
    titleLines: ['혁신', '값진 것을 더 귀하게'],
    description: [
      '재개발의 핵심은 가치 평가입니다.',
      '구성원 변호사 50% 이상 감정평가사 자격을 갖춘 전문성!',
      '고객 가치를 정확히 평가하여 최상으로 끌어올리고 있습니다.',
    ],
    nextLabel: 'FAIR',
    nextSwipeTitle: '합리적인 보상과 배상',
    image: HERO_02.src,
    imagePreview: HERO_02.preview,
    nextImage: asset('assets/hero-02-next.jpg'),
    visual: 'jewel',
    fadeEdges: true,
    wordSize: 'lg',
  },
  {
    id: 3,
    index: '03',
    word: 'Fair',
    titleLines: ['합리적인 보상', '청산, 그리고 배상'],
    description: [
      'AI 역량 총동원',
      '막연한 추정이 아닌 정확한 분석을 통해 합리적인 결과를 확보합니다',
    ],
    nextLabel: 'COMMUNICATE',
    nextSwipeTitle: '사람을 연결하는 교감',
    image: HERO_03.src,
    imagePreview: HERO_03.preview,
    nextImage: asset('assets/hero-03-next.jpg'),
    visual: 'cubes',
    wordSize: 'lg',
  },
  {
    id: 4,
    index: '04',
    word: 'Communicate',
    titleLines: ['교감', '사람을 연결하다'],
    description: [
      '원활한 소통으로 만드는 유연한 정보의 흐름,',
      '적극적인 접근과 경청으로 만들어가는 법무법인경국입니다',
    ],
    nextLabel: 'SPEED',
    nextSwipeTitle: '더 빠르고 가까운 접근',
    image: HERO_04.src,
    imagePreview: HERO_04.preview,
    nextImage: asset('assets/hero-04-next.jpg'),
    visual: 'birds',
    /** Long English word — use compact copy scale so it never overflows */
    wordSize: 'md',
  },
  {
    id: 5,
    index: '05',
    word: 'Speed',
    titleLines: ['접근성 문턱은 낮추고,', '접근은 빠르게'],
    description: [
      '법원, 검찰청, 등기국 등 주요법조기관 소재지에 위치',
      '온오프라인 빠른 대응이 가능한 경쟁력',
    ],
    nextLabel: 'VALUE',
    nextSwipeTitle: '오래된 가치를 지키다',
    image: HERO_05.src,
    imagePreview: HERO_05.preview,
    nextImage: asset('assets/hero-05-next.jpg'),
    visual: 'campus',
    wordSize: 'lg',
  },
]
